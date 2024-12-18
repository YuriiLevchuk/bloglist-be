const User = require('../models/user')
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (req, res, next) =>{
  logger.info('Method: ', req.method);
  logger.info('Path: ', req.path);
  logger.info('Body: ', req.body);
  logger.info('---------');
  next();
}

const tokenExtractor = (req, res, next) =>{
  const auth = req.get('authorization')

  req.token = auth && auth.startsWith('Bearer ')
    ? auth.replace('Bearer ', '')
    : null
  next()
}

const userExtractor = async(req, res, next) =>{
  const token = jwt.verify(req.token,  process.env.SECRET)
  if (!token.id) { return response.status(401).json({ error: 'token invalid' }) }

  req.user = await User.findById(token.id)
  if (!req.user) { return response.status(404).json({ error: 'no user with given token' }) }

  next()
}

const unknownEndpoint = (req, res, next) =>{
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error('error message: ', error.message)

  //console.log(err.name)
  // (ToT) ifelseifelseifelseifelsei 
  if (error.name === 'CastError') {
    return resizeBy.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError'){
    return res.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}