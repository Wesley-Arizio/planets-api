import { IPagination, IRepository } from ".";
import { Reservation } from "../entities/reservation";

export class ReservationRepository implements IRepository<Reservation> {
  create(value: Reservation): Promise<Reservation> {
    throw new Error("Method not implemented.");
  }
  exists(id: String): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getMany(pagination: IPagination): Promise<Reservation[]> {
    throw new Error("Method not implemented.");
  }
  getOne(id: String): Promise<Reservation> {
    throw new Error("Method not implemented.");
  }
  update(id: String, newValue: Reservation): Promise<Reservation> {
    throw new Error("Method not implemented.");
  }
}
