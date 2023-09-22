import { Arg, Query, Resolver } from "type-graphql";
import { PaginationInput } from "../input/paginationInput";
import { Planet } from "../model/planetModel";

import { IUseCase } from "../../usecase";
import { IPagination } from "../../repository";
import { TYPES } from "../types";
import { Inject, Service } from "typedi";

@Service()
@Resolver((of) => Planet)
export class PlanetResolver {
  constructor(
    @Inject(TYPES.SuitablePlanetsUseCase)
    private readonly useCase: IUseCase<Planet[], IPagination>
  ) {}
  @Query(() => [Planet!]!)
  async suitablePlanets(@Arg("data") data: PaginationInput) {
    const res = await this.useCase.execute(data);

    return res;
  }
}
