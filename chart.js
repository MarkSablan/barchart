// TODO 
// create a dynamic spacing for bar


let canvas = document.querySelector('canvas');
let chartCtx;
let tempWidth = 20;
canvas.width = 550;
canvas.height = 400;

function draw(){
	chartCtx.clearRect(0, 0, canvas.width, canvas.height);
	chart1.displayChart();
	requestAnimationFrame(draw);
}

//get highest number from an object/array
function getHighest(dataSet){
	let temp = dataSet[0];
	// console.log(temp);
	for (var i = 1; i < dataSet.length; i++) {
		if(temp < dataSet[i])temp = dataSet[i];
		// console.log(temp);
	}
	// console.log('highest number: '+ temp);
	return temp;
}

function getLines(highestNum){
	if(highestNum < 10) return 10;
	else if(highestNum < 16) return highestNum;
	else if (highestNum < 500) return 11;
	else if (highestNum < 1000) return 13;
	else return 12;
}


// Bar constructor
function Bar(label, width, height, xPos, yPos, highestNum, areaHeight){
	// scale multiplier
	this.scale = areaHeight / highestNum;
	// the height of the bar, multiplied by negative number
	// to convert it to negative number because of how the
	// canvas x and y positions work
	this.height = (this.scale * height) * -1;
	// for animation, increments over time until it reaches
	// the required height
	this.currentHeight = 0;
	// the width of the bar
	this.width = width;
	// x and y Positions
	this.xPos = xPos;
	this.yPos = yPos;
	// initial graph animation speed
	this.speed = 5;
	// initial friction for acceleration
	this.friction = 0.00001;
	console.log("scale " + this.scale);

}

// Bar Prototype methods
Bar.prototype.draw = function(){
	chartCtx.fillStyle = 'green';
	chartCtx.fillRect(this.xPos, this.yPos, this.width, this.currentHeight);
	this.update();
}

Bar.prototype.update = function(){
	if(this.currentHeight > this.height){
		// friction multiplier, the purpose of this number is for precision
		this.friction *= 1.00001;
		this.speed += this.friction;
		this.currentHeight -= this.speed;
		console.log(this.friction + " " + this.speed);
	}
}


// Chart Constructor
function Chart(ctx, data){
	/*
	   xAxis
		|
	xGap|	area
		|
	yAxis--------------
			yGap	
	*/
	chartCtx = ctx;
	this.data = data;
	this.xGap = 50;
	this.yGap = 50;
	this.yAxis = canvas.height - 50;
	this.areaWidth = canvas.width - this.xGap;
	this.areaHeight = canvas.height - this.yGap;
	this.peak = getHighest(this.data.data);
	// this.peak = getHighest(this.data.data) + (10 - (getHighest(this.data.data) % 10));
	this.xLines = getLines(getHighest(this.data.data));
	// Math.floor(this.areaHeight / this.peak);
	this.xLineGaps = (this.areaHeight / this.xLines) ;
	this.barWidth = (this.areaWidth / this.data.data.length) - 30;
	// this.bar1 = new Bar(this.data.label[0], this.barWidth, this.data.data[0], this.xGap + 10, this.yAxis, this.peak, 320);
	// this.bar2 = new Bar(this.data.label[1], this.barWidth, this.data.data[1], this.xGap + 60, this.yAxis, this.peak, 320);
	// this.bar3 = new Bar(this.data.label[2], this.barWidth, this.data.data[2], this.xGap + 110, this.yAxis, this.peak, 320);
	// this.bar4 = new Bar(this.data.label[3], this.barWidth, this.data.data[3], this.xGap + 160, this.yAxis, this.peak, 320);
	this.bars = [];
	this.createBars();
	this.barSpacing = (this.areaWidth - (this.barWidth * this.bars.length)) / this.bars.length;
}

Chart.prototype.createBars = function(){
	for(let i = 0; i < this.data.data.length; i++){
		// console.log(this.data.label[i], this.barWidth, this.data.data[i], this.xGap + 10, this.yAxis, this.peak, this.areaHeight);
		this.bars[i] = new Bar(this.data.label[i], this.barWidth, this.data.data[i], this.xGap + 100 * i, this.yAxis, this.peak, 320);
	}
}

Chart.prototype.createGrid = function(){

	// console.log(`Peak ${this.peak} \nxLines ${this.xLines}\nxLineGaps ${this.xLineGaps}`);
	// draw xAxis
	chartCtx.strokeStyle = 'black';
	chartCtx.beginPath();
	chartCtx.moveTo(this.xGap, 0);
	chartCtx.lineTo(this.xGap, this.yAxis);
	chartCtx.stroke();

	// draw yAxis
	chartCtx.beginPath();
	chartCtx.moveTo(this.xGap, this.yAxis);
	chartCtx.lineTo(canvas.width, this.yAxis);
	chartCtx.stroke();
	// console.log(this.xLineGaps);
	// draw xAxis Lines
	for (let i = 1; i < this.xLines + 1; i++) {
		chartCtx.beginPath();
		chartCtx.moveTo(this.xGap, this.xLineGaps);
		chartCtx.lineTo(canvas.width, this.xLineGaps);
		chartCtx.strokeStyle = 'grey';
		chartCtx.fillStyle = 'black';
		chartCtx.stroke();
		chartCtx.fillText((this.peak / (this.xLines - 1) * i).toFixed(1), this.xGap - 30 , this.yAxis - this.xLineGaps);
		// console.log("Xlines: " + this.xLines + " xLineGaps: " + this.xLineGaps + " " + getHighest(this.data.data)/this.xLines);
		this.xLineGaps += (this.xLineGaps / i);
	}
	chartCtx.fillText("0", this.xGap - 30, this.yAxis);
	this.xLineGaps  = this.areaHeight / this.xLines;
	// console.log(this.peak);
	// here is where i left off

}

Chart.prototype.displayChart = function(){
	this.createGrid();
	for (var i = 0; i < this.bars.length; i++) {
		this.bars[i].draw();
	}
}


let chart1 = new Chart(canvas.getContext('2d'), {
	title : "Barchart 1",
	label : ["Bar 1", "Bar 2", "Bar 3", "Bar 4", "Bar 5"],
	data : [5, 4, 1, 2, 3]
});
console.log(chart1.barWidth);
// let bar1 = new Bar(300, 100, canvas.height);
draw();
