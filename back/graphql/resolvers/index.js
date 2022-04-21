import { merge } from "lodash";

// all resolvers import
import authResolver from "./auth.resolver";
import userResolver from "./user.resolver";
import placeParkingResolver from "./placeParking.resolver";

export default merge(authResolver, userResolver, placeParkingResolver);
