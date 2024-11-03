const info = (...x) =>{
  if(process.env.NODE_ENV === 'test') return 0;
  console.log(...x);
}

const error = (...x) =>{
  if(process.env.NODE_ENV === 'test') return 0;
  console.error(...x);
}

module.exports = { info, error }