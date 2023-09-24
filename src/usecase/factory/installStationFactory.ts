import { PrismaClient } from "@prisma/client";
import { IUseCase } from "..";
import { Context, IPagination } from "../../repository";
import { PlanetRepository } from "../../repository/planetRepository";
import {
  InstallStationUseCase,
  InstallStationUseCaseArgs,
} from "../installStationUseCase";
import { StationRepository } from "../../repository/stationRepository";
import { Station } from "../../entities/station";

export function installStationFactory(
  context: Context<PrismaClient>
): IUseCase<Station, InstallStationUseCaseArgs> {
  return new InstallStationUseCase(
    new PlanetRepository(context),
    new StationRepository(context)
  );
}
