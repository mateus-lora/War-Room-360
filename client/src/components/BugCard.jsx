import { useState, useRef, useEffect } from "react";

const BugCard = ({ id, data, currentUser, actions }) => {
  const { titulo, status, responsavel, gravidade, logs } = data;
  const [mensagem, setMensagem] = useState("");
  
  // 1. Criamos uma referência para o final da lista de logs
  const logsEndRef = useRef(null);

  const isAssumido = responsavel !== null;
  const isResolvido = status === "Resolvido";
  const isMe = responsavel === currentUser;

  // 2. Efeito que rola a div para baixo sempre que a lista de 'logs' mudar
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const handleSendLog = () => {
    actions.log(id, mensagem);
    setMensagem(""); 
  };

  const handleResolve = () => {
    if (window.confirm(`Tem certeza que deseja encerrar a tarefa ${id}?`)) {
      actions.setStatus(id);
    }
  };

  return (
    <div className={`card ${isAssumido ? gravidade : ''} ${isResolvido ? 'resolvido' : ''}`}>
      <div className="card-header">
        <div className="id-wrapper">
          <span className="bug-id">{id}</span>
          {gravidade && <span className="priority-badge">{gravidade}</span>}
        </div>
        {isAssumido && <span className="status-pill">{status}</span>}
      </div>

      <div className="bug-title">{titulo}</div>

      <div className="owner-info">
        {isAssumido ? <>Owner: <b>{responsavel}</b></> : <i>Aguardando...</i>}
      </div>

      {!isAssumido ? (
        <button className="btn-assumir" onClick={() => actions.assumir(id)}>
          Assumir Ticket
        </button>
      ) : (
        <div className="card-content">
          <div className="log-container">
            {logs.map((l, i) => (
              <div key={i} className={`log-entry ${l.u === 'SISTEMA' ? 'log-sys' : ''}`}>
                {l.u !== 'SISTEMA' && <b>{l.u}: </b>} {l.m}
              </div>
            ))}
            {/* 3. Colocamos a div invisível como âncora no final do container */}
            <div ref={logsEndRef} />
          </div>

          {!isResolvido && (
            <div className="card-actions">
              <div className="chat-input-group">
                <input 
                  type="text" 
                  placeholder="Digite a mensagem.." 
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendLog()}
                />
                <button className="btn-send" onClick={handleSendLog} disabled={!mensagem}>
                  Enviar
                </button>
              </div>

              {isMe && (
                <div className="controls">
                  <select 
                    value={gravidade || ""} 
                    onChange={(e) => actions.setGravity(id, e.target.value)}
                  >
                    <option value="" disabled>Prioridade ∨</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                  <button className="btn-resolve" onClick={handleResolve}>
                    Resolver
                  </button>
                </div>
              )}
            </div>
          )}
          {isResolvido && <div className="completado-badge">COMPLETADO</div>}
        </div>
      )}
    </div>
  );
};

export default BugCard;