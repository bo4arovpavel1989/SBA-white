var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var BkPPSCoordinates = require('./../lib/models/mongoModel.js').BkPPSCoordinates;
var fs=require('fs-extra');



BkPPS.find({}, function(err, reps){
	console.log(reps.length);
});
//writing pps coordinates in json in order to place it on th emap

let bks=require('./../bklist.js').bkList_offline;

bks.forEach(bk=>{
	BkPPS.find({bk:bk.bk}, function(err, reps){
		var bkDates=[];
		if(reps){
			reps.forEach(rep=>{
				let singleDate = {year:rep.year, month:rep.month};
				singleDate=JSON.stringify(singleDate);
				let checkIfExists=bkDates.indexOf(singleDate);
				if(checkIfExists==-1) bkDates.push(singleDate);
			});
			fs.appendFile('ppsDates.dat', bk.name + '\r\n=======================\r\n'+bkDates+'\r\n');
		}
	});
});
/*
bks.forEach(bk=>{
	BkPPSCoordinates.find({bk: bk.bk}, function(err, rep){
		rep=JSON.stringify(rep);
		fs.writeFile('ppscoordinates' + bk.bk + '.json', rep);
	});
});*/

