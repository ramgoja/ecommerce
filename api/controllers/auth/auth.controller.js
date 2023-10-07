const { showError } = require("../../lib/index.js");
const { User } = require("../../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  register = async (req, res, next) => {
    try {
      const { name, email, password, confirm_password, address, phone } =
        req.body;

      if (password == confirm_password) {
        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

        await User.create({ name, email, password: hash, address, phone });

        res.json({
          success:
            "Thank you for registering. Please login to access your account.",
        });
      } else {
        next({
          message: "Password not confirmed.",
          status: 422,
        });
      }
    } catch (err) {
      showError(err, next);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).exec();
      console.log(user);

      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          if (user.status) {
            const token = jwt.sign(
              {
                id: user._id,
                iat: Math.floor(Date.now() / 1000) - 30,
                exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
              },
              process.env.JWT_SECRET
            );

            res.json({ token, user });
          } else {
            next({
              message: "Inactive account",
              status: 422,
            });
          }
        } else {
          next({
            message: "Incorrect Password",
            status: 422,
          });
        }
      } else {
        next({
          message: "Give email is not registered in our database",
          status: 422,
        });
      }
    } catch (err) {
      showError(err, next);
    }
  };
}

module.exports = new AuthController();
