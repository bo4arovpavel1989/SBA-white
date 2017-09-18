var bks = ['topic-65850381_33876754', 
'topic-65850381_33876856', 
'topic-65850381_34381780', 
'888', 
'topic-65850381_33876848', 
'topic-65850381_33876835', 
'topic-65850381_33876915', 
'topic-65850381_33876927',
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
	if(bks[i]!=='888'||bks[i]!=='baltbet')//these bk are not presented in zheleznaya stavka
	nightmare
	  .goto('https://vk.com/'+bks[i])
	  .wait(1500)
	  .exists('#bt_pages > a:nth-child(4)') // //check if there is more button on the page. if none - start parsing date
	  .then(result=>{
					if(result)  nightmare.click('#bt_pages > a:nth-child(4)')
										 .wait(1500)
										 .then(()=>{doGrabbing(i)})
					else doGrabbing(i);								
				});
	else{
		i++;
		getFeedback(i)
	}			
}				
	  
	  
function doGrabbing(i)	 { 
	  nightmare
	  .evaluate(()=>{
					return document.body.innerHTML;
	   })
	  .then((body)=>{
		  var $ = cheerio.load(body);
		  var bknumer = i;
		  var date = new Date();
		  let commentsections=$('div.bp_text').get();
		  var control=0;
		  if(commentsections.length>0){
			  commentsections.forEach(section=>{
				  try{
				   let isNegative, isNeutral, isPositive;
					let feedbackObject=({
						bk: bks_formatted[bknumer].bk,
						source: 'zheleznaya stavka (VK)',
						type: 'feedback',
						date:date
					});
					var feedbackTextToAnalyze=section.children[0].data;
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