let writePPSfromFNS=require('./writePPSfromFNS.js').writingPPSfromFNS;
var bks=require('./../bklist.js').bkList_offline;
const BKLIST_LENGTH=bks.length;
var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;

BkPPS.remove({},(err, rep)=>{
	console.log(rep);
	startCalling(0);
});

function startCalling(i){
	writePPSfromFNS(i, (reply)=>{
		if(reply&&i<BKLIST_LENGTH-1){
			console.log('next bk');
			startCalling(i+1);
		} else {console.log('done');}
	});	
}

