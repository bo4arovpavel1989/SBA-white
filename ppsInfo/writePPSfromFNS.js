var fs = require("fs");
var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var bks=require('./../bklist.js').bkList_offline;
var async=require('async');


module.exports.writingPPSfromFNS=function(k, majorCallback){
	var bk = bks[k];
	var queriesArray=[];
	var namesArray=fs.readdirSync("ppsAddressesFromFNSXML/"+bk.bk+'/'); //catalogues names are equal to bk names
	
	namesArray.forEach(name=>{
		queriesArray.push(function(callback2){
			readOneFile(name, bk, (reply)=>{
				callback2()
			});
		});
	});
	
	async.series(queriesArray,(err)=>{
		majorCallback(true);
	});
		
	function readOneFile(filename, bk, callback){
		var path="ppsAddressesFromFNSXML/"+bk.bk+'/'+filename;
		console.log(path);
		fs.readFile(path, 'utf8',(err, rep)=>{
			var queriesArray=[];
			rep = rep.split('\n');
			let nameSplit=filename.split('_');
			let dateBegin=nameSplit[1];
			let dateEnd=nameSplit[2];
			
			if(dateEnd=='.dat'||dateEnd=='.DAT'){ //that means that dateEnd is not defined in filename, so i make dateEnd - beginnig if the next month
				var today = new Date();
				if(today.getMonth()<11)dateEnd=today.getFullYear()+'-'+(today.getMonth()+2)+'-01'; 
				else dateEnd=today.getFullYear()+1+'-01-01'; 
			}
			
			rep.forEach(line=>{
				queriesArray.push(function(callback3)=>{
					var bkPPS = new BkPPS({bk:bk.bk, name:bk.name, begin:dateBegin, end:dateEnd, address: line}).save((err, reply)=>{
						callback3()
					});	
				});
			});
			
			async.series(queriesArray,(err)=>{
				callback();
			})
		});	
	}
	
};

