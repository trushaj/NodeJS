const pool = require('../../../db');
const queries = require('../user.queries');
const User = require('../../../models/user');
const bcrypt = require('bcryptjs');
const { validationResult} = require("express-validator");

const getUser = (req, res) => {
    pool.query(queries.getUser, (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

const getUserById = (req, res) => {
    const user_id = parseInt(req.params.id);
    pool.query(queries.getUserById, [user_id], (error, results) =>{
        if(error) throw error;
        res.status(200).json(results.rows);
    });
};

const addUser = async(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            errors: error.array()
        });
    }
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);

User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
}).then(user => res.json(user));
const emailExist = await User.findOne({ email: req.body.email});
if (emailExist) return res.status(400).send('Email already exists');


//destructuring
/*const { name, user_id, email, password } = req.body;
//check if id exists
pool.query(queries.checkIdExists, [email], (error, result) =>{
    if (result.rows.length){
        res.send("Email aleady exists.");
    }
});
//adding category to db
pool.query(queries.addUser,
    [name, user_id, email, password],
    (error, results) => {
    if(error) throw error;
    res.status(201).send("Account Created Succesfully!");
}
);*/

};


const removeUser = (req, res) => {
    const user_id = parseInt(req.params.id);
    
    pool.query(queries.getUserById, [user_id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound){
            res.send("Account does not exist in the database!");
        }

        pool.query(queries.removeUser, [user_id], (error,results) => {
            if (error) throw error;
            res.send(results.affectedRows);
        });
    });
};

const updateUser = (req, res) => {
    const user_id = parseInt(req.params.id);
    const { name } = req.body;

    pool.query(queries.getUserById, [user_id], (error, results) => {
        const noUserFound = !results.rows.length;
        if (noUserFound){
            res.send("Account does not exist in the database!");
        }

        pool.query(queries.updateUser, [name, user_id], (error, results) => {
            if (error) throw error;
            res.status(200).send(req.body);
        });
    });
}



module.exports = {
    getUser,
    getUserById,
    addUser,
    removeUser,
    updateUser,
  
};