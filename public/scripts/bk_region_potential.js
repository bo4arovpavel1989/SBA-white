$(document).ready(function(){
	addToFilterTableRPHandler();
});

function addToFilterTableRPHandler(){
	$('#addToFilterRegionPotential').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		document.getElementById('showTableRP').disabled = true;
		$('.loader').addClass('loading');
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(html){
						$('.loader').removeClass('loading');
						document.getElementById('showTableRP').disabled = false;
						$('#bk_table_rp').append(html);
				}
		});
		
	});
}



function resetTable(){
	$('#resetTable').on('click', function(){
		$("#bk_table_rp").empty();
	});
}