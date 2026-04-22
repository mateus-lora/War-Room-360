export const handleLogin = (name, profissao, navigate) => {
  if (!name || !profissao) return;

  const ws = new WebSocket(`ws://localhost:8888/ws`);
  
  sessionStorage.setItem("userName", name);
  sessionStorage.setItem("userRole", profissao);
  sessionStorage.setItem("user_authenticated", "true"); // NOVO: Flag de autenticação
  
  ws.onopen = () => {
    console.log("Conectado à War Room!");
    ws.send(JSON.stringify({ 
      type: "login", 
      user: name, 
      role: profissao 
    }));
    
    navigate("/home"); 
  };

  ws.onerror = (err) => {
    console.error("Erro na conexão:", err);
    alert("Não foi possível conectar ao servidor Python!");
  };
};