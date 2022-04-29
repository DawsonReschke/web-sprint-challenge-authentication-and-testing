const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    if(!token) return next({message:'token required',status:403})
    const verified = jwt.verify(token,process.env.SECRET_KEY || 'random secret key')
    return next();
  } catch (error) {
    return next({message:'token invalid',status:403})
  }
}


