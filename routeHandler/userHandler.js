import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userSchema from "../schemas/userSchema.js"

const router = express.Router()
const User = mongoose.model("User", userSchema)

router.post('/register', async(req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword
    })
    await newUser.save()
    res.status(200).json({
      message: "User added successfully!!!"
    })
  } catch (error) {
    res.status(500).json({
      error: "Server side error!!!"
    });
  }
})

router.post('/login', async(req, res) => {
  try {
    const user = await User.find({
      username: req.body.username
    })
    if(user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(req.body.password, user[0].password)
      if(isValidPassword) {
        const token = jwt.sign({
          username: user[0].username,
          id: user[0]._id
        }, process.env.APP_SECRET, {
          expiresIn: "1h",
        })

        res.status(200).json({
          "access_token": token,
          "message": "Login successfully!!!"
        })
      } else {
        res.status(401).json({
          "error": "Authentication failed!!"
        })
      }
    } else {
      res.status(401).json({
        "error": "Authentication failed!!!"
      })
    }
  } catch(error) {
    res.status(401).json({
      "error": "Authentication failed!!!"
    })
  }
})

const userHandler = router; // Assign the router object to userHandler
export default userHandler; // Export userHandler as default
