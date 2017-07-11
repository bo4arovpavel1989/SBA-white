var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
console.log('winline-parser');

let grabEvent = function (link, callback){
	var objectToReturn={
		bk: 'winline'
	};
	
nightmare
  .goto(link)
  .wait('.result-table__row')
  .wait(2000)
  .evaluate(function () {
	this.scrollTo(100000, 0);
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
     var $ = cheerio.load(body);
	 let win, draw, away, marja;
	 let market1x2=$('.result-table__row').get();
	 market1x2=market1x2[0];
	win=market1x2.children[3].children[2].children[2].children[0].data;
	if(market1x2.children[7]!=undefined){
			draw=market1x2.children[5].children[2].children[2].children[0].data;
			away=market1x2.children[7].children[2].children[2].children[0].data;
	}else{
		draw='-';
		away=market1x2.children[5].children[2].children[2].children[0].data;
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
    console.error('Search failed:', error);
	callback(error, null)
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
  }, 5*60*1000);
  
};

module.exports.grabEvent=grabEvent;

