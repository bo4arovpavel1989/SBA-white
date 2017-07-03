var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
console.log('winline-parser');
nightmare
  .goto('https://winline.ru/?t=now&s=all')
  .wait(1000)
    .evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
    })
	.wait(1000)
    .evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
    })
	.wait(1000)
    .evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
    })
	.wait(1000)
    .evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
    })
    .wait(1000)
    .evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
    })
    .wait(1000)
    .evaluate(function() {
        window.document.body.scrollTop = document.body.scrollHeight;
    })
	.wait(4000)
  .evaluate(function () {
	this.scrollTo(100000, 0);
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
     var $ = cheerio.load(body);
	//console.log($.html());
	let sports=$('div.table.ng-scope>.ng-scope>.statistic').get();
	console.log(sports.length);
	sports.forEach((sport)=>{
		try{
		//console.log(sport);
		let sportType=sport.children[0].attribs['href'];
		let win, draw, away;
		sportType = sportType.split('/')[3]; 
		let coeffs=sport.next.children[0].children[2];
		if(coeffs.children==undefined) coeffs=sport.next.children[0].children[3];
		if(coeffs.children[0].children[0]!== undefined) {win=coeffs.children[0].children[0].data;} else {win=' - ';}
		if(coeffs.children[1].children[0] !== undefined) {draw=coeffs.children[1].children[0].data;} else {draw=' - ';}
		if(coeffs.children[2].children[0] !== undefined) {away=coeffs.children[2].children[0].data;} else {away=' - '}
		let marja = 0;
				if(win != ' - ' && win != 0) marja += 100/parseFloat(win);
				if(draw != ' - ' && draw != 0) marja += 100/parseFloat(draw);
				if(away != ' - ' && away != 0) marja += 100/parseFloat(away);
				marja = marja -100;
				if(marja>0&&marja!=NaN){
					console.log('live:'  + sportType + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);
					let now = Date.now();
					sportType=sportSpelling(sportType);
					let coeff = new Coefficient({bk: 'winline', betType:'live', averageType:'immediate', date: now, sport: sportType, marja: marja, win: win, draw: draw, away: away}).save();				
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
		nightmare.end();
		nightmare.proc.disconnect();
		nightmare.proc.kill();
		nightmare.ended = true;
		nightmare = null;
	}
}, 5*60*1000);
