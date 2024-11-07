const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    user: "672c0b471a6bb23b21a6a8a7",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    user: "672c0b471a6bb23b21a6a8a7",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    user: "672c0b471a6bb23b21a6a8a7",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    user: "672c0b471a6bb23b21a6a8a7",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    user: "672c0b471a6bb23b21a6a8a7",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    user: "672c0b471a6bb23b21a6a8a7",
    likes: 2,
    __v: 0
  }  
]

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

module.exports = {
  initialBlogs,
  testUsers
}