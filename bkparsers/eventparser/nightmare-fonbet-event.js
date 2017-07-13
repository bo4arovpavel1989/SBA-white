var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
console.log('fonbet-parser');

let grabEvent=function(event, marketType, callback){

var objectToReturn={bk:'fonbet'};

nightmare
  .goto('https://www.fonbet.ru/#!/live')
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .wait(5000)
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
	  console.log('start parsing');
     var $ = cheerio.load(body);
	 let allEvents=$('td.table__col._size_long').get();
	 console.log(event)
	 allEvents.forEach(singlEvent=>{
		 try{
			if(singlEvent.children[0].children[1].children[0].data.indexOf(event)!=-1){
				let win, draw, away, marja;
				if(marketType=='1x2'){
					win=singlEvent.next.children[0].data;
					draw=singlEvent.next.next.children[0].data;
					away=singlEvent.next.next.next.children[0].data;
				} else if(marketType=='12'){
					win=singlEvent.next.children[0].data;
					draw='-';
					away=singlEvent.next.next.children[0].data;
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
			}
		 }catch(e){}
	 });
	callback(null, objectToReturn);
  })
  .catch(function (error) {
	console.log(error);
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
	}, 3*60*1000);
	
};


module.exports.grabEvent=grabEvent;