import { Planet } from "../../../src/entities/planet";
import { Station } from "../../../src/entities/station";
import { RepositoryError } from "../../../src/repository";
import { StationRepository } from "../../../src/repository/stationRepository";
import { InstallStationUseCase } from "../../../src/usecase/installStationUseCase";
import { MockRepository } from "../mock/repository";

describe("InstallStationUseCase", () => {
  it("Should not be able to create a station if a planet does not exist", async () => {
    const mockStationRepository = new MockRepository<Station>();
    const mockPlanetRepository = new MockRepository<Planet>();

    jest.spyOn(mockStationRepository, "create");
    jest.spyOn(mockPlanetRepository, "exists").mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(false));
    });

    const usecase = new InstallStationUseCase(
      mockPlanetRepository,
      mockStationRepository
    );

    await expect(
      usecase.execute({ planetId: "any_id", stationName: "tesla" })
    ).rejects.toThrow("Planet not found");

    expect(mockPlanetRepository.exists).toHaveBeenCalledWith("any_id");
    expect(mockStationRepository.create).toHaveBeenCalledTimes(0);
  });

  it("Should return internal server error if database error occurs", async () => {
    const mockStationRepository = new MockRepository<Station>();
    const mockPlanetRepository = new MockRepository<Planet>();

    jest.spyOn(mockStationRepository, "create");
    jest.spyOn(mockPlanetRepository, "exists").mockImplementationOnce(() => {
      return new Promise((_, reject) =>
        reject(new RepositoryError("table does not exist"))
      );
    });

    const usecase = new InstallStationUseCase(
      mockPlanetRepository,
      mockStationRepository
    );

    await expect(
      usecase.execute({ planetId: "any_id", stationName: "tesla" })
    ).rejects.toThrow("Internal Server Error!");

    expect(mockPlanetRepository.exists).toHaveBeenCalledWith("any_id");
    expect(mockStationRepository.create).toHaveBeenCalledTimes(0);
  });

  it("Should be able to create a station in a planet", async () => {
    const mockStationRepository = new MockRepository<Station>();
    const mockPlanetRepository = new MockRepository<Planet>();

    jest.spyOn(mockStationRepository, "create").mockImplementationOnce(() => {
      return new Promise((resolve) =>
        resolve({
          id: "any_other_id",
          name: "tesla",
          planetId: "any_id",
        })
      );
    });
    jest.spyOn(mockPlanetRepository, "exists").mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(true));
    });

    const usecase = new InstallStationUseCase(
      mockPlanetRepository,
      mockStationRepository
    );

    const response = await usecase.execute({
      planetId: "any_id",
      stationName: "tesla",
    });

    const expected = {
      id: "any_other_id",
      name: "tesla",
      planetId: "any_id",
    };

    expect(mockPlanetRepository.exists).toHaveBeenCalledWith("any_id");
    expect(mockStationRepository.create).toHaveBeenCalledWith({
      name: "tesla",
      planetId: "any_id",
    });
    expect(expected).toStrictEqual(response);
  });
});
