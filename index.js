//const express = require("express"); // Common JS way
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
//Creating the app

const app = express();

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
