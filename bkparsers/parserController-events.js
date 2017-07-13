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
var redis = require('redis');
var redisClient = redis.createClient();

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
		grab888(objectToGet.bk888, (err, rep)=>{
			objectToWrite.bk888=rep;
			callback();
		});
	},
	(callback)=>{
		grab1xstavka(objectToGet.bk1xstavka, (err, rep)=>{
			objectToWrite.bk1xstavka=rep;
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
			console.log(Date.now()+'/r/n');
			console.log(objectToWrite);
			objectToWrite=JSON.stringify(objectToWrite);
			redisClient.lpush('eventCoefficients', objectToWrite);
		}
	);
}

function startEventGrabbing(){
	var eventObject={};
	async.series([
		(callback)=>{
			redisClient.hgetall('eventToGrab', (err, rep)=>{
			eventObject=rep;
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