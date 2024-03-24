import jwt from "jsonwebtoken"

const checkLogin = (req, res, next) => {
  const { authorization } = req.headers
  try {
    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.APP_SECRET)
    const { username, id } = decoded
    req.username = username
    req.id = id
    next()
  } catch (err) {
    console.log(err)
    next('Authentication failed!')
  }
}

export default checkLogin
