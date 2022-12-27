const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const expressJwt = require("express-jwt");
require("dotenv").config({ path: "../.env" });
const jwtKey = process.env.JWTKEY;
const SERVER_PORT = process.env.SERVER_PORT;

const userRoute = require("./users.js");
const dishes = require("./dishes.js");
const orders = require("./orders.js");
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());



//Routes
app.use("/", userRoute);  
app.use("/", dishes);
app.use("/", orders);

//Check token
//algorithms: ["RS256"]
app.use(expressJwt({ secret: jwtKey, algorithms: ["HS256"] }).unless({ path: [ "/" ] }));
//Port listener
app.listen(SERVER_PORT, () => {
  console.log(`Server started on port ${SERVER_PORT}`);
});

//Home endpoint
app.get("/", (req, res) => {
  res.status(200).send("Bienvenido a Delilah Resto");
});

//Global middleware
app.use((req, res, next) => {
  useResponse = {
    error: true,
    code: 404,
    message: "Url not found",
  };
  res.status(404).send(useResponse);
});