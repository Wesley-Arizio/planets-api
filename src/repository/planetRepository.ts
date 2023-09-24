import { PrismaClient } from "@prisma/client";
import { Context, IPagination, IRepository, RepositoryError } from ".";
import { Planet } from "../entities/planet";

export class PlanetRepository implements IRepository<Planet> {
  constructor(private readonly context: Context<PrismaClient>) {}

  async create(value: Planet): Promise<Planet> {
    try {
      return await this.context.client.planet.create({
        data: {
          name: value.name.toString(),
          mass: value.mass,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async exists(id: string): Promise<boolean> {
    try {
      return (await this.context.client.planet.count({ where: { id } })) > 0;
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async getMany(pagination: IPagination): Promise<Planet[]> {
    try {
      return await this.context.client.planet.findMany({
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: {
          mass: "asc",
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async getOne(id: string): Promise<Planet> {
    try {
      const planet = await this.context.client.planet.findUnique({
        where: { id },
      });

      if (!planet) {
        throw new RepositoryError(`Planet with id ${id} not found`);
      }

      return planet;
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async update(id: string, newValue: Planet): Promise<Planet> {
    try {
      return await this.context.client.planet.update({
        where: { id },
        data: {
          name: newValue.name,
          mass: newValue.mass,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
}
