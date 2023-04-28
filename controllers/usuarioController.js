import { check, validationResult } from "express-validator";
import { generateToken } from "../helpers/token.js";
import { emailRegister } from "../helpers/email.js";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    auth: false,
    pagina: "Login",
  });
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

export {
  formularioLogin,
  register,
  formularioRegister,
  formularioForgotPass,
  checkAccount,
};
