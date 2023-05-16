import { validationResult } from "express-validator";
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";

const admin = async (req, res) => {
  res.render("propiedades/admin", {
    pagina: "My Properties",
    navBar: true,
  });
};

const crear = async (req, res) => {
  const [categories, prices] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/crear", {
    pagina: "New Property",
    navBar: true,
    categories: categories,
    csrfToken: req.csrfToken(),
    prices: prices,
  });
};

const publish = async (req, res) => {
  console.log("Publish");

  let result = validationResult(req);

  if (!result.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    res.render("propiedades/crear", {
      pagina: "New Property",
      navBar: true,
      categories: categories,
      csrfToken: req.csrfToken(),
      prices: prices,
      errores: result.Array(),
    });
  }
};
export { admin, crear, publish };
