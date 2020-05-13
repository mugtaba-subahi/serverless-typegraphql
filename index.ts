import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import { Resolver, Query, buildSchemaSync } from 'type-graphql';

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return 'Hello World!';
  }
}

const schema = buildSchemaSync({ resolvers: [HelloResolver] });
const server = new ApolloServer({ schema });

module.exports.graphql = server.createHandler();
