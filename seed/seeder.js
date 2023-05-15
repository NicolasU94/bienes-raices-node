import { exit } from "node:process";
import categorias from "./categorias.js";
import Categoria from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import precios from "./precios.js";
import db from "../config/db.js";
import { truncate } from "node:fs";

const importData = async () => {
  try {
    //Auth
    await db.authenticate();
    // Generate the rows
    await db.sync();
    //insert the data
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
    ]);
    console.log("Data created successfully");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const eliminateData = async () => {
  //   Way to do it manually for each table
  await Promise.all([
    Categoria.destroy({ where: {}, truncate: true }),
    Precio.destroy({ where: {}, truncate: true }),
  ]);
  //Way to do it automatically for each table
  //   await db.sync({force:true});
  console.log("Data deleted successfully");
  exit();
};

if (process.argv[2] === "-i") importData();
if (process.argv[2] === "-e") eliminateData();
