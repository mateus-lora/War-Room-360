import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/App.css";
import BugCard from "../components/BugCard.jsx";
import StatusIndicator from "../components/StatusIndicator.jsx"; // NOVO: Importando o componente

function Home() {
  const [defeitos, setDefeitos] = useState({});
  const [novoTicket, setNovoTicket] = useState("");
  const [onlineCount, setOnlineCount] = useState(0); 
  const ws = useRef(null);
  const navigate = useNavigate();
  
  const me = sessionStorage.getItem("userName");
  const role = sessionStorage.getItem("userRole");

  useEffect(() => {
    // 1. Verificação de segurança: se não houver usuário, volta para o login
    if (!me || !role) {
      navigate("/");
      return;
    }

    // 2. Limpeza preventiva: se houver conexão aberta, fecha antes de criar uma nova
    if (ws.current) {
      ws.current.close();
    }

    const socket = new WebSocket(`ws://localhost:8888/ws`);
    ws.current = socket;
    
    // 3. Evento de abertura: Avisa o servidor quem é você para o contador único funcionar
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "login", user: me }));
    };

    // 4. Recebimento de mensagens
    socket.onmessage = (e) => {
      const res = JSON.parse(e.data);
      if (res.type === "sync") {
        setDefeitos(res.data);
      } else if (res.type === "users_count") {
        setOnlineCount(res.count);
      }
    };
    
    // 5. Cleanup: Quando fechar a aba ou deslogar, encerra o socket
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
      ws.current = null;
    };
  }, [me, role, navigate]);

  // Ações disparadas pelos botões
  const actions = {
    assumir: (id) => ws.current?.send(JSON.stringify({ type: 'assumir', id, user: me, role })),
    setGravity: (id, gravidade) => ws.current?.send(JSON.stringify({ type: 'set_gravidade', id, gravidade, user: me })),
    setStatus: (id) => ws.current?.send(JSON.stringify({ type: 'status', id })),
    log: (id, text) => text && ws.current?.send(JSON.stringify({ type: 'log', id, user: me, text })),
    create: (titulo) => {
      if(titulo.trim() && ws.current) {
        ws.current.send(JSON.stringify({ type: 'create', titulo, user: me }));
        setNovoTicket(""); 
      }
    }
  };

  if (!me || !role) return null;

  return (
    <div className="dashboard-container">
      {/* Header com o novo contador online */}
      <header className="header-warroom">
        <div className="header-left">
          <h1>War Room 360</h1>
          <div className="online-badge">
            <span className="dot"></span> {onlineCount} Online
          </div>
        </div>
        
        {/* NOVO: StatusIndicator adicionado dentro do user-badge */}
        <div className="user-badge">
          <StatusIndicator />
          <div>{me} ({role})</div>
        </div>
      </header>

      {/* Painel de criação de Tickets */}
      <div className="create-panel">
        <input 
          type="text" 
          placeholder="Descreva o novo bug / defeito..." 
          value={novoTicket}
          onChange={(e) => setNovoTicket(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && actions.create(novoTicket)}
        />
        <button onClick={() => actions.create(novoTicket)}>Criar Ticket</button>
      </div>

      {/* Grid de Cards dos defeitos */}
      <div className="bug-grid">
        {Object.entries(defeitos).map(([id, data]) => (
          <BugCard 
            key={id} 
            id={id} 
            data={data} 
            currentUser={me} 
            actions={actions} 
          />
        ))}
      </div>
    </div>
  );
}

export default Home;