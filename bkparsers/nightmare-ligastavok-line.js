var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
var links=[];
console.log('ligastavok-parser');

findLinks();

function findLinks(){
	nightmare
	  .goto('https://www.ligastavok.ru/')
	  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
	  .wait('li.menu__item a.menu__link')
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		  console.log('start parsing');
		  var $ = cheerio.load(body);
		  let linksToClick;
		  linksToClick = $('li.menu__item a.menu__link').get();
		   console.log(linksToClick);
		  linksToClick.forEach(oneLink=>{
			  console.log(oneLink.attribs.href);
			  links.push(oneLink.attribs.href);
		  });
		  checkLinks(0);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
}

function checkLinks(i){
	if(i<links.length){
		nightmare
		  .goto('https://ligastavok.ru' + links[i])
		  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
		  .wait('.fa.fa-check')
		  .click('.fa.fa-check')
		  .wait(500)
		  .click('button.button.button_default.topic__btn')
		  .wait('.grid__row')
		  .exists('.line.topic__table')
		  .then(result=>{
			  if(result)doGrabbing(i);
			  else checkLinks(i+1);
		  })
		  .catch(function (error) {
			console.log(error);
			checkLinks(i+1);
		  });
	}else {
		console.log('done')
	}
}

function doGrabbing(i){
	nightmare
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		  var $ = cheerio.load(body);
		  try{
			  let sportSelector = $('.events-table-wrapper h1 nobr').get();
			  var sport = sportSelector[0].children[0].children[0].data;
			  console.log(sport);
			  let markets=$('td.sportEventCell').get();
			  markets.forEach(market=>{
			  try{	  
				let win, draw, away, marja, isDraw;
				  win=market.next.children[0].children[0].children[0].data.replace(',', '.');
				  isDraw=market.next.next.next.children[0].children[0].children;
				  //console.log(isDraw);
				  if(isDraw.length==0) {
					  draw='-';
					  away=market.next.next.children[0].children[0].children[0].data.replace(',', '.');
				  } else {
					  draw=market.next.next.children[0].children[0].children[0].data.replace(',', '.');
					  away=market.next.next.next.children[0].children[0].children[0].data.replace(',', '.');
				  }
				  marja=0;
			 if(win != '-' && win != 0) marja += 100/parseFloat(win);
			 if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
			 if(away != '-' && away != 0) marja += 100/parseFloat(away);
			 marja = marja -100;
			 let now = Date.now();
			 sport=sportSpelling(sport);
			 console.log(sport + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);	
			 let coeff = new Coefficient({bk: 'betcity', betType:'line', averageType:'immediate', date: now, sport: sport, marja: marja, win: win, draw: draw, away: away}).save();  
			  }catch(e){}	
			 });
		  }catch(e){console.log(e)}
		  checkLinks(i+1);
	  })
	  .catch(function (error) {
		console.log(error);
		checkLinks(i+1);
	  });
}
