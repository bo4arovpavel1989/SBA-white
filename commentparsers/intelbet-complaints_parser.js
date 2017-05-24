var bks = ['fon', 'bk-leon', '888', 'liga-stavok', '1xstavka', 'bk-olimp', 'winline', 'bk-betcity', 'bk-baltbet'];
var bks_formatted=['fonbet', 'leon', '888', 'ligastavok', '1xstavka', 'olimp', 'winline', 'betcity', 'baltbet']; //bk names as i use it in ither modules


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Complaint = require('./../lib/models/mongoModel.js').Complaint;
console.log('intelbet_parser');

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('http://www.intelbet.ru/complaints/' + bks[i] + '/')
	  .wait(1500)
	  .then(()=>{
		  console.log(bks[i]);
		  scrollScreen(i, 0); //scroll screen to get all data
	  })
}

function scrollScreen(i, currH){
	console.log('scroll');
	var previousHeight, currentHeight=currH;
	previousHeight=currentHeight;
	 console.log(currentHeight);
	console.log(previousHeight);
	nightmare.evaluate(function() {
      return document.body.scrollHeight;
    }).then(height=>{
		currentHeight=height;
		nightmare.scrollTo(currentHeight, 0)
             .wait(3000).then(()=>{
				 if(currentHeight==previousHeight) doGrabbing(i)
				 else scrollScreen(i, currentHeight);
			 });
	})	
}

function doGrabbing(i){
	nightmare.evaluate(()=>{
						return document.body.innerHTML;
					})
	  .then(function (body) {
		  console.log(2);
		 var $ = cheerio.load(body);
		 var bknumer = i;
		 let complaints = $('.complaint-cell').get();
		 console.log(complaints.length);
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });
	
	
}