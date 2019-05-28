const fs = require('fs')
const iconv = require('iconv-lite')

const stream = fs.createReadStream('./word.txt', { highWaterMark: 11 })

let buffer = []

stream.on('data', (chunk) => {
  buffer.push(chunk)
})

stream.on('end', () => {
  const buf = Buffer.concat(buffer)
  console.log(iconv.decode(buf, 'utf8'))
})
