var grabLeon=require('./eventparser/node-phantom-leon-event.js').grabEvent;
var grabFonbet=require('./eventparser/nightmare-fonbet-event.js').grabEvent;
var grab888=require('./eventparser/nightmare-888-event.js').grabEvent;
var grab1xstavka=require('./eventparser/nightmare-1xstavka-event.js').grabEvent;
var grabLigastavok=require('./eventparser/nightmare-ligastavok-event.js').grabEvent;
var grabWinline=require('./eventparser/nightmare-winlinebet-event.js').grabEvent;
var grabBkolimp=require('./eventparser/nightmare-bkolimp-event.js').grabEvent;
var grabBaltbet=require('./eventparser/nightmare-baltbet-event.js').grabEvent;
var grabBetcity=require('./eventparser/nightmare-betcity-event.js').grabEvent;
var async=require('async');


function parseEvents(objectToGet){
	var objectToWrite={};
	async.parallel([
	(callback)=>{
		grabLeon(objectToGet.leon.eventName, (err, rep)=>{
			objectToWrite.leon=rep;
			callback();
		});
	},
	(callback)=>{
		grabFonbet(objectToGet.fonbet.eventName, objectToGet.fonbet.betType, (err, rep)=>{
			objectToWrite.fonbet=rep;
			callback();
		});
	},
	(callback)=>{
		grab888(objectToGet.bk888.link, (err, rep)=>{
			objectToWrite.bk888=rep;
			callback();
		});
	},
	(callback)=>{
		grab1xstavka(objectToGet.bk1xstavka.link, (err, rep)=>{
			objectToWrite.bk1xstavka=rep;
			callback();
		});
	},
	(callback)=>{
		grabLigastavok(objectToGet.ligastavok.link, (err, rep)=>{
			objectToWrite.ligastavok=rep;
			callback();
		});
	},
	(callback)=>{
		grabWinline(objectToGet.winline.link, (err, rep)=>{
			objectToWrite.winline=rep;
			callback();
		});
	},(callback)=>{
		grabBkolimp(objectToGet.bkolimp.link, (err, rep)=>{
			objectToWrite.bkolimp=rep;
			callback();
		});
	},
	(callback)=>{
		grabBaltbet(objectToGet.baltbet.id, (err, rep)=>{
			objectToWrite.baltbet=rep;
			callback();
		});
	},
	(callback)=>{
		grabBetcity(objectToGet.betcity.link, (err, rep)=>{
			objectToWrite.betcity=rep;
			callback();
		});
	}],
		(err)=>{
			console.log(Date.now()+'/r/n');
			console.log(objectToWrite);
		}
	);
}


var thisObject={
	betcity: {link:'https://betcity.ru/live/ev/id=4210914;'},
	baltbet: {id:'#addl2325307'},
	bkolimp:{link:'https://olimp.bet/app/event/live/1/33036188'},
	winline:{link:'https://winline.ru/stavki/sport/futbol/mezhdunarodnye_/mezhdunarodnye_(kluby)/liga_evropy_uefa/plus/921241/?v=tablmt&t=lineall'},
	ligastavok:{link:'https://www.ligastavok.ru/Live#game/7595955/nid/28083411/vid/0/track/false'},
	bk1xstavka:{link:'https://1xstavka.ru/live/Football/118593-UEFA-Europa-League/130149089-Inter-Baku-Fola/'},
	bk888:{link:'https://mobile.888.ru/#/match/7211604?type=1'},
	fonbet:{eventName:'Интер Баку — Фола Эш', betType:'1x2'},
	leon:{eventName:'Интер Баку - КС Фола Эш'}
};

parseEvents(thisObject);