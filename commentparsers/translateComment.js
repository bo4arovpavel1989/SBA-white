var https = require('https');
var Comment = require('./../lib/models/mongoModel.js').Comment;
var apiKey=require('./../credentials.js').secret.translateAPIKey;
console.log(apiKey);

translateTransaction(0, 100);

function translateTransaction (skip, limit){
	Comment.find({}).skip(skip).limit(limit).exec((err, reps)=>{
	if(reps){
		var counter = skip+1;
		reps.forEach(rep=>{
			console.log(rep.comment)
			var id = rep._id;
			rep.comment = encodeURIComponent(rep.comment);
			
			var options = {
				host: 'translate.yandex.net',
				port: 443,
				path: '/api/v1.5/tr.json/translate?lang=ru-en&key=' + apiKey +'&text=' + rep.comment,
				method: 'POST'
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
					data=JSON.parse(data);
					let english = data.text[0];
					Comment.update({_id: id}, {$set:{engComment: english}}).exec();
					counter++;
					if(counter==limit-1){console.log('next round');translateTransaction(skip+100, limit+100);}
					}catch(e){
						counter++;
						if(counter==limit-1){console.log('next round');translateTransaction(skip+100, limit+100);}
						}
				});
			});
			req.end();	
		});	
	} else {console.log('end')}
	});
}

 