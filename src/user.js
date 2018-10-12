const Sequelize = require("sequelize");
const sequelize = require("../lib/connect");

const Admins = sequelize.define("admins", {
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

const Categories = sequelize.define("categories", {
  name: Sequelize.STRING,
  description: { type: Sequelize.TEXT, allowNull: true }
});

const Products = sequelize.define("products", {
  cat_id: Sequelize.INTEGER,
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  image: Sequelize.STRING,
  price: Sequelize.INTEGER
});

Products.belongsTo(Categories, { foreignKey: "cat_id" });

const Orders = sequelize.define("orders", {
  customer_id: Sequelize.INTEGER,
  registered: Sequelize.STRING,
  delivery_add_id: Sequelize.INTEGER,
  payment_type: Sequelize.STRING,
  data: Sequelize.DATE,
  status: Sequelize.BOOLEAN,
  session: Sequelize.STRING,
  total: Sequelize.INTEGER
});

const Order_items = sequelize.define("order_items", {
  quantity: Sequelize.INTEGER
});

Orders.belongsToMany(Products, { through: Order_items });
Products.belongsToMany(Orders, { through: Order_items });

const Delivery_addresses = sequelize.define("delivery_addresses", {
  forename: Sequelize.STRING,
  surname: Sequelize.STRING,
  add1: Sequelize.STRING,
  add2: { type: Sequelize.STRING, allowNull: true },
  add3: { type: Sequelize.STRING, allowNull: true },
  postcode: { type: Sequelize.INTEGER, allowNull: true },
  phone: Sequelize.INTEGER,
  email: Sequelize.INTEGER
});

Orders.belongsTo(Delivery_addresses, { foreignKey: "delivery_add_id" });

const Customers = sequelize.define("customers", {
  forename: { type: Sequelize.STRING, allowNull: true },
  surname: { type: Sequelize.STRING, allowNull: true },
  add1: { type: Sequelize.STRING, allowNull: true },
  add2: { type: Sequelize.STRING, allowNull: true },
  add3: { type: Sequelize.STRING, allowNull: true },
  postcode: { type: Sequelize.INTEGER, allowNull: true },
  phone: Sequelize.INTEGER,
  email: Sequelize.STRING,
  registered: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false }
});

Orders.belongsTo(Customers, { foreignKey: "customer_id" });

const Logins = sequelize.define("logins", {
  customer_id: Sequelize.INTEGER,
  username: Sequelize.STRING,
  password: Sequelize.STRING
});

Logins.belongsTo(Customers, { foreignKey: "customer_id" });
//Customers.hasOne(Logins);
const start = async () => {
  await sequelize.sync({ force: true });
};
// start();

module.exports = {
  Admins: Admins,
  Categories: Categories,
  Products: Products,
  Orders: Orders,
  Order_items: Order_items,
  Delivery_addresses: Delivery_addresses,
  Customers: Customers,
  Logins: Logins
};
