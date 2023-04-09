const mongoose = require("mongoose")

const todoSchema = mongoose.Schema({
    activity: { type: String, required: true },
    status: { type: String, default: "Pending" },
    time_taken: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
    user: { type: mongoose.Types.ObjectId, ref: "users" }
})

const todoModel = mongoose.model("todo", todoSchema)

module.exports = todoModel