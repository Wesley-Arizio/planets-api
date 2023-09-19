import { IPagination, IRepository } from ".";
import { User } from "../entities/user";

export class UserRepository implements IRepository<User> {
  create(value: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  exists(id: String): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getMany(pagination: IPagination): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  getOne(id: String): Promise<User> {
    throw new Error("Method not implemented.");
  }
  update(id: String, newValue: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
