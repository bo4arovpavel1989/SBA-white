var bks = ['fonbet', 'leonbets', '888sport', 'liga-stavok', '1h-stavka', 'olimp-kz', 'winlinebet', 'betcity', 'baltbet-tsupis'];
var bks_formatted=['fonbet', 'leon', '888', 'ligastavok', '1xstavka', 'olimp', 'winline', 'betcity', 'baltbet']; //bk names as i use it in ither modules


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Feedback = require('./../lib/models/mongoModel.js').Feedback;
console.log('bookmaker-rating_parser');

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('https://bookmaker-ratings.ru/complaints/?complaint_bookmaker=' + bks[i])
	  .wait(1500)
	  .click('.change-view-btn.list-btn')
	  .wait(1000)
	  .then(()=>{
		  console.log(bks[i]);
		  checkExists('#load-more', i); //check if there is more button on the page. if none - start parsing date
	  })
}

function checkExists(selector, i){
	console.log(1);
	     nightmare.exists(selector) // //check if there is more button on the page. if none - start parsing date
			      .then(result=>{
					if(result)  nightmare.click(selector) //more button hasnt yet hide class so i click it and start from the beginning
										 .wait(3000)
										 .then(()=>{checkExists(selector, i)})							
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
		
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });	
}