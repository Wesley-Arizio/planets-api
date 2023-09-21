import { PrismaClient } from "@prisma/client";
import { Context, IPagination, IRepository, RepositoryError } from ".";
import { Station } from "../entities/station";

export class StationRepository implements IRepository<Station> {
  constructor(private readonly context: Context<PrismaClient>) {}
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
      return (await this.context.client.station.count({ where: { id } })) > 1;
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
