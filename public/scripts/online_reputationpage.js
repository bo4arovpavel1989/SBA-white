$(document).ready(function(){
	showReputationDataHandler();
});

function showReputationDataHandler(){
	$('#showReputationData').on('submit',function(e){
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
						document.getElementById('showData').disabled = false;
						console.log(data);
						$('#reputationDataContainer').empty();
						calculateDynamics(data);
				}
		});
	});
}

function calculateDynamics(data){
	var commentObject={comments:data.lastComments,example:'vvsvddv'};
	console.log(commentObject);
    var templateComment = Handlebars.compile( $('#lastComments').html() );
	var commentHTML=templateComment(commentObject);
	$('#reputationDataContainer').append( commentHTML );
}
