import { PrismaClient } from "@prisma/client";
import { IUseCase } from "..";
import { Context, IPagination } from "../../repository";
import { StationRepository } from "../../repository/stationRepository";
import { Station } from "../../entities/station";
import {
  IListStationsUseCaseArgs,
  ListStationsUseCase,
} from "../listStationsUseCase";

export function listStationsFactory(
  context: Context<PrismaClient>
): IUseCase<Station[], IListStationsUseCaseArgs> {
  return new ListStationsUseCase(new StationRepository(context));
}
