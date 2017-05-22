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
		  checkExists('#get-feedbacks-list', i);
	  })
}

function checkExists(selector, i){
	console.log(1);
	     nightmare.exists(selector)
			      .then(result=>{
					if(result)  nightmare.exists('.hide' + selector)
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
		 let date = feedback.children[1].children[5].children[1].children[1].children[0].data;
		 let comments = feedback.children[3].children;
		 comments.forEach(comment=>{
			 try {
				 if (comment.attribs.class==='cons'){
					 let consString = comment.children[3].children[0].data.split('\n')[1].slice(20)
					 console.log(consString)
				 }
				 if (comment.attribs.class==='pros'){
					 let prosString = comment.children[3].children[0].data.split('\n')[1].slice(20);
					 console.log(prosString)
				 }
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