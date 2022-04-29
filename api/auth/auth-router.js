const router = require('express').Router();
const {
  validateAuthRequestBody,
} = require('./auth-middlewares')
const {
  createUser,
  getUserByUsername,
} = require('./user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const salt = process.env.NODE_ENV === 'testing' ? bcrypt.genSaltSync(2) : bcrypt.genSaltSync(2)

const hashPassword = (password) => { 
  return bcrypt.hash(password,salt)
}
const verifyPassword = (password,hashedPassword) => {
  return bcrypt.compare(password,hashedPassword)
}

router.post('/register',validateAuthRequestBody, async (req, res,next) => {
  const {username,password} = req.body
  const hashedPassword = await hashPassword(password)
  createUser({username,password:hashedPassword})
    .then(([id]) => {res.json({
      id,
      username,
      password:hashedPassword
    })})
    .catch(e => next({message:'username taken',status:400}))
});

router.post('/login',validateAuthRequestBody, async (req, res,next) => {
  const {username,password} = req.body
  const user = await getUserByUsername(username)
  const verified = await verifyPassword(password,user.password)
  if(!verified) return next({message:'invalid credentials',status:403})
  res.json({
    message:`welcome, ${user.username}`,
    token: jwt.sign(user,process.env.SECRET_KEY || 'random secret key')
  })
});

module.exports = router;
