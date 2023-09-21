import { PrismaClient } from "@prisma/client";
import { Context, IPagination, IRepository, RepositoryError } from ".";
import { User } from "../entities/user";

export class UserRepository implements IRepository<User> {
  constructor(private readonly context: Context<PrismaClient>) {}
  async create(value: User): Promise<User> {
    try {
      return await this.context.client.user.create({
        data: {
          email: value.email,
          password: value.password,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async exists(id: string): Promise<boolean> {
    try {
      return (await this.context.client.user.count({ where: { id } })) > 1;
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async getMany(pagination: IPagination): Promise<User[]> {
    try {
      return await this.context.client.user.findMany({
        skip: pagination.offset,
        take: pagination.limit,
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async getOne(id: string): Promise<User> {
    try {
      const user = await this.context.client.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new RepositoryError(`User with id ${id} not found`);
      }

      return user;
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
  async update(id: string, newValue: User): Promise<User> {
    try {
      return await this.context.client.user.update({
        where: { id },
        data: {
          password: newValue.password,
        },
      });
    } catch (e: any) {
      throw new RepositoryError(e?.message);
    }
  }
}
