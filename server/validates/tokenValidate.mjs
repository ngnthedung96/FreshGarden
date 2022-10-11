import jwt from "jsonwebtoken"

const tokenUserValidate = {
  //verifyToken 
  verifyToken: (req, res, next) => {
    const token = req.headers.token
    if (token) {
      const accessToken = token.split(" ")[1]
      jwt.verify(accessToken, "secretUserKey", (err, member) => {
        if (err) {
          return res.status(403).json("Token isn't valid")
        }
        req.user = member
        next()
      })
    }
    else {
      return res.status(401)
    }
  }
}
const tokenAdminValidate = {
  //verifyToken 
  verifyToken: (req, res, next) => {
    const token = req.headers.token
    if (token) {
      const accessToken = token.split(" ")[1]
      jwt.verify(accessToken, "secretAdminKey", (err, member) => {
        if (err) {
          return res.status(403).json("Token isn't valid")
        }
        req.admin = member
        next()
      })
    }
    else {
      return res.status(401)
    }
  }
}

export const tokenValidate = {
  tokenUserValidate,
  tokenAdminValidate
} 