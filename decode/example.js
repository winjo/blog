const fs = require('fs')

const stream = fs.createReadStream('./word.txt', { highWaterMark: 11 })

let str = ''

stream.on('data', (chunk) => {
  str += chunk
})

stream.on('end', () => {
  console.log(str)
})
