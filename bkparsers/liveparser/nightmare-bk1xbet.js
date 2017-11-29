var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../../lib/customfunctions.js').sportSpelling;

console.log('1xstavka-parser');

nightmare
  .goto('https://1xstavka.ru/')
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .click('div.banner:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)') //click show all bets
  .wait(1500)
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
     var $ = cheerio.load(body);
	 //console.log($.html());
	var lines=$('.c-bets').get();
	console.log(lines);
	lines.forEach((line)=>{
		try {
			let betType, sport, sportType, win, draw, away;
			//console.log(line);
			//betType = line.parent.parent.parent.parent.children[1].children[1].attribs['data-top10'];
			sport = line.prev.prev.prev.prev.prev.prev.attribs.href;
			sportType=sport.split('/')[1];
			win = line.children[0].children[0].children[0].data;if(win == undefined) win='-';
			console.log('win - ' + win);
			try{
				draw = line.children[0].children[1].children[0].data;if(draw == undefined) draw='-';
			}catch(e){draw='-'}	
			//console.log('draw - ' + draw);
			away = line.children[0].children[2].children[0].data;if(away == undefined) away='-';
			//console.log('away - ' + away);
			//console.log('away - ' + away);
			let marja = 0;
			if(win != '-' && win != 0) marja += 100/parseFloat(win);
			if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
			if(away != '-' && away != 0) marja += 100/parseFloat(away);
			marja = marja - 100;
			if(marja>0&&!isNaN(marja)){
				console.log('live' + ': ' + sportType + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);
				let now = Date.now();
				sportType=sportSpelling(sportType);
				let coeff = new Coefficient({bk: 'bk1xbet', betType:'live', averageType:'immediate', date: now, sport: sportType, marja: marja, win: win, draw: draw, away: away}).save();
			}
		} catch(e) {console.log(e)}
	});
  })
  .catch(function (error) {
	console.log(error);
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
	process.exit();
}, 5*60*1000);

  
