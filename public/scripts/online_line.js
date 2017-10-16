$(document).ready(function(){
	drawGraph(eventData);
});

function drawGraph(data){
	var title=data.name;
	var dataSource=[];
	var seriesArray=[];
	var marketArray=[];
	for (var i=0;i<data.data.length;i++){
		for(prop in data.data[i].data){
			if(prop!=='bk'&&marketArray.indexOf(prop)==-1){
				let seriesItem ={valueField:prop};
				console.log(prop);
				if(prop=='win')seriesItem.name='П1'
				else if(prop=='draw')seriesItem.name='X'
				else if(prop=='away')seriesItem.name='П2'
				else if(prop=='marja')seriesItem.name='маржа'
				seriesArray.push(seriesItem);
				marketArray.push(prop);
			}
			let dataItem={time:data.data[i].time};
			if(data.data[i].data.win)dataItem.win = parseFloat(data.data[i].data.win);
			if(data.data[i].data.away)dataItem.away = parseFloat(data.data[i].data.away);
			if(data.data[i].data.draw)dataItem.draw = parseFloat(data.data[i].data.draw);
			if(data.data[i].data.marja)dataItem['marja'] = parseFloat(data.data[i].data.marja);
			dataSource.push(dataItem);
		}
	}
	console.log(seriesArray);
	console.log(dataSource);
	  var chart = $("#chart").dxChart({
        palette: "red",
        dataSource: dataSource,
        commonSeriesSettings: {
            type: "spline",
            argumentField: "time"
        },
        commonAxisSettings: {
            grid: {
                visible: false
            }
        },
        margin: {
            bottom: 20
        },
        series: seriesArray,
        tooltip:{
            enabled: true
        },
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "right"
        },
        "export": {
            enabled: true
        },
        title: title
    }).dxChart("instance");
}