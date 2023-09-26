## Backend code challenge

Essa Api graphql tem o objetivo de gerenciar reservas para recargas de veículos espaciais em planetas com a massa necessária, visando o melhor desempenho das recargas.
A listagem de planetas usa como fonte a [api oficial da NASA](https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps&format=json) sendo feita a pesquisa utilizando a seguinte query: 

```
https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=
select+pl_name,pl_masse+from+ps+where+upper(soltype)+like+'%CONF%'+and+pl_masse+>=+10+order+by+pl_masse+asc+&format=json
```

### Tecnologias usadas

 - Graphql (apollo-server e type-graphql)
 - Typescript
 - Prisma
 - Postgresql
 - Docker
 - Jest e supertest para testes unitários e de integração.

### Testes
Foram feitos testes unitários e de integração, para rodar a suite de testes basta utilizar os comandos:

```sh
npm run test:unit # rodar apenas testes unitários.
npm run test:integration # rodar apenas o teste de integração.
npm run test # rodar todos os testes.
```

OBS: Para rodar testes de integração é necessário primeiro iniciar o docker e rodar o comando abaixo.

### Iniciando o projeto

Para iniciar o projeto, é necessário primeiro configurar o banco de dados usando o docker.
Após navegar ao diretório do projeto rodar o comando:
```sh 
docker comopose up -d
```
Instalar as dependências
```sh
npm ci
```
Rodando o comando a seguir, irá rodar as migrations (sincronizar o banco de dados com as schemas definidas no projeto) e popoular o banco de dado usando a seed no arquivo `prisma/seed.ts`

```sh
npm run start:dev
```

Após executado o comando acima, o servidor deverá rodar em `http://localhost:4000`