import { IPagination, IRepository } from "../../src/repository";

export class MockRepository<T> implements IRepository<T> {
  getMany(pagination: IPagination): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  getOne(id: String): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update(id: String, newValue: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
}
