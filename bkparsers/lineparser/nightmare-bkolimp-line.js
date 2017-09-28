var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
var cheerio = require('cheerio');
var Coefficient = require('./../../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../../lib/customfunctions.js').sportSpelling;
console.log('olimp-parser');
var links=[];
var links2=[];

getLinks();
  
  function getLinks(){
	 nightmare
	  .goto('https://olimp.bet/app/prematch')
	  .wait(1500)
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 let linksToFind=$('.sports-sport-link').get();
		 linksToFind.forEach(link=>{
			 try{
				console.log(link.attribs.href)
				links.push(link.attribs.href);
			 }catch(e){}
		 });
		 getLinks2(0);
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  }); 
  };
  
  function getLinks2(i){
	  console.log(i);
	  nightmare
	  .goto('https://olimp.bet'+links[i])
	  .wait(1500)
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 let linksToFind=$('div.hot-champs-list').get()[0].children;
		 linksToFind=linksToFind.slice(0,5);
		 linksToFind.forEach(link=>{
			 try{
				console.log(link.attribs.href)
				links2.push(link.attribs.href);
			 }catch(e){}
		 });
		i++;
		if(i<10)getLinks2(i);//i prefer to get first 10 type of sports
		else doGrabbing(0);
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		i++;
		if(i<10)getLinks2(i);//i prefer to get first 10 type of sports
		else doGrabbing(0);
	  });  
  }

  function doGrabbing(i){
	  console.log(links2);
	  console.log('start grabbin...');
	   nightmare
	  .goto('https://olimp.bet' + links2[i])
	  .wait('.match_short-main')
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		  var $ = cheerio.load(body);
			console.log(i);
			let lines=$('.match_short-main').get();
			//console.log(lines);
			let control=0;
			lines.forEach((line)=>{
				try{
					//console.log(line);
					let win, draw, away;
					let sport=line.parent.parent.children[0].children[1].data;
					let coeffs = line.children[1].children[1].children;
					//console.log(coeffs);
					console.log(sport);
					let winCell = coeffs[0];
					let drawCell = coeffs[1];
					let awayCell = coeffs[2];
					if(winCell.children[0].children[0].children[0].data == 'П1 ') win=winCell.children[1].children[0].data;
					if(drawCell.children[0].children[0].children[0].data == 'Х ') draw=drawCell.children[1].children[0].data; else if(drawCell.children[0].children[0].children[0].data == 'П2 '){draw = '-'; away=drawCell.children[1].children[0].data;}
					if(awayCell.children[0].children[0].children[0].data == 'П2 ') away=awayCell.children[1].children[0].data;
					let marja = 0;
					if(win != '-' && win != 0) marja += 100/parseFloat(win);
					if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
					if(away != '-' && away != 0) marja += 100/parseFloat(away);
					marja = marja -100;
					if(marja>0&&!isNaN(marja)){
						console.log(sport + ': ' + win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);		
						let now = Date.now();
						sport=sportSpelling(sport);
						let coeff = new Coefficient({bk: 'bkolimp', betType:'line', averageType:'immediate', date: now, sport: sport, marja: marja, win: win, draw: draw, away: away}).save((err, rep)=>{
							control++;
							if(control>=lines.length){
								i++;
								if(i<links2.length)doGrabbing(i);
								else console.log('done');
							}
						});
					}else {
						control++;
							if(control>=lines.length){
								i++;
								if(i<links2.length)doGrabbing(i);
								else console.log('done');
							}
					}
				} catch(e){
							console.log(e)
							control++;
							if(control>=lines.length){
								i++;
								if(i<links2.length)doGrabbing(i);
								else console.log('done');
							}}	
			});
			if(lines.length==0){
				i++;
				if(i<links2.length)doGrabbing(i);
				else console.log('done');
			}
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		i++;
		if(i<links2.length)doGrabbing(i);
		else console.log('done');
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
}, 5*60*1000);
