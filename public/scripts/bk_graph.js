$(document).ready(function(){
	addToFilterGraphHandler();
});

var vizualizationData=[];

function addToFilterGraphHandler(){
	$('#addToFilterGraph').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(data){
						vizualizationData.push(data);
						drawGraph(vizualizationData);
				}
		});
		
	});
}

function drawGraph(data){
	var dataToShow=[];
	var title="Количество ППС";
	var titleArray=[];
	for (var k=0;k<data.length;k++){
		titleArray.push(data[k].bk);
	}
	var seriesArray=[];
	for (var m=0;m<data.length;m++){
		seriesArray.push({valueField:titleArray[m],name:titleArray[m]});
	}
	if(data[0].city)title = "Количество ППС "+ '(' + data[0].city+')';
	for (var j=0;j<data[0].dates.length;j++){
		var dataItem={};
		for (var i=0;i<data.length;i++){	
			dataItem.year=data[i].dates[j];
			dataItem[titleArray[i]]=data[i].datas[j];
		}	
		dataToShow.push(dataItem);
	}
	  var chart = $("#chart").dxChart({
        palette: "red",
        dataSource: dataToShow,
        commonSeriesSettings: {
            type: "spline",
            argumentField: "year"
        },
        commonAxisSettings: {
            grid: {
                visible: true
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

};
