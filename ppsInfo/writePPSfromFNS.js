var fs = require("fs");
var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var bks=require('./../bklist.js').bkList_offline;


module.exports.writingPPSfromFNS=function(k, callback){
	let bk = bks[k];
	let namesArray=[];
	let i,j;
	namesArray=fs.readdirSync("ppsAddressesFromFNSXML/"+bk.bk+'/');
	i=0;
	j=0;
	var control=0;
	namesArray=namesArray.sort();
	namesArray.forEach(filename=>{
		let nameSplit=filename.split(' ');
		let dateSplit=nameSplit[1].split('-');
		let nextyear;
		var year=dateSplit[0];
		var month=dateSplit[1];
		year=Number(year);
		month=Number(month);
		if(namesArray[j+1]!=undefined){
			let nextnameSplit=namesArray[j+1].split(' ');
			let nextdateSplit=nextnameSplit[1].split('-');
			nextyear=nextdateSplit[0];
			nextyear=Number(nextyear);
		}
		console.log(year);
		console.log(nextyear);
		console.log(year==nextyear);
		if(nextyear!=year || namesArray[j+1]==undefined){
			console.log(filename);
			fs.readFile("ppsAddressesFromFNSXML/"+bk.bk+'/'+filename, 'utf8',(err, rep)=>{
				rep = rep.split('\n');
				control += rep.length;
				rep.forEach(line=>{
							console.log(line);
							var bkPPS = new BkPPS({bk:bk.bk, name:bk.name, year:year, month:month, address: line}).save((err, reply)=>{
								i++;
								console.log(i);
								if(i==control) callback(true);
							});			   
				});	
			});		
		}	
		j++;
	});	
};
		
