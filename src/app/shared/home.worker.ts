/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {

  sleep(2000);
  
  const response = `worker response to ${data}`;
  postMessage(response);
});

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
      currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}