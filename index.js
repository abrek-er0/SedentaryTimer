
// Time between the rings in miliseconds
const wait_time = 1000 * 60 * 20;
// Dom elements
const canvas = document.getElementById("canvas");
const button = document.getElementById("start-button");
const remaining_time_text = document.getElementById("remaining-time");
set_time(wait_time);
// Notification sound
var audio = new Audio('notification.mp3');

const ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90;

function stop_timer(){
	button.style.display = "block";
	canvas.style.display = "none";
	set_time(wait_time);
	timer_worker.terminate();
}

canvas.addEventListener('click', stop_timer, false);

function draw_clock(remaining_time) {
	set_time(remaining_time);
	draw_face(ctx, radius);
	draw_numbers(ctx, radius);
	draw_time(ctx, radius, remaining_time);
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function set_time(remaining_time) {
	const minutes = Math.floor(remaining_time / 60000);
	const seconds = pad(parseInt((remaining_time % 60000) / 1000), 2);
	remaining_time_text.innerText  = minutes + ":" + seconds;
}

function draw_face(ctx, radius) {
	const grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
	grad.addColorStop(0, '#ffae00');
	grad.addColorStop(0.5, '#ffff00');
	grad.addColorStop(1, '#ffae00');
	ctx.beginPath();
	ctx.arc(0, 0, radius, 0, 2*Math.PI);
	ctx.fillStyle = '#f2d5b6';
	ctx.fill();
	ctx.strokeStyle = grad;
	ctx.lineWidth = radius*0.1;
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
	ctx.fillStyle = '#333';
	ctx.fill();
}

function draw_numbers(ctx, radius) {
	ctx.font = radius*0.50 + "px arial";
	ctx.textBaseline="middle";
	ctx.textAlign="center";
	ctx.fillStyle = "#8c4800"
	for(let num = 1; num < 13; num++){
		let ang = num * Math.PI / 6;
		ctx.rotate(ang);
		ctx.translate(0, -radius*0.85);
		ctx.rotate(-ang);
		ctx.fillText(".", 0 , -radius*0.50 / 4);
		ctx.rotate(ang);
		ctx.translate(0, radius*0.85);
		ctx.rotate(-ang);
  }
}

function draw_time(ctx, radius, remaining_time){
    const now = new Date();
    //final line
    draw_hand(ctx, 0, radius * 0.90);
    //minute
    const remaining_time_rad = (remaining_time * Math.PI / (wait_time / 2));
    draw_hand(ctx, remaining_time_rad, radius * 0.90);
    draw_hand(ctx, remaining_time_rad, radius * 0.90);
    draw_arc_full(ctx, 0, 0, radius * 0.95, -Math.PI / 2, -Math.PI / 2 + remaining_time_rad)
}

function draw_hand(ctx, pos, length, width, initial = 0) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.strokeStyle = "#fa8643";
    ctx.stroke();
    ctx.rotate(-pos);
}

function draw_arc_full(ctx, x, y, rad, startDegree, endDegree){
    ctx.beginPath();
    ctx.fillStyle = "rgba(250, 62, 15, 0.20)";
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.arc(x, y, rad, startDegree, endDegree);
    ctx.closePath();
    ctx.fill();
}

var timer_worker;

function start_timer(){
	button.style.display = "none"
	canvas.style.display = "block"
	timer_worker = new Worker("worker.js")
	timer_worker.postMessage(wait_time)
	timer_worker.onmessage = (e) => {
		draw_clock(e.data);
		if(e.data <= 0){
			audio.play()}
		}
}