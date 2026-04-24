# War Room 360 - Dashboard WebSockets

Este trabalho prático tem como objetivo demonstrar uma aplicação de comunicação em tempo real utilizando o protocolo WebSocket, implementado com Python e o framework Tornado no backend, e React/Vite no frontend.

O sistema atua como um painel ao vivo ("War Room") para triagem, investigação e resolução de defeitos/bugs de forma colaborativa.

## Integrantes do Grupo
- Mateus Lora - RA
- Gabriel Hanel - RA 1135926

## Tecnologias Utilizadas
- **Backend:** Python com Tornado Framework.
- **Frontend:** React + Vite
- **Versionamento:** Git e GitHub.

## Pré-requisitos
Para rodar este projeto, você precisará ter instalado em sua máquina:
- **Python 3.10** ou superior.
- **Node.js**

---

## Instalação

### Passo 1: Clone o Repositório
Abra o terminal e clone este repositório do GitHub:

```bash
git clone https://github.com/mateus-lora/War-Room-360.git
cd War-Room-360
```

### Inicializando o Backend (Server)
O servidor WebSocket gerenciará as conexões e a troca de mensagens.

1. Navegue até a pasta do projeto onde está o backend
```bash
cd server
```
2. Instale as dependências exigidas pelo projeto:

```bash
pip install -r requirements.txt
```

3. Inicie o servidor:

```bash
python server.py
```

> O servidor indicará no console que está rodando em http://localhost:8888. Ele deixará logs registrando sempre que um novo cliente entrar ou sair (tratamento do ciclo de vida on_open / on_close).

### Inicializando o Frontend

1. Em uma nova janela de terminal, navegue até a pasta do frontend:
```bash
cd client
```
2. Instale as dependências do Node:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

> Acesse o link gerado no terminal em seu navegador. 

### Simulando Concorrência
Para testar o gerenciamento de múltiplos clientes simultâneos:
1. Abra múltiplas abas no navegador acessando a URL do frontend.
2. Em cada aba, realize o login com um nome de usuário diferente. Devido ao uso de sessionStorage, cada aba se comportará como um cliente independente na rede.
3. Altere status, crie tickets ou mande logs: tudo refletirá instantaneamente (comunicação bidirecional persistente) nas demais telas abertas.