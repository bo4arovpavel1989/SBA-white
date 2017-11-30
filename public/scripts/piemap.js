(function(){
	var filter=[];
	var points=[];
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
		addToFilter();
		showOnMap();
		resetMap();
	}
		
	function addToFilter(){
		$('#addToFilter').on('submit', function(e){
			e.preventDefault();
			month=$('#monthSelect').val();
			year=$('#yearSelect').val();
			let bk = $('#bkSelect').val();
			let bkname=$('#bkSelect').data('name');
			if (filter.indexOf(bk) == -1)
			{
				filter.push(bk);
				$('#bkFilterList').append(' <span class="bkinfilter" onclick="deleteFromFilter($(this));"data-name="'+bk+'">'+bk+'</span>');
				
			}
		});
	}

	function showOnMap(){
		$('#showMap').on('click', function(){
			$('#map').empty();
			console.log(filter);
			getPoints(filter, function(ready){
				if(ready) drawMap();
			});
		});
	}

	function resetMap(){
		$('#resetMap').on('click', function(){
			$("#tabsData").empty();
				$.ajax({
					url: '/getofflinecomponent/offline_map',
					success: function(html){
								$("#tabsData").append(html);
							}
				});
		});
	}

	function deleteFromFilter(spanTag){
			let bkToDelete=spanTag.data('name');
			console.log(bkToDelete);
			spanTag.remove();
			let index = filter.indexOf(bkToDelete);
			filter.splice(index,1);
			console.log(filter)
	}

	function getPoints(bks, callback){
		var counter = bks.length;
		bks.forEach(function(bk){
		$.ajax({
			url: '/bkpps/ppscoordinates'+bk+'.json',
			dataType: 'json',
			success: function(data){
				data.forEach(dat=>{
					points.push({bk: dat.bk, coords:dat.data.geometry.coordinates, description: dat.data.properties.description});
				})
				counter--;
				if (counter==0)callback(true);
			}		
		});
		});
	}

	function drawMap(){
		var filterView = document.getElementById("addToFilter");
		filterView.scrollIntoView({block: "start", behavior: "smooth"});
		$('#bkFilterList').empty();
		var colorsFilter=[];
		var myMap = new ymaps.Map('map', {
			  center: [55.751574, 37.573856],
			  zoom: 9
		  }, {
			  searchControlProvider: 'yandex#search'
		  }),
		  // Значения цветов иконок.
		  placemarkColors = [
			'#DB425A', '#4C4DA2', '#00DEAD', '#D73AD2',
			'#F8CC4D', '#F88D00', '#AC646C', '#548FB7',
			'#DB355A', '#4C32A2', '#03DEA3', '#D73AD2',
			'#F8CC4D', '#F88D00', '#AC326C', '#548FB7',
			'#Df259A', '#424DA2', '#0223AD', '#D73AD2',
			'#F2693D', '#F86D00', '#AA646C', '#AC8F77'
			],
			clusterer = new ymaps.Clusterer({
				// Макет метки кластера pieChart.
				clusterIconLayout: 'default#pieChart',
				// Радиус диаграммы в пикселях.
				clusterIconPieChartRadius: 25,
				// Радиус центральной части макета.
				clusterIconPieChartCoreRadius: 10,
				// Ширина линий-разделителей секторов и внешней обводки диаграммы.
				clusterIconPieChartStrokeWidth: 3
			}),
			geoObjects = [];

		for (var i = 0, len = points.length; i < len; i++) {
			geoObjects[i] = new ymaps.Placemark(points[i].coords, {}, {
				iconColor: getColor(points[i].bk)
			});
		}

		clusterer.add(geoObjects);
		myMap.geoObjects.add(clusterer);

		myMap.setBounds(clusterer.getBounds(), {
			checkZoomRange: true
		});
		
	function getColor(bk) {
			var indexNum=filter.indexOf(bk);
			if(colorsFilter.indexOf(bk) == -1){
				colorsFilter.push(bk);
				$('#bkFilterList').append('<li style="color:'+placemarkColors[indexNum]+';display:inline;">'+bk+'&emsp;</li>')
			}
			return placemarkColors[indexNum];
		}
	}	
})();