const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const testUsers = [
  {
    _id:"672c0b471a6bb23b21a6a8a7",
    username:"123",
    name:"123",
    passwordHash:"$2a$10$bmBdujS1rVB/OJ2mZ5VL7u1E/N844xlkX3QT/BY4NUvHjAOmKvE26", //123
    __v: 0
  },
  {
    _id:"672c0c3912e9faeacf665e2e",
    username:"user2",
    name:"123",
    passwordHash:"$2a$10$078Ne8gP9qi8aKlvSIWf1ewZnqUj7qJwem6lVy.dEVGHohsgy8SDe", //123
    __v: 0
  },
  {
    _id:"672c11a1d85026e072e1777d",
    username:"user3",
    name:"123",
    passwordHash:"$2a$10$p7M6Uy.Jzpt4smtJ2IsR3OIq/E68LYuj9ZnDzco7X3ARO7WRkYVSe", //123
    __v: 0
  },
]

describe(('user api test'), ()=>{
  beforeEach(async()=>{
    await User.deleteMany({})
    await User.insertMany(testUsers)
  })

  test('invalid users are not created', async()=>{
    api.post('/api/users')
      .send({ username:"1", name:"123", password:"123"})
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/users')
    //console.log(response.body)
    assert.strictEqual(response.body.length, testUsers.length)
  })
})

after(async () => {
  await mongoose.connection.close();
})