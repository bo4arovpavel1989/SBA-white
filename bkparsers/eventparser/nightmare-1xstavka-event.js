var cheerio = require('cheerio');


console.log('1xstavka-parser');

let grabEvent = function (link, callback){
	var Nightmare = require('nightmare');		
	var nightmare = Nightmare({ show: false });
	var objectToReturn = {
		bk: '1xstavka'
	};

	 nightmare
	  .goto(link)
	  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
	  .wait(1500)
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .end()
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 //console.log($.html());
		let lines=$('div.bets').get();
		let market1x2=lines[0];
		let win, draw, away, marja;
		win = market1x2.children[8].attribs['data-coef'];
		if (market1x2.children[30] != undefined) {
			draw = market1x2.children[19].attribs['data-coef'];
			away= market1x2.children[30].attribs['data-coef'];
		} else {
			draw = '-';
			away = market1x2.children[19].attribs['data-coef'];
		}
		marja = 0;
		if(win != '-' && win != 0) marja += 100/parseFloat(win);
		if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
		if(away != '-' && away != 0) marja += 100/parseFloat(away);
		marja = marja -100;
		console.log(win + ' - ' + draw + ' - ' + away + ". Marja: " + marja);	
		objectToReturn.win = win;
		objectToReturn.draw = draw;
		objectToReturn.away = away;
		objectToReturn.marja = marja;
		callback(null, objectToReturn);
	  })
	  .catch(function (error) {
		console.log(error);
		callback(error, null);
	  });	
  
	  setTimeout(()=>{
		console.log('timeout stop');
		if(nightmare) {
			try{
				nightmare.end();
				nightmare.proc.disconnect();
				nightmare.proc.kill();
				nightmare.ended = true;
				nightmare = null;
			}catch(e){}
		}
	  }, 3*60*1000);
  
};

module.exports.grabEvent = grabEvent;



  
