import { PrismaClient } from "@prisma/client";
import { Context, IPagination, IRepository, RepositoryError } from ".";
import { Reservation } from "../entities/reservation";

export class ReservationRepository implements IRepository<Reservation> {
  constructor(private readonly context: Context<PrismaClient>) {}
  async create(value: Reservation): Promise<Reservation> {
    try {
      return await this.context.client.reservation.create({
        data: {
          userId: value.userId,
          stationId: value.stationId,
          startsAt: value.startsAt,
          endsAt: value.endsAt,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async exists(id: string): Promise<boolean> {
    try {
      return (
        (await this.context.client.reservation.count({ where: { id } })) > 1
      );
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async getMany(pagination: IPagination): Promise<Reservation[]> {
    try {
      return await this.context.client.reservation.findMany({
        skip: pagination.offset,
        take: pagination.limit,
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async getOne(id: string): Promise<Reservation> {
    try {
      const reservation = await this.context.client.reservation.findUnique({
        where: { id },
      });

      if (!reservation) {
        throw new RepositoryError(`Reservation with id ${id} not found`);
      }

      return reservation;
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async update(id: string, newValue: Reservation): Promise<Reservation> {
    try {
      return await this.context.client.reservation.update({
        where: { id },
        data: {
          startsAt: newValue.startsAt,
          endsAt: newValue.endsAt,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
}
