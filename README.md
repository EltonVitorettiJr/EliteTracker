<h1 align="center">Elite Tracker</h1>

<h3 align="center">Sistema Fullstack de Rastreamento de Hábitos e Foco</h3>

<p align="center">
<a href="#art-sobre-o-projeto">Sobre o Projeto</a> |
<a href="#computer-tecnologias-usadas">Tecnologias Usadas</a> |
<a href="#package-como-rodar">Como Rodar</a>
</p>

# :art: Sobre o Projeto

O Elite Tracker é uma aplicação Fullstack desenvolvida para ajudar os usuários a gerenciar seus hábitos diários e manter o foco em suas tarefas. Através de um painel interativo, é possível acompanhar o progresso mensal e a consistência visualmente.

O projeto foi construído utilizando uma arquitetura moderna de **Monorepo (Yarn Workspaces)**, garantindo uma manutenção simplificada e padronização de código entre a Interface e a API com o Biome.

## ✨ Features Principais

* **Autenticação Social Segura:** Login rápido integrado com o **GitHub OAuth** e validação via token (JWT).
* **Gestão de Hábitos Diários:** Adição, exclusão e checklist de conclusão de hábitos.
* **Métricas Visuais (Calendário):** Acompanhamento de progresso com calendário interativo, exibindo porcentagem de conclusão e os dias exatos em que o hábito foi realizado.
* **Sessão de Foco:** Temporizador embutido para gerenciar ciclos de produtividade (Time Focus).
* **Validação de Dados Estrita:** Uso de schemas de validação para garantir a integridade dos dados trafegados.

# :computer: Tecnologias Usadas

### Front-end (Interface)

* **React** (Biblioteca de UI)
* **Mantine UI & Dates** (Componentes de interface e Calendário)
* **Day.js** (Manipulação e formatação de datas)
* **React Router** (Navegação de rotas)
* **React Timer Hook** (Gerenciamento do cronômetro de foco)
* **Phosphor Icons** (Pacote de ícones)

### Back-end (API)

* **Node.js & Express** (Servidor e rotas)
* **Mongoose** (Banco de dados NoSQL com MongoDB)
* **Zod** (Validação de schemas e tipagem)
* **Axios** (Requisições HTTP para a API do GitHub)
* **JSON Web Token (JWT)** (Autenticação e segurança de sessão)

### Ferramentas Globais

* **Yarn Workspaces** (Gerenciamento de Monorepo)
* **Biome** (Linter, Formatter e organização de imports)

# :package: Como Rodar o Projeto Localmente

Este projeto utiliza a arquitetura de Monorepo. Siga os passos abaixo para rodar a aplicação em sua máquina de forma integrada.

1. **Clone o repositório:**
```sh
git clone https://github.com/SeuUsuario/elite-tracker.git
cd elite-tracker

```


2. **Instale as Dependências Globais:**
Estando na pasta raiz do projeto, rode o comando abaixo. O Yarn Workspaces se encarregará de instalar as dependências do Front e do Back de uma só vez:
```sh
yarn install

```


3. **Configure o Banco de Dados e as Variáveis de Ambiente:**
* Certifique-se de ter um cluster do **MongoDB** rodando (Atlas ou local).
* Crie os arquivos `.env` nas pastas da API e da Interface conforme o bloco de [Configuração de Variáveis](https://www.google.com/search?q=%23-configura%C3%A7%C3%A3o-de-vari%C3%A1veis-env) abaixo.


4. **Rodando a API (Back-end):**
Abra um terminal, acesse a pasta da API e inicie o servidor:
```sh
cd EliteTrackerAPI
yarn dev

```


5. **Rodando a Interface (Front-end):**
Abra um novo terminal, acesse a pasta da Interface e inicie a aplicação React:
```sh
cd EliteTrackerInterface
yarn dev

```



## 📦 Configuração de Variáveis (.env)

Você precisará criar dois arquivos `.env` separados (um em cada subpasta) contendo as seguintes chaves:

**Dentro da pasta `EliteTrackerAPI` (.env):**

```env
MONGO_URL = sua_connection_string_do_mongodb
GITHUB_CLIENT_ID = seu_client_id_do_github
GITHUB_CLIENT_SECRET_ID = seu_client_secret_do_github
JWT_SECRET = sua_chave_secreta_super_segura
JWT_EXPIRES = 86400

```

**Dentro da pasta `EliteTrackerInterface` (.env):**

```env
VITE_BASE_URL_API = seu_client_id_do_github
VITE_LOCAL_STORAGE_KEY = 

```

# :bug: Problemas

Sinta-se à vontade para abrir uma *Issue* caso encontre bugs ou tenha sugestões de melhoria para o projeto!

<p align="center"> Feito com 💜 por <strong>Elton Vitoretti Jr</strong> sob tutoria do DevClub.

Entre em contato: <a href="https://www.linkedin.com/in/elton-vitoretti-jr">LinkedIn</a> </p>
