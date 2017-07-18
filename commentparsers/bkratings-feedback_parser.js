var bks = ['fonbet', 'leonbets', '888sport', 'liga-stavok', '1h-stavka', 'olimp-kz', 'winlinebet', 'betcity', 'baltbet-tsupis'];
var bks_formatted=['fonbet', 'leon', 'bk888', 'ligastavok', 'bk1xbet', 'olimp', 'winline', 'betcity', 'baltbet']; //bk names as i use it in ither modules


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Feedback = require('./../lib/models/mongoModel.js').Feedback;
console.log('bookmaker-rating_parser');

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('https://bookmaker-ratings.ru/review/obzor-bukmekerskoy-kontory-' + bks[i]+ '/all-feedbacks/')
	  .wait(1500)
	  .then(()=>{
		  console.log(bks[i]);
		  checkExists('#all-feedbacks-more-btn', i); //check if there is more button on the page. if none - start parsing date
	  })
}

function checkExists(selector, i){
	console.log(1);
	     nightmare.exists(selector) // //check if there is more button on the page. if none - start parsing date
			      .then(result=>{
					if(result)  nightmare.exists('.disabled' + selector) //check if more button has hide class. more button has hide class where all feedback is loaded now and its time to start parsing
									     .then(result2=>{
												  if(result2)doGrabbing(i);
												  else nightmare.click(selector + '>span') //more button hasnt yet hide class so i click it and start from the beginning
																.wait(3000)
																.then(()=>{checkExists(selector, i)})
											  })
					else doGrabbing(i);								
				});
}

function doGrabbing(i){
	nightmare.evaluate(()=>{
						return document.body.innerHTML;
					})
	  .then(function (body) {
		  console.log(2);
		 var $ = cheerio.load(body);
		 var bknumer = i;
		 let feedbacks=$('.single').get();
		 console.log(feedbacks.length);
		 feedbacks.forEach(feedback=>{
			 try {
				 let isNegative, isNeutral, isPositive;
				 let feedbackObject=({
					bk: bks_formatted[bknumer],
					source: 'bookmaker-ratings.ru',
					type: 'feedback'
				 });
				 let rating=feedback.children[1].children[5].children[3].children[0].data;
				 rating=Number(rating);
				 let feedbackText=feedback.children[3].children[3].children[0].children[0].data;
				 let date = feedback.children[5].children[1].children[0].data;
				 date=date.replace('в', '');
				 if (rating == 3) {feedbackObject.isNeutral=true; feedbackObject.neutral = feedbackText;}
				 else if (rating > 3) {feedbackObject.isPositive=true; feedbackObject.positive = feedbackText;}
				 else if (rating < 3) {feedbackObject.isNegative=true; feedbackObject.negative = feedbackText;}	
				 feedbackObject.date=date;	
				 let dataToWrite = new Feedback(feedbackObject).save();
				 console.log(date)
			 } catch(e){}
		 });
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });	
}