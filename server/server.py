import tornado.ioloop, tornado.web, tornado.websocket, json, os

DATA_FILE = "defeitos_v6.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f: return json.load(f)
    return {
        "D-101": {"titulo": "Falha na integridade do banco", "status": "Aguardando", "responsavel": None, "cargo": "", "gravidade": "Normal", "logs": []},
        "D-102": {"titulo": "Inconsistencia no calculo de frete", "status": "Aguardando", "responsavel": None, "cargo": "", "gravidade": "Normal", "logs": []},
        "D-103": {"titulo": "Leak de memoria no worker principal", "status": "Aguardando", "responsavel": None, "cargo": "", "gravidade": "Normal", "logs": []}
    }

app_state = load_data()
clients = set()

class DefeitosHandler(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin): return True
    def open(self): clients.add(self); self.write_message(json.dumps({"type": "sync", "data": app_state}))
    def on_close(self): clients.remove(self)

    def on_message(self, message):
        msg = json.loads(message)
        bid = msg.get("id")
        if msg["type"] == "assumir":
            app_state[bid].update({"responsavel": msg["user"], "cargo": msg["role"], "status": "Em analise"})
            app_state[bid]["logs"].append({"u": "SISTEMA", "m": f"Investigacao iniciada por {msg['user']}"})
        elif msg["type"] == "set_gravidade":
            app_state[bid]["gravidade"] = msg["gravidade"]
            app_state[bid]["logs"].append({"u": "SISTEMA", "m": f"Prioridade: {msg['gravidade']}"})
        elif msg["type"] == "log":
            app_state[bid]["logs"].append({"u": msg["user"], "m": msg["text"]})
        elif msg["type"] == "status":
            app_state[bid]["status"] = "Resolvido"
            app_state[bid]["logs"].append({"u": "SISTEMA", "m": "Ticket encerrado - Solucionado."})

        with open(DATA_FILE, "w") as f: json.dump(app_state, f)
        for c in clients: c.write_message(json.dumps({"type": "sync", "data": app_state}))

def make_app():
    return tornado.web.Application([(r"/ws", DefeitosHandler), (r"/(.*)", tornado.web.StaticFileHandler, {"path": "./", "default_filename": "index.html"})])

if __name__ == "__main__":
    app = make_app(); app.listen(8888)
    print("Engineering OS: http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()