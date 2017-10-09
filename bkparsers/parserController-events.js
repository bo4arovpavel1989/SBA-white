var grabLeon=require('./eventparser/node-phantom-leon-event.js').grabEvent;
var grabFonbet=require('./eventparser/nightmare-fonbet-event.js').grabEvent;
var grabBk888=require('./eventparser/nightmare-bk888-event.js').grabEvent;
var grabBk1xbet=require('./eventparser/nightmare-bk1xbet-event.js').grabEvent;
var grabLigastavok=require('./eventparser/nightmare-ligastavok-event.js').grabEvent;
var grabWinline=require('./eventparser/nightmare-winline-event.js').grabEvent;
var grabBkolimp=require('./eventparser/nightmare-bkolimp-event.js').grabEvent;
var grabBaltbet=require('./eventparser/nightmare-baltbet-event.js').grabEvent;
var grabBetcity=require('./eventparser/nightmare-betcity-event.js').grabEvent;
var EventToGrab = require('./../lib/models/mongoModel.js').EventToGrab;
var async=require('async');

function parseEvents(objectToGet){
	var objectToWrite={};
	console.log(objectToGet);
	async.parallel([
	(callback)=>{
		grabLeon(objectToGet.leon, (err, rep)=>{
			objectToWrite.leon=rep;
			callback();
		});
	},
	(callback)=>{
		grabFonbet(objectToGet.fonbet, objectToGet.fonbetType, (err, rep)=>{
			objectToWrite.fonbet=rep;
			callback();
		});
	},
	(callback)=>{
		grabBk888(objectToGet.bk888, (err, rep)=>{
			objectToWrite.bk888=rep;
			callback();
		});
	},
	(callback)=>{
		grabBk1xbet(objectToGet.bk1xbet, (err, rep)=>{
			objectToWrite.bk1xbet=rep;
			callback();
		});
	},
	(callback)=>{
		grabLigastavok(objectToGet.ligastavok, (err, rep)=>{
			objectToWrite.ligastavok=rep;
			callback();
		});
	},
	(callback)=>{
		grabWinline(objectToGet.winline, (err, rep)=>{
			objectToWrite.winline=rep;
			callback();
		});
	},(callback)=>{
		grabBkolimp(objectToGet.bkolimp, (err, rep)=>{
			objectToWrite.bkolimp=rep;
			callback();
		});
	},
	(callback)=>{
		grabBaltbet(objectToGet.baltbet, (err, rep)=>{
			objectToWrite.baltbet=rep;
			callback();
		});
	},
	(callback)=>{
		grabBetcity(objectToGet.betcity, (err, rep)=>{
			objectToWrite.betcity=rep;
			callback();
		});
	}],
		(err)=>{
			let time = getTime();
			console.log(time+'/r/n');
			console.log(objectToWrite);
			objectToWrite=JSON.stringify(objectToWrite);
			redisClient.lpush('eventCoefficients', objectToWrite);
		}
	);
}

function getTime(){
	let date = new Date();
	let h, m, s, time;
	h=date.getHours();
	m=date.getMinutes();
	s=date.getSeconds();
	if(h.length==1)h='0' + h;
	if(m.length==1)h='0' + m;
	if(s.length==1)h='0' + s;
	time = h + ':' + m + ':' + s;
	return time;
}


function startEventGrabbing(){
	var eventObject={};
	async.series([
		(callback)=>{
			EventToGrab.find({}).sort({date:-1}).exec((err, rep)=>{
				eventObject=rep[0];
				console.log(eventObject)
				callback();
			});
		}
		], 
		(err)=>{
			parseEvents(eventObject);
			setInterval(()=>{
				parseEvents(eventObject);
			},
			5*60*1000)
		});
	}

startEventGrabbing();