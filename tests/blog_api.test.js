const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('api testing', ()=>{
  beforeEach(async()=>{
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
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
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('record can be deleted', async()=>{
    const beforeDelete = (await Blog.find({}))
      .map(el => el.toJSON())

    const idToDelete = beforeDelete[0].id
    await api
      .delete(`/api/blogs/${idToDelete}`)
      .expect(204)

    const afterDelete = (await Blog.find({}))
      .map(el => el.toJSON().id)

    assert.strictEqual(afterDelete.length, beforeDelete.length-1)
    assert(!afterDelete.includes(idToDelete))
  })

  test('record with non existent id wont be deleted', async()=>{
    await api
      .delete(`/api/blogs/5a422a851b54a67623400000`)
      .expect(204)
    
    const afterDelete = (await Blog.find({}))
      .map(el => el.toJSON().id)
    assert.strictEqual(afterDelete.length, initialBlogs.length)
  })

  test('update existing record', async()=>{
    reqBody = { title:"updated title" }
    await api
      .put(`/api/blogs/5a422a851b54a676234d17f7`)
      .send(reqBody)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const titlesAfterUpdate = (await Blog.find({}))
      .map(el => el.toJSON().title)
    
    assert(titlesAfterUpdate.includes("updated title"))
    assert(!titlesAfterUpdate.includes("React patterns"))
  })
})

after(async () => {
  await mongoose.connection.close()
})