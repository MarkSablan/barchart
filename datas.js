let canvas = document.getElementById('barChart');
canvas.width = 800;
canvas.height = 500;
let chart1 = new Chart(canvas.getContext('2d'), {
	title : "Barchart 1",
	label : ["data1", "data2", "data3", "data4", "data5", "data6", "data7", "data8", "data9"],
	data : [1, 5, 2, 6, 7, 9, 10, 12, 14],
	color : ['blue', 'red', 'green', 'yellow', 'orange', 'purple', 'lime', 'red', 'indigo']
});

chart1.drawChart();


function test(){
	chart1.bars[0].height = (chart1.bars[0].scale * 14) * -1;
	chart1.bars[1].height = (chart1.bars[0].scale * 7) * -1;
	chart1.bars[2].height = (chart1.bars[0].scale * 5) * -1;
	chart1.bars[3].height = (chart1.bars[0].scale * 10) * -1;
}
