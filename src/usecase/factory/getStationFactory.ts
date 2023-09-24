import { PrismaClient } from "@prisma/client";
import { IUseCase } from "..";
import { Context } from "../../repository";
import { Station } from "../../entities/station";
import { GetStationUseCase } from "../getStationUseCase";
import { StationRepository } from "../../repository/stationRepository";

export function getStationFactory(
  context: Context<PrismaClient>
): IUseCase<Station, string> {
  return new GetStationUseCase(new StationRepository(context));
}
