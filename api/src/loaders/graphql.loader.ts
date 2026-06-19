import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Application }       from 'express';
import { buildSchema }        from 'graphql';
import { Logger }             from '@lib/logger';

export let loadGraphQL = async (app: Application): Promise<void> => {
  // ---- Schema is loaded from graphql/schema directory ----
  let typeDefs = `
    type Query {
      ping: String
    }
  `;

  let resolvers = {
    Query: {
      ping: () => 'pong',
    },
  };

  let schema = buildSchema(typeDefs);

  let server = new ApolloServer({ schema });
  await server.start();

  app.use('/graphql', expressMiddleware(server as any));
  Logger.info('GraphQL loaded at /graphql');
};
