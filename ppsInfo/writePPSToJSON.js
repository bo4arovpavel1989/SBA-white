var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var BkPPSCoordinates = require('./../lib/models/mongoModel.js').BkPPSCoordinates;
var fs=require('fs-extra');

BkPPS.find({}, function(err, reps){
	console.log(reps.length);
});
//writing pps coordinates in json in order to place it on th emap

let bks=require('./../bklist.js').bkList_offline;
bks.forEach(bk=>{
	BkPPSCoordinates.find({bk: bk.bk}, function(err, rep){
		rep=JSON.stringify(rep);
		fs.writeFile('ppscoordinates' + bk.bk + '.json', rep);
	});
});

