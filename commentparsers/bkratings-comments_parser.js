var bks = ['leonbets', 'fonbet', '1h-stavka', '888sport', 'winlinebet',  'olimp-kz', 'liga-stavok','betcity', 'baltbet-tsupis'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules

var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Comment = require('./../lib/models/mongoModel.js').Comment;
console.log('bookmaker-rating_parser');

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('https://bookmaker-ratings.ru/review/obzor-bukmekerskoy-kontory-' + bks[i]+ '/')
	  .wait(1500)
	  .then(()=>{
		  console.log(bks[i]);
		  checkExists('#comments-load-more', i); //check if there is more button on the page. if none - start parsing date
	  })
}

function checkExists(selector, i){
	console.log(1);
	     nightmare.exists(selector) // //check if there is more button on the page. if none - start parsing date
			      .then(result=>{
					if(result)  nightmare.exists('.is-hidden' + selector) //check if more button has hide class. more button has hide class where all feedback is loaded now and its time to start parsing
									     .then(result2=>{
												  if(result2)doGrabbing(i);
												  else nightmare.click(selector) //more button hasnt yet hide class so i click it and start from the beginning
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
		 let comments = $('.comment').get();
		 var date = new Date();
		 console.log(comments.length)
		 comments.forEach(comment=>{
			 try{
				 let isModerator = comment.children[3].children[1].children[1].children[3].children[0].data;
				 if(isModerator !==' Модератор'){
					let commentText = comment.children[3].children[3].children[1].children[0].data;
					let dataToWrite = new Comment({
						bk: bks_formatted[bknumer].bk,
						source: 'bookmaker-ratings.ru',
						type: 'comment',
						comment: commentText,
						date:date
					}).save();		
				 }
				 
			 } catch(e){}
		 });
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });	
}