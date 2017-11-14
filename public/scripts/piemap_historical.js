var filter=[];
var points=[];
$(document).ready(function(){
	var checkMapLoading = setInterval(function(){ checkingMap() }, 1000);

	function checkingMap() {
		try{
		if(ymaps){
			stopChecking();
			startAll();	
		}
		}catch(e){}
	}

	function stopChecking() {
		clearInterval(checkMapLoading);
	}
		
});

function startAll(){
	$('.loader').removeClass('loading');
	$('#chooseBkAndTime').show(400);
}
