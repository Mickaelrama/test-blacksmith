import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../../models";
import verifyCredential from "../../utils/verifyCredential";
import { Op } from "sequelize";

const createToken = (json) => {
  return jwt.sign(json, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

export default {
  Mutation: {
    register: async (_, { args }, context) => {
      await verifyCredential(context.token, "ADMIN");

      const encryptedPassword = await bcrypt.hash(args.password, 10);

      const { dataValues } = await models.User.create({
        ...args,
        password: encryptedPassword,
      });
      return {
        token: createToken({
          id: dataValues.id,
          email: dataValues.email,
          username: dataValues.username,
        }),
      };
    },
    login: async (_, { args: { usernameOrEmail, password } }) => {
      const query = await models.User.findOne({
        where: {
          [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        },
      });

      const currentUser = query?.dataValues;

      if (!currentUser) {
        throw new Error("username or email don't exist.");
      }

      const isCorrectPassword = await bcrypt.compare(
        password,
        currentUser.password
      );

      if (!isCorrectPassword) {
        throw new Error("wrong password");
      }

      return {
        token: createToken({
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email,
          role: currentUser.role,
        }),
      };
    },
  },
};
