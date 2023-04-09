const express = require("express");
const mongoose = require("mongoose")
const todoModel = require("../models/todo")

const router = express.Router();

router.post("/todo", async (req, res) => {
    try {
        const { activity } = req.body;
        // console.log('activity',activity)
        const user = req.user;
        const todo = await todoModel.create({ activity, user })

        return res.status(200).json({
            message: "Todo activity successfully created.",
            todo
        })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.get("/todo", async (req, res) => {
    try {
        const user = req.user;
        const activities = await todoModel.find({ user })

        return res.status(200).json({
            activities,
            message: "All Todos Fetched."
        })
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.put("/todo/:id", async (req, res) => {
    try {
        const todoIdToUpdate = req.params.id
        if (mongoose.isValidObjectId(todoIdToUpdate)) {
            const todo = await todoModel.findOne({ _id: todoIdToUpdate })
            if (!todo) {
                return res.status(404).json({
                    message: `Todo with id ${todoIdToUpdate} does not exist!`
                })
            }

            if ((todo.user).toHexString() !== req.user) {
                //Converts an array of 8-bit unsigned integers to its equivalent string representation that is encoded with uppercase hex characters.
                //toHexString converts onjectId to string
                return res.status(401).json({
                    message: "you are not authorized to edit this todo"
                })
            } else {
                const { status, time_taken, isDeleted } = req.body
                let todo;
                if (isDeleted) {
                    console.log('is deleted', isDeleted)
                    todo = await todoModel.findByIdAndUpdate(todoIdToUpdate, { $set: { isDeleted } })
                } else {
                    todo = await todoModel.findByIdAndUpdate(todoIdToUpdate, { $set: { status, time_taken } })
                }

                return res.json({
                    message: "Successfully Updated",
                    todo
                })
            }
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.delete("/todo/:id", async (req, res) => {
    try {
        const todoIdToDelete = req.params.id
        // console.log('delete', todoIdtoDelete);
        if (mongoose.isValidObjectId(todoIdToDelete)) {
            const todo = await todoModel.findOne({ _id: todoIdToDelete })
            if (!todo) {
                return res.status(404).json({
                    message: ` Todo with id ${todoIdToDelete} does not exist!`
                })
            }

            if ((todo.user).toHexString() !== req.user) {
                return res.status(401).json({
                    message: "you are not authorized to delete this todo"
                })
            }
            else {
                const todo = await todoModel.findByIdAndDelete(todoIdToDelete)

                return res.status(200).json({
                    message: "Successfully Deleted",
                    todo
                })
            }
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

router.delete("/todo", async (req, res) => {
    try {
        await todoModel.deleteMany({ isDeleted: true })
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
})

module.exports = router