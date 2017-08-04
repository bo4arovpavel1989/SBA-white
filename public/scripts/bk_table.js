$(document).ready(function(){
	addToFilterTableHandler();
	resetTable();
});

function addToFilterTableHandler(){
	$('#addToFilterTable').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		document.getElementById('showTable').disabled = true;
		$('.loader').addClass('loading');
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(html){
						$('.loader').removeClass('loading');
						document.getElementById('showTable').disabled = false;
						$('#bk_table').append(html);
						calculateDynamics();
				}
		});
		
	});
}

function calculateDynamics(){	
	var lines=$('.uncalculated').each(function(){
		var first=$(this).prev().prev().data('value');
		var second=$(this).prev().data('value');
		first=Number(first);
		second=Number(second);
		var diff = second - first;
		var relation=0;
		if(first>0) {
			relation= (diff/first) * 100;
			relation=relation.toFixed( 2 );
		}else relation='n/a';	
		var sign='';
		var sign2='';
		if (relation>0) sign='+';
		if(diff>0)sign2 = '+';
		$(this).html(sign2+diff+' ('+sign+relation+'%)');
		$(this).removeClass('uncalculated');
	});
}

function resetTable(){
	$('#resetTable').on('click', function(){
		$("#bk_table").empty();
	});
}