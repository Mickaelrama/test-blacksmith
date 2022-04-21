import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import typeDefs from "./graphql/type-defs";
import resolvers from "./graphql/resolvers";
import * as dotenv from "dotenv";
import models, { sequelize } from "./models";

dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
  // create server
  const app = express();
  app.use(cors()); // handle cors
  const httpServer = createServer(app);

  // Set up ApolloServer.
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema,
    context: (http) => ({
      req: http.req,
      token: http.req.headers.authorization
        ? http.req.headers.authorization.replace("Bearer", "").trim()
        : null,
    }),
  });

  // start the apollox server
  await server.start();
  server.applyMiddleware({ app });

  // start database and http server
  sequelize.sync().then(async () => {
    // create the default user
    models.User.createDefaultUser();

    httpServer.listen(PORT, () => {
      console.log(
        `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startServer();
