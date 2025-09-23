const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware');
const { default: blogs } = require('../../frontend/src/services/blogs');

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


blogsRouter.post('/', middleware.userExtractor, async(req, res) => {
  const {title, author, url, likes} = req.body
  const user = req.user

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json({
    ...(savedBlog.toObject()),
    id:savedBlog._id,
    user:{
      username:user.username,
      name:user.name,
      id:user._id
    }
  })
})


blogsRouter.delete('/:id', middleware.userExtractor, async(req, res)=>{
  const id = req.params.id
  const user = req.user

  const recordToDelete = await Blog.findById(id)
  if(!recordToDelete) { return res.status(204).end()} // record already deleten
  if(!(user._id.toString() === recordToDelete.user.toString()))
    { return res.status(401).json({ error: 'wrong token' }) }

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

blogsRouter.post('/:id/comments', async(req, res)=>{
  const id = req.params.id
  const comment = req.body.comment
  const blog = await Blog.findById(id)
  blog.comments = blog.comments.concat(comment)
  await blog.save()
  res.json(blog)
})

blogsRouter.get('/:id/comments', async(req, res)=>{
  const id = req.params.id
  const blog = await Blog.findById(id)
  res.json(blog.comments)
})

module.exports = blogsRouter