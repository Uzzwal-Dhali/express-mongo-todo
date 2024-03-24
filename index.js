import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import todoHandler from "./routeHandler/todoHandler.js"
import userHandler from "./routeHandler/userHandler.js"

const app = express()
app.use(express.json())
dotenv.config()

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost/todos')
  .then(() => console.log('Mongo connected successfully!!'))
  .catch(err => console.log(err))
}

app.use('/todo', todoHandler)
app.use('/user', userHandler)

const errorHandler = (err, req, res, next) => {
  if(res.headersSent) {
    return next(err)
  }
  res.status(500).json({
    error: err
  })
}

app.use(errorHandler)

app.listen(3000, () => {
  console.log("Listening to port 3000")
})
