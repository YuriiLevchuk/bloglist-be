const info = (...x) =>{
  console.log(...x);
}

const error = (...x) =>{
  console.error(...x);
}

module.exports = { info, error }