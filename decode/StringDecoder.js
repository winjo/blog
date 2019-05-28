const fs = require('fs')
const { StringDecoder } = require('string_decoder')

const decoder = new StringDecoder('utf8')

const stream = fs.createReadStream('./word.txt', { highWaterMark: 11 })

let str = ''

stream.on('data', (chunk) => {
  str += decoder.write(chunk)
})

stream.on('end', () => {
  str += decoder.end() || ''
  console.log(str)
})
