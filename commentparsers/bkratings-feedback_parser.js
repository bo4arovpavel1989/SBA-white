var bks = ['leonbets', 'fonbet', '1h-stavka', '888sport', 'winlinebet', 'olimp-kz', 'liga-stavok', 'betcity', 'baltbet-tsupis'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules

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
		 var usermark;
		 let feedbacks=$('.single').get();
		 console.log(feedbacks.length);
		 try{
			usermark=$('#all-feedbacks > div.block-content > div.top-block > div.rating > span > span.cnt > span').get();
			console.log(usermark[0].children[0].data);
			usermark=usermark[0].children[0].data;
		 }catch(e){}
		 feedbacks.forEach(feedback=>{
			 try {
				 let isNegative, isNeutral, isPositive;
				 let feedbackObject=({
					bk: bks_formatted[bknumer].bk,
					source: 'bookmaker-ratings.ru',
					type: 'feedback'
				 });
				 let rating=feedback.children[1].children[5].children[3].children[0].data;
				 rating=Number(rating);
				 let feedbackText=feedback.children[3].children[3].children[0].children[0].data;
				 let date = new Date();
				 if (rating == 3) {feedbackObject.isNeutral=true; feedbackObject.neutral = feedbackText;}
				 else if (rating > 3) {feedbackObject.isPositive=true; feedbackObject.positive = feedbackText;}
				 else if (rating < 3) {feedbackObject.isNegative=true; feedbackObject.negative = feedbackText;}	
				 feedbackObject.date=date;
				 if(!isNaN(Number(usermark)))feedbackObject.usermark=Number(usermark);
				 feedbackObject.feedbackText=feedbackText.slice(0,200);
				 let dataToWrite = new Feedback(feedbackObject).save();
			 } catch(e){}
		 });
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });	
}