const refresh_delay = 1000;

let waitTime;

function timer(start_time) {
	remaining_time = waitTime - new Date().getTime() + start_time
  postMessage(Math.max(remaining_time, 0))
  if (remaining_time > 0){
  	setTimeout(() => timer(start_time), refresh_delay);
  }else{
  	setTimeout(() => timer(new Date().getTime()), refresh_delay);
  }
}

onmessage = (e) => {
  waitTime = e.data
  timer(new Date().getTime());
}