console.log('running app');
var cheerio = require('cheerio');
var phantom = require("phantom");
var _ph, _page, _outObj;
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
console.log('ligastavok -parser');

function getMarja(){
	phantom.create().then(ph => {
		_ph = ph;
		return _ph.createPage();
	}).then(page => {
		_page = page;
		return _page.open('https://www.ligastavok.ru/Live', { charset: 'utf-8'});
	}).then(status => {
		//console.log(status);
		return _page.property('content')
	}).then(content => {
		let $ = cheerio.load(content);
		let tables = $('.tevent.bts>tbody').get();
		tables.forEach((table)=>{
			var sport=table.parent.parent.parent.parent.parent.parent.parent.parent.attribs.sptype;//this is type of sport
			let lines = table.children;
			lines.forEach((line)=>{
				var coeffs=[];
				let cells = line.children;
				cells.forEach((cell)=>{
					if(cell.attribs.class.indexOf('typeWIN') != -1) {
						if(cell.children[0].children != undefined) {
							let coeff=cell.children[0].children[0].children[0].data;
							coeff=coeff.replace(',', '.');
							coeffs.push(coeff);
						} else {
							coeffs.push('-');
						}
					}	
				});
				let marja = 0;
				console.log(typeof(coeffs[0]));
				if(coeffs[0] != '-' && coeffs[0] != 0) marja += 100/parseFloat(coeffs[0]);
				if(coeffs[1] != '-' && coeffs[1] != 0) marja += 100/parseFloat(coeffs[1]);
				if(coeffs[2] != '-' && coeffs[2] != 0) marja += 100/parseFloat(coeffs[2]);
				marja = marja -100;
				console.log(sport + ': ' + coeffs[0] + ' - ' + coeffs[1] + ' - ' + coeffs[2] + '. Marja = ' + marja);
				console.log('next');
				let now = Date.now();
				sport=sportSpelling(sport);
				let coeff = new Coefficient({bk: 'ligastavok', betType:'live', averageType:'immediate', date: now, sport: sport, marja: marja, win: coeffs[0], draw:coeffs[1], away:coeffs[2]}).save();
			});
		});
	}).catch(e => console.log(e));
}



getMarja();
