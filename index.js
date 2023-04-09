require('dotenv').config()
const mongoose = require("mongoose")
const app = require("./app")

const port = process.env.PORT || 5000;
const db_URL = process.env.DATABASE_URL;

mongoose.connect(db_URL, () => {
    console.log("Connected to Database");
    app.listen(port, () => { console.log(`Server is up at ${port} `) })
})