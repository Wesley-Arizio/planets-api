import { PrismaClient } from "@prisma/client";
import { Context, IPagination, IRepository, RepositoryError } from ".";
import { Station } from "../entities/station";
import { Reservation } from "../entities/reservation";

export interface IStationReservations extends Partial<IPagination> {
  stationId: string;
  startsAt?: Date;
  endsAt?: Date;
}

export interface IStationsByPlanet extends Partial<IPagination> {
  planetId: string;
}

export interface IStationRepository extends IRepository<Station> {
  getStationReservations(args: IStationReservations): Promise<Reservation[]>;
  getStationsByPlanet(args: IStationsByPlanet): Promise<Station[]>;
}
export class StationRepository implements IStationRepository {
  constructor(private readonly context: Context<PrismaClient>) {}
  async getStationReservations(
    args: IStationReservations
  ): Promise<Reservation[]> {
    try {
      return await this.context.client.reservation.findMany({
        where: {
          OR: [
            {
              AND: [
                {
                  startsAt: {
                    lte: args.endsAt,
                  },
                },
                {
                  endsAt: {
                    gte: args.startsAt,
                  },
                },
              ],
            },
            {
              AND: [
                {
                  startsAt: {
                    gte: args.startsAt,
                  },
                },
                {
                  endsAt: {
                    lte: args.endsAt,
                  },
                },
              ],
            },
          ],
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async create(value: Station): Promise<Station> {
    try {
      return await this.context.client.station.create({
        data: {
          name: value.name,
          planetId: value.planetId,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async exists(id: string): Promise<boolean> {
    try {
      return (await this.context.client.station.count({ where: { id } })) > 0;
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }

  async getStationsByPlanet(args: IStationsByPlanet): Promise<Station[]> {
    try {
      return await this.context.client.station.findMany({
        skip: args.offset,
        take: args.limit,
        where: {
          planetId: args.planetId,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }

  async getMany(pagination: IPagination): Promise<Station[]> {
    try {
      return await this.context.client.station.findMany({
        skip: pagination.offset,
        take: pagination.limit,
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async getOne(id: string): Promise<Station> {
    try {
      const reservation = await this.context.client.station.findUnique({
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
  async update(id: string, newValue: Station): Promise<Station> {
    try {
      return await this.context.client.station.update({
        where: { id },
        data: {
          name: newValue.name,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
}
