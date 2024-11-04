const blogsRouter = require('express').Router()
const { result } = require('lodash')
const Blog = require('../models/blog')


blogsRouter.get('/', async(req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.get('/:id', async(req, res)=>{
  const id = req.params.id
  const searchedRecord = await Blog.findById(id)

  return searchedRecord
    ? res.json(searchedRecord)
    : res.status(404).json({ error:"blog with given id doesnt exist" })
})


blogsRouter.post('/', async(req, res) => {
  const blog = new Blog(req.body)

  const result = await blog.save()
  res.status(201).json(result)
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