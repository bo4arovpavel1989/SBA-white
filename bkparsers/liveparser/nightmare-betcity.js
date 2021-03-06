var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../../lib/customfunctions.js').sportSpelling;

console.log('betcity-parser');

nightmare
  .goto('https://betcity.ru/ru/')
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .wait('.live-list__championship-event')
  .wait(2000)
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
	  console.log('start parsing');
     var $ = cheerio.load(body);
	let lines=$('.live-list__championship-event').get();
	lines.forEach(line=>{
		let sport, inw, draw, away, marja;
		try {
		//console.log(line);
		sport=line.parent.children[0].children[2].children[0].children[0].data;
		sport=sport.split('. ')[0];
		//console.log(sport);
		win = line.children[6].children[0].children[0].attribs['data-k'];
		if(line.children[7].children[0].children[0]==undefined) draw='-';
		else draw = line.children[7].children[0].children[0].attribs['data-k'];
		away = line.children[8].children[0].children[0].attribs['data-k'];
		marja = 0;
				if(win != '-' && win != 0) marja += 100/parseFloat(win);
				if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
				if(away != '-' && away != 0) marja += 100/parseFloat(away);
				marja = marja -100;
				if(marja>0&&!isNaN(marja)){
					console.log(sport + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);		
					let now = Date.now();
					sport=sportSpelling(sport);
					let coeff = new Coefficient({bk: 'betcity', betType:'live', averageType:'immediate', date: now, sport: sport, marja: marja, win: win, draw: draw, away: away}).save();
				}
		} catch(e){}
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

