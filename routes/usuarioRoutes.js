import express from "express";
import {
  formularioLogin,
  authenticateUser,
  formularioRegister,
  formularioForgotPass,
  register,
  checkAccount,
  resetPass,
  checkToken,
  newPass,
} from "../controllers/usuarioController.js";

const router = express.Router();

router.get("/", function (req, res) {
  res.json({ msg: "Sending Back server message" });
});
router.post("/register", register);

router.get("/login", formularioLogin);
router.post("/login", authenticateUser);
router.get("/register", formularioRegister);
router.get("/forgot-pass", formularioForgotPass);
router.post("/forgot-pass", resetPass);
router.get("/check/:token", checkAccount);

//Storing new password
router.get("/forgot-pass/:token", checkToken);
router.post("/forgot-pass/:token", newPass);
export default router;
