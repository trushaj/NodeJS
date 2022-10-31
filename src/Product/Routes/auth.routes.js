const express = require('express');
const pool = require('../../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtTokens } = require('./verifyToken');


const router = express.Router();

router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        const users = await pool.query('select * from users where email = $1', [email]);
        if(users.rows.length === 0) return res.status(401).json({ error : "Email is invalid!"});

        //password check
        const validPassword = await bcrypt.compare(password, users.rows[0].password);
        if(!validPassword) return res.status(401).json({ error : "Password or Email is Incorrect!"});
        
        //jwt token
        const token = jwt.sign({_id: users._id}, process.env.TOKEN_SECRET);

        users.token = token;
        res.status(200).json(users);

        res.header('auth-token', token).send(token);

    } catch (error) {
        res.status(401).json({ error : error.message});
    }
})


module.exports = router;