import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-lambda';
import { Resolver, Query, buildSchema, ObjectType, Field } from 'type-graphql';
import { APIGatewayProxyEvent, Context, Callback } from 'aws-lambda';
import * as request from 'request-promise';

@ObjectType()
class Post {
  @Field()
  userId: Number;

  @Field()
  id: Number;

  @Field()
  title: String;

  @Field()
  body: String;
}

@Resolver()
class AllPosts {
  @Query(() => [Post])
  async allPosts() {
    return await request.get({ uri: 'https://jsonplaceholder.typicode.com/posts', json: true });
  }
}

const createHandler = async () => {
  const schema = await buildSchema({ resolvers: [AllPosts] });
  const server = new ApolloServer({ schema, playground: { endpoint: 'http://localhost:3000/dev/graphql' } });

  const config = {
    cors: {
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type', 'Origin', 'Accept'],
    },
  };

  return server.createHandler(config);
};

export const graphql = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  createHandler().then(handler => handler(event, context, callback));
};
