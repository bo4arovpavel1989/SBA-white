var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
var links=[];
console.log('baltbet-parser');

var linkNumber=1;

goGrabbing(linkNumber);

function goGrabbing(i){
	if(i<=20) {
		nightmare
		  .goto('https://www.baltbet.ru/')
		  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
		  .wait('#sidebartab > li.tab-item-side.t-item-line > div')
		  .click('#sidebartab > li.tab-item-side.t-item-line > div')
		  .wait('#tablesportsdiv')
		  .click('#tablesportsdiv > li:nth-child(' + i + ') > a')
		  .wait('#livediv > h1')
		  .wait(500)
		  .evaluate(function () {
			return document.body.innerHTML;
		  })
		  .then(function (body) {
			  console.log('start parsing');
			  var $ = cheerio.load(body);
			  var sportType=$('#livediv > h1').get();
			 sport=sportType[0].children[0].data.split(': ')[1];
			 console.log(sport);
			 let markets=$('td.left').get();
			 markets.forEach(market=>{
				 try{
					 let win, draw, away, marja;
					 if(market.next.attribs.class=='coef'){
						 win=market.next.children[0].data.replace(',', '.');
						 if(market.next.next.next.attribs.class=='coef'){
							draw= market.next.next.children[0].data.replace(',', '.');
							away= market.next.next.next.children[0].data.replace(',', '.');
						 } else {
							 draw='-';
							 away=market.next.next.children[0].data.replace(',', '.');
						 }
						  marja=0;
						 if(win != '-' && win != 0 && win !=undefined) marja += 100/parseFloat(win);
						 if(draw != '-' && draw != 0&& draw !=undefined) marja += 100/parseFloat(draw);
						 if(away != '-' && away != 0&& away !=undefined) marja += 100/parseFloat(away);
						 marja = marja -100;
						 if(marja>0&&marja!=NaN){
							 let now = Date.now();
							 sport=sportSpelling(sport);
							 console.log(sport + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);	
							 let coeff = new Coefficient({bk: 'baltbet', betType:'line', averageType:'immediate', date: now, sport: sport, marja: marja, win: win, draw: draw, away: away}).save();  
						 }
					 }
				 }catch(e){}
			 });
			 if(i<=20)goGrabbing(i+1);
			 else {
				console.log('done');
				return nightmare.end();
			}
		  })
		  .catch(function (error) {
			console.log(error);
			if(i<=20)goGrabbing(i+1);
			 else {
				console.log('done');
				return nightmare.end();
			}
		  });
	}
	else console.log('done')
}

setTimeout(()=>{
	nightmare.end();
}, 5*60*1000);