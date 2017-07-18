var BkPPS = require('./lib/models/mongoModel.js').BkPPS;
var BkPPSCoordinates = require('./lib/models/mongoModel.js').BkPPSCoordinates;
var fs=require('fs-extra');
var CitiesStats = require('./lib/models/mongoModel.js').CitiesStats;
var CitiesInfo = require('./lib/models/mongoModel.js').CitiesInfo;
var cities=[];

BkPPS.find({}, function(err, reps){
	console.log(reps.length);
});
BkPPSCoordinates.find({}, function(err, reps){
	for (var i=0; i<((reps.length)/2); i++) {
		fs.appendFile('ppsCoordinatesHeatMap.js', '[' + reps[i].data.geometry.coordinates + '],\r\n');
	}
});

//writing pps coordinates in json in order to place it on th emap

let bks=['atlantik-m', 'betring', 'betru', 'digitalbetting', 'favorit', 'firmastom', 'fortuna', 'investcompcentr', 'investgarant',
'johnygame', 'marathon', 'matchbet', 'melofon', 'panorama', 'rosbet', 'rosippodromi', 'rusteletot', 'sportbet', 'starbet', 
'williamhill', 'winline', 'bkolimp', 'leon', 'bk888', 'fonbet', 'baltbet', 'bk1xbet', 'ligastavok'];

bks.forEach(bk=>{
	BkPPSCoordinates.find({bk: bk}, function(err, rep){
		rep=JSON.stringify(rep);
		fs.writeFile('ppscoordinates' + bk + '.json', rep);
	});
});



//BkPPSCoordinates.find({}).remove().exec();
//BkPPS.find({}).remove().exec();*/