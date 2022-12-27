const express = require("express");
require("dotenv").config({ path: "../.env" });
const sequelize = require("../database/connection.js");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const router = express.Router();
const jwtKey = process.env.JWTKEY;
const {
    checkAdmin,
    verifyUser,
    verifyUserId,
    existingUser
  } = require("../utils/utils");

//Check token
router.use(expressJwt({ secret: jwtKey, algorithms: ["HS256"] }).unless({ path: ["/", "/users/signup", "/users/login"] }));
router.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
        res.status(401).send("You need to sign in or sign up");
    } else {
        next(err);
    }
})

router.get("/users", checkAdmin, async (req, res) => {
    //Get all the users. It can only be done by admins
    try {
        const records = await sequelize.query("SELECT * FROM users", { type: sequelize.QueryTypes.SELECT })
        res.status(200).json(records);
    } catch (error) {
        res.status(400).json(`Error message: ${error}`)
        console.error(error);
    }      
  });
router.get("/users/:id", checkAdmin, async (req, res) => {
        //Get specific user by its id. Only admins allowed
        const user_id = req.params.id;
        if(req.params.id != null) {
            try {
                const records = await sequelize.query("SELECT * FROM users WHERE id = :id", { replacements: {id: user_id}, type: sequelize.QueryTypes.SELECT })
                console.log(records)
                if(records.length == 0) {
                    res.status(404).json("ID doesn't exist")
                } else {
                    res.status(200).json(records)
                }
                // records !== [] ? res.status(200).json(records) : res.status(404);
            } catch (error) {
                console.error(error);
                res.status(400).json(`Error message: ${error}` );
            }   
        } 
})
router.post("/users/login", verifyUser, async (req, res) => {
    //Login user
    const email = req.body.email;
    try {
        const data = await sequelize.query("SELECT * FROM users WHERE email = ?", {replacements: [req.body.email], type: sequelize.QueryTypes.SELECT,})
        const username = data[0].Name;
        const admin = data[0].Admin;
        const id = data[0].ID;
        const payload = {
            user: username,
            role: admin,
            id: id
        }
        //Into the payload will be inserted name of user, role (1 == admin, 0 == client), and ID
        console.log(payload)
        const token = jwt.sign({payload}, jwtKey, { expiresIn: "1h" });
        res.status(200).json({Message: `You're welcome ${username}`, Token: token});
        console.log(token);
    } catch (error) {
        res.status(400).json("Error message: " + error);
        console.error(error);
    }
});
router.post("/users/signup", existingUser, async (req, res) => {
    //User sign up. The following fields are required
    const { name, email, password, direction } = req.body;
    try {
        if (name && email && password && direction) {
            const add = await sequelize.query(
                "INSERT INTO users (Name, Email, Password, Direction) VALUES (:name, :email, :password, :direction)",
                { replacements: {name, email, password, direction } }
            )
            res.status(200).json("User added");
        } else {
            res.status(400).json("Error message: You need to insert the data required" );
        }
    } catch (error) {
        res.status(400).json("Error message: " + error);
        console.error(error);
    }
});
router.put("/users/admin-update/:id", verifyUserId, async(req, res) => {
        // Admins can make changes over any user by providing the ID of user. It can be used to change the role of any user
        const { name, email, password, direction, admin } = req.body;
        try {
            const user_id = req.params.id;
            const update = await sequelize.query(
                "UPDATE users SET name = :name, email = :email, password = :password, direction = :direction, admin = :admin WHERE id = :id",
                { replacements: {name, email, password, direction, admin, id: user_id } }
            )
            res.status(200).json(`User updated correctly`);
        } catch (error) {
            console.error(error);
            res.status(400).json("Error message: " + error);
        } 
})
router.put("/users/client-update", async(req, res) => {
    //Update for normal clients
    const { name, email, password, direction } = req.body;
    try {
        const role = req.user.payload.role;
        if(role == 1) {
            res.status(400).json("You need to go to the other endpoint for admins");
        } else {
            console.log(req.user.payload);
            /* The ID of user is taken from the "payload" which was created when the token was generated. 
            Changes will be applied only to that specific account */
            const user_id = await req.user.payload.id;
            const update = await sequelize.query(
                "UPDATE users SET name = :name, email = :email, password = :password, direction = :direction WHERE id = :id",
                { replacements: {name, email, password, direction, id: user_id} }
            )
            res.status(200).json(`User updated corrrectly`);
        }
    } catch (error) {
        console.error(error);
        res.status(400).json(error);
    }
})
router.delete("/users/admin-delete/:id", checkAdmin, async(req, res) => {
        //Delete user by ID. Only for admins
        try {
            const user_id = req.params.id;
            const deleteUser = await sequelize.query(
                "DELETE FROM users WHERE id = :id",
                { replacements: {id: user_id} }
            )
            res.status(200).json("User removed");
        } catch (error) {
            console.error(error);
            res.status(400).json("Error: " + error);
        }
})
router.delete("/users/client-delete", async(req, res) => {
    //Normal clients can delete its own account
    try {
        const user_id = await req.user.payload.id;
        const deleteUser = await sequelize.query(
            "DELETE FROM users WHERE id = :id",
            { replacements: {id: user_id} }
        )
        res.status(200).json("User removed");
    } catch(error) {
        console.error(error);
        res.status(400);
    }
})

//Export routes
module.exports = router;