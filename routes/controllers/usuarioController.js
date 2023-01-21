const formularioLogin = (req, res) => {
  res.render("auth/login", {
    auth: false,
  });
};

const formularioRegister = (req, res) => {
  res.render("auth/register", {});
};

export { formularioLogin, formularioRegister };
