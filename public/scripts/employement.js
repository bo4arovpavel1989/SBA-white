$(document).ready(function(){
	submitHandler();
});

function submitHandler(){
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
							console.log(data);
							$('#tiles').empty();
							showVacancies(data);
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
};
