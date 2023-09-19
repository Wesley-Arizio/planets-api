import { Station } from "../../src/entities/station";
import { RepositoryError } from "../../src/repository";
import { ListStationsUseCase } from "../../src/usecase/listStationsUseCase";
import { MockRepository } from "../mock/repository";

describe("ListStationsUseCase", () => {
  it("Should return internal server error if database error occurs", async () => {
    const mockStationRepository = new MockRepository<Station>();
    jest.spyOn(mockStationRepository, "getMany").mockImplementationOnce(() => {
      return new Promise((_, reject) =>
        reject(new RepositoryError("Table does not exist"))
      );
    });
    const usecase = new ListStationsUseCase(mockStationRepository);

    await expect(usecase.execute({ limit: 3, offset: 0 })).rejects.toThrow(
      "Internal Server Error"
    );
    expect(mockStationRepository.getMany).toHaveBeenCalledWith({
      limit: 3,
      offset: 0,
    });
  });
  it("Should return a list of stations", async () => {
    const mockStationRepository = new MockRepository<Station>();
    jest.spyOn(mockStationRepository, "getMany").mockImplementationOnce(() => {
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
            planetId: "2",
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
        planetId: "2",
      },
      {
        id: "3",
        name: "starlink",
        planetId: "1",
      },
    ];

    const response = await usecase.execute({ limit: 3, offset: 0 });
    expect(response).toStrictEqual(expected);
    expect(mockStationRepository.getMany).toHaveBeenCalledWith({
      limit: 3,
      offset: 0,
    });
  });
});
