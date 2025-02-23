// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("user", "root", "Lonewolf@123", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;