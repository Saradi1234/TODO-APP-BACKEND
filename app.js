const express = require("express");
const userRoutes = require("./routes/userRoutes")
const todoRoutes = require("./routes/todoRoutes")
const authorization = require("./auth/auth")
const cors = require("cors");

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors())

app.use("/todo", authorization)

app.use(userRoutes)
app.use(todoRoutes)

app.get("/", (req, res) => {
    res.send("All Ok");
})

module.exports = app