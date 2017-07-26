$(document).ready(function(){
	addToFilterGraphHandler();
	resetGraph();
});

var vizualizationData=[];

function addToFilterGraphHandler(){
	$('#addToFilterGraph').on('submit', function(e){
		e.preventDefault();
		document.getElementById('showGraph').disabled = true;
		$('.toDisable').each(function(){
			$(this).hide();
		});
		$('.loader').addClass('loading');
		var $that = $(this);
		var formData = new FormData($that.get(0));
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(data){
						if(data){
							vizualizationData.push(data);
							drawGraph(vizualizationData);
						}else alert('Ошибка!');
						$('.loader').removeClass('loading');
						document.getElementById('showGraph').disabled = false;
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

function resetGraph(){
	$('#resetGraph').on('click', function(e){
		e.preventDefault();
		vizualizationData=[];
		$('.toDisable').each(function(){
			$(this).show();
		});
		alert("Данные сброшены. График обновится для следующей загрузки");
	})
}