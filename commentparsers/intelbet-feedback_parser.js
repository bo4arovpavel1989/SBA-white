var bks = ['fon', 'bk-leon', '888', 'liga-stavok', '1xstavka', 'bk-olimp', 'winline', 'bk-betcity', 'bk-baltbet'];
var bks_formatted=['fonbet', 'leon', '888', 'ligastavok', '1xstavka', 'olimp', 'winline', 'betcity', 'baltbet'];


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Feedback = require('./../lib/models/mongoModel.js').Feedback;
console.log('intelbet_parser');

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('http://www.intelbet.ru/feedback/' + bks[i] + '/')
	  .exists('#get-feedbacks-list')
	  .then(result=>{
		  if(result) return nightmare.click('#get-feedbacks-list')
									 .wait(3000)
									 .exists('#get-feedbacks-list')
									 .then(result2=>{
										 if (result2) return nightmare.click('#get-feedbacks-list')
																	  .wait(3000)
																	  .evaluate(()=>{
																		  return document.body.innerHTML
																	  })
										 else return nightmare.evaluate(()=>{
														 return document.body.innerHTML;
													 });
									 })					 
		  else return nightmare.evaluate(()=>{
										 return document.body.innerHTML;
									 });						 
	  })
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 let feedbacks=$('.feedback').get();
		 console.log(bks[i] + ' ' + feedbacks.length)
		 feedbacks.forEach(feedback=>{
			console.log(feedback) 
		 });
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });
}

