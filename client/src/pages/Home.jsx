import { useEffect, useState, useRef } from "react";
import "../assets/App.css";
import BugCard from "../components/BugCard.jsx";
function Home() {
  const [defeitos, setDefeitos] = useState({});
  const ws = useRef(null);
  
  // Pegamos os dados do usuário uma única vez
  const me = localStorage.getItem("userName")
  const role = localStorage.getItem("userRole") || "Dev";

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8888/ws`);
    ws.current.onmessage = (e) => {
      const res = JSON.parse(e.data);
      if (res.type === "sync") setDefeitos(res.data);
    };
    return () => ws.current.close();
  }, []);

  // Centralizador de ações para passar para os filhos
  const actions = {
    assumir: (id) => ws.current.send(JSON.stringify({ type: 'assumir', id, user: me, role })),
    setGravity: (id, gravidade) => ws.current.send(JSON.stringify({ type: 'set_gravidade', id, gravidade, user: me })),
    setStatus: (id) => ws.current.send(JSON.stringify({ type: 'status', id })),
    log: (id, text) => text && ws.current.send(JSON.stringify({ type: 'log', id, user: me, text }))
  };

  return (
    <div className="dashboard-container">
      <header className="header-warroom">
        <h1>War Room 360</h1>
        <div className="user-badge">{me} ({role})</div>
      </header>

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