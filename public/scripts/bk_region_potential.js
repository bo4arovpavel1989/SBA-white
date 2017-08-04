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
						calculateCoefficient();
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
		var month=$('#month').val();
		var year=$('#year').val();
		console.log(region);
		$.ajax({
			url:'/getcitiesofregion?region='+encodeURIComponent(region)+'&month='+encodeURIComponent(month)+'&year='+year,
			dataType: 'html',
			success:function(html){
				console.log(html);
				$('#cityChoose').empty();
				$('#cityChoose').append(html);
			}
		});
	});
}

function calculateCoefficient(){
	$('.uncalculated').each(function(){
		var salary=$(this).data('salary');
		var allBkRelation=$(this).data('allbkrelation');
		var bkRelation=$(this).data('bkrelation');
		var sportPopularity=$(this).data('sportpopularity');
		var bkPopularity=$(this).data('bkpopopularity');
		var coefficient;
		if(bkRelation=='-'){//for all bk
			try{
				coefficient=((Number(salary)/1000)+Number(sportPopularity))/(1+Number(allBkRelation));
				coefficient=coefficient.toFixed(2);
			}catch(e){coefficient='Ошибка!'}
		}
		$(this).html(coefficient);
		$(this).removeClass('uncalculated');
	});
}