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
						$('#lastCommentsContainer').empty();
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
	$('#lastCommentsContainer').append( commentHTML );
	var nowFeedback=data.to;
	var firstFeedback=data.from;
	var sourcesNow=[];
	var sourcesFirst=[];
	var nowStats={};
	var firstStats={};
	var dynamicsStat={};
	nowFeedback.forEach(function(feedback){
		if(sourcesNow.indexOf(feedback.source)===-1) {
			sourcesNow.push(feedback.source);
			nowStats[feedback.source]={isPositive:0,isNegative:0,isNeutral:0}
		}
	});
	firstFeedback.forEach(function(feedback){
		if(sourcesFirst.indexOf(feedback.source)===-1) {
			sourcesFirst.push(feedback.source);
			firstStats[feedback.source]={isPositive:0,isNegative:0,isNeutral:0}
		}
	});
	nowFeedback.forEach(function(feedback){
		if(feedback.isPositive)nowStats[feedback.source].isPositive++; 
		if(feedback.isNegative)nowStats[feedback.source].isNegative++; 
		if(feedback.isNeutral)nowStats[feedback.source].isNeutral++; 
	});
	firstFeedback.forEach(function(feedback){
		if(feedback.isPositive)firstStats[feedback.source].isPositive++; 
		if(feedback.isNegative)firstStats[feedback.source].isNegative++; 
		if(feedback.isNeutral)firstStats[feedback.source].isNeutral++; 
	});
	for(var property in nowStats){
		dynamicsStat[property]={};
		firstStats[property] = firstStats[property] ?  firstStats[property] : {isPositive:0,isNegative:0,isNeutral:0};
		dynamicsStat[property].isPositive=nowStats[property].isPositive - firstStats[property].isPositive;
		dynamicsStat[property].isNegative=nowStats[property].isNegative - firstStats[property].isNegative;
		dynamicsStat[property].isNeutral=nowStats[property].isNeutral - firstStats[property].isNeutral;
	}
	console.log(dynamicsStat);
	console.log(nowStats);
}
