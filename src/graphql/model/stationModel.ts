import { Field, ObjectType, ID } from "type-graphql";

@ObjectType()
export class Station {
  @Field(() => ID!)
  id: string;

  @Field()
  name: string;

  @Field(() => ID!)
  planetId: string;
}
