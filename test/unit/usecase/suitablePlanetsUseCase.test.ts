import { Decimal } from "@prisma/client/runtime/library";
import { Planet } from "../../../src/entities/planet";
import { RepositoryError } from "../../../src/repository";
import { SuitablePlanetsUseCase } from "../../../src/usecase/suitablePlanetsUseCase";
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
            mass: new Decimal(10.12),
          },
          {
            id: "2",
            name: "XPTO2",
            mass: new Decimal(15.12),
          },
        ])
      );
    });

    const useCase = new SuitablePlanetsUseCase(repo);
    const expected = [
      {
        id: "1",
        name: "XPTO",
        mass: new Decimal(10.12),
      },
      {
        id: "2",
        name: "XPTO2",
        mass: new Decimal(15.12),
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
