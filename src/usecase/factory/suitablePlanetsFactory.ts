import { PrismaClient } from "@prisma/client";
import { IUseCase } from "..";
import { Planet } from "../../entities/planet";
import { Context, IPagination } from "../../repository";
import { PlanetRepository } from "../../repository/planetRepository";
import { SuitablePlanetsUseCase } from "../suitablePlanetsUseCase";

export function suitablePlanetsFactory(
  context: Context<PrismaClient>
): IUseCase<Planet[], IPagination> {
  return new SuitablePlanetsUseCase(new PlanetRepository(context));
}
