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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}