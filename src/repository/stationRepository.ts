import { IPagination, IRepository } from ".";
import { Station } from "../entities/station";

export class StationRepository implements IRepository<Station> {
  create(value: Station): Promise<Station> {
    throw new Error("Method not implemented.");
  }
  exists(id: String): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getMany(pagination: IPagination): Promise<Station[]> {
    throw new Error("Method not implemented.");
  }
  getOne(id: String): Promise<Station> {
    throw new Error("Method not implemented.");
  }
  update(id: String, newValue: Station): Promise<Station> {
    throw new Error("Method not implemented.");
  }
}
