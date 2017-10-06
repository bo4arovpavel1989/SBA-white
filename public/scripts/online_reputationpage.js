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
	var summary={isPositive:0,isNegative:0,isNeutral:0};
	var sources=[];
	feedbacks.forEach(function(feedback){
		if(sources.indexOf(feedback.source)===-1) {
			sources.push(feedback.source);
			stat[feedback.source]={total:0,isPositive:0,isNegative:0,isNeutral:0,usermark:feedback.usermark}
		}
		if(feedback.isPositive){stat[feedback.source].isPositive++;summary.isPositive++}
		if(feedback.isNegative){stat[feedback.source].isNegative++;summary.isNegative++}
		if(feedback.isNeutral){stat[feedback.source].isNeutral++;summary.isNeutral++} 
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
		drawPieGraph(summary);	
		console.log(data)
	}
}

function drawPieGraph(dataSource){
	$('#chartTitle').show();
	console.log(dataSource);
	var dataToVisualize=[];
	for (var marking in dataSource){
		var markingInRussian;
		if (marking=='isPositive') markingInRussian='Положительные';
		if (marking=='isNegative') markingInRussian='Отрицательные';
		if (marking=='isNeutral') markingInRussian='Нейтральные';
		dataToVisualize.push({marking:markingInRussian,value:dataSource[marking]});
	}
	$("#pie").dxPieChart({
        size: {
            width: 1200
        },
        palette: "bright",
        dataSource: dataToVisualize,
        series: [
            {
                argumentField: "marking",
                valueField: "value",
                label: {
                    visible: true,
                    connector: {
                        visible: true,
                        width: 1
                    }
                }
            }
        ],
        title: '',
        "export": {
            enabled: true
        },
        onPointClick: function (e) {
            var point = e.target;
    
            toggleVisibility(point);
        },
        onLegendClick: function (e) {
            var arg = e.target;
    
            toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
        }
    });
    
    function toggleVisibility(item) {
        if(item.isVisible()) {
            item.hide();
        } else { 
            item.show();
        }
    }
}