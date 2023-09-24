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
  StationsInput,
} from "../input";
import { Planet } from "../model/planetModel";

import { IUseCase } from "../../usecase";
import { IPagination } from "../../repository";
import { TYPES } from "../../types";
import { Inject, Service } from "typedi";
import { Station } from "../model/stationModel";
import { InstallStationUseCaseArgs } from "../../usecase/installStationUseCase";
import { IListStationsUseCaseArgs } from "../../usecase/listStationsUseCase";
import { ReservationUseCaseArgs } from "../../usecase/reservationUseCase";
import {
  Reservation,
  Reservation as ReservationModel,
} from "../model/reservationModel";
import { User } from "../../entities/user";
import { ICreateUserUseCaseArgs } from "../../usecase/createUserUseCase";
import { User as UserModel } from "../model/userModel";

@Service()
@Resolver((of) => Planet)
export class PlanetResolver {
  constructor(
    @Inject(TYPES.SuitablePlanetsUseCase)
    private readonly suitablePlanetsUseCase: IUseCase<Planet[], IPagination>,
    @Inject(TYPES.ListStationsUseCase)
    private readonly listStationsUseCase: IUseCase<
      Station[],
      IListStationsUseCaseArgs
    >,
    @Inject(TYPES.CreateUserUseCase)
    private readonly createUserUseCase: IUseCase<User, ICreateUserUseCaseArgs>
  ) {}

  @Query(() => [Planet!]!)
  async suitablePlanets(@Arg("data") data: PaginationInput) {
    return this.suitablePlanetsUseCase.execute(data);
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

@Service()
@Resolver((of) => Station)
export class StationResolver {
  constructor(
    @Inject(TYPES.InstallStationUseCase)
    private readonly installStationUseCase: IUseCase<
      Station,
      InstallStationUseCaseArgs
    >,
    @Inject(TYPES.GetPlanetByStationUseCase)
    private readonly getPlanetByStationUseCase: IUseCase<Planet, string>,
    @Inject(TYPES.ListStationsUseCase)
    private readonly listStationsUseCase: IUseCase<
      Station[],
      IListStationsUseCaseArgs
    >
  ) {}

  @Mutation(() => Station!)
  async installStation(@Arg("data") data: InstallStationInput) {
    return this.installStationUseCase.execute({
      stationName: data.name,
      planetId: data.planetId,
    });
  }

  @FieldResolver(() => Planet)
  async planet(@Root() station: Station) {
    return this.getPlanetByStationUseCase.execute(station.id);
  }

  @Query(() => [Station!]!)
  async stations(@Arg("data") data: StationsInput) {
    return this.listStationsUseCase.execute(data);
  }
}

@Service()
@Resolver((of) => ReservationModel)
export class ReservationResolver {
  constructor(
    @Inject(TYPES.ReservationUseCase)
    private readonly reservationUseCase: IUseCase<
      Reservation,
      ReservationUseCaseArgs
    >,
    @Inject(TYPES.GetStationUseCase)
    private readonly getStationUseCase: IUseCase<Station, string>
  ) {}

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

  @FieldResolver(() => Station!)
  async station(@Root() reservation: ReservationModel) {
    return this.getStationUseCase.execute(reservation.stationId);
  }
}
