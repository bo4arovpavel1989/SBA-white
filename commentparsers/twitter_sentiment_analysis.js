var util = require('util'),
    twitter = require('twitter'),
    sentimentAnalysis = require('./sentimentAnalysis'),
	apiKey=require('./../credentials.js').secret.twitter;
	Comment = require('./../lib/models/mongoModel.js').Comment;

var config = apiKey;




 function analyze(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = []; // to store the tweets and sentiment

  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};

      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      dbData.push({
        tweet: resp.tweet.text,
        score: resp.sentiment.score
      });
      response.push(resp);
    };
    callback(response);
  });
}