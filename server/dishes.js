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

router.post("/dishes", checkAdmin, async (req, res) => {
    //Create a new product. Only admins allowed
    const { description, image, price } = req.body;
    try {
        if (description && image && price) {
            const newProduct = await sequelize.query(
                "INSERT INTO dishes (Description, Image, Price) VALUES (:description, :image, :price)",
                { replacements: { description, image, price } }
            )
            res.status(200).json("New dish added correctly");
        } else {
            res.status(400).json("You need to insert all the data required");
        }
    } catch(error) {
        console.error(error);
    }
})

router.put("/dishes", verifyDish, checkAdmin, async (req, res) => {
    //Update product Only can be done by admins
    try {
        const { description, image, price } = req.body;
        const dishID = await getDish(req.body.description);
        const updateDish = await sequelize.query(
            "UPDATE dishes SET description = :description, image = :image, price = :price WHERE id = :id",
            { replacements: {description, image, price, id: dishID} }
        )
        res.status(200).json("Dish updated");
    } catch(error) {
        console.error(error);
    }
})

router.delete("/dishes/:id", checkAdmin, async(req, res) => {
    //Delete product by ID
    try {
        const dishID = req.params.id
        const deleteDish = await sequelize.query(
            "DELETE FROM dishes WHERE id = :id",
            { replacements: {id: dishID} }
        )
        if(deleteDish[0].affectedRows == 0) {
            res.status(404).json("Dish not found")
        } else {
            res.status(200).json("Dish removed")
        }
        res.status(200).json();
    } catch(error) {
        console.error(error);
    }
})
module.exports = router;
