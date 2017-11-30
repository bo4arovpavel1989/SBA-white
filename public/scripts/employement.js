(function(){
	$(document).ready(function(){
		submitHandler();
		cityAutocomplete();
	});

	function submitHandler(){
		$('#addToFilterGraph').on('submit', function(e){
			e.preventDefault();
			document.getElementById('showGraph').disabled = true;
			$('.loader').addClass('loading');
			var city=document.getElementById('cityChoose').value;
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
								$('#tiles').empty();
								showVacancies(data);
								var title={city:city};
								drawGraph(data,title);
							}else alert('Ошибка!');
							$('.loader').removeClass('loading');
							document.getElementById('showGraph').disabled = false;
					}
			});
			
		});
	}

	function showVacancies(data){
		var dataObject={dataItem:data};
		var template = Handlebars.compile( $('#vacanciesList').html() );
		var HTML=template(dataObject);
		$('#tiles').append(HTML);
	}

	function drawGraph(data,title){
		
		$('#chartTitle').show();
		if(title.city.length>0)$('#city').text(' ('+title.city+')');
		
		 var dataArray=[
			 {salary:'<30K rub',vacancies:0},
			 {salary:'30-50k rub',vacancies:0},
			 {salary:'50-70k rub',vacancies:0},
			 {salary:'70-100K rub',vacancies:0},
			 {salary:'100-150K rub',vacancies:0},
			 {salary:'>150K rub',vacancies:0}];
		
		 
		 data.forEach(function(dataItem){
			 dataItem=dataItem.salary.split(' ');
			 if(dataItem[3]=='RUR'){
				 if(!isNaN(parseInt(dataItem[0]))) {
					 if (parseInt(dataItem[0])<30000) dataArray[0].vacancies++;
					 else if (parseInt(dataItem[0])>=30000&&parseInt(dataItem[0])<50000) dataArray[1].vacancies++;
					 else if (parseInt(dataItem[0])>=50000&&parseInt(dataItem[0])<70000) dataArray[2].vacancies++;
					 else if (parseInt(dataItem[0])>=70000&&parseInt(dataItem[0])<100000) dataArray[3].vacancies++;
					 else if (parseInt(dataItem[0])>=100000&&parseInt(dataItem[0])<150000) dataArray[4].vacancies++;
					 else if (parseInt(dataItem[0])>=150000) dataArray[5].vacancies++;
				 }
				  if(!isNaN(parseInt(dataItem[2]))) {
					 if (parseInt(dataItem[2])<30000) dataArray[0].vacancies++;
					 else if (parseInt(dataItem[2])>=30000&&parseInt(dataItem[2])<50000) dataArray[1].vacancies++;
					 else if (parseInt(dataItem[2])>=50000&&parseInt(dataItem[2])<70000) dataArray[2].vacancies++;
					 else if (parseInt(dataItem[2])>=70000&&parseInt(dataItem[2])<100000) dataArray[3].vacancies++;
					 else if (parseInt(dataItem[2])>=100000&&parseInt(dataItem[2])<150000) dataArray[4].vacancies++;
					 else if (parseInt(dataItem[2])>=150000) dataArray[5].vacancies++;
				 }
			 }
		 });
		 
		 $("#chart").dxChart({
			dataSource: dataArray, 
			series: {
				argumentField: "salary",
				valueField: "vacancies",
				name: "Количество вакансий",
				type: "bar",
				color: '#1DF7AA'
			}
		});
	}
})();