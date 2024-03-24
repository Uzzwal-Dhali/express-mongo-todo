import express from "express"
import mongoose from "mongoose"
import todoSchema from "../schemas/todoSchema.js"
import userSchema from "../schemas/userSchema.js"
import checkLogin from "../middlwares/login.js"

const router = express.Router()
const Todo = new mongoose.model("Todo", todoSchema)
const User = new mongoose.model("User", userSchema)

router.get('/', checkLogin, async(req, res) => {
  try {
    const todos = await Todo.find({})
    .populate("user", "name -_id")
    .select({
      _id: 0,
      __v: 0
    })
    res.status(200).json({
      result: todos,
    })
  } catch (error) {
    res.status(500).json({
      error: "Oops! Something is wrong."
    });
  }
})

router.get('/:id', async(req, res) => {
  try {
    const todo = await Todo.find({ _id: req.params.id })
    res.status(200).json({
      result: todo,
    })
  } catch (error) {
    res.status(500).json({
      error: "Oops! Something is wrong."
    });
  }
})

router.post('/', checkLogin, async (req, res) => {
  try {
    const newTodo = new Todo({
      ...req.body,
      user: req.id
    });
    const todo = await newTodo.save();
    await User.updateOne({
      _id: req.id
    }, {
      $push: {
        todos: todo._id
      }
    })
    res.status(200).json({
      message: "Added successfully!!"
    });
  } catch (err) {
    res.status(500).json({
      error: "Server side error!!!"
    });
  }
});

router.put('/:id', async(req, res) => {
  try {
    await Todo.updateOne({_id: req.params.id}, req.body)
    res.status(200).json({
      message: "Updated successfully!!"
    });
  } catch (err) {
    res.status(500).json({
      error: "Server side error!!!"
    });
  }
})

router.delete('/:id', async(req, res) => {
  try {
    await Todo.deleteOne({_id: req.params.id})
    res.status(200).json({
      message: "Deleted successfully!!"
    });
  } catch (error) {
    res.status(500).json({
      error: "Server side error!!!"
    });
  }
})

const todoHandler = router;
export default todoHandler
