let canvas = document.getElementById('barChart');
canvas.width = 800;
canvas.height = 450;
let chart1 = new Chart(canvas.getContext('2d'), {
	title : "Barchart 1",
	label : ["data1", "data2", "data3", "data4", "data5", "data6", "data7", "data8", "data9"],
	data : [1, 1, 1, 1, 1, 1, 1, 1, 1],
	color : ['blue', 'red', 'green', 'yellow', 'orange', 'purple', 'lime', 'brown', 'indigo']
});

chart1.drawChart();
let a = 1;


setInterval(function(){
	chart1.data.data[0]+=Math.random(1) * a;
	chart1.data.data[1]+=Math.random(1) * a;
	chart1.data.data[2]+=Math.random(1) * a;
	chart1.data.data[3]+=Math.random(1) * a;
	chart1.data.data[4]+=Math.random(1) * a;
	chart1.data.data[5]+=Math.random(1) * a;
	chart1.data.data[6]+=Math.random(1) * a; 
	chart1.data.data[7]+=Math.random(1) * a;
	chart1.data.data[8]+=Math.random(1) * a; 
	chart1.update();
	a+=a;
}, 2000);
