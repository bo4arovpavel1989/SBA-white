var bks=require('./../../bklist.js').bkList_offline;
var CitiesInfo = require('./../../lib/models/mongoModel.js').CitiesInfo;
var BkPPS = require('./../../lib/models/mongoModel.js').BkPPS;
var fs=require('fs-extra');
var now=new Date();
var nowString;
if(now.getMonth()+1<10)nowString=now.getFullYear()+'-0'+(now.getMonth()+1)+'-01';
else nowString=now.getFullYear()+'-'+(now.getMonth()+1)+'-01';
console.log(nowString);


fs.readFile('allbookmakers.csv','utf8',(err, data)=>{
		var lines=data.split('\n');
		CitiesInfo.update({name:'Москва',date:{$gte:nowString}},{$set:{bkPopularity:[83]}}).exec();
		lines.forEach(line=>{
			line=line.split(';');
			var cityName=new RegExp(line[0],'ui');
			line[2]=line[2].replace('%','');
			line[2]=line[2].replace('\r','');
			line[2]=Number(line[2]);
			CitiesInfo.update({name:{$regex:cityName},date:{$gte:nowString}},{$set:{bkPopularity:[line[2]]}},{upsert:false}).exec();
		});
});