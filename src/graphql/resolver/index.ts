import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import {
  CreateUserInput,
  InstallStationInput,
  PaginationInput,
  RervateStationInput,
} from "../input";
import { Planet } from "../model/planetModel";

import { IUseCase } from "../../usecase";
import { IPagination } from "../../repository";
import { TYPES } from "../../types";
import { Inject, Service } from "typedi";
import { Station } from "../model/stationModel";
import { InstallStationUseCaseArgs } from "../../usecase/installStationUseCase";
import { IListStationsUseCaseArgs } from "../../usecase/listStationsUseCase";
import { Reservation } from "../../entities/reservation";
import { ReservationUseCaseArgs } from "../../usecase/reservationUseCase";
import { Reservation as ReservationModel } from "../model/reservationModel";
import { User } from "../../entities/user";
import { ICreateUserUseCaseArgs } from "../../usecase/createUserUseCase";
import { User as UserModel } from "../model/userModel";

@Service()
@Resolver((of) => Planet)
export class PlanetResolver {
  constructor(
    @Inject(TYPES.SuitablePlanetsUseCase)
    private readonly suitablePlanetsUseCase: IUseCase<Planet[], IPagination>,
    @Inject(TYPES.InstallStationUseCase)
    private readonly installStationUseCase: IUseCase<
      Station,
      InstallStationUseCaseArgs
    >,
    @Inject(TYPES.ListStationsUseCase)
    private readonly listStationsUseCase: IUseCase<
      Station[],
      IListStationsUseCaseArgs
    >,
    @Inject(TYPES.ReservationUseCase)
    private readonly reservationUseCase: IUseCase<
      Reservation,
      ReservationUseCaseArgs
    >,
    @Inject(TYPES.CreateUserUseCase)
    private readonly createUserUseCase: IUseCase<User, ICreateUserUseCaseArgs>,
    @Inject(TYPES.GetPlanetUseCase)
    private readonly getPlanetUseCase: IUseCase<Planet, string>
  ) {}

  @Query(() => [Planet!]!)
  async suitablePlanets(@Arg("data") data: PaginationInput) {
    return this.suitablePlanetsUseCase.execute(data);
  }

  @Mutation(() => Station!)
  async installStation(@Arg("data") data: InstallStationInput) {
    return this.installStationUseCase.execute({
      stationName: data.name,
      planetId: data.planetId,
    });
  }

  @Mutation(() => ReservationModel!)
  async reservateStation(@Arg("data") data: RervateStationInput) {
    return this.reservationUseCase.execute({
      stationId: data.stationId,
      startsAt: data.startsAt || new Date(Date.now()),
      endsAt: data.endsAt,
      // TODO - extract user id from authentication token
      userId: data.userId,
    });
  }

  @Mutation(() => UserModel!)
  async createUser(@Arg("data") data: CreateUserInput) {
    return this.createUserUseCase.execute({
      email: data.email,
      password: data.password,
    });
  }

  @FieldResolver(() => [Station!]!)
  async station(@Root() planet: Planet) {
    return this.listStationsUseCase.execute({
      planetId: planet.id,
    });
  }
}
