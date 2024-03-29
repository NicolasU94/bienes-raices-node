//const express = require("express"); // Common JS way
import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadesRoutes from "./routes/propiedadesRoutes.js";
import db from "./config/db.js";

//Creating the app

const app = express();
app.use(express.urlencoded({ extended: true }));

//Enabling cookie parser
app.use(cookieParser());

//Enabling csurf
app.use(csrf({ cookie: true }));

//* Db Connection is being openned //
try {
  await db.authenticate();
  db.sync();
  console.log("Connection to db established successfully");
} catch (error) {
  console.log("Connection to db failed" + error.message);
}

//Routing
app.use("/", propiedadesRoutes);
app.use("/auth", usuarioRoutes);
//Setting up pug
app.set("view engine", "pug");
app.set("views", "./views");

const port = 3000;

//Public Folder
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
