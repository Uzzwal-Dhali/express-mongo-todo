import mongoose from "mongoose";
const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  todos: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Todo"
    }
  ]
})

export default userSchema
