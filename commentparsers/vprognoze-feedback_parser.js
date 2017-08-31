var bks = ['19-bukmekerskaya-kontora-leonbets.html', 
'33-fonbet-bukmekerskaya-kontora.html', 
'28-bukmekerskaya-kontora-1x-stavka.html', 
'888', 
'winline', 
'olimp', 
'27-bukmekerskaya-kontora-liga-stavok.html', 
'betcity',
'baltbet'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules

var https = require('https');
var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Feedback = require('./../lib/models/mongoModel.js').Feedback;
var apiKey=require('./../credentials.js').secret.translateAPIKey;
var analyze = require('sentiment');
console.log('vprognoze_parser');

String.prototype.replaceAll = function(search, replace){
  return this.split(search).join(replace);
}

getFeedback(0);

function getFeedback(i){
	if(bks[i]!=='888'||bks[i]!=='winline'||bks[i]!=='olimp'||bks[i]!=='betcity'||bks[i]!=='baltbet')//these bk are not presented in vprognoze.ru
	nightmare
	  .goto('https://vprognoze.ru/rating/'+bks[i])
	  .wait(1500)
	  .evaluate(()=>{
					return document.body.innerHTML;
	   })
	  .then((body)=>{
		  var $ = cheerio.load(body);
		  var marksarray=[];
		  var usermark=0;
		  var sum=0;
		  var bknumer = i;
		  var userMarks=$('.rat_line').get();
		  var date = new Date();
		  userMarks.forEach(marktag=>{
			  try{
				  var mark = marktag.children[1].children[1].children[1].children[3].children[0].data.split('. из')[0];
				  console.log(mark)
				  marksarray.push(Number(mark));
			  }catch(e){console.log(e)}
		  });
		  marksarray.forEach(mark=>{
			  if(!isNaN(mark)){usermark += mark;sum++}
		  });
		  usermark=(usermark/(2*sum)).toFixed(2);//divided by 2 coz i need mark of five points, not of ten
		  let commentsections=$('.comment').get();
		  var control=0;
		  if(commentsections.length>0){
			  commentsections.forEach(section=>{
				  try{
				   let isNegative, isNeutral, isPositive;
					  let feedbackObject=({
							bk: bks_formatted[bknumer].bk,
							source: 'vprognoze.ru',
							type: 'feedback',
							date:date
					  });
					  var feedbackTextToAnalyze=section.children[3].children[5].children[0].data;
					  feedbackTextToAnalyze = feedbackTextToAnalyze.replaceAll(/[^-a-zA-Zа-яА-ЯёЁ0-9 ]/, "");  
						console.log(feedbackTextToAnalyze);
					  translateAndAnalyzeFeedback(encodeURIComponent(feedbackTextToAnalyze),feedbackTextToAnalyze,feedbackObject,(feedbackText, rating, fbobject)=>{
						 console.log(rating);
						 console.log(feedbackText);
						 rating=Number(rating);
						 if (rating <=2&&rating>=-2) {fbobject.isNeutral=true; feedbackObject.neutral = feedbackText;}
						 else if (rating > 2) {fbobject.isPositive=true; feedbackObject.positive = feedbackText;}
						 else if (rating < -2) {fbobject.isNegative=true; feedbackObject.negative = feedbackText;}	
						 console.log(fbobject);
						 fbobject.usermark=usermark;
						 fbobject.feedbackText=feedbackText.slice(0,200);
						 let dataToWrite = new Feedback(fbobject).save((err, rep)=>{
							 control++;
							 if(control==commentsections.length){
								i++;
								if(i<bks.length)getFeedback(i);
								else console.log('done'); 
							 }
						 });
					  });
				  }catch(e){ 
					console.log(e);
					control++;
					 if(control>=commentsections.length){
						i++;
						if(i<bks.length)getFeedback(i);
						else console.log('done'); 
					 }
				 }  
			  });
		  }else{
			i++;
			if(i<bks.length)getFeedback(i);
			else console.log('done');
		  }
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		i++;
		if(i<bks.length)getFeedback(i);
		else console.log('done');
	  });
	else{
		i++;
		getFeedback(i)
	}
}

function translateAndAnalyzeFeedback(feedbackEncoded,original,fbobject,callback){
	var options = {
				host: 'translate.yandex.net',
				port: 443,
				path: '/api/v1.5/tr.json/translate?lang=ru-en&key=' + apiKey +'&text=' + feedbackEncoded,
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
					data=JSON.parse(data);
					let english = data.text[0];
					let score=analyze(english);
					callback(original, score.score,fbobject);
				});
			});
			req.end();
}