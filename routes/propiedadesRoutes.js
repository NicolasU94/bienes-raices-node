import express from "express";
import { body } from "express-validator";
import { admin, crear, publish } from "../controllers/propiedadController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);
router.get("/propiedades/crear", crear);
router.post(
  "/propiedades/crear",
  body("title").notEmpty().withMessage("The title is required"),
  //   body("descripcion").notEmpty().withMessage("The description is required"),
  //   body("category").notEmpty().withMessage("Please select a category"),
  //   body("price").notEmpty().withMessage("The title is required"),
  publish
);

export default router;
