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

router.get("/dishes", async (req, res) => {
    //Route to get all the dishes. For customers and admins
    try {
        const records = await sequelize.query(
            "SELECT * FROM dishes", { type: sequelize.QueryTypes.SELECT }
            )
            if(records.length == 0) {
                res.status(404).json("There's no data")
            } else {
                res.status(200).json(records);
            }
        } catch (error) {
            console.error(error);
            res.status(400);
        }
})
