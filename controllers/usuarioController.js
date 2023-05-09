import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateJwt, generateToken } from "../helpers/token.js";
import { emailRegister, emailPass } from "../helpers/email.js";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    auth: false,
    pagina: "Login",
    csrfToken: req.csrfToken(),
  });
};

const authenticateUser = async (req, res) => {
  await check("email").isEmail().withMessage("Email must be valid").run(req);
  await check("password")
    .notEmpty()
    .withMessage("Password is required")
    .run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Login",
      csrfToken: req.csrfToken(),
      errores: result.array(),
    });
  }

  const { email, password } = req.body;

  const myUser = await Usuario.findOne({
    where: { email },
  });

  //* Verifying if the user exists
  if (!myUser) {
    return res.render("auth/login", {
      pagina: "Login",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "The User doesn't exist" }],
    });
  }

  //*Verifying if user is on a confirmed account
  if (!myUser.confirmed) {
    return res.render("auth/login", {
      pagina: "Login",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "The User account has not been confirmed" }],
    });
  }

  //*Verifying the Password submitted against Db
  if (!myUser.verifyPass(password)) {
    return res.render("auth/login", {
      pagina: "Login",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "The password is incorrect" }],
    });
  }
  const token = generateJwt(myUser.id);

  return res
    .cookie("_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    })
    .redirect("/mis-propiedades");
};

const formularioRegister = (req, res) => {
  res.render("auth/register", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const register = async (req, res) => {
  //*Executing validations//
  await check("name").notEmpty().withMessage("Name cant be empty").run(req);
  await check("email").isEmail().withMessage("Email must be valid").run(req);
  await check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .run(req);
  await check("repeatPass")
    .equals(req.body.password)
    .withMessage("Passwords must match")
    .run(req);

  console.log(req.body);
  //*Parsing validation result to variable//
  let result = validationResult(req);

  const { name, email, password } = req.body;

  if (!result.isEmpty()) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: result.array(),
      usuario: {
        nombre: name,
        email: email,
      },
    });
  }

  const userCreated = await Usuario.findOne({
    where: { email },
  });

  if (userCreated) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "User already exists" }],
      usuario: {
        nombre: name,
        email: email,
      },
    });
  }

  const user = await Usuario.create({
    name,
    email,
    password,
    token: generateToken(),
  });

  //Sending out the email:

  emailRegister({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  res.render("templates/message", {
    pagina: "Account Created successfully",
    mensaje:
      "We've sent out an email to your inbox, confirm your account on the link",
  });
};

const formularioForgotPass = (req, res) => {
  res.render("auth/forgotPass", {
    pagina: "Recupera Acceso a tu cuenta",
    csrfToken: req.csrfToken(),
  });
};

const resetPass = async (req, res) => {
  await check("email").isEmail().withMessage("Email must be valid").run(req);

  let result = validationResult(req);

  const { email } = req.body;

  if (!result.isEmpty()) {
    return res.render("auth/forgotPass", {
      pagina: "Recupera Acceso a tu cuenta",
      csrfToken: req.csrfToken(),
      errores: result.array(),
    });
  }

  const userFound = await Usuario.findOne({
    where: { email },
  });

  if (!userFound) {
    return res.render("auth/forgotPass", {
      pagina: "Recupera Acceso a tu cuenta",
      csrfToken: req.csrfToken(),
      errores: [
        { msg: "The email entered is not registered to an existing user" },
      ],
    });
  }

  userFound.token = generateToken();
  await userFound.save();

  const { name, token } = userFound;

  emailPass({
    name,
    email,
    token,
  });

  res.render("templates/message", {
    pagina: "Password Reset request sent",
    mensaje: "We've sent out an email to your inbox to reset your password",
  });
};

const checkAccount = async (req, res) => {
  const { token } = req.params;

  const myUser = await Usuario.findOne({
    where: { token },
  });

  if (!myUser) {
    res.render("auth/confirm-account", {
      pagina: "There was an error creating your account",
      mensaje:
        "There was an error when attempting to create your account. Please try again",
      error: true,
    });
  }

  myUser.confirmed = true;

  myUser.token = null;

  await myUser.save();

  res.render("auth/confirm-account", {
    pagina: "Your Account was created successfully",
    mensaje: "Account was successfully created!.",
    error: false,
  });
};

const checkToken = async (req, res) => {
  const { token } = req.params;

  const myUser = await Usuario.findOne({
    where: { token },
  });

  if (!myUser) {
    res.render("auth/confirm-account", {
      pagina: "There was an error resetting your password",
      mensaje:
        "There was an error when attempting to reset your password. Please try again",
      error: true,
    });
  }

  res.render("auth/resetPass", {
    pagina: "Reset your password",
    csrfToken: req.csrfToken(),
  });
};

const newPass = async (req, res) => {
  await check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    res.render("auth/resetPass", {
      pagina: "Reset your password",
      csrfToken: req.csrfToken(),
      errores: result.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  const myUser = await Usuario.findOne({ where: { token } });

  const salt = await bcrypt.genSalt(10);
  myUser.password = await bcrypt.hash(password, salt);
  myUser.token = null;
  await myUser.save();

  res.render("auth/confirm-account", {
    pagina: "Password was Reset",
    mensaje: "Password was reset successfully",
    error: false,
  });
};

export {
  formularioLogin,
  authenticateUser,
  register,
  formularioRegister,
  formularioForgotPass,
  checkAccount,
  resetPass,
  newPass,
  checkToken,
};
