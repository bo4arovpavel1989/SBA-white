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
	  .wait(1500)
	  .then(()=>{
		  console.log(bks[i]);
		  checkExists('#get-feedbacks-list', i); //check if there is more button on the page. if none - start parsing date
	  })
}

function checkExists(selector, i){
	console.log(1);
	     nightmare.exists(selector) // //check if there is more button on the page. if none - start parsing date
			      .then(result=>{
					if(result)  nightmare.exists('.hide' + selector) //check if more button has hide class. more button has hide class where all feedback is loaded now
									     .then(result2=>{
												  if(result2)doGrabbing(i);
												  else nightmare.click(selector)
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
		 let feedbacks=$('.feedback').get();
		 console.log(bks[i] + ' ' + feedbacks.length)
		 feedbacks.forEach(feedback=>{
		 var date = feedback.children[1].children[5].children[1].children[1].children[0].data;
		 console.log(date);
		 let comments = feedback.children[3].children;
		 comments.forEach(comment=>{
			 let isPositive, isNegative, prosString, consString;
			 isPositive=false;
			 isNegative=false;
			 try {
				 if (comment.attribs.class==='cons'){
					 isNegative=true;
					 consString = comment.children[3].children[0].data.split('\n')[1].slice(20)//string starts from about 20 space symbols
				 }
				 if (comment.attribs.class==='pros'){
					 isPositive=true;
					 prosString = comment.children[3].children[0].data.split('\n')[1].slice(20);//string starts from about 20 space symbols
				 }
				 let feedback = new Feedback({
					 bk: bks_formatted[i], 
					 type: 'feedback', 
					 date: date, 
					 isPositive: isPositive, 
					 isNegative: isNegative,
					 positive: prosString,
					 negative: consString
				 }).save();
			 } catch(e){}
		 });
		 });
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });
	
	
}