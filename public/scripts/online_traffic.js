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
						$('#trafficDataContainer').html(html);
				}
		});
	});
}