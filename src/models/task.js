const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

class Task extends Model {}

Task.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "done"),
      defaultValue: "pending"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE"
    },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "tasks"
  }
);

// Associations
Task.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Task, { foreignKey: "userId", as: "tasks" });

module.exports = Task;
