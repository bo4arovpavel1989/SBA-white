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
						$('.lastCommentsContainer').empty();
						$('#reputationData').empty();
						calculateDynamics(data);
				}
		});
	});
}

function calculateDynamics(data){
	console.log(data);
	var commentObject={comments:data.lastComments,example:'vvsvddv'};
    var templateComment = Handlebars.compile( $('#lastComments').html() );
	var commentHTML=templateComment(commentObject);
	$('.lastCommentsContainer').append( commentHTML );
	var feedbacks=data.feedback;
	var stat={};
	var sources=[];
	feedbacks.forEach(function(feedback){
		if(sources.indexOf(feedback.source)===-1) {
			sources.push(feedback.source);
			stat[feedback.source]={total:0,isPositive:0,isNegative:0,isNeutral:0,usermark:feedback.usermark}
		}
		if(feedback.isPositive)stat[feedback.source].isPositive++; 
		if(feedback.isNegative)stat[feedback.source].isNegative++; 
		if(feedback.isNeutral)stat[feedback.source].isNeutral++; 
		stat[feedback.source].total++;
	});
	
	for (var source in stat){
		var data={
			source:source,
			total:stat[source].total,
			positive:stat[source].isPositive,
			negative:stat[source].isNegative,
			neutral:stat[source].isNeutral,
			usermark:stat[source].usermark
			};
		var templateFeedback = Handlebars.compile( $('#feedbackSources').html() );
		var feedbackHTML=templateFeedback(data);
		$('#reputationData').append( feedbackHTML );	
		console.log(data)
	}
}
