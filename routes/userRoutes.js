const express = require("express");
const userModel = require("../models/user")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const secretKey = "This-is-a-secret-key"

const router = express.Router();

router.post("/signup",
    // username must be an email
    body("username").isString(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 1, max: 24 }),
    async (req, res) => {
        try {
            console.log("Signup", req.body);
            // Finds the validation errors 
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { username, password } = req.body

            let user = await userModel.findOne({ username })
            if (user) {
                return res.status(409).json({ message: "User already exists" })
            }

            //HASHING THE PASSWORD
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ message: err.message })
                }
                //CREATING USER
                user = await userModel.create({
                    username, password: hash
                })

                return res.json({
                    message: "User Successfully Created",
                    user
                })
            })
        }
        catch (error) {
            return res.status(500).json({ message: error.message })
        }
    })

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await userModel.findOne({ username })
        if (!user) {
            return res.status(404).json({ message: "User not registered" })
        }
        // If user already there then compare the pasword 

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: err.message })
            }
            if (result) {
                const token = jwt.sign(
                    { data: user._id },
                    secretKey,
                    { expiresIn: '1h' }
                )
                return res.json({
                    message: "User Successfully Logged in",
                    token
                })
            } else {
                return res.status(401).json({
                    message: "Invalid credentials"
                })
            }
        })

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router;