$(document).ready(function(){
	var j=0;
	getMoreNews(j);
});

function getMoreNews(i){
	$('moreNews').on('click',function(e){
		e.preventDafault();
		i=i+1;
		$('.loader').addClass('loading');
		$.ajax({
			url:'/marketpulse?q='+i,
			success:function(data){
				$('#tiles')append(data);
				$('.loader').removeClass('loading');
			}
		});
	});
}