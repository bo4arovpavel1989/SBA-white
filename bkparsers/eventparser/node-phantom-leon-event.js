console.log('running app');
var cheerio = require('cheerio');
console.log('leon-parser');

let grabEvent = function (event, callback){
	var phantom = require("phantom");
	var _ph, _page, _outObj;
	var objectToReturn={bk:'leon'};
	
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
		let allEvents=$('.liveeventTeam').get();
		allEvents.forEach(singleEvent=>{
			if(singleEvent.children[0].data.indexOf(event)!=-1){
				let win, draw, away, marja;
				win=singleEvent.parent.parent.next.next.next.next.next.children[1].children[0].data;
				draw=singleEvent.parent.parent.next.next.next.next.next.next.next.next.next.children[1].children[0].data;;	
				away=singleEvent.parent.parent.next.next.next.next.next.next.next.next.next.next.next.next.next.children[1].children[0].data;
				marja = 0;
				if(win != '-' && win != 0) marja += 100/parseFloat(win);
				if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
				if(away != '-' && away != 0) marja += 100/parseFloat(away);
				marja = marja -100;
				console.log(win + ' - ' + draw + ' - ' + away + ". Marja: " + marja);	
				objectToReturn.win = win;
				objectToReturn.draw = draw;
				objectToReturn.away = away;
				objectToReturn.marja = marja;
			}
		});
		callback(null, objectToReturn);
		setTimeout(()=>{
			try{
				_page.close();
				_ph.exit();
			}catch(e){}
		}, 3*60*1000);
	}).catch(e => {
			console.log(e);
			callback(e, null);
			setTimeout(()=>{
				try{
					_page.close();
					_ph.exit();
				}catch(e){}
			}, 3*60*1000);		
		});
}
module.exports.grabEvent=grabEvent;