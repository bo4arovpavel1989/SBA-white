$(document).ready(function(){
	addToFilterGraphHandler();
	resetGraph();
	toggleTypeOfGraph();
});

var vizualizationData=[];
var graphChosen='linegraph';

function addToFilterGraphHandler(){
	$('#addToFilterGraph').on('submit', function(e){
		e.preventDefault();
		document.getElementById('showGraph').disabled = true;
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
							if(graphChosen==='linegraph'){
								vizualizationData.push(data);
								drawLineGraph(vizualizationData);
								$('.toDisable').each(function(){
									$(this).hide();
								});
							} else {
								vizualizationData.push(data);
								drawPieGraph(vizualizationData);
								$('.toDisable').each(function(){
									$(this).hide();
								});
							}
						}else alert('Ошибка!');
						$('.loader').removeClass('loading');
						document.getElementById('showGraph').disabled = false;
				}
		});
		
	});
}

function toggleTypeOfGraph(){
	$('#graphTypeChoose').on('change', function(){
		var grType = $('#graphTypeChoose').val();
		graphChosen=grType;
		if(grType=='piegraph') {
			$('#pie').show();
			$('#chart').hide();
			$('.secondDate').each(function(){
				$(this).hide(400);
			});
		}else {
			$('#pie').hide();
			$('#chart').show();
			$('.secondDate').each(function(){
				$(this).show(400);
			});
		}
	});
}

function drawLineGraph(data){
	var dataToShow=[];
	var title="Количество ППС";
	var titleArray=[];
	var seriesArray=[];
	console.log(data);
	for (var k=0;k<data.length;k++){
		titleArray.push(data[k].bk);
	}
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

};

function drawPieGraph(dataSource){
	var title;
	if(dataSource[0].city!='')title="Соотношение ППС " + dataSource[0].date+' ('+dataSource[0].city+')';
	else title="Соотношение ППС " + dataSource[0].date;
	console.log(dataSource);
	$("#pie").dxPieChart({
        size: {
            width: 1200
        },
        palette: "bright",
        dataSource: dataSource,
        series: [
            {
                argumentField: "bk",
                valueField: "quantity",
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1
                    }
                }
            }
        ],
        title: title,
        "export": {
            enabled: true
        },
        onPointClick: function (e) {
            var point = e.target;
    
            toggleVisibility(point);
        },
        onLegendClick: function (e) {
            var arg = e.target;
    
            toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
        }
    });
    
    function toggleVisibility(item) {
        if(item.isVisible()) {
            item.hide();
        } else { 
            item.show();
        }
    }
}

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