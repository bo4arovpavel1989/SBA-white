var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');

console.log('baltbet-parser');

let grabEvent = function (id, callback){
var objectToReturn = {
	bk: 'baltbet'
};

   nightmare
  .goto('https://baltbet.ru/')
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .click('a' + id)
  .wait('table.lv')
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .end()
  .then(function (body) {
    var $ = cheerio.load(body);
	let line=$('table.lv').get();
	line=line[0];
		try{
			let win, draw, away;
			//console.log(line);
			//console.log(sport);
			win=line.children[1].children[0].children[2].children[0].children[0].data;
			let isDraw=line.children[0].children[0].children[2].children[0].data;
			if (isDraw=='X') draw = line.children[1].children[0].children[3].children[0].children[0].data;
			else {draw='-'; away=line.children[1].children[0].children[3].children[0].children[0].data;}
			if(draw !='-') away=line.children[1].children[0].children[4].children[0].children[0].data;
			win=win.replace(',', '.');
			draw=draw.replace(',', '.');
			away=away.replace(',', '.');
			let marja = 0;
			if(win != '-' && win != 0) marja += 100/parseFloat(win);
			if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
			if(away != '-' && away != 0) marja += 100/parseFloat(away);
			marja = marja -100;
			if(marja>0&&marja!=NaN){
				//console.log(win + ' - ' + draw + ' - ' + away + '. Marja = ' + marja);	
				objectToReturn.win = win;
				objectToReturn.draw = draw;
				objectToReturn.away = away;
				objectToReturn.marja = marja;
			}
		}catch(e){}
		console.log('done');
		callback(null, objectToReturn);
  })
  .catch(function (error) {
	console.log(error);
	callback(error, null);
	return nightmare.end();
  });
  
	  
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
	}, 3*60*1000);

};

module.exports.grabEvent = grabEvent;

