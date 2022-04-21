import bcrypt from "bcrypt";

const getUserModel = (sequelize, { DataTypes }) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "PUBLIC"),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasOne(models.PlaceParking);
  };

  // create the default user
  User.createDefaultUser = () => {
    User.findOne({ where: { username: "Admin" } }).then(async (result) => {
      const encryptedPassword = await bcrypt.hash("Admin123", 10);
      if (!result) {
        User.create({
          username: "Admin",
          email: "admin@admin.com",
          password: encryptedPassword,
          role: "ADMIN",
        });
      }
    });
  };

  return User;
};

export default getUserModel;
