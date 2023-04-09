const jwt = require("jsonwebtoken")
const secretKey = "This-is-a-secret-key"

const authorization = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: "User not authorized" })
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: err.message })
        }
        console.log(decoded);
        req.user = decoded.data;
        next()
    })
}

module.exports = authorization;