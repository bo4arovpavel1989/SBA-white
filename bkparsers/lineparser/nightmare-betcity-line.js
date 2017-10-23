var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show:false });
var cheerio = require('cheerio');
var Coefficient = require('./../../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../../lib/customfunctions.js').sportSpelling;
var links=[];
console.log('betcity-parser');

findLinks();

function findLinks(){
	nightmare
	  .goto('https://betcity.ru/ru/line/')
	  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
	  .wait('.competitions-content-table-item-text__title')
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		  console.log('start parsing');
		  var $ = cheerio.load(body);
		  let sportsToGrab=$('.competitions-content-table-item__title').get();
		  sportsToGrab.forEach(sport=>{//i did 
			  try{
				  links.push(sport.next.children[1].attribs.href);
				  links.push(sport.next.next.next.children[1].attribs.href);
				  links.push(sport.next.next.next.next.next.children[1].attribs.href);
			  }catch(e){console.log(e)}
		  });
		  console.log(links)
		  checkLinks(0);
	  })
	  .catch(function (error) {
		console.log(error);
		return nightmare.end();
	  });
}

function checkLinks(i){
	if(i<links.length){
		nightmare
		  .goto('https://betcity.ru' + links[i])
		  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
		  .wait('.live-list__championship-header-name')
		  .exists('.live-list__championship-event-winner-text')
		  .then(result=>{
			  if(result)checkLinks(i+1);
			  else doGrabbing(i);
		  })
		  .catch(function (error) {
			console.log(error);
			checkLinks(i+1);
		  });
	}else {
		console.log('done');
		try{
			nightmare.end();
			nightmare.proc.disconnect();
			nightmare.proc.kill();
			nightmare.ended = true;
			nightmare = null;
		}catch(e){};
	}
}

function doGrabbing(i){
	nightmare
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		  var $ = cheerio.load(body);
		  let sportSelector = $('.live-list__championship-header-name').get();
		  try{
			  var sport = sportSelector[0].children[0].children[0].data.split('. ')[0];
			  console.log(sport);
			  let markets=$('.live-list__championship-event').get();
			  //console.log(markets[0]);
			  let win, draw, away, marja;
			  win=markets[0].children[5].children[0].children[0].children[0].data;
			  console.log(win)
			  if(markets[0].children[6].children[0].children[0]!=undefined)
			  draw=markets[0].children[6].children[0].children[0].children[0].data;
		      else draw='-';
			  away=markets[0].children[7].children[0].children[0].children[0].data;
			  marja=0;
			 if(win != '-' && win != 0) marja += 100/parseFloat(win);
			 if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
			 if(away != '-' && away != 0) marja += 100/parseFloat(away);
			 marja = marja -100;
			 if(marja>0&&!isNaN(marja)){
				 let now = Date.now();
				 sport=sportSpelling(sport);
				 console.log(sport + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);	
				 let coeff = new Coefficient({bk: 'betcity', betType:'line', averageType:'immediate', date: now, sport: sport, marja: marja, win: win, draw: draw, away: away}).save();
		     }
			}catch(e){console.log(e)}
		  checkLinks(i+1);
	  })
	  .catch(function (error) {
		console.log(error);
		checkLinks(i+1);
	  });
}

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
