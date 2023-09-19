import { IUseCase } from ".";
import { Planet } from "../entities/planet";
import { IPagination, IRepository, RepositoryError } from "../repository";

export class SuitablePlanetsUseCase implements IUseCase<Planet[], IPagination> {
  constructor(private readonly repository: IRepository<Planet>) {}
  async execute({ limit, offset }: IPagination): Promise<Planet[]> {
    try {
      return await this.repository.getMany({ limit, offset });
    } catch (e) {
      console.error(e);
      if (e instanceof RepositoryError) {
        throw Error("Internal Server Error!");
      }
      throw e;
    }
  }
}
