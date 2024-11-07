const usersRouter = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')

usersRouter.get('/', async(req,res)=>{
  const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async(req,res)=>{
  const { username, name, password } = req.body
  if( (!password) || (password.length < 3) ){ 
    return res.status(400).json({ error:"given password is invalid" }) 
  }
  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new User({
    username, name, passwordHash
  })

  const savedUser = await newUser.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter