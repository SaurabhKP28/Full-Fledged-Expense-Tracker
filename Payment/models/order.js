/*
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
        defaultValue: "PENDING"
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});


module.exports = Order;
*/
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.STRING, // ✅ Ensure STRING (not INT)
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PENDING"
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Order;

