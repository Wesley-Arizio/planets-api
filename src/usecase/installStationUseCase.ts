import { IUseCase } from ".";
import { Planet } from "../entities/planet";
import { Station } from "../entities/station";
import { IRepository, RepositoryError } from "../repository";

export interface InstallStationUseCaseArgs {
  planetId: String;
  stationName: String;
}

export class InstallStationUseCase
  implements IUseCase<Station, InstallStationUseCaseArgs>
{
  constructor(
    private readonly planetRepository: IRepository<Planet>,
    private readonly stationRepository: IRepository<Station>
  ) {}

  async execute({
    planetId,
    stationName,
  }: InstallStationUseCaseArgs): Promise<Station> {
    try {
      if (!(await this.planetRepository.exists(planetId))) {
        throw new Error("Planet not found");
      }

      return await this.stationRepository.create({
        planetId,
        name: stationName,
      } as Station);
    } catch (e) {
      console.error(e);
      if (e instanceof RepositoryError) {
        throw new Error("Internal Server Error!");
      }
      throw e;
    }
  }
}
