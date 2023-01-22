//const express = require("express"); // Common JS way
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";
//Creating the app

const app = express();

//* Db Connection is being openned //
try {
  await db.authenticate();
  console.log("Connection to db established successfully");
} catch (error) {
  console.log("Connection to db failed" + error.message);
}

//Routing
app.use("/", usuarioRoutes);
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
