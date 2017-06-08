var util = require('util'),
    twitter = require('twitter'),
    sentimentAnalysis = require('./sentimentAnalysis'),
	apiKey=require('./../credentials.js').secret.twitter;
	Comment = require('./../lib/models/mongoModel.js').Comment;

var config = apiKey;
console.log(config);

Comment.find({}, (err, reps)=>{
	if(reps){
		reps.forEach(rep=>{
			analyze(rep.engComment, (response)=>{
				console.log('====================');
				console.log(rep.comment);
				console.log(response[0].sentiment);
				console.log('====================');
			});
		});
	}
});

 function analyze(text, callback) {
  let twitterClient = new twitter(config);
  var response = []; // to store the tweets and sentiment
  let options =  { count: 100};
  twitterClient.get('search/tweets', {q:text}, (error, data, resp)=>{
	  console.log(resp);
	  //console.log(data);
	  /*
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};
      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      response.push(resp);
    };
    callback(response);*/
  });
  
}