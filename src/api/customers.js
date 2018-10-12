const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  Admins,
  Categories,
  Products,
  Orders,
  Order_items,
  Delivery_addresses,
  Customers,
  Logins
} = require("../user");
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

router.post("/register", (req, res) => {
  const {
    username,
    password,
    phone,
    email,
    forename,
    surname,
    add1,
    add2,
    add3,
    postcode
  } = req.body;

  Logins.findOne({ where: { username: username } }).then(user => {
    if (user) {
      const errors = {};
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }
    const newUser = {
      username: username,
      password,
      customer: {
        phone: phone,
        email: email
      }
    };
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        if (err) throw err;
        newUser.password = hash;
        newUser;
        Logins.create(newUser, {
          include: [Customers]
        })
          .then(user => {
            res.json(user);
          })
          .catch(err => console.log(err));
      });
    });
  });
});
router.get("/:id(\\d+)", (req, res) => {
  // (\\d+) => express routing https://expressjs.com/en/guide/routing.html
  const errors = {};
  const id = req.params.id;
  Logins.findById(id, { include: [Customers] }).then(user => {
    if (!user) {
      errors.user = "Users not found";
      return res.status(404).json(errors);
    }
    res.json(user);
  });
});
router.get("/all", (req, res) => {
  const errors = {};
  Logins.findAll({ order: [["id", "DESC"]], limit: 10 }).then(users => {
    if (!users) {
      errors.user = "User not found";
      res.status(404).json(errors);
    }
    res.json(users);
  });
});

router.post("/update/:id(\\d+)", async (req, res) => {
  const errors = {};
  const id = req.params.id;
  const {
    oldpass,
    newpass,
    phone,
    email,
    forename,
    surname,
    add1,
    add2,
    add3,
    postcode
  } = req.body;
  const userUpdate = {
    newpass,
    phone,
    email,
    forename,
    surname,
    add1,
    add2,
    add3,
    postcode
  };
  const isEmailUnique = await new Promise((resolve, reject) => {
    Customers.findOne({
      where: {
        [Op.and]: [{ [Op.not]: { id: 2 } }, { email }]
      }
    }).then(user => {
      user ? resolve(false) : resolve(true);
    });
  });
  isEmailUnique
    ? (userUpdate.email = email)
    : res.status(400).json({ email: "Email already exists" });

  if (oldpass != "") {
    const checkPass = await new Promise((resolve, reject) => {
      Logins.findById(id).then(user => {
        if (!user) {
          errors.user = "User not found";
          var err = res.status(404).json(errors);
          reject(err);
        }
        bcrypt.compare(oldpass, user.password).then(isMath => {
          if (isMath) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    });
    if (checkPass) {
      userUpdate.newpass = newpass;
    } else {
      errors.password = "Password incorrect";
      return res.status(400).json(errors);
    }
  }
  Logins.update(userUpdate, { where: { id: id } }).then(() => {
    console.log("ok");
  });
});
// @route /api/customer
module.exports = router;
