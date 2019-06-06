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

function trace2() {
  return new Error().stack
}

function trace3() {
  const err = {
    name: 'Trace',
    message: 'Error'
  }
  Error.captureStackTrace(err, trace3)
  return err.stack
}
