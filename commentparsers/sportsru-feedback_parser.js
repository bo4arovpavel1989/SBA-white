var bks = ['fonbet', 'leon', '888', 'ligastavok', '1xstavka', 'olimp', 'winline', 'betcity', 'baltbet'];
var bks_formatted=['fonbet', 'leon', 'bk888', 'ligastavok', 'bk1xbet', 'bkolimp', 'winline', 'betcity', 'baltbet']; //bk names as i use it in ither modules


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Feedback = require('./../lib/models/mongoModel.js').Feedback;
console.log('sportsru_parser');

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('https://www.sports.ru/betting/ratings/'+bks[i]+'/feedbacks/')
	  .wait(1500)
	  .evaluate(()=>{
					return document.body.innerHTML;
	   })
	  .then((body)=>{
		  var $ = cheerio.load(body);
		  var userMark=$('.bets-stars').get()[0].attribs['data-rating'];
		  var date = new Date();
		  console.log(userMark)
		  var bknumer = i;
		  var commentsections=$('div.bets-feedback-item').get();
		  var control=0;
		  commentsections.forEach(section=>{
			  try{
				  let isNegative, isNeutral, isPositive;
				  let feedbackObject=({
						bk: bks_formatted[bknumer],
						source: 'sports.ru',
						type: 'feedback',
						date:date
				  });
				  let rating=section.children[3].children[1].children[4].children[3].attribs['data-rating'];
				  //console.log(rating)
				  let feedBackText='';
				  let feedBackTextArray=section.children[3].children[3].children;
				  feedBackTextArray.forEach(tag=>{
					  feedBackText +=tag.data;
				  });
				  //console.log(feedBackText)
				  rating=Number(rating);
				 if (rating == 3) {feedbackObject.isNeutral=true; feedbackObject.neutral = feedBackText;}
				 else if (rating > 3) {feedbackObject.isPositive=true; feedbackObject.positive = feedBackText;}
				 else if (rating < 3) {feedbackObject.isNegative=true; feedbackObject.negative = feedBackText;}	
				 console.log(feedbackObject);
				 let dataToWrite = new Feedback(feedbackObject).save((err, rep)=>{
					 control++;
					 if(control==commentsections.length){
						i++;
						if(i<bks.length)getFeedback(i);
						else console.log('done'); 
					 }
				 });
			  }catch(e){
					control++;
					 if(control==commentsections.length){
						i++;
						if(i<bks.length)getFeedback(i);
						else console.log('done'); 
					 }}
		  });
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		i++;
		if(i<bks.length)getFeedback(i);
		else console.log('done');
	  });
	
}

