require('express-async-errors')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
//routers
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

// connect to mongodb //
mongoose.connect(config.MONGODB_URI)
  .then( () => logger.info('Connected to mongodb\n---------'))
  .catch( () => logger.info('Connection to mongodb failed\n---------'))

// middleware //
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app