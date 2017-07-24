$(document).ready(function(){
	addToFilterTableHandler();
});

function addToFilterTableHandler(){
	$('#addToFilterTable').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				success: function(html){
						$('#bk_table').empty();
						$('#bk_table').append(html);
						calculateDynamics();
				}
		});
		
	});
}

function calculateDynamics(){
	var first=$('#yearFromVal').data('value');
	var second=$('#yearToVal').data('value');
	first=Number(first);
	second=Number(second);
	var diff = second - first;
	var relation = (diff/first) * 100;
	relation=relation.toFixed( 2 );
	var sign='';
	if (relation>0) sign='+';
	$('#dynamics').html(sign+relation+'%');
}