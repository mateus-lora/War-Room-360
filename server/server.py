import tornado.ioloop, tornado.web, tornado.websocket, json, os
import aiofiles

DATA_FILE = "defeitos_v6.json"

def load_tickets_from_storage():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f: return json.load(f)
    return {}

app_state = load_tickets_from_storage()
clients = {}

class DefeitosHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin): return True
    
    def open(self): 
        clients[self] = None
        self.write_message(json.dumps({"type": "sync", "data": app_state}))
        print(f"[+] Nova conexão estabelecida. Total de abas: {len(clients)}")

    def on_close(self): 
        if self in clients:
            del clients[self]
        self.broadcast_online_count()
        print(f"[-] Conexão fechada. Total de abas: {len(clients)}")

    async def on_message(self, message):
        msg = json.loads(message)
        action = msg.get("type")

        handlers = {
            "assumir": self.assign_ticket_to_user,
            "set_gravidade": self.update_ticket_priority,
            "log": self.add_comment_to_ticket,
            "status": self.resolve_ticket,
            "create": self.create_new_ticket,
            "login": self.register_user_session 
        }

        handler = handlers.get(action)
        if handler:
            handler(msg)
            if action != "login":
                await self.save_and_sync()
        else:
            print(f"Ação desconhecida recebida: {action}")

    def register_user_session(self, msg):
        nome = msg.get("user", "Desconhecido")
        clients[self] = nome
        print(f"{nome} entrou na sala.")
        self.broadcast_online_count()

    def create_new_ticket(self, msg):
        new_id = f"D-{len(app_state) + 101}"
        app_state[new_id] = {
            "titulo": msg["titulo"],
            "status": "Aguardando",
            "responsavel": None,
            "cargo": "",
            "gravidade": "Normal",
            "logs": [{"u": "SISTEMA", "m": f"Ticket criado por {msg['user']}"}]
        }

    def assign_ticket_to_user(self, msg):
        bid = msg["id"]
        app_state[bid].update({"responsavel": msg["user"], "cargo": msg["role"], "status": "Em analise"})
        app_state[bid]["logs"].append({"u": "SISTEMA", "m": f"Investigacao iniciada por {msg['user']}"})

    def update_ticket_priority(self, msg):
        bid = msg["id"]
        app_state[bid]["gravidade"] = msg["gravidade"]
        app_state[bid]["logs"].append({"u": "SISTEMA", "m": f"Prioridade definida para: {msg['gravidade']}"})

    def add_comment_to_ticket(self, msg):
        app_state[msg["id"]]["logs"].append({"u": msg["user"], "m": msg["text"]})

    def resolve_ticket(self, msg):
        bid = msg["id"]
        app_state[bid]["status"] = "Resolvido"
        app_state[bid]["logs"].append({"u": "SISTEMA", "m": "Ticket encerrado - Solucionado."})

    async def save_and_sync(self):
        async with aiofiles.open(DATA_FILE, "w") as f: 
            await f.write(json.dumps(app_state))
            
        for c in clients: 
            c.write_message(json.dumps({"type": "sync", "data": app_state}))

    def broadcast_online_count(self):
        usuarios_unicos = {name for name in clients.values() if name is not None}
        count = len(usuarios_unicos)
        
        if count == 0 and len(clients) > 0:
            count = 1
            
        for c in clients:
            c.write_message(json.dumps({"type": "users_count", "count": count}))

def make_app():
    return tornado.web.Application([
        (r"/ws", DefeitosHandler), 
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": "./", "default_filename": "index.html"})
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Engineering OS Rodando em: http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()