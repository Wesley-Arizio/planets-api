import { IUseCase } from ".";
import { Station } from "../entities/station";
import { IPagination, IRepository, RepositoryError } from "../repository";

export class ListStationsUseCase implements IUseCase<Station[], IPagination> {
  constructor(private readonly stationRepository: IRepository<Station>) {}
  async execute(args: IPagination): Promise<Station[]> {
    try {
      return await this.stationRepository.getMany(args);
    } catch (e) {
      if (e instanceof RepositoryError) {
        throw new Error("Internal Server Error");
      }
      throw e;
    }
  }
}
