import { Planet } from "@prisma/client";
import { IUseCase } from ".";
import { RepositoryError } from "../repository";
import { IPlanetRepository } from "../repository/planetRepository";
import { Station } from "../entities/station";
import { IStationRepository } from "../repository/stationRepository";

export class GetStationUseCase implements IUseCase<Station, string> {
  constructor(private readonly planetRepository: IStationRepository) {}
  async execute(stationId: string): Promise<Station> {
    try {
      return await this.planetRepository.getOne(stationId);
    } catch (e) {
      if (e instanceof RepositoryError) {
        throw new Error("Internal Server Error");
      }
      throw e;
    }
  }
}
