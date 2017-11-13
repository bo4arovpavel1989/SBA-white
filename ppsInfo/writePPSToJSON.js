var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var BkPPSCoordinates = require('./../lib/models/mongoModel.js').BkPPSCoordinates;
var fs=require('fs-extra');
var customFunctions=require('./../lib/customfunctions.js')
var async=require('async');

let date1='2013-01-01';
let date2='2014-01-01';
let dates=customFunctions.calculateMiddleMonthes(date1,date2,{unlimited:true});
let queries=[];

BkPPS.find({}, function(err, reps){
	console.log(reps.length);
});
//writing pps coordinates in json in order to place it on th emap

let bks=require('./../bklist.js').bkList_offline;
dates.forEach(date=>{
	queries.push(function(callback){
		getPPSforDate(date,()=>{
			callback();
		});
	});
});

async.series(queries,(err)=>{
	console.log('done');
});

function getPPSforDate(date,callback){
	let year=date.split('-')[0];
	let month=date.split('-')[1];
	let control=0;
	console.log(Number(year));
	console.log(Number(month));
	bks.forEach(bk=>{
		BkPPSCoordinates.find({bk: bk.bk,year:Number(year),month:Number(month)}, function(err, rep){
			console.log(rep);
			rep=JSON.stringify(rep);
			fs.writeFile('historical_pps/'+year+'/'+month+'/ppscoordinates' + bk.bk + '.json', rep);
			control++;
			if(control==bks.length)callback();
		});
	});
}