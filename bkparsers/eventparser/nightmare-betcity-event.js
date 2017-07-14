var cheerio = require('cheerio');


console.log('betcity-parser');

let grabEvent = function(link, callback){
	var Nightmare = require('nightmare');		
	var nightmare = Nightmare({ show: false });
	var objectToReturn = {
		bk: 'betcity'
	};
   nightmare
  .goto(link)
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .wait('div.title_dop')
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
	 console.log('start parsing');
     var $ = cheerio.load(body);
     let win, draw, away, marja;
	 let market1x2=$('.content_dop_wrapper').get();
	 market1x2=market1x2[0];
	 win = market1x2.children[0].children[0].children[0].children[2].children[0].data;
	 if(market1x2.children[0].children.length ===3){
		  draw = market1x2.children[0].children[1].children[0].children[2].children[0].data;
		  away = market1x2.children[0].children[2].children[0].children[2].children[0].data;
	 }else{
		 draw = '-';
		 away = market1x2.children[0].children[1].children[0].children[2].children[0].data;
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

module.exports.grabEvent=grabEvent;

