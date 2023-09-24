import { ApolloServer, BaseContext } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";
import { PlanetResolver } from "./resolver";
import { Container } from "typedi";

export async function GraphqlModule(graphqlPort: number) {
  const schema = await buildSchema({
    resolvers: [PlanetResolver],
    container: Container,
  });

  const server = new ApolloServer({
    schema,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: graphqlPort },
  });

  console.log(`App running at ${url}`);

  return { server, url };
}
