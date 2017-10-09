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
var EventGrabbed = require('./../lib/models/mongoModel.js').EventGrabbed;
var async=require('async');

function parseEvents(objectToGet){
	var objectToWrite={bk:{}};
	console.log(objectToGet);
	async.parallel([
	(callback)=>{
		if (objectToGet.leon)grabLeon(objectToGet.leon, (err, rep)=>{
			objectToWrite.bk.leon=rep;
			callback();
		});
		else callback();
	},
	(callback)=>{
		if(objectToGet.fonbet)grabFonbet(objectToGet.fonbet, objectToGet.fonbetType, (err, rep)=>{
			objectToWrite.bk.fonbet=rep;
			callback();
		});
		else callback();
	},
	(callback)=>{
		if(objectToGet.bk888)grabBk888(objectToGet.bk888, (err, rep)=>{
			objectToWrite.bk.bk888=rep;
			callback();
		});
		else callback();
	},
	(callback)=>{
		if(objectToGet.bk1xbet)grabBk1xbet(objectToGet.bk1xbet, (err, rep)=>{
			objectToWrite.bk.bk1xbet=rep;
			callback();
		});
		else callback();
	},
	(callback)=>{
		if(objectToGet.ligastavok)grabLigastavok(objectToGet.ligastavok, (err, rep)=>{
			objectToWrite.bk.ligastavok=rep;
			callback();
		});
		else callback();
	},
	(callback)=>{
		if(objectToGet.winline)grabWinline(objectToGet.winline, (err, rep)=>{
			objectToWrite.bk.winline=rep;
			callback();
		});
		else callback();
	},(callback)=>{
		if(objectToGet.bkolimp)grabBkolimp(objectToGet.bkolimp, (err, rep)=>{
			objectToWrite.bk.bkolimp=rep;
			callback();
		});
		else callback();
	},
	(callback)=>{
		if(objectToGet.baltbet)grabBaltbet(objectToGet.baltbet, (err, rep)=>{
			objectToWrite.bk.baltbet=rep;
			callback();
		});
		else callback();
	},
	(callback)=>{
		if(objectToGet.betcity)grabBetcity(objectToGet.betcity, (err, rep)=>{
			objectToWrite.bk.betcity=rep;
			callback();
		});
		else callback();
	}],
		(err)=>{
			let time = getTime();
			console.log(time+'/r/n');
			console.log(objectToWrite);
			objectToWrite.time=time;
			for (var prop in objectToWrite.bk){
				EventGrabbed.update({name:objectToGet.name,bk:prop},{$push:{data:{time: objectToWrite.time,data:objectToWrite.bk[prop]}}},{upsert:true}).exec();
			}
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
			3*60*1000)
		});
	}

startEventGrabbing();