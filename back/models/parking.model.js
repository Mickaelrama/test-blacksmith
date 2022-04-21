import bcrypt from "bcrypt";

const getPlaceParkingModel = (sequelize, { DataTypes }) => {
  const PlaceParking = sequelize.define("place_parking", {
    etage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      min: 0,
    },
    tempsOccupation: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  PlaceParking.associate = (models) => {
    PlaceParking.belongsTo(models.User);
  };

  return PlaceParking;
};

export default getPlaceParkingModel;
