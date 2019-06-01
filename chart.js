/*
Author = Mark Luis G. Sablan
Partially Finished 5/31/2019
*/

// TODO
// Able to create multiple charts

let chartCtx;
function draw(){
	chartCtx.clearRect(0, 0, canvas.width, canvas.height);
	chart1.displayChart();
	requestAnimationFrame(draw);
}

//get highest number from an object/array
function getHighest(dataSet){
	let temp = dataSet[0];
	for (var i = 1; i < dataSet.length; i++) {
		if(temp < dataSet[i])temp = dataSet[i];
	}
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
function Bar(label, width, height, xPos, yPos, highestNum, areaHeight, color){
	// label/title of the bar
	this.label = label;
	this.areaHeight = areaHeight;
	// scale multiplier
	this.scale = this.areaHeight / highestNum;
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
	this.fillColor = color;
}

// Bar Prototype methods
Bar.prototype.draw = function(){
	chartCtx.fillStyle = this.fillColor;
	chartCtx.globalAlpha = 0.7;
	chartCtx.fillRect(this.xPos, this.yPos, this.width, this.currentHeight);
	chartCtx.fillStyle = 'black';
	chartCtx.textAlign = 'center';
	chartCtx.font = '11px Calibri'
	chartCtx.fillText(this.label, this.xPos + (this.width/2), this.yPos + 15);
	this.update();
}

Bar.prototype.update = function(){
	if(this.currentHeight > this.height){
		// friction multiplier, the purpose of this number is for precision
		this.friction *= 1.09;
		this.speed += this.friction;
		this.currentHeight -= this.speed;
	}
	// resets the speed and friction everytime the bar
	// reaches its final height
	this.speed = 3;
	this.friction = 0.000001;
}


Bar.prototype.updateData = function(highestNum, height){
	this.scale = this.areaHeight /  highestNum;
	this.height = (this.scale * height) * -1;
	if(this.currentHeight <= this.height){
		this.currentHeight = this.height;
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
	this.yGap = 70;
	this.yAxis = canvas.height - this.yGap;
	// Area width and height for the bar to be drawn
	this.areaWidth = canvas.width - this.xGap;
	this.areaHeight = canvas.height - this.yGap;
	// Highest number from dataset
	this.peak = getHighest(this.data.data);
	// x Axis lines 
	this.xLines = getLines(getHighest(this.data.data));
	this.xLineGaps = (this.areaHeight / this.xLines) ;
	// Computes the bar width based on the population of dataset
	this.barWidth = (this.areaWidth / this.data.data.length) - 15;
	this.bars = [];
	// Spacing between bars
	this.barSpacing = 15;
	// Create initial bar objects
	this.createBars();
}

Chart.prototype.createBars = function(){
	for(let i = 0; i < this.data.data.length; i++){
		this.bars[i] = new Bar(this.data.label[i], this.barWidth, this.data.data[i], ((this.barWidth + this.barSpacing) * i) + (this.barSpacing/2) + this.xGap, this.yAxis, this.peak, this.areaHeight - this.xLineGaps, this.data.color[i]);
		let test = (this.barWidth + this.barSpacing) * i;
	}
}

Chart.prototype.createGrid = function(){
	// draw xAxis
	chartCtx.globalAlpha = 1.0;
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

	// draw xAxis Lines
	for (let i = 1; i < this.xLines + 1; i++) {
		chartCtx.beginPath();
		chartCtx.moveTo(this.xGap - 5, this.xLineGaps);
		chartCtx.lineTo(canvas.width, this.xLineGaps);
		chartCtx.strokeStyle = 'grey';
		chartCtx.fillStyle = 'black';
		chartCtx.stroke();
		chartCtx.textAlign = 'right';
		chartCtx.font = '9px Calibri'
		chartCtx.fillText((this.peak / (this.xLines - 1) * i).toFixed(1), this.xGap - 5, this.yAxis - this.xLineGaps - 2);
		this.xLineGaps += (this.xLineGaps / i);
	}
	chartCtx.fillText("0", this.xGap - 5, this.yAxis);

	this.xLineGaps  = this.areaHeight / this.xLines;
	// display the chart title
	chartCtx.textAlign = 'center';
	chartCtx.font = '20px Calibri'
	chartCtx.fillText(this.data.title, canvas.width/2, this.areaHeight + 45);
}


Chart.prototype.displayChart = function(){
	this.createGrid();
	for (var i = 0; i < this.bars.length; i++) {
		this.bars[i].draw();
	}
}

Chart.prototype.drawChart = function(){
	draw();
}

// update data
Chart.prototype.updateBars = function(){
	for (var i = 0; i < this.bars.length; i++) {
		this.bars[i].updateData(this.peak, this.data.data[i]);
	}
}

Chart.prototype.update = function(){
	// get the peak/highest number in the data set
	this.peak = getHighest(this.data.data);
	this.createGrid();
	//update bars
	this.updateBars();
}