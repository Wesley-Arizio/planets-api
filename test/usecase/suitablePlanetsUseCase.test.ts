import { Planet } from "../../src/entities/planet";
import { RepositoryError } from "../../src/repository";
import { SuitablePlanetsUseCase } from "../../src/usecase/suitablePlanetsUseCase";
import { MockRepository } from "../mock/repository";

describe("SuitablePlanetsUseCase", () => {
  it("Should return a list of suitable planets to recharge spacial vehicles", async () => {
    const repo = new MockRepository<Planet>();

    jest.spyOn(repo, "getMany").mockImplementationOnce(() => {
      return new Promise((resolve) =>
        resolve([
          {
            id: "1",
            name: "XPTO",
            mass: 10.12,
            hasStation: false,
          },
          {
            id: "2",
            name: "XPTO2",
            mass: 15.12,
            hasStation: true,
          },
        ])
      );
    });

    const useCase = new SuitablePlanetsUseCase(repo);
    const expected = [
      {
        id: "1",
        name: "XPTO",
        mass: 10.12,
        hasStation: false,
      },
      {
        id: "2",
        name: "XPTO2",
        mass: 15.12,
        hasStation: true,
      },
    ] as Planet[];

    const response = await useCase.execute({ limit: 2, offset: 0 });
    expect(response).toStrictEqual(expected);
    expect(repo.getMany).toHaveBeenCalledWith({ limit: 2, offset: 0 });
  });

  it("Should return internal server error in case of database failure", async () => {
    const repo = new MockRepository<Planet>();

    jest.spyOn(repo, "getMany").mockImplementationOnce(() => {
      return new Promise((_resolve, reject) => {
        return reject(new RepositoryError("Database column does not exist"));
      });
    });

    const useCase = new SuitablePlanetsUseCase(repo);
    await expect(useCase.execute({ limit: 2, offset: 0 })).rejects.toThrow(
      "Internal Server Error!"
    );
    expect(repo.getMany).toHaveBeenCalledWith({ limit: 2, offset: 0 });
  });
});
