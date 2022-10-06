import jwt from "jsonwebtoken"

const tokenValidate = {
  //verifyToken 
  verifyToken: (req, res, next) => {
    const token = req.headers.token
    if (token) {
      const accessToken = token.split(" ")[1]
      jwt.verify(accessToken, "secretKey", (err, member) => {
        if (err) {
          return res.status(403).json("Token isn't valid")
        }
        req.user = member
        req.admin = member
        next()
      })
    }
    else {
      return res.status(401)
    }
  }
}

export default tokenValidate 