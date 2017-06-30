var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
console.log('olimp-parser');
var links=[];
getLinks();
  
  function getLinks(){
	 nightmare
	  .goto('https://olimp.bet/app/prematch')
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 let linksToFind=$('.pei-w').get();
		 linksToFind.forEach(link=>{
			 try{
			 console.log(link.attribs.href)
				links.push(link.attribs.href);
			 }catch(e){}
		 });
		 checkLink(0);
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  }); 
  };
  
  function checkLink(i){
	  if(i<links.length) {
		  nightmare
		  .goto('https://olimp.bet' + links[i])
		  .exists('#eg-1') //thats the name of 1x2 market
		  .then(result=>{
			  if(result)doGrabbing(i);
			  else checkLink(i+1)  
	      })
		  .catch(function (error) {
			console.error('Search failed:', error);
			checkLink(i+1)
		  }); 
	  }else {
		console.log('done');
		return nightmare.end();
	}
  }
  
  function doGrabbing(i){
	   nightmare
	  .goto('https://olimp.bet' + links[i])
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 try{
		 let market=$('#eg-1').get();
		 let sportType = $('#breadcrumbs').get();
		 let sport = sportType[0].children[1].children[0].children[0].data;
		 let win, draw, away, marja;
		 win = market[0].children[1].children[0].children[1].children[0].children[0].data;
		 let isDraw = market[0].children[1].children[1].children[0].attribs.title;
		 if(isDraw=='Ничья'){
			 draw=market[0].children[1].children[1].children[1].children[0].children[0].data;
			 away=market[0].children[1].children[2].children[1].children[0].children[0].data;
		 }else{
			  draw='-';
			  away=market[0].children[1].children[1].children[1].children[0].children[0].data;
		 }
		 marja=0;
		 if(win != '-' && win != 0) marja += 100/parseFloat(win);
		 if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
		 if(away != '-' && away != 0) marja += 100/parseFloat(away);
		 marja = marja -100;
		 if(marja>0&&marja!=NaN){
			 let now = Date.now();
			 sport=sportSpelling(sport);
			 console.log(sport + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);	
			 let coeff = new Coefficient({bk: 'olimp', betType:'line', averageType:'immediate', date: now, sport: sport, marja: marja, win: win, draw: draw, away: away}).save();
	     }
		} catch(e){}
		 checkLink(i+1);
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		checkLink(i+1);
	  });
  }
  
setTimeout((nightmare)=>{
	console.log('timeout stop');
	nightmare.end();
}, 5*60*1000);