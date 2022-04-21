import models from "../../models";
import verifyCredential from "../../utils/verifyCredential";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

export default {
  Query: {
    getUsers: async (
      _,
      { args: { role, keyword, limit, offset } },
      context
    ) => {
      await verifyCredential(context.token, "ADMIN");

      const and = [];

      if (role) {
        and.push({ role });
      }

      if (keyword && keyword.length) {
        and.push({
          [Op.or]: [
            { username: { [Op.iLike]: `%${keyword}%` } },
            { email: { [Op.iLike]: `%${keyword}%` } },
          ],
        });
      }

      const where =
        role || keyword?.length
          ? {
              where: {
                [Op.and]: and,
              },
            }
          : {};

      const users = await models.User.findAll({
        ...where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const count = await models.User.count({
        ...where,
      });

      return {
        users,
        count,
      };
    },
  },
  Mutation: {
    updateUser: async (_, { args }, context) => {
      await verifyCredential(context.token, "ADMIN");

      const user = await models.User.findOne({ where: { id: args.id } });
      if (!user) {
        throw new Error("This user dont't exist.");
      }

      const password = args.password
        ? await bcrypt.hash(args.password, 10)
        : user.password;

      const updatedUser = await user.update({
        ...args,
        password,
      });

      return updatedUser;
    },
    deleteUser: async (_, { id }, context) => {
      await verifyCredential(context.token, "ADMIN");

      return await models.User.destroy({ where: { id } });
    },
  },
};
