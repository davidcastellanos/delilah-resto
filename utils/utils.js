const sequelize = require("../database/connection.js");

//Middleware to check role of user, admin or client
const checkAdmin = async(req, res, next) => {
    /* Role =>>> admin == 1, customer == 0.
    This is what comes in the payload :
    user: { payload: { user: 'Nicole Lepariz', role: 0, id: 0 },iat: 1655393607,exp: 1655397207},*/
    try {
        const role = req.user.payload.role;
        role == 1 ? next() : res.status(403).json("Sorry, only admins have access");
    } catch(error) {
        res.status(404).json("Error message: " + error)
        console.error(error);
    }
}

//Middleware to check if the user already exists
const verifyUser = async (req, res, next) => {
    if(req.body.email && req.body.password != "") {
        try {
            const records = await sequelize.query("SELECT * FROM users WHERE email = ? && password = ?", { replacements: [req.body.email, req.body.password], type: sequelize.QueryTypes.SELECT, })
            //This if statment verifies whether there's data or not
            if (records[0]) {
                next();
            } else if (records[0] == null) {
                res.status(404).json("User not found :V")
            }
        } catch (error) {
            res.status(400).json("Error message: " + error);
            console.error(error);
        }
    } else {
        res.status(400).json("You need to insert your email and password");
    }
}

//Middleware to check if user exits by its ID
const verifyUserId = async(req, res, next) => {
    if (req.params != null) {
        try {
            const records = await sequelize.query("SELECT * FROM users WHERE id = ?", { replacements: [req.params.id] })
            console.log(records)
            if(records[0].length == 0) {
                res.json("User not found :V")
            } else {
                next()
            }
        } catch(error) {
            console.error(error);
        }
    } 
}

/* Middleware for "/signup" to verify if user already exists.
But this one returns a different response in case of error */
const existingUser = async (req, res, next) => {
    if(req.body.name && req.body.email != "") {
        try {
            const records = await sequelize.query("SELECT * FROM users WHERE name = ? && email = ?", { replacements: [req.body.name, req.body.email], type: sequelize.QueryTypes.SELECT, })
            //This if statment verifies whether there's data or not
            if (records[0]) {
                res.status(409).json("You are already a user and need to sign in");
            } else if (records[0] == null) {
                next();
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        res.status(400).send("You need to insert the data required");
    }
}

//GET ID function for "/modifyuser" and "/deleteuser" routes
const getID = async(user_email) => {
    const user = await sequelize.query("SELECT id FROM users WHERE email = ?", { replacements: [user_email], type: sequelize.QueryTypes.SELECT, })
    const id = user[0].id;
    console.log(id);
    return id;
}

//Verify is the product really exists
const verifyDish = async (req, res, next) => {
    if(req.body.description && req.body.image && req.body.price != undefined) {
        try {
            const records = await sequelize.query("SELECT * FROM dishes WHERE description = ?", { replacements: [req.body.description], type: sequelize.QueryTypes.SELECT})
            if(records[0]) {
                next();
            } else if (records[0] == null) {
                res.status(404).send("Dish not found :v");
            }
        } catch(error) {
            res.status(400).json("Error message: " + error)
            console.error(error);
        }
    } else {
        res.status(404).json("You need to insert all the dish data")
    }
}
//Verify order data
const verifyOrder = async (req, res, next) => {
    if(req.body.description && req.body.payment != undefined) {
        try {
            const description = req.body.description;
            description.forEach(async(element) => {
                const dish_name = element;
                const records = await sequelize.query("SELECT * FROM dishes WHERE description = ?", { replacements: [dish_name], type: sequelize.QueryTypes.SELECT})
                if(records[0]) {
                    next();
                } else if (records[0] == null) {
                    res.status(404).send("Dish not found :v");
                }
            })
        } catch(error) {
            res.status(400).json("Error message: " + error)
            console.error(error);
        }
    } else {
        res.status(404).json("You need to insert all the dish data")
    }
}
// Function to get the dish data
const getDish = async(description) => {
    try {
        const product = await sequelize.query(
            "SELECT id FROM dishes WHERE description = ?", { replacements: [description], type: sequelize.QueryTypes.SELECT, }
        )
        console.log(product);
        const productID = product[0].id;
        return productID;
    } catch(error) {
        console.error(error);
    }
}

//Function to get the Order ID
const getOrder = async (dishId, userId) => {
    const records = await sequelize.query(
      "SELECT id FROM Orders WHERE Dish_id = ? AND User_id = ?", {
        replacements: [dishId, userId], type: sequelize.QueryTypes.SELECT
      }
    )
    const id = records[0].id;
    return id;
  }
module.exports = {
    checkAdmin,
    verifyUser,
    existingUser,
    getID,
    verifyDish,
    verifyOrder,
    getDish,
    getOrder,
    verifyUserId
};