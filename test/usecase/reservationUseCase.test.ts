import { Reservation } from "../../src/entities/reservation";
import { Station } from "../../src/entities/station";
import { User } from "../../src/entities/user";
import { IRepository } from "../../src/repository";
import {
  IStationRepository,
  ReservationUseCase,
  ReservationUseCaseArgs,
} from "../../src/usecase/reservationUseCase";
import { MockRepository, StationMockRepository } from "../mock/repository";

describe("ReservationUseCase", () => {
  let stationMockRepository: IStationRepository;
  let userMockRepository: IRepository<User>;
  let reservationRepository: IRepository<Reservation>;
  let usecase: ReservationUseCase;

  beforeEach(() => {
    stationMockRepository = new StationMockRepository();
    userMockRepository = new MockRepository<User>();
    reservationRepository = new MockRepository<Reservation>();
    usecase = new ReservationUseCase(
      stationMockRepository,
      userMockRepository,
      reservationRepository
    );

    jest.spyOn(stationMockRepository, "exists").mockImplementation(() => {
      return new Promise((resolve) => resolve(true));
    });
    jest.spyOn(userMockRepository, "getOne").mockImplementation(() => {
      return new Promise((resolve) =>
        resolve({ hasOngoingReservation: false } as User)
      );
    });
  });

  it("Should not be able to create a reservation if startsAt is in the past", async () => {
    const args: ReservationUseCaseArgs = {
      stationId: "any station id",
      startsAt: new Date("2023-04-12"),
      userId: "1",
      endsAt: new Date(),
    };

    await expect(usecase.execute(args)).rejects.toThrow(
      "startsAt cannot be in the past"
    );
  });

  it("Should not be able to create a reservation if station does not exist", async () => {
    jest.spyOn(stationMockRepository, "exists").mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(false));
    });
    const args: ReservationUseCaseArgs = {
      stationId: "any station id",
      startsAt: new Date(),
      endsAt: new Date(),
      userId: "1",
    };

    await expect(usecase.execute(args)).rejects.toThrow("Station not found");
    expect(stationMockRepository.exists).toHaveBeenCalledWith(args.stationId);
  });

  it("Should not be able to create a reservation if user already have a ongoing one", async () => {
    jest.spyOn(userMockRepository, "getOne").mockImplementationOnce(() => {
      return new Promise((resolve) =>
        resolve({ hasOngoingReservation: true } as User)
      );
    });
    const args: ReservationUseCaseArgs = {
      stationId: "any station id",
      startsAt: new Date(),
      endsAt: new Date(),
      userId: "1",
    };

    await expect(usecase.execute(args)).rejects.toThrow(
      "User already have an ongoing reservation"
    );
    expect(stationMockRepository.exists).toHaveBeenCalledWith(args.stationId);
    expect(userMockRepository.getOne).toHaveBeenCalledWith(args.userId);
  });

  it("Should not be able to create a reservation if the station is already in use by another user at the same time", async () => {
    jest
      .spyOn(stationMockRepository, "getStationReservations")
      .mockImplementation(() => {
        return new Promise((resolve) =>
          resolve([
            {
              id: "1",
              userId: "1",
              stationId: "1",
              startsAt: new Date(),
              endsAt: new Date(),
            },
          ])
        );
      });

    const args: ReservationUseCaseArgs = {
      stationId: "any station id",
      startsAt: new Date(),
      endsAt: new Date(),
      userId: "1",
    };

    await expect(usecase.execute(args)).rejects.toThrow(
      "The selected station is already ocupied"
    );
    expect(stationMockRepository.exists).toHaveBeenCalledWith(args.stationId);
    expect(userMockRepository.getOne).toHaveBeenCalledWith(args.userId);
    expect(stationMockRepository.getStationReservations).toHaveBeenCalledWith({
      stationId: "any station id",
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      limit: 1,
    });
  });

  it("Should be able to create a reservation with valid timestamp range", async () => {
    jest
      .spyOn(stationMockRepository, "getStationReservations")
      .mockImplementation(() => {
        return new Promise((resolve) => resolve([]));
      });

    jest.spyOn(userMockRepository, "update").mockImplementation(() => {
      return new Promise((resolve) => resolve({} as User));
    });

    const args: ReservationUseCaseArgs = {
      stationId: "any station id",
      startsAt: new Date(),
      endsAt: new Date(),
      userId: "1",
    };

    jest.spyOn(reservationRepository, "create").mockImplementationOnce(() => {
      return new Promise((resolve) =>
        resolve({
          id: "1",
          userId: args.userId,
          stationId: args.stationId,
          startsAt: args.startsAt,
          endsAt: args.endsAt,
        })
      );
    });

    const response = await usecase.execute(args);
    const expected = {
      id: "1",
      userId: args.userId,
      stationId: args.stationId,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
    };

    expect(response).toStrictEqual(expected);
    expect(stationMockRepository.exists).toHaveBeenCalledWith(args.stationId);
    expect(userMockRepository.getOne).toHaveBeenCalledWith(args.userId);
    expect(stationMockRepository.getStationReservations).toHaveBeenCalledWith({
      stationId: "any station id",
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      limit: 1,
    });
    expect(userMockRepository.update).toHaveBeenCalledWith(args.userId, {
      hasOngoingReservation: true,
    });
  });
});
