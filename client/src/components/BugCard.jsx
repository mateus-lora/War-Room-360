const BugCard = ({ id, data, currentUser, actions }) => {
  const { titulo, status, responsavel, gravidade, logs } = data;
  
  const isAssumido = responsavel !== null;
  const isResolvido = status === "Resolvido";
  const isMe = responsavel === currentUser;

  return (
    <div className={`card ${isAssumido ? gravidade : ''} ${isResolvido ? 'resolvido' : ''}`}>
      {/* Cabeçalho do Card */}
      <div className="card-header">
        <span className="bug-id">{id}</span>
        {isAssumido && <span className="status-pill">{status}</span>}
      </div>

      <div className="bug-title">{titulo}</div>

      <div className="owner-info">
        {isAssumido ? <>Owner: <b>{responsavel}</b></> : <i>Aguardando...</i>}
      </div>

      {/* Área de Interação */}
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
          </div>

          {!isResolvido && (
            <div className="card-actions">
              <input 
                type="text" 
                placeholder="Digite a mensagem.." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    actions.log(id, e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              {isMe && (
                <div className="controls">
                  <select 
                    value={gravidade || ""} 
                    onChange={(e) => actions.setG(id, e.target.value)}
                  >
                    <option value="" disabled>Prioridade ∨</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                  <button className="btn-resolve" onClick={() => actions.setS(id)}>
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