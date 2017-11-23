var myMap, myPlacemark, heatMap;
$(document).ready(function(){
	var checkMapLoading = setInterval(function(){ checkingMap() }, 1000);

	function checkingMap() {
		try{
		if(ymaps){
			stopChecking();
			setTimeout(startAll(),1000);
		}
		}catch(e){}
	}

	function stopChecking() {
		clearInterval(checkMapLoading);
	}
		
});

function startAll(){
	$('.loader').removeClass('loading');
	$('#formToHide').show(400);
	ymaps.ready(init);

    function init(){     
        myMap = new ymaps.Map("map", {
            center: [55.76, 77.64],
            controls: ['zoomControl', 'typeSelector',  'fullscreenControl'],
            zoom: 3.45
        });
		createHeatMap(function(rep){
			heatMap=rep;
			getHistoricalData();
		});
	}	
}

function createHeatMap(callback){
	ymaps.modules.require(['Heatmap'], function (Heatmap) {
		alert(1);
		var data = [],
		   gradients = [{
                    0.1: 'rgba(128, 255, 0, 0.7)',
                    0.2: 'rgba(255, 255, 0, 0.8)',
                    0.7: 'rgba(234, 72, 58, 0.9)',
                    1.0: 'rgba(162, 36, 25, 1)'
                }, {
                    0.1: 'rgba(162, 36, 25, 0.7)',
                    0.2: 'rgba(234, 72, 58, 0.8)',
                    0.7: 'rgba(255, 255, 0, 0.9)',
                    1.0: 'rgba(128, 255, 0, 1)'
                }],
                radiuses = [5, 10, 20, 30],
                opacities = [0.4, 0.6, 0.8, 1];
			heatmap = new Heatmap(data,{
				gradient: gradients[0],
                radius: radiuses[1],
                opacity: opacities[2]
			});
		console.log(data);	
		heatmap.setMap(myMap);
		callback(heatmap);
	});
}


function getHistoricalData(){
	$('#chooseBkAndTime').on('submit',function(e){
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
				success: function(data){
					$('.loader').removeClass('loading');
					document.getElementById('showData').disabled = false;
					drawHistoricalMap(data);
				},
				error:function(e){
					$('.loader').removeClass('loading');
					if(e)alert('Ошибка!');
					document.getElementById('showData').disabled = false;
				}
		});
	});
}

function drawHistoricalMap(data){
	console.log(data);
	getDataForDate(data.dates,0,data.bk);
}

function getDataForDate(date,i,bk){
	var year=date[i].split('-')[0];
	var month=date[i].split('-')[1];
	var points=[];
	$.ajax({
		url: '/bkpps_historical/'+year+'/'+month+'/ppscoordinates'+bk+'.json',
		dataType: 'json',
		success: function(data){
			data.forEach(function(dat){
				points.push(dat.data.geometry.coordinates);
			});		
			drawMapForDate(points, date[i],function(){
				i++;
				if(i<date.length)getDataForDate(date,i,bk);
			});
		}		
	});
}

function drawMapForDate(points, date,callback){
	setTimeout(cssDateShow(date),1000);
	var filterView = document.getElementById("divHeaderLine1");
	filterView.scrollIntoView({block: "start", behavior: "smooth"});
	heatMap.setData(points);
	setTimeout(function(){callback();},5000);
}

function cssDateShow(str){
	var month=str.split('-')[1];
	var year=str.split('-')[0];
	$('.dateshow').text(year+' - '+month);
	$('.dateshow').removeClass('hidden');
	$('.dateshow').addClass('spread');
	setTimeout(function(){
		$('.dateshow').addClass('hidden');
		$('.dateshow').removeClass('spread');	
		$('.dateshow').empty();
	},3000)
}