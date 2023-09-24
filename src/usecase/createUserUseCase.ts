import { User } from "@prisma/client";
import { IUseCase } from ".";
import { IRepository, RepositoryError } from "../repository";

export interface ICreateUserUseCaseArgs {
  email: string;
  password: string;
}

export class CreateUserUseCase
  implements IUseCase<User, ICreateUserUseCaseArgs>
{
  constructor(private readonly userRepository: IRepository<User>) {}
  async execute(args: ICreateUserUseCaseArgs): Promise<User> {
    try {
      return await this.userRepository.create({
        email: args.email,
        password: args.password,
      } as User);
    } catch (e) {
      if (e instanceof RepositoryError) {
        throw new Error("Internal Server Error");
      }
      throw e;
    }
  }
}
