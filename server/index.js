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