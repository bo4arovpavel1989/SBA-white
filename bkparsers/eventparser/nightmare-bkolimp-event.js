var cheerio = require('cheerio');
console.log('olimp-parser');

let grabEvent = function(link, callback){
	var Nightmare = require('nightmare');		
	var nightmare = Nightmare({ show: false });
	var objectToReturn={
		bk:'olimp'
	};
	
	nightmare
	  .goto(link)
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .end()
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 let win, draw, away, marja;
		 let market1x2=$('div.full_paint-group-stakes').get();
		 win=market1x2[0].children[0].children[1].children[0].children[0].data;
		 console.log(win)
		 let isDraw=market1x2[0].children[1].children[0].children[0].data;
		 if(isDraw=='Ничья'){
			 draw=market1x2[0].children[1].children[1].children[0].children[0].data;
			 away=market1x2[0].children[2].children[1].children[0].children[0].data;
		 }else{
			 draw='-';
			 away=market1x2[0].children[1].children[1].children[0].children[0].data;
		 }
		 marja = 0;
		if(win != '-' && win != 0) marja += 100/parseFloat(win);
		if(draw != '-' && draw != 0) marja += 100/parseFloat(draw);
		if(away != '-' && away != 0) marja += 100/parseFloat(away);
		marja = marja -100;	
		objectToReturn.win = win;
		objectToReturn.draw = draw;
		objectToReturn.away = away;
		objectToReturn.marja = marja;
		console.log(objectToReturn);
		callback(null, objectToReturn);
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		callback(error, null);
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

module.exports.grabEvent=grabEvent;