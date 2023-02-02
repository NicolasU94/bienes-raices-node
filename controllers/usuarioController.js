import { check, validationResult } from "express-validator";
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

  const { name, email } = req.body;

  if (!result.isEmpty()) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      errores: result.array(),
      usuario: {
        nombre: name,
        email: email,
      },
    });
  }

  const userCreated = await Usuario.findOne({
    where: { ElementInternals },
  });

  if (userCreated) {
    return res.render("auth/register", {
      pagina: "Crear Cuenta",
      errores: [{ msg: "User already exists" }],
      usuario: {
        nombre: name,
        email: email,
      },
    });
  }

  const user = await Usuario.create(req.body);
  res.json(user);
  console.log();
};

const formularioForgotPass = (req, res) => {
  res.render("auth/forgotPass", {
    pagina: "Recupera Acceso a tu cuenta",
  });
};

export { formularioLogin, register, formularioRegister, formularioForgotPass };
