var https = require('https');
var secret=require('./../credentials.js').secret;
var token=secret.vkapi.access_token;

getGroup();

function getWall (){
			var options = {
				host: 'api.vk.com',
				port: 443,
				path: '/method/wall.get?domain=fonbet&access_token='+token+'&v=5.52',
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
					try {
					console.log(data);
					}catch(e){
						}
				});
			});
			req.end();	
}

function getGroup(){
	var options = {
				host: 'api.vk.com',
				port: 443,
				path: '/method/groups.getById?group_id=fonbet&fields=members_count,counters,activity&access_token='+token+'&v=5.52',
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
					try {
					console.log(data);
					}catch(e){
						}
				});
			});
			req.end();
}
 