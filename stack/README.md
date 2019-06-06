# 获取函数调用堆栈

js 里可以通过 console.trace() 获得函数调用堆栈信息，但是只会在控制台上显示堆栈信息，无法获取具体的内容，为了获得堆栈的信息，可以使用以下三种方法

### 1、callee, caller

在非严格模式下可以通过 arguments.callee 获取函数调用者，代码如下

```javascript
function a() { return b() }
function b() { return c() }
function c() { return trace1() } 

function trace1(){
  const stack = []
  let caller = arguments.callee.caller
  while(caller) {
    stack.unshift(getFuncName(caller))
    caller = caller && caller.caller
  }
  return stack
  
  function getFuncName(fn) {
    const match = fn.toString().match(/function(?:\s+([a-zA-Z$][\w$]*)|)\s*\(/)
    return match ? match[1] || 'anonymous' : ''
  }
}
```

### 2、new Error

严格模式下无法获得 caller，不过可以通过 Error，Error 对象会自动记录当前的调用堆栈，并保存在 stack 属性上，所以可以很简单地获得堆栈信息

```javascript
function trace2() {
  return new Error().stack
}
```

### 3、Error.captureStackTrace

这是属于 v8 上的私有 api，通过这个静态方法可以给任何对象附加当前的 stack 信息，并且支持自动过滤，使用如下

```javascript
function trace3() {
  const err = {
    name: 'Trace',
    message: 'Error'
  }
  Error.captureStackTrace(err, trace3)
  return err.stack
}
```

事实上 node 上的 console.trace 等 api 都是基于此的，更多关于 captureStackTrace 的说明参考[链接](https://segmentfault.com/a/1190000007076507)

