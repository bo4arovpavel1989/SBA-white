var filter=[];
var points=[];
var myMap, myPlacemark;
$(document).ready(function(){
	var checkMapLoading = setInterval(function(){ checkingMap() }, 1000);

	function checkingMap() {
		try{
		if(ymaps){
			stopChecking();
			startAll();	
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
            center: [55.76, 37.64],
            zoom: 4
        });
	}	
	getHistoricalData();
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
	points=[];
	$.ajax({
		url: '/bkpps_historical/'+year+'/'+month+'/ppscoordinates'+bk+'.json',
		dataType: 'json',
		success: function(data){
			console.log(data);
			data.forEach(function(dat){
				points.push({bk: dat.bk, coords:dat.data.geometry.coordinates, description: dat.data.properties.description});
			});
			drawMapForDate(date[i],function(){
				i++;
				if(i<date.length)getDataForDate(date,i,bk);
			});
		}		
	});
}

function drawMapForDate(date,callback){
	alert(date);
	console.log(points);
	var filterView = document.getElementById("showData");
	filterView.scrollIntoView({block: "start", behavior: "smooth"});
	points.forEach(function(point){
		console.log(point.coords);
        myPlacemark = new ymaps.Placemark(point.coords);
        myMap.geoObjects.add(myPlacemark);
	});
	setTimeout(function(){callback();},5000);
}