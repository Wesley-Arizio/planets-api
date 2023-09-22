import { Field, ObjectType, Float } from "type-graphql";

@ObjectType()
export class Planet {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  mass: number;
}
