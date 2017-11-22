var filter=[];
var points=[];
var prevPoints=[];
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
            center: [55.76, 77.64],
            zoom: 3.3
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
	prevPoints=prevPoints.concat(points);
	points=[];
	$.ajax({
		url: '/bkpps_historical/'+year+'/'+month+'/ppscoordinates'+bk+'.json',
		dataType: 'json',
		success: function(data){
			console.log(data);
			console.log(prevPoints);
			data.forEach(function(dat){
				var isNewPoint=true;
				for (var i=0;i<prevPoints.length;i++){
					if(dat.data.geometry.coordinates[0]==prevPoints[i].coords[0]&&dat.data.geometry.coordinates[1]==prevPoints[i].coords[1]){isNewPoint=false;break;}
				}
				if(isNewPoint)points.push({bk: dat.bk, coords:dat.data.geometry.coordinates});
			});
			drawMapForDate(date[i],function(){
				i++;
				if(i<date.length)getDataForDate(date,i,bk);
			});
		}		
	});
}

function drawMapForDate(date,callback){
	setTimeout(cssDateShow(date),1000);
	var filterView = document.getElementById("divHeaderLine1");
	filterView.scrollIntoView({block: "start", behavior: "smooth"});
	points.forEach(function(point){
        myPlacemark = new ymaps.Placemark(point.coords);
        myMap.geoObjects.add(myPlacemark);
	});
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