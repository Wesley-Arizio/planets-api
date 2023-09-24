import { Field, ID, InputType } from "type-graphql";

@InputType()
export class PaginationInput {
  @Field()
  limit: number;

  @Field()
  offset: number;
}

@InputType()
export class InstallStationInput {
  @Field()
  name: string;

  @Field(() => ID!)
  planetId: string;
}

@InputType()
export class RervateStationInput {
  @Field(() => ID!)
  stationId: string;

  @Field(() => ID!)
  userId: string;

  @Field(() => Date)
  startsAt?: Date;

  @Field(() => Date!)
  endsAt: Date;
}

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
