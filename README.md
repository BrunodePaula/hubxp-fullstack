
Este é um projeto fullstack utilizando **NestJS** para o backend, **React** para o frontend, **MongoDB** para o banco de dados, e **LocalStack** para emular o AWS S3. Abaixo estão as instruções para rodar o projeto localmente utilizando **Docker**.

## Tecnologias Utilizadas

- **Backend**: NestJS, MongoDB, Mongoose
- **Frontend**: React, Vite
- **Banco de Dados**: MongoDB (emulado via Docker)
- **Armazenamento de Arquivos**: LocalStack (emula AWS S3)
- **Lambdas**: Node.js

## Estrutura do Projeto

- **backend**: Código do backend em NestJS
- **frontend**: Código do frontend em React
- **lambda**: Função Lambda para notificação de pedidos
- **docker**: Arquivos de configuração do Docker e Docker Compose
- **docker-compose.yml**: Arquivo para configurar e rodar os containers
- **README.md**: Este documento

## Como Rodar o Projeto

### Passo 1: Clonar o Repositório

Clone o repositório para sua máquina local:

```bash
git clone https://github.com/BrunodePaula/hubxp-fullstack.git
cd hubxp-fullstack
```

### Passo 2: Iniciar os Containers com Docker Compose

Use o Docker Compose para iniciar todos os containers necessários (MongoDB, LocalStack, Backend, Frontend). No diretório raiz do projeto, execute:

```bash
docker-compose up --build
```
Este comando vai construir as imagens do Docker e iniciar os containers. Ele vai criar os seguintes serviços:

- **mongo**: Banco de dados MongoDB
- **localstack**: Emulação do AWS S3 (LocalStack)
- **backend**: Backend (NestJS)
- **frontend**: Frontend (React)

### Observação Importante

Se você estiver utilizando uma máquina com desempenho mais limitado, ou estiver enfrentando erros de timeout ao iniciar os containers, recomendamos aumentar o tempo limite do Docker Compose com o seguinte comando:

```bash
COMPOSE_HTTP_TIMEOUT=300 docker-compose up --build
```

### Passo 3: Acessar o Frontend

Após o Docker Compose levantar os containers, o frontend estará disponível em http://localhost:5173.

```bash
http://localhost:5173
```
### Passo 4: Acessar o Backend

O backend estará rodando na porta 3000. A API estará disponível em http://localhost:3000.

### Passo 5: Rodar o Seed (Popular o Banco de Dados)

Para popular o banco de dados com dados iniciais (categorias, produtos, pedidos), você pode rodar o script de seed dentro do container do backend. Execute o seguinte comando:

```bash
docker-compose exec backend npm run seed
```

Isso vai executar o script seed.ts, que cria dados de categorias, produtos e pedidos no banco de dados MongoDB.

Observação: Se o banco de dados já tiver dados, o seed não será executado novamente. Se quiser forçar o seed mesmo com dados existentes, você pode remover manualmente os dados ou modificar a lógica de verificação no script.

### Passo 6: Lambda de Notificação de Pedidos

A função Lambda (`lambda/notifyOrder`) é executada automaticamente como parte do ambiente Docker.

Ao rodar `docker-compose up --build`, o container da lambda será criado e ficará escutando na porta **3003**, pronto para receber requisições.

**Dica:** Para acompanhar os logs da Lambda, você pode usar:

```bash
docker-compose logs -f lambda
```

### Passo 7: Interagir com a API
Após levantar os containers e rodar o seed, você pode interagir com a API usando as rotas do backend.

**Rotas do Backend** (exemplo):

GET /products: Retorna todos os produtos cadastrados no banco de dados

POST /orders: Cria um novo pedido (requisição de exemplo para envio de pedidos)

### Passo 8: Parar os Containers
Quando terminar de trabalhar no projeto, você pode parar os containers com o seguinte comando:

```bash
docker-compose down
```
Esse comando irá parar e remover todos os containers, mas os dados persistem, pois estamos utilizando volumes para armazenar os dados do MongoDB.

### Configuração de Variáveis de Ambiente
Algumas variáveis de ambiente são utilizadas para configurar a conexão do banco de dados e outros serviços.

**Variáveis de Ambiente**
**MONGO_URI**: URI de conexão com o MongoDB (padrão: mongodb://mongo:27017/hubxp)

**AWS_REGION**: Região da AWS (padrão: us-east-1)

**AWS_BUCKET**: Nome do bucket no LocalStack (padrão: product-images)

**AWS_ENDPOINT**: Endpoint do LocalStack (padrão: http://localstack:4566)

**LAMBDA_URL**: URL da função Lambda para notificações de pedidos

As variáveis de ambiente devem ser definidas no arquivo .env no backend e na raiz do projeto.

### Rodando o Seed
O seed pode ser rodado para popular o banco de dados com dados iniciais. Acesse o container do backend e execute o seguinte comando:

```bash
docker-compose exec backend npm run seed
```

Este comando irá verificar se as coleções de categorias, produtos e pedidos estão vazias. Se estiverem, o script irá inserir dados de exemplo no banco de dados. Caso contrário, o seed não será executado.

### Rodando o Storybook
Este projeto utiliza o Storybook para documentar e visualizar componentes do frontend de forma isolada.

Para rodar o Storybook localmente, acesse o diretório frontend e execute:

```bash
cd frontend
npm run storybook
```
Isso abrirá o Storybook no navegador, geralmente disponível em:

```bash
http://localhost:6006
```
### Componentes Documentados
Os seguintes componentes estão documentados no Storybook:

 - **ProductForm**: Formulário utilizado para criar ou editar um produto, com suporte a upload de imagem e validação com Yup.

 - **ProductsPage**: Página principal de listagem de produtos, com tabela (DataGrid), ações de editar/excluir e botão para adicionar novo produto.

Esses componentes estão organizados sob a seção Product na interface do Storybook.

### Resumo de Comandos

 - **Iniciar containers**: ```docker-compose up --build```

 - **Rodar o seed**: ```docker-compose exec backend npm run seed```

 - **Ver logs da Lambda**: ```docker-compose logs -f lambda```

 - **Parar containers**: ```docker-compose down```

 - **Rodar o storybook**: ```npm run storybook```