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
						drawHistoricalMap(data);
				},
				error:function(e){
					$('.loader').removeClass('loading');
					if(e)alert('Ошибка!');
				}
		});
	});
}

function drawHistoricalMap(data){
	console.log(data);
}