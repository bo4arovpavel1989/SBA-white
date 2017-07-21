let writePPSfromFNS=require('./writePPSfromFNS.js').writingPPSfromFNS;

function startCalling(i){
	writePPSfromFNS(i, (reply)=>{
		if(reply&&i<34){
			console.log('next bk');
			i++;
			startCalling(i);
		} else {console.log('done');}
	});	
}

startCalling(0);