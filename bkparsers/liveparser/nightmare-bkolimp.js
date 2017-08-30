var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../../lib/customfunctions.js').sportSpelling;
console.log('olimp-parser');
nightmare
  .goto('https://olimp.bet/app/live')
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
     var $ = cheerio.load(body);
	let lines=$('.eh-all').get();
	lines.forEach((line)=>{
		try{
		//console.log(line);
		let win, draw, away;
		let sport=line.children[0].children[0].children[0].children[0].attribs.title;
		let coeffs = line.children[0].children[1].children[0];
		//console.log(coeffs);
		let winCell = coeffs.children[0];
		let drawCell = coeffs.children[1];
		let awayCell = coeffs.children[2];
		if(winCell.children[0].children[0].data == 'П1 ') win=winCell.children[1].children[0].data;
		if(drawCell.children[0].children[0].data == 'Х ') draw=drawCell.children[1].children[0].data; else if(drawCell.children[0].children[0].data == 'П2 '){draw = '-'; away=drawCell.children[1].children[0].data;}
		if(awayCell.children[0].children[0].data == 'П2 ') away=awayCell.children[1].children[0].data;
			let marja = 0;
				if(win != '-' && win != 0) marja += 100/parseFloat(win);
				if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
				if(away != '-' && away != 0) marja += 100/parseFloat(away);
				marja = marja -100;
				if(marja>0&&!isNaN(marja)){
					console.log(sport + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);		
					let now = Date.now();
					sport=sportSpelling(sport);
					let coeff = new Coefficient({bk: 'bkolimp', betType:'live', averageType:'immediate', date: now, sport: sport, marja: marja, win: win, draw: draw, away: away}).save();
				}
		} catch(e){console.log(e)}
	});
  })
  .catch(function (error) {
    console.error('Search failed:', error);
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