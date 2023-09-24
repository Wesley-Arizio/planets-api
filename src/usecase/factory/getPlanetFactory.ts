import { PrismaClient } from "@prisma/client";
import { IUseCase } from "..";
import { Context } from "../../repository";
import { Planet } from "../../entities/planet";
import { GetPlanetUseCase } from "../getPlanetUseCase";
import { PlanetRepository } from "../../repository/planetRepository";

export function getPlanetFactory(
  context: Context<PrismaClient>
): IUseCase<Planet, string> {
  return new GetPlanetUseCase(new PlanetRepository(context));
}
