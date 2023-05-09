const admin = async (req, res) => {
  res.render("propiedades/admin", {
    pagina: "My Properties",
    navBar: true,
  });
};

const crear = async (req, res) => {
  res.render("propiedades/crear", {
    pagina: "New Property",
    navBar: true,
  });
};

export { admin, crear };
