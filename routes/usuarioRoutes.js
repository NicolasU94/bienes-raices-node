import express from "express";
import {
  formularioLogin,
  formularioRegister,
  formularioForgotPass,
} from "./controllers/usuarioController.js";

const router = express.Router();

router.get("/", function (req, res) {
  res.json({ msg: "Sending Back server message" });
});

router.get("/login", formularioLogin);
router.get("/register", formularioRegister);
router.get("/forgot-pass", formularioForgotPass);

export default router;
