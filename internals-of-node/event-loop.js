const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

const shouldContinue = () => {
  return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// Entire body executes in one 'tick'
while (shouldContinue()) {
  // 1) Node looks at pendingTimers and sees if any functions are ready to be called. setTimeout setInterval

  // 2) Node looks at pendingOSTasks and pendingOperations are calls relevant callbacks

  // 3) Pause execution, continue on..
  //    - a new pendingOSTask is done
  //    - a new pendingOperations is done
  //    - a timer is about to complete

  // 4) Look at pending Timers. Call any setImmediate

  // 5) Handle any 'close' events
}

// change thread pool size
// default = 4
process.UV_THREADPOOL_SIZE = 5;