import Sequelize from "sequelize";
import getUserModel from "./user.model";
import * as dotenv from "dotenv";
import getPlaceParkingModel from "./parking.model";

dotenv.config();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
  }
);

// model declaration
const models = {
  User: getUserModel(sequelize, Sequelize),
  PlaceParking: getPlaceParkingModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
