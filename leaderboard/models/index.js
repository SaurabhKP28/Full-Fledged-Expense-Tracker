const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = require("./User");  // Correct import
const Expense = require("./Expense");

// Define associations if needed
User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

const db = {
  User,
  Expense,
  sequelize,
  Sequelize
};

module.exports = db;
