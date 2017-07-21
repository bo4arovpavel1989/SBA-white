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
	let control=0;
	namesArray.forEach(filename=>{
		var data;	
		console.log(filename);
		fs.readFile("ppsAddressesFromFNSXML/"+bk.bk+'/'+filename, 'utf8',(err, rep)=>{
			rep = rep.split('\n');
			control += rep.length;
			let nameSplit=filename.split(' ');
			let dateSplit=nameSplit[1].split('-');
			var year=dateSplit[0];
			var month=dateSplit[1];
			year=Number(year);
			month=Number(month);
			rep.forEach(line=>{
						console.log(line);
						var bkPPS = new BkPPS({bk:bk.bk, name:bk.name, year:year, month:month, address: line}).save((err, reply)=>{
							i++;
							console.log(i);
							if(i==control) callback(true);
						});			   
			});	
		});
	});	
};
		
