import { Planet } from "@prisma/client";
import { IUseCase } from ".";
import { IRepository, RepositoryError } from "../repository";

export class GetPlanetUseCase implements IUseCase<Planet, string> {
  constructor(private readonly planetRepository: IRepository<Planet>) {}
  async execute(planetId: string): Promise<Planet> {
    try {
      return await this.planetRepository.getOne(planetId);
    } catch (e) {
      if (e instanceof RepositoryError) {
        throw new Error("Internal Server Error");
      }
      throw e;
    }
  }
}
