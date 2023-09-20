import { IUseCase } from ".";
import { Reservation } from "../entities/reservation";
import { Station } from "../entities/station";
import { User } from "../entities/user";
import { IPagination, IRepository, RepositoryError } from "../repository";

export interface ReservationUseCaseArgs {
  stationId: String;
  startsAt: Date;
  endsAt: Date;
  userId: String;
}

export interface IStationReservations extends Partial<IPagination> {
  stationId: String;
  startsAt?: Date;
  endsAt?: Date;
}

export interface IStationRepository extends IRepository<Station> {
  getStationReservations(args: IStationReservations): Promise<Reservation[]>;
}

export class ReservationUseCase
  implements IUseCase<Reservation, ReservationUseCaseArgs>
{
  constructor(
    private readonly stationRepository: IStationRepository,
    private readonly userRepository: IRepository<User>,
    private readonly reservationRepository: IRepository<Reservation>
  ) {}
  async execute(args: ReservationUseCaseArgs): Promise<Reservation> {
    try {
      const now = Date.now();

      if (now > args.startsAt.getTime()) {
        throw new Error("startsAt cannot be in the past");
      }

      if (!(await this.stationRepository.exists(args.stationId))) {
        throw new Error("Station not found");
      }

      const { hasOngoingReservation } = await this.userRepository.getOne(
        args.userId
      );

      if (hasOngoingReservation) {
        throw new Error("User already have an ongoing reservation");
      }

      const reservations = await this.stationRepository.getStationReservations({
        stationId: args.stationId,
        startsAt: args.startsAt,
        endsAt: args.endsAt,
        limit: 1,
      });

      if (reservations.length > 0) {
        throw new Error("The selected station is already ocupied");
      }

      const reservation = await this.reservationRepository.create({
        userId: args.userId,
        stationId: args.stationId,
        startsAt: args.startsAt,
        endsAt: args.endsAt,
      } as Reservation);

      await this.userRepository.update(args.userId, {
        hasOngoingReservation: true,
      });

      return reservation;
    } catch (e) {
      if (e instanceof RepositoryError) {
        throw new Error("Internal server error");
      }

      throw e;
    }
  }
}
