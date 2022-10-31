const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { compareSync } = require("bcryptjs");
const { User } = require("../db");
const { transporter } = require("../../configs/mailer");

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(404).send({
      success: false,
      error: "Must complete all fields",
    });
  } else {
    let passHash = await bcryptjs.hash(password, 8);
    const user = User.create({
      username: username,
      password: passHash,
      email: email,
      id: Math.random() * passHash.length,
    })
      .then((user) => {
        sendEmail(email);
        res.send({
          success: true,
          message: "User succesfully add",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      })
      .catch((err) => {
        res.send({
          success: false,
          message: "Something went wrong",
          error: err,
        });
      });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  User.findOne({
    where: {
      username: username,
    },
  }).then((user) => {
    // NOT FINDED USER
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Could not found user",
      });
    }
    //INCORRET PASSWORD
    if (!compareSync(password, user.password)) {
      return res.status(404).send({
        success: false,
        message: "Incorrect password",
      });
    }

    if (user.isActive === false) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "You account is Inactive, send an email to recover your account ",
        });
    }

    const payload = {
      user: user.username,
      id: user.id,
    };
    const token = jwt.sign(payload, "secretKey", { expiresIn: "1d" });
    const cookiesOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    // console.log("Holi soy token", token);
    res.cookie("jwt", token, cookiesOptions);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      // token: "Bearer " + token,
      token: token,
      name: user.username,
    });
  });
};

exports.protectedRoute = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      user: {
        id: req.user.id,
        user: req.user.username,
      },
    });
  } catch (error) {
    res.send(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  console.log("success logout");
  return res.redirect("/");
};

const sendEmail = async (email) => {
  await transporter.sendMail({
    from: '"HENRY BARBER" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "¡Bienvenido a Henry Barber!", // Subject line
    text: "¡Gracias! Estamos encantados de que formes parte de nuestra comunidad", // plain text body
    html: "<b>Al registrarte se te enviaran descuentos =)</b>", // html body
  });
};

exports.loginGoogle = async (req, res) => {
  if (req.user) {
    console.log(req.user.id);
    const token = jwt.sign({ id: req.user.id }, "secretKey", {
      expiresIn: 60 * 60 * 24, // equivalente a 24 horas
    });
    // console.log("token");
    res.cookie("token", token);
    res.redirect("http://localhost:3000/");
  } else {
    res.redirect("http://localhost:3000/login");
  }
};
