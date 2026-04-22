# War Room 360 - Dashboard WebSockets

Este trabalho prático tem como objetivo demonstrar uma aplicação de comunicação em tempo real utilizando o protocolo WebSocket, implementado com Python e o framework Tornado no backend, e React/Vite (HTML/JS) no frontend.

O sistema atua como um painel ao vivo ("War Room") para triagem, investigação e resolução de defeitos/bugs de forma colaborativa.

## 👥 Integrantes do Grupo
- Mateus Lora
- Gabriel Hanel

## 🛠️ Tecnologias Utilizadas
- **Backend:** Python 3.10+ com Tornado Framework (Servidor WebSocket Obrigatório).
- **Frontend:** HTML/JavaScript (Empacotado via React + Vite).
- **Versionamento:** Git e GitHub.

## ⚙️ Pré-requisitos
Para rodar este projeto, você precisará ter instalado em sua máquina:
- **Python 3.10** ou superior.
- **Node.js** (para instalar e rodar o frontend).

---

## 🚀 Como instalar e executar o projeto

### Passo 1: Clone o Repositório
Abra o terminal e clone este repositório do GitHub:

```bash
git clone <URL_DO_SEU_REPOSITORIO_AQUI>
cd <NOME_DA_PASTA_DO_PROJETO>
```

### Passo 2: Inicializando o Servidor (Backend)
O servidor WebSocket gerenciará as conexões e a troca de mensagens.

1. Navegue até a pasta raiz do projeto (onde está o arquivo server.py).
2. Instale as dependências exigidas pelo projeto:

```bash
pip install -r requirements.txt
```

3. Inicie o servidor:

```bash
python server.py
```

> O servidor indicará no console que está rodando em http://localhost:8888. Ele deixará logs registrando sempre que um novo cliente entrar ou sair (tratamento do ciclo de vida on_open / on_close).

### Passo 3: Inicializando o Cliente (Frontend)
A interface web permitirá a interação com o servidor.

1. Em uma **nova janela** de terminal, navegue até a pasta do frontend (se aplicável, ou na raiz onde está o package.json).
2. Instale as dependências do Node:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

> Acesse o link gerado no terminal (geralmente http://localhost:5173) em seu navegador. 

### Passo 4: Simulando Concorrência
Para testar o gerenciamento de múltiplos clientes simultâneos:
1. Abra múltiplas abas no navegador acessando a URL do frontend.
2. Em cada aba, realize o login com um nome de usuário diferente. Graças ao uso de sessionStorage, cada aba se comportará como um cliente independente na rede.
3. Altere status, crie tickets ou mande logs: tudo refletirá instantaneamente (comunicação bidirecional persistente) nas demais telas abertas.