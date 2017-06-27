var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
const TYPE = 0; // 1 - type of bet - Live; 0 - type of bet -Line

console.log('888-parser');

grabSite(1, TYPE);

function grabSite(i, type){
nightmare
  .goto('https://mobile.888.ru/#/sport?sport=' + i + '&type=' + type + '&region=-1&qrange=-1&video=-1')
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .wait(5000)
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .then(function (body) {
     var $ = cheerio.load(body);
	 //console.log($.html());
	 var sport = $('span.heading-title>a>span.ng-binding').get();
	 var sportType = sport[0].children[0].data;
	 let lines=$('.match-markets').get();
	 lines.forEach((line)=>{
		 try {
		 let win, draw, away;
		 let marketsQuantity=line.children.length;
			 win = line.children[0].children[1].children[0].data;
			 if(line.children[1].attribs.class=='bet-event') {
				 draw = line.children[1].children[1].children[0].data;
				away = line.children[2].children[1].children[0].data;
			 }else {
			 draw = '-'
			 away = line.children[2].children[1].children[0].data;	 
			 }	
		 	let marja = 0;
				if(win != '-' && win != 0) marja += 100/parseFloat(win);
				if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
				if(away != '-' && away != 0) marja += 100/parseFloat(away);
				marja = marja -100;
				let betType;
				betType = (type == 1) ? 'live' : 'line';
				console.log(betType + ': ' + sportType + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);
				let now = Date.now();
				sportType=sportSpelling(sportType);
				let coeff = new Coefficient({bk: '888', betType:betType, averageType:'immediate', date: now, sport: sportType, marja: marja, win: win, draw: draw, away: away}).save();
		 }catch(e){}	
	 });
	i = i + 1;
	if(i<=10) grabSite(i, type);
	else console.log('done');
  })
  .catch(function (error) {
	console.log('no event for sport №' + i);
    i = i + 1;
	if(i<=10) grabSite(i, type);
	else console.log('done');
  });
}


  
