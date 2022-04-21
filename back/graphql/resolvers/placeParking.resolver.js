import models from "../../models";
import verifyCredential from "../../utils/verifyCredential";
import { Op } from "sequelize";

export default {
  Mutation: {
    addPlaceParking: async (_, { args }, context) => {
      await verifyCredential(context.token, "ADMIN");
      const placeParking = await models.PlaceParking.create(args);
      return placeParking;
    },
    updatePlaceParking: async (_, { args }, context) => {
      await verifyCredential(context.token, "ADMIN");
      const placeParking = await models.PlaceParking.findOne({
        where: {
          id: args.id,
        },
      });
      const updatePlaceParking = await placeParking.update({
        ...placeParking,
        ...args,
      });
      return updatePlaceParking;
    },
    deletePlaceparking: async (_, { id }, context) => {
      await verifyCredential(context.token, "ADMIN");
      return await models.PlaceParking.destroy({ where: { id } });
    },
  },
  Query: {
    getPlaceParkings: async (
      _,
      { args: { dispo, etage, limit, offset } },
      context
    ) => {
      await verifyCredential(context.token, "PUBLIC");
      const and = [];
      if (dispo) {
        and.push({ userId: { [Op.is]: null } });
      }

      if (etage) {
        and.push({ etage });
      }

      const where =
        dispo || etage
          ? {
              where: {
                [Op.and]: and,
              },
            }
          : {};

      const parkings = await models.PlaceParking.findAll({
        ...where,
        limit,
        offset,
        order: [["etage", "DESC"]],
        include: ["user"],
      });
      const count = await models.PlaceParking.count({ ...where });

      return {
        parkings,
        count,
      };
    },
  },
};
