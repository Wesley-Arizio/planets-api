import { PrismaClient } from "@prisma/client";
import { IUseCase } from "..";
import { Context } from "../../repository";
import { Planet } from "../../entities/planet";
import { PlanetRepository } from "../../repository/planetRepository";
import { GetPlanetByStationUseCase } from "../getPlanetByStationUseCase";

export function getPlanetByStationFactory(
  context: Context<PrismaClient>
): IUseCase<Planet, string> {
  return new GetPlanetByStationUseCase(new PlanetRepository(context));
}
