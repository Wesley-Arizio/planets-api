## Backend code challenge

This is a graphql API that manages spacial vehicles energy recharges in planets with the necessary mass for better performance.
The planet's list uses NASA's api as resources [link here](https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps&format=json)


### Chosen tecnhologies
 - Graphql (apollo-server and type-graphql)
 - Typescript
 - Prisma
 - Postgresql
 - Docker
 - Jest and supertest for unit and integration tests.


### Tests
Use the commands below to run the tests:

```sh
npm run test:unit # run only unit tests.
npm run test:integration # run only integration tests.
npm run test # run all tests.
```

Observation: In order to run integration tests, it's necessary to first initialize docker and start the container.

### Initializing the project
To run the project, it's necessary to configure the database using docker.
After navigate to the root directory, run the command:
```sh 
docker comopose up -d
```
Install dependencies
```sh
npm ci
```
Run the command below, it will run the migrations and populate the database with the correct planet's list.

```sh
npm run start:dev
```

After that, the API will start running at `http://localhost:4000`