import "reflect-metadata";
import { GraphqlModule } from "./graphql";
import { PrismaClient } from "@prisma/client";
import Container from "typedi";
import { TYPES } from "./graphql/types";
import { suitablePlanetsFactory } from "./usecase/factory/suitablePlanetsFactory";

(async function () {
  const repositoryContext = {
    client: new PrismaClient(),
  };

  Container.set({
    id: TYPES.SuitablePlanetsUseCase,
    factory: () => suitablePlanetsFactory(repositoryContext),
  });

  const graphqlPort = Number(process.env.GRAPHQL_PORT) || 4000;

  await GraphqlModule(graphqlPort);
})();
