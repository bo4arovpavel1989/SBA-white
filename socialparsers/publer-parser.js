var bks = ['leonbets', 'fonbet', '1h-stavka', '888sport', 'winlinebet', 'olimp-kz', 'liga-stavok', 'betcity', 'baltbet-tsupis'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules

var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
var cheerio = require('cheerio');
console.log('publer-parser');

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('https://publer.pro/my/groupsstats/?gid=92639977')
	  .wait(1500)
	  .evaluate(()=>{
					return document.body.innerHTML;
	   })
	  .then((body)=>{	  
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });
}
