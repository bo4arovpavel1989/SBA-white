//global functions here
function cityAutocomplete(){
	$.ajax({
			url: '/autocomplete/city',	
			dataType: 'json',
			success: function(data){
					var ac = $('#cityChoose').autocomplete({ 
						source: data.cities,
						minLength: 3
					});
			},
			error:function(data){
				console.log(data);
			}
		});
}
