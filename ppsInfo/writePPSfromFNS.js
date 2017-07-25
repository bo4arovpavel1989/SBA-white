var fs = require("fs");
var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var bks=require('./../bklist.js').bkList_offline;


module.exports.writingPPSfromFNS=function(k, callback){
	var bk = bks[k];
	var namesArray=[];
	namesArray=fs.readdirSync("ppsAddressesFromFNSXML/"+bk.bk+'/');
	var control=namesArray.length;
	
	goReading(0)
	
	function goReading(i){
		readOneFile(namesArray[i], bk, (reply)=>{
			i++;
			if(i<control)goReading(i);
			else callback(true);
		});
	}
		
	function readOneFile(filename, bk, callbackJunior){
		var path="ppsAddressesFromFNSXML/"+bk.bk+'/'+filename;
		console.log(path);
		fs.readFile(path, 'utf8',(err, rep)=>{
					var j=0;
					rep = rep.split('\n');
					var control2=rep.length;		
					let nameSplit=filename.split('_');
					let dateBegin=nameSplit[1];
					let dateEnd=nameSplit[2];
					if(dateEnd=='.dat'||dateEnd=='.DAT'){
						var today = new Date();
						dateEnd=today.getFullYear()+'-'+(today.getMonth()+2)+'-01';
					} 
					console.log(dateBegin);
					console.log(dateEnd);
					console.log(filename);
					rep.forEach(line=>{
							var bkPPS = new BkPPS({bk:bk.bk, name:bk.name, begin:dateBegin, end:dateEnd, address: line}).save((err, reply)=>{
								j++;
								if(j==control2) callbackJunior(true);
							});			   
					});				
				});	
	}
	
};

