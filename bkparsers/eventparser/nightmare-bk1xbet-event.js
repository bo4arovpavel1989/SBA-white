var cheerio = require('cheerio');


console.log('1xstavka-parser');

let grabEvent = function (link, callback){
	var Nightmare = require('nightmare');		
	var nightmare = Nightmare({ show: false });
	var objectToReturn = {
		bk: 'bk1xbet'
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
		let lines=$('div.bet_group>div.bets').get();
		let market1x2=lines[0];
		console.log(market1x2);
		let win, draw, away, marja;
		win = market1x2.children[0].children[2].children[0].children[0].data;//.attribs['data-coef'];
		console.log(win)
		if (market1x2.children[2] != undefined) {
			draw = market1x2.children[1].children[2].children[0].children[0].data
			away= market1x2.children[2].children[2].children[0].children[0].data
		} else {
			draw = '-';
			away = market1x2.children[1].children[2].children[0].children[0].data
		}
		marja = 0;
		if(win != '-' && win != 0) marja += 100/parseFloat(win);
		if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
		if(away != '-' && away != 0) marja += 100/parseFloat(away);
		marja = marja -100;	
		objectToReturn.win = win;
		objectToReturn.draw = draw;
		objectToReturn.away = away;
		objectToReturn.marja = marja;
		console.log(objectToReturn);
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



  
