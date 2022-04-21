import jwt from "jsonwebtoken";
import { ForbiddenError, AuthenticationError } from "apollo-server-errors";
import roles from "../constants/roles";
import models from "../models/";

export default async (token, requiredRole) => {
  // we check the token
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);
    throw new AuthenticationError("Invalid token");
  }

  // we check role
  if (requiredRole) {
    const { dataValues } = await models.User.findOne({
      where: { id: decoded.id },
    });
    const role = dataValues.role;
    // we verify if the user's role has access
    if (roles[role] && !roles[role].includes(requiredRole)) {
      throw new ForbiddenError("Forbiden");
    }
  }

  return decoded;
};
