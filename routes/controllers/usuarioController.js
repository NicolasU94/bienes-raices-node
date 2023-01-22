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

const formularioForgotPass = (req, res) => {
  res.render("auth/forgotPass", {
    pagina: "Recupera Acceso a tu cuenta",
  });
};

export { formularioLogin, formularioRegister, formularioForgotPass };
