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
				},
				error:function(e){
					$('.loader').removeClass('loading');
					document.getElementById('showData').disabled = false;
					if(e)alert('Ошибка!');
				}
		});
	});
}

function calculateDynamics(){
	try{
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
			var dynamics=(((now-first)/(first))*100).toFixed(2);
			var sign='';
			if(dynamics>0){
				sign='+';
				$(this).addClass('positiveDynamics');
			} 
			else if(dynamics<0) $(this).addClass('negativeDynamics');
			$(this).html(' ('+sign+dynamics+'%)');
		});
	}catch(e){
		alert('Данные за вторую дату выборки отсутствуют')
	}
}

function drawGraph(data){
	$('#chartTitle').show();
	for (var i=0;i<data.length;i++){
		try{
			data[i].data=data[i].data.replace('K','000').replace('M','000000');
			data[i].data=data[i].data.match(/\d{1}/g).join('');
			data[i].data=parseInt(data[i].data);
			data[i].data=(data[i].data)/1000;
		}catch(e){}
	}
	console.log(data);
	 $("#chart").dxChart({
        dataSource: data, 
        series: {
            argumentField: "date",
            valueField: "data",
            name: "Посещаемость (тыс. визитов)",
            type: "bar",
            color: '#1DF7AA'
        }
    });
	
}