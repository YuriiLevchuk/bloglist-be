const blogsRouter = require('express').Router()
const { result } = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async(req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username:1, name:1 })
  res.json(blogs)
})

blogsRouter.get('/:id', async(req, res)=>{
  const id = req.params.id
  const searchedRecord = await Blog
    .findById(id)
    .populate('user', { username:1, name:1 })

  return searchedRecord
    ? res.json(searchedRecord)
    : res.status(404).json({ error:"blog with given id doesnt exist" })
})


blogsRouter.post('/', async(req, res) => {
  const {title, author, url, likes} = req.body
  const user = await User.findById("672c0c3912e9faeacf665e2e")

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user:"672c0c3912e9faeacf665e2e"
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async(req, res)=>{
  const id = req.params.id
  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})


blogsRouter.put('/:id', async(req, res)=>{
  const id = req.params.id
  const body = req.body

  const updatedBlog = {
    ...body
  }

  const blogAfterUpdate = await Blog.findByIdAndUpdate(id, updatedBlog, { new:true })
  res.json(blogAfterUpdate)
})


module.exports = blogsRouter