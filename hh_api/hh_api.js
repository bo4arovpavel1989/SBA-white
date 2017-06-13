var https=require('https');

var bookmakers = encodeURIComponent('букмекерские');
			var options = {
				host: 'api.hh.ru',
				port: 443,
				headers: {'user-agent': 'Mozilla/5.0'},
				path: '/vacancies?text=' + bookmakers,
				method: 'GET'
			};

			var req = https.request(options, function(res) {
				console.log("statusCode: ", res.statusCode);
				console.log("headers: ", res.headers);
				var data='';
				res.on('data', function(d) {
					//process.stdout.write(d);
					data +=d;
				});
				res.on('end', ()=>{
					
					data=JSON.parse(data);
					console.log(data);
				});
			});
			req.end();	