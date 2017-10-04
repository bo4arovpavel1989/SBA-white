$(document).ready(function(){
	showTrafficDataHandler();
});

function showTrafficDataHandler(){
	$('#showTrafficData').on('submit',function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		document.getElementById('showData').disabled = true;
		$('.loader').addClass('loading');
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(html){
						$('.loader').removeClass('loading');
						document.getElementById('showData').disabled = false;
						$('#trafficDataContainer').empty();
						$('#trafficDataContainer').html(html);
						calculateDynamics();
						drawGraph(graphData);
				}
		});
	});
}

function calculateDynamics(){
	$('.dynamics').each(function(){
		var now=$(this).data('now');
		var first=$(this).data('first');
		if(isNaN(now)&&isNaN(first)){
			now=now.replace('K','000').replace('M','000000');
			first=first.replace('K','000').replace('M','000000');
			now=now.match(/\d{1}/g).join('');
			first=first.match(/\d{1}/g).join('');
			now=parseInt(now);
			first=parseInt(first);
		}
		var dynamics=((now-first)/(first))*100;
		var sign='';
		if(dynamics>0)sign='+';
		$(this).html(' ('+sign+dynamics+')');
	});
}

function drawGraph(data){
	var dataToShow=[];
	var title="Посещаемость сайта конторы";
	var titleArray=[];
	var seriesArray=[];
	
	for (var m=0;m<data.length;m++){
		seriesArray.push({valueField:data[m],name:data[m]});
	}
	
	  var chart = $("#chart").dxChart({
        palette: "red",
        dataSource: data,
        commonSeriesSettings: {
            type: "spline",
            argumentField: "date"
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
}