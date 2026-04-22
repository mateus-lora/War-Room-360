import { useState } from "react";
import "../assets/App.css";
import { handleLogin } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

function PageInicial() {
  const [profissao, setProfissao] = useState("");
  const [name, setName] = useState("");
    const navigate = useNavigate();
  return (
    <>
    <div className="login-wrapper">
      <section>
        <h1>War Room 360</h1>
        <input
          placeholder="Digite seu nome"
          id="userName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autocomplete="off"
        />
<select 
        id="userRole" 
        value={profissao} 
        onChange={(e) => setProfissao(e.target.value)}
      >
        <option value="" disabled hidden>Selecione sua profissão</option>
          <option value="QA">QA</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="SRE">SRE</option>
          <option value="Product Manager">Product Manager</option>
          <option value="Tech Lead">Tech Lead</option>
          <option value="Security Engineer">Security Engineer</option>
          <option value="Customer Support">Customer Support</option>
          <option value="DBA">DBA</option>
      </select>

<button disabled={!name || !profissao} onClick={() => handleLogin(name, profissao, navigate)}>
            Entrar
          </button>
      </section>
      </div>
    </>
  );
}

export default PageInicial;