var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;

console.log('1xstavka-parser');

nightmare
  .goto('https://1xstavka.ru/')
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .click('#countLiveEventsOnMain > div.labelFdropList > div:nth-child(5)')
  .wait(1500)
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
     var $ = cheerio.load(body);
	 //console.log($.html());
	var lines=$('.c-bets').get();
	lines.forEach((line)=>{
		try {
			let betType, sport, sportType, win, draw, away;
			//console.log(line);
			//betType = line.parent.parent.parent.parent.children[1].children[1].attribs['data-top10'];
			sport = line.prev.prev.prev.prev.prev.prev.attribs.href;
			sportType=sport.split('/')[1];
			betType=sport.split('/')[0];
			if(betType=='live'){
				win = line.children[0].children[0].attribs['data-coef'];if(win ==undefined) win='-';
				draw = line.children[0].children[1].attribs['data-coef'];if(draw ==undefined) draw='-';
				away = line.children[0].children[2].attribs['data-coef'];if(away ==undefined) away='-';
				let marja = 0;
				if(win != '-' && win != 0) marja += 100/parseFloat(win);
				if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
				if(away != '-' && away != 0) marja += 100/parseFloat(away);
				marja = marja -100;
				if(marja>0&&marja!=NaN){
					console.log(betType + ': ' + sportType + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);
					let now = Date.now();
					sportType=sportSpelling(sportType);
					let coeff = new Coefficient({bk: '1xstavka', betType:betType, averageType:'immediate', date: now, sport: sportType, marja: marja, win: win, draw: draw, away: away}).save();
				}
			}
		} catch(e) {}
	});
  })
  .catch(function (error) {
	console.log(error);
  });


setTimeout(()=>{
	console.log('timeout stop');
	if(nightmare) {
		nightmare.end();
		nightmare.proc.disconnect();
		nightmare.proc.kill();
		nightmare.ended = true;
		nightmare = null;
	}
}, 5*60*1000);


  
