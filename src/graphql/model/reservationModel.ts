import { Field, ObjectType, ID } from "type-graphql";

@ObjectType()
export class Reservation {
  @Field((type) => ID)
  id: string;

  @Field()
  startsAt: Date;

  @Field()
  endsAt: Date;

  @Field(() => ID!)
  stationId: string;

  @Field(() => ID!)
  userId: string;
}
