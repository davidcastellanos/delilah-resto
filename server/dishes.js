const express = require("express");
const sequelize = require("../database/connection.js");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config({ path: "../.env" });
const jwtKey = process.env.JWTKEY;
const router = express.Router();
const {
    checkAdmin,
    verifyDish,
    getDish
} = require("../utils/utils.js");

//Verify token
router.use(expressJwt({ secret: jwtKey, algorithms: ["HS256"] }).unless({ path: [ "/" ] }));
router.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).send("You need to sign in or sign up");
    } else {
        next(err);
    }
})
