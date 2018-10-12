global._basepath = process.cwd();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("./lib/config");
const sequelize = require("./lib/connect");

// Setting body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setting View EJS
app.set("views", config.VIEWS);
app.set("view engine", "ejs");

// Setting static file
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("test");
});

const customers = require("./src/api/customers");
app.use("/api/customer", customers);

const PORT = process.env.PORT || config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
