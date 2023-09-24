import { PrismaClient } from "@prisma/client";
import { IUseCase } from "..";
import { Context } from "../../repository";
import { Planet } from "../../entities/planet";
import { GetPlanetUseCase } from "../getPlanetUseCase";
import { PlanetRepository } from "../../repository/planetRepository";
import { User } from "../../entities/user";
import {
  CreateUserUseCase,
  ICreateUserUseCaseArgs,
} from "../createUserUseCase";
import { UserRepository } from "../../repository/userRepository";

export function createUserFactory(
  context: Context<PrismaClient>
): IUseCase<User, ICreateUserUseCaseArgs> {
  return new CreateUserUseCase(new UserRepository(context));
}
