const Sequelize = require("sequelize");

const sequelize = new Sequelize("postgres", "postgres", "tungduy", {
  host: "localhost",
  dialect: "postgres",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: "path/to/database.sqlite"
});
module.exports = sequelize;
