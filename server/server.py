import tornado.ioloop, tornado.web, tornado.websocket, json, os

DATA_FILE = "defeitos_v6.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f: return json.load(f)
    return {}

app_state = load_data()
# Alterado: Agora clients é um dicionário {objeto_conexao: "nome_usuario"}
clients = {}

class DefeitosHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin): return True
    
    def open(self): 
        # Inicializa a conexão sem nome definido ainda
        clients[self] = None
        self.write_message(json.dumps({"type": "sync", "data": app_state}))
        print(f"[+] Nova conexão estabelecida. Total de abas: {len(clients)}")

    def on_close(self): 
        if self in clients:
            del clients[self]
        self.broadcast_online_count()
        print(f"[-] Conexão fechada. Total de abas: {len(clients)}")

    def on_message(self, message):
        msg = json.loads(message)
        action = msg.get("type")

        handlers = {
            "assumir": self.handle_assumir,
            "set_gravidade": self.handle_set_gravidade,
            "log": self.handle_log,
            "status": self.handle_status,
            "create": self.handle_create,
            "login": self.handle_login 
        }

        handler = handlers.get(action)
        if handler:
            handler(msg)
            if action != "login":
                self.save_and_sync()
        else:
            print(f"Ação desconhecida recebida: {action}")

    # --- Handlers de Ações ---
    def handle_login(self, msg):
        nome = msg.get("user", "Desconhecido")
        # Associa o nome à conexão atual
        clients[self] = nome
        print(f"[👤] {nome} entrou na sala.")
        # Só dispara a contagem de usuários únicos DEPOIS do login
        self.broadcast_online_count()

    def handle_create(self, msg):
        new_id = f"D-{len(app_state) + 101}"
        app_state[new_id] = {
            "titulo": msg["titulo"],
            "status": "Aguardando",
            "responsavel": None,
            "cargo": "",
            "gravidade": "Normal",
            "logs": [{"u": "SISTEMA", "m": f"Ticket criado por {msg['user']}"}]
        }

    def handle_assumir(self, msg):
        bid = msg["id"]
        app_state[bid].update({"responsavel": msg["user"], "cargo": msg["role"], "status": "Em analise"})
        app_state[bid]["logs"].append({"u": "SISTEMA", "m": f"Investigacao iniciada por {msg['user']}"})

    def handle_set_gravidade(self, msg):
        bid = msg["id"]
        app_state[bid]["gravidade"] = msg["gravidade"]
        app_state[bid]["logs"].append({"u": "SISTEMA", "m": f"Prioridade definida para: {msg['gravidade']}"})

    def handle_log(self, msg):
        app_state[msg["id"]]["logs"].append({"u": msg["user"], "m": msg["text"]})

    def handle_status(self, msg):
        bid = msg["id"]
        app_state[bid]["status"] = "Resolvido"
        app_state[bid]["logs"].append({"u": "SISTEMA", "m": "Ticket encerrado - Solucionado."})

    # --- Utilitários ---
    def save_and_sync(self):
        with open(DATA_FILE, "w") as f: json.dump(app_state, f)
        for c in clients: c.write_message(json.dumps({"type": "sync", "data": app_state}))

    def broadcast_online_count(self):
        # Lógica principal: Filtra os nomes, remove None e conta apenas nomes ÚNICOS
        usuarios_unicos = {name for name in clients.values() if name is not None}
        count = len(usuarios_unicos)
        
        # Se alguém conectou mas ainda não logou, garantimos que mostre pelo menos 1
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