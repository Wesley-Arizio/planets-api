import { PrismaClient } from "@prisma/client";
import { IUseCase } from "..";
import { Reservation } from "../../entities/reservation";
import { Context } from "../../repository";
import { StationRepository } from "../../repository/stationRepository";
import {
  ReservationUseCase,
  ReservationUseCaseArgs,
} from "../reservationUseCase";
import { UserRepository } from "../../repository/userRepository";
import { ReservationRepository } from "../../repository/reservationRepository";

export function reservationFactory(
  context: Context<PrismaClient>
): IUseCase<Reservation, ReservationUseCaseArgs> {
  return new ReservationUseCase(
    new StationRepository(context),
    new UserRepository(context),
    new ReservationRepository(context)
  );
}
