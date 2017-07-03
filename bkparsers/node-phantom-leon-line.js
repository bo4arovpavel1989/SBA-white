console.log('running app');
var cheerio = require('cheerio');
var phantom = require("phantom");
var _ph, _page, _outObj;
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
console.log('leon-parser');

function getMarja(){
	phantom.create().then(ph => {
		_ph = ph;
		return _ph.createPage();
	}).then(page => {
		_page = page;
		return _page.open('https://leon.ru/', { charset: 'utf-8'});
	}).then(status => {
		//console.log(status);
		return _page.property('content')
	}).then(content => {
		let $ = cheerio.load(content);
				
		let tdPrematch=$('.prematches.home>.val').get();
		tdPrematch.forEach((tdElem)=>{
			try {
				let sport = tdElem.parent.prev.prev.prev.children[5].children[0].data;
				sport = sport.split(' - ');
				sport = sport[0];
				sport = sport.slice(17);
				let home = tdElem.children[0].data;
				let draw = tdElem.parent.next.next.children[1].children[0].data;;
				let away = tdElem.parent.next.next.next.next.children[1].children[0].data;	
				let marja=0;
				if(!isNaN(Number(home)) && (Number(home))!==0) marja += 100/Number(home);
				if(!isNaN(Number(draw)) && (Number(draw))!==0) marja += 100/Number(draw);
				if(!isNaN(Number(away)) && (Number(away))!==0) marja += 100/Number(away);
				marja = marja - 100;
				if(marja>0&&marja!=NaN){
					console.log('prematch coeffs: ' + sport  + ' - ' + home + '-' + draw + '-' + away + '. Marja - ' + marja + '\n');
					let now = Date.now();
					sport=sportSpelling(sport);
					let coeff = new Coefficient({bk: 'leon', betType:'line', averageType:'immediate', date: now, sport: sport, marja: marja, win: home, draw: draw, away: away}).save();
				}
			} catch(e){}
		});
		setTimeout(()=>{
			try{
				_page.close();
				_ph.exit();
			}catch(e){}
		}, 3*60*1000);
	}).catch(e => {
			console.log(e);
			setTimeout(()=>{
				try{
					_page.close();
					_ph.exit();
				}catch(e){}
			}, 3*60*1000);
		});
}
getMarja();