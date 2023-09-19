import { IPagination, IRepository } from ".";
import { User } from "../entities/user";

export class UserRepository implements IRepository<User> {
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
