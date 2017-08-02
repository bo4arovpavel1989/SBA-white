$(document).ready(function(){
	addToFilterTableRPHandler();
	resetTableRP();
	getCitiesOfRegion();
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



function resetTableRP(){
	$('#resetTableRP').on('click', function(){
		$("#bk_table_rp").empty();
	});
}

function getCitiesOfRegion(){
	$('#regionChoose').on('change',function(){
		var region=$('#regionChoose').val();
		console.log(region);
		$.ajax({
			url:'/getcitiesofregion?region='+encodeURIComponent(region),
			dataType: 'html',
			success:function(html){
				console.log(html);
				$('#cityChoose').empty();
				$('#cityChoose').append(html);
			}
		});
	});
}