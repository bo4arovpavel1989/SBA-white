var bks = ['leon', 'fonbet', '1xstavka', '888', 'winline', 'olimp', 'ligastavok', 'betcity', 'baltbet'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules

var https = require('https');
var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Feedback = require('./../lib/models/mongoModel.js').Feedback;
var apiKey=require('./../credentials.js').secret.translateAPIKey;
var analyze = require('sentiment');
console.log('vprognoze_parser');

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('https://vprognoze.ru/rating/19-bukmekerskaya-kontora-leonbets.html')
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
		  usermark=(usermark/sum).toFixed(2);
		  let commentSection=$('.comment').get();
		  commentSection.forEach(section=>{
			  try{
			   let isNegative, isNeutral, isPositive;
				  let feedbackObject=({
						bk: bks_formatted[bknumer].bk,
						source: 'vprognoze.ru',
						type: 'feedback',
						date:date
				  });
				  var feedbackText=section.children[3].children[5].children[0].data;
				  console.log(feedbackText);
				  //TODO - translate and analyze text. Judging on analyze data referr feedback to either Positive negative or neutral
			  }catch(e){console.log(e)}  
		  });
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		i++;
		if(i<bks.length)getFeedback(i);
		else console.log('done');
	  });
	
}

function translateAndAnalyzeFeedback(feedback,callback){
	var options = {
				host: 'translate.yandex.net',
				port: 443,
				path: '/api/v1.5/tr.json/translate?lang=ru-en&key=' + apiKey +'&text=' + feedback,
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
					callback(score);
				});
			});
			req.end();
}