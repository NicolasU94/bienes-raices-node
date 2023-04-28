import express from "express";
import {
  formularioLogin,
  formularioRegister,
  formularioForgotPass,
  register,
  checkAccount,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", function (req, res) {
  res.json({ msg: "Sending Back server message" });
});
router.post("/register", register);

router.get("/login", formularioLogin);
router.get("/register", formularioRegister);
router.get("/forgot-pass", formularioForgotPass);
router.get("/check/:token", checkAccount);

export default router;
