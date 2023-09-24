import { Station } from "../../../src/entities/station";
import { RepositoryError } from "../../../src/repository";
import { ListStationsUseCase } from "../../../src/usecase/listStationsUseCase";
import { MockRepository, StationMockRepository } from "../mock/repository";

describe("ListStationsUseCase", () => {
  it("Should return internal server error if database error occurs", async () => {
    const mockStationRepository = new StationMockRepository();
    jest
      .spyOn(mockStationRepository, "getStationsByPlanet")
      .mockImplementationOnce(() => {
        return new Promise((_, reject) =>
          reject(new RepositoryError("Table does not exist"))
        );
      });
    const usecase = new ListStationsUseCase(mockStationRepository);

    await expect(
      usecase.execute({ limit: 3, offset: 0, planetId: "any_id" })
    ).rejects.toThrow("Internal Server Error");
    expect(mockStationRepository.getStationsByPlanet).toHaveBeenCalledWith({
      limit: 3,
      offset: 0,
      planetId: "any_id",
    });
  });
  it("Should return a list of stations", async () => {
    const mockStationRepository = new StationMockRepository();
    jest
      .spyOn(mockStationRepository, "getStationsByPlanet")
      .mockImplementationOnce(() => {
        return new Promise((resolve) =>
          resolve([
            {
              id: "1",
              name: "tesla",
              planetId: "1",
            },
            {
              id: "2",
              name: "spacex",
              planetId: "1",
            },
            {
              id: "3",
              name: "starlink",
              planetId: "1",
            },
          ])
        );
      });
    const usecase = new ListStationsUseCase(mockStationRepository);
    const expected = [
      {
        id: "1",
        name: "tesla",
        planetId: "1",
      },
      {
        id: "2",
        name: "spacex",
        planetId: "1",
      },
      {
        id: "3",
        name: "starlink",
        planetId: "1",
      },
    ];

    const response = await usecase.execute({
      limit: 3,
      offset: 0,
      planetId: "1",
    });
    expect(response).toStrictEqual(expected);
    expect(mockStationRepository.getStationsByPlanet).toHaveBeenCalledWith({
      limit: 3,
      offset: 0,
      planetId: "1",
    });
  });
});
