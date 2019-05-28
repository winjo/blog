当读取中文文件或者从 http 请求的数据包含中文字符时，因为编码的原因如果不按照正确方式处理会产生乱码，先看一个常见的错误的处理方式

```js
// example.js
const fs = require('fs')

const stream = fs.createReadStream('./word.txt', { highWaterMark: 11 })

let str = ''

stream.on('data', (chunk) => {
  str += chunk
})

stream.on('end', () => {
  console.log(str)
})

```

结果如下：

忘初��，方得���终

这是因为如果只是简单的 chunk 相加，实际上的操作时 `str += chunk.toString`，而由于 `highWaterMark`设置的为 11，则每次读取时可能并没有读取完整的 3 个字节，则导致乱码

正确方式有如下两种解决方案

1、使用内置的 string_decoder，代码如下

```js
// StringDecoder.js
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

```

decoder 每次转码时会保留剩下的字节和后面入的字节再次拼接，所以不会乱码

2、使用第三方库 icon-lite

```js
// concat
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

```

先把 buffer 存储起来，然后使用 Buffer.concat 拼接成一个完整的 buffer，最后使用 iconv-lite 转码