import { IPagination, IRepository } from ".";
import { Planet } from "../entities/planet";

export class PlanetRepository implements IRepository<Planet> {
  getMany(pagination: IPagination): Promise<Planet[]> {
    throw new Error("Method not implemented.");
  }
  getOne(id: String): Promise<Planet> {
    throw new Error("Method not implemented.");
  }
  update(id: String, newValue: Planet): Promise<Planet> {
    throw new Error("Method not implemented.");
  }
}