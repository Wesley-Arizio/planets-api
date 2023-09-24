import "reflect-metadata";
import { GraphqlModule } from "./graphql";
import { PrismaClient } from "@prisma/client";
import Container from "typedi";
import { TYPES } from "./types";
import { suitablePlanetsFactory } from "./usecase/factory/suitablePlanetsFactory";
import { installStationFactory } from "./usecase/factory/installStationFactory";
import { listStationsFactory } from "./usecase/factory/listStationsFactory";
import { getPlanetFactory } from "./usecase/factory/getPlanetFactory";
import { reservationFactory } from "./usecase/factory/reservationFactory";
import { createUserFactory } from "./usecase/factory/createUserFactory";
import { getPlanetByStationFactory } from "./usecase/factory/getPlanetByStationFactory";
import { getStationFactory } from "./usecase/factory/getStationFactory";

export async function main() {
  const repositoryContext = {
    client: new PrismaClient(),
  };

  Container.set({
    id: TYPES.SuitablePlanetsUseCase,
    factory: () => suitablePlanetsFactory(repositoryContext),
  });

  Container.set({
    id: TYPES.InstallStationUseCase,
    factory: () => installStationFactory(repositoryContext),
  });

  Container.set({
    id: TYPES.ListStationsUseCase,
    factory: () => listStationsFactory(repositoryContext),
  });

  Container.set({
    id: TYPES.GetPlanetUseCase,
    factory: () => getPlanetFactory(repositoryContext),
  });

  Container.set({
    id: TYPES.ReservationUseCase,
    factory: () => reservationFactory(repositoryContext),
  });

  Container.set({
    id: TYPES.CreateUserUseCase,
    factory: () => createUserFactory(repositoryContext),
  });

  Container.set({
    id: TYPES.GetPlanetByStationUseCase,
    factory: () => getPlanetByStationFactory(repositoryContext),
  });

  Container.set({
    id: TYPES.GetStationUseCase,
    factory: () => getStationFactory(repositoryContext),
  });

  const graphqlPort = Number(process.env.GRAPHQL_PORT) || 4000;

  return await GraphqlModule(graphqlPort);
}
