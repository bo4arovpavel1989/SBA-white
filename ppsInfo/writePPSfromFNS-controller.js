let writePPSfromFNS=require('./writePPSfromFNS.js').writingPPSfromFNS;
var bks=require('./../bklist.js').bkList_offline;
const BKLIST_LENGTH=bks.length;

function startCalling(i){
	writePPSfromFNS(i, (reply)=>{
		if(reply&&i<BKLIST_LENGTH-1){
			console.log('next bk');
			i++;
			startCalling(i);
		} else {console.log('done');}
	});	
}

startCalling(0);