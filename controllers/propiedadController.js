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
    prices: prices,
  });
};

export { admin, crear };
