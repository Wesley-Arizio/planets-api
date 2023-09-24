import { IUseCase } from ".";
import { Station } from "../entities/station";
import { IPagination, IRepository, RepositoryError } from "../repository";
import { IStationRepository } from "../repository/stationRepository";

export interface IListStationsUseCaseArgs extends Partial<IPagination> {
  planetId: string;
}

export class ListStationsUseCase
  implements IUseCase<Station[], IListStationsUseCaseArgs>
{
  constructor(private readonly stationRepository: IStationRepository) {}
  async execute(args: IListStationsUseCaseArgs): Promise<Station[]> {
    try {
      return await this.stationRepository.getStationsByPlanet(args);
    } catch (e) {
      if (e instanceof RepositoryError) {
        throw new Error("Internal Server Error");
      }
      throw e;
    }
  }
}
