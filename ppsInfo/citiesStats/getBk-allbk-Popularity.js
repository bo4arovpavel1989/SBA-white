var bks=require('./../../bklist.js').bkList_offline;
var CitiesInfo = require('./../../lib/models/mongoModel.js').CitiesInfo;
var BkPPS = require('./../../lib/models/mongoModel.js').BkPPS;
var fs=require('fs-extra');
var now=new Date();
var nowString;
if(now.getMonth()+1<10)nowString=now.getFullYear()+'-0'+(now.getMonth()+1)+'-01';//beginning of the current month
else nowString=now.getFullYear()+'-'+(now.getMonth()+1)+'-01';
console.log(nowString);


fs.readFile('wordstat/allbookmakers.csv','utf8',(err, data)=>{
		var lines=data.split('\n');
		CitiesInfo.update({name:'Москва',date:{$gte:nowString}},{$set:{bkPopularity:[83]}}).exec();
		var i=0;
		var control=lines.length;
		lines.forEach(line=>{
			line=line.split(';');
			var cityName=new RegExp(line[0],'ui');
			line[2]=line[2].replace('%','');
			line[2]=line[2].replace('\r','');
			line[2]=Number(line[2]);
			console.log(line);
			CitiesInfo.update({name:{$regex:cityName},date:{$gte:nowString}},{$set:{bkPopularity:[line[2]]}},{upsert:false}).exec((err, rep)=>{
				i++;
				console.log(i);
				console.log(control);
				if(i==control)getBkSpecialPopularity();
			});
		});
});

function getBkSpecialPopularity(){
	console.log('starting...');
	var nameArray=fs.readdirSync('wordstat');
	
	getWordstatData(0);
	
	function getWordstatData(i){
		console.log();
		if(nameArray[i]!=='allbookmakers.csv'){
			fs.readFile('wordstat/'+nameArray[i],'utf-8',(err, rep)=>{
				var bk=nameArray[i].split('.')[0];
				var lines=rep.split('\n');
				var j=0;
				var control=lines.length;
				lines.forEach(line=>{
					line=line.split(';');
					var cityName=new RegExp(line[0],'ui');
					line[2]=line[2].replace('%','');
					line[2]=line[2].replace('\r','');
					line[2]=Number(line[2]);
					console.log(line);
					console.log(bk);
					CitiesInfo.update({name:{$regex:cityName},date:{$gte:nowString}},{$push:{bkPopularity:{bk:bk,bkPopularity:line[2]}}},{upsert:false}).exec((err, reply)=>{
						j++;
						if(j==control) {
							i++;
							if(i<nameArray.length)getWordstatData(i);
							else console.log('done');
						}
					});
				});
			})
		} else{
			i++;
			getWordstatData(i);
		}
	}
}