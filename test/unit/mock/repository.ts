import { Reservation } from "../../../src/entities/reservation";
import { Station } from "../../../src/entities/station";
import { User } from "../../../src/entities/user";
import { IPagination, IRepository } from "../../../src/repository";
import {
  IStationRepository,
  IStationsByPlanet,
} from "../../../src/repository/stationRepository";
import { IUserRepository } from "../../../src/repository/userRepository";
import { IStationReservations } from "../../../src/usecase/reservationUseCase";

export class MockRepository<T> implements IRepository<T> {
  create(value: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  getMany(pagination: IPagination): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  getOne(id: String): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update(id: String, newValue: T): Promise<T> {
    throw new Error("Method not implemented.");
  }
  exists(id: String): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export class StationMockRepository implements IStationRepository {
  getStationsByPlanet(args: IStationsByPlanet): Promise<Station[]> {
    throw new Error("Method not implemented.");
  }
  getStationReservations(args: IStationReservations): Promise<Reservation[]> {
    throw new Error("Method not implemented.");
  }
  create(value: Station): Promise<Station> {
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
  exists(id: String): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export class UserMockRepository implements IUserRepository {
  countOngoingUserReservations(userId: string): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getMany(pagination: IPagination): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  getOne(id: String): Promise<User> {
    throw new Error("Method not implemented.");
  }
  update(id: String, newValue: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  create(value: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  exists(id: String): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
