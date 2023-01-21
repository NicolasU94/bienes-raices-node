import express from "express";
import {
  formularioLogin,
  formularioRegister,
} from "./controllers/usuarioController.js";

const router = express.Router();

router.get("/", function (req, res) {
  res.json({ msg: "Sending Back server message" });
});

router.get("/login", formularioLogin);
router.get("/register", formularioRegister);

export default router;
