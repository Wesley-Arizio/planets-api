import { Planet } from "@prisma/client";
import { IUseCase } from ".";
import { RepositoryError } from "../repository";
import { IPlanetRepository } from "../repository/planetRepository";

export class GetPlanetByStationUseCase implements IUseCase<Planet, string> {
  constructor(private readonly planetRepository: IPlanetRepository) {}
  async execute(stationId: string): Promise<Planet> {
    try {
      return await this.planetRepository.getPlanetByStation(stationId);
    } catch (e) {
      if (e instanceof RepositoryError) {
        throw new Error("Internal Server Error");
      }
      throw e;
    }
  }
}
