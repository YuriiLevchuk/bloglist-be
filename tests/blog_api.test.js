const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, testUsers } = require('./testing_data')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

let token = null
describe('api testing', ()=>{
  beforeEach(async()=>{
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
    await User.deleteMany({})
    await User.insertMany(testUsers)

    const loggedInUser = await api.post('/api/login')
      .send({
        username: "123",
        password: "123"
      })
    
    token = `Bearer ${loggedInUser._body.token}`
  })

  test('GET /api/blogs returns list of blogs', async()=>{
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('valid id property is defined for each record', async()=>{
    const res = await api.get('/api/blogs')

    const elementsWithId = res.body.filter(el => el.id.length === 24)
    assert.strictEqual(elementsWithId.length, initialBlogs.length)
  })

  test('valid record can be added', async()=>{
    const newBlog = {
      title:"test title",
      author:"test author",
      url:"https://testurl.com/"
    }
    
    await api.post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(contents.includes('test title'))
  })

  test('undefined likes is set to 0', async()=>{
    const newBlog = {
      title:"no likes",
      author:"test author",
      url:"https://testurl.com/"
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => `${r.title}${r.likes}`)
    assert(contents.includes('no likes0'))
  })

  test('record with no title or url is not added', async()=>{
    const newBlog = {
      author:"test author",
      like:12
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('record can be deleted', async()=>{
    const beforeDelete = (await Blog.find({}))
      .map(el => el.toJSON())

    const idToDelete = beforeDelete[0].id
    await api.delete(`/api/blogs/${idToDelete}`)
      .set({ Authorization: token })
      .expect(204)

    const afterDelete = (await Blog.find({}))
      .map(el => el.toJSON().id)

    assert.strictEqual(afterDelete.length, beforeDelete.length-1)
    assert(!afterDelete.includes(idToDelete))
  })

  test('record with non existent id wont be deleted', async()=>{
    await api.delete(`/api/blogs/5a422a851b54a67623400000`)
      .set({ Authorization: token })
      .expect(204)
    
    const afterDelete = (await Blog.find({}))
      .map(el => el.toJSON().id)
    assert.strictEqual(afterDelete.length, initialBlogs.length)
  })

  test('update existing record', async()=>{
    reqBody = { title:"updated title" }
    await api.put(`/api/blogs/5a422a851b54a676234d17f7`)
      .send(reqBody)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const titlesAfterUpdate = (await Blog.find({}))
      .map(el => el.toJSON().title)
    
    assert(titlesAfterUpdate.includes("updated title"))
    assert(!titlesAfterUpdate.includes("React patterns"))
  })

  test('unathorised user cant add blog', async()=>{
    const newBlog = {
      title:"test title",
      author:"test author",
      url:"https://testurl.com/"
    }
    
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
})