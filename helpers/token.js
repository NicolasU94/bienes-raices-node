import jwt from "jsonwebtoken";

const generateJwt = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

const generateToken = () =>
  Math.random().toString(32).substring(2) + Date.now().toString(32);

export { generateToken, generateJwt };
