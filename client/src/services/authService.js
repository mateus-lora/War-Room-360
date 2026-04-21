export const handleLogin = (name, profissao, navigate) => {
  if (!name || !profissao) return;

const ws = new WebSocket(`ws://localhost:8888/ws`);
sessionStorage.setItem("userName", name);
  sessionStorage.setItem("userRole", profissao);
  sessionStorage.setItem('user_authenticated', 'true');

  ws.onopen = () => {
    console.log("Conectado à War Room!");
    ws.send(JSON.stringify({ 
      type: "login", 
      user: name, 
      role: profissao 
    }));
    
    // Mudei para cá para o redirecionamento ser instantâneo após conectar
    navigate("/home"); 
  };

  ws.onerror = (err) => {
    console.error("Erro na conexão:", err);
    alert("Não foi possível conectar ao servidor Python!");
  };
}