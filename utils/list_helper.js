const _ = require('lodash')

const dummy = (blogs) =>{
  return 1
}

const totalLikes = (blogs) =>{
  const res = blogs.reduce(
    (sum, el) => sum += el.likes
    , 0
  )

  return res
}

const favoriteBlog = (blogs) =>{
  const res = blogs.reduce(
    (maxEl, curEl) => {
      console.log(maxEl)
      if(maxEl.likes <= curEl.likes){ return curEl }
      else{ return maxEl }
    }
    , blogs[0]
  )

  return {
    title: res.title,
    author: res.author,
    likes: res.likes
  }
}

const mostBlogs = (blogs) =>{
  const author = _.maxBy(blogs, el=>el.author).author
  const count = _(blogs)
    .map('author')
    .countBy()
    .value()[author]
  return { author:author, blogs:count }
}

const mostLikes = (blogs) =>{
  const res = _(blogs)
  .groupBy('author')
  .map((items, author) => ({
    author,
    likes: _.sumBy(items, 'likes')
  }))
  .maxBy('likes'); 
  
  return res
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}