var bks=require('./../../bklist.js').bkList_offline;
var CitiesInfo = require('./../../lib/models/mongoModel.js').CitiesInfo;
var BkPPS = require('./../../lib/models/mongoModel.js').BkPPS;
var fs=require('fs-extra');
var firstDate;
var secondDate;
var date;

var fileArray=fs.readdirSync('wordstat');

fileArray.forEach(filename=>{
	date=filename.split('_')[0];
	firstDate=filename.split('_')[0]+'-01';
	var year=filename.split('_')[0].split('-')[0];
	var month=filename.split('_')[0].split('-')[1];
	if(Number(month)<9)secondDate=year+'-0'+(Number(month)+1)+'-01';
	else if(Number(month)<12&&Number(month)>=9)secondDate=year+'-'+(Number(month)+1)+'-01';
	else secondDate=(Number(year)+1)+'-01-01';
});



fs.readFile('wordstat/'+date+'_allbookmakers.csv','utf8',(err, data)=>{
		var lines=data.split('\n');
		CitiesInfo.update({name:'Москва',date:{$gte:firstDate,$lte:secondDate}},{$set:{bkPopularity:[83]}}).exec();
		var i=0;
		var control=lines.length;
		lines.forEach(line=>{
			line=line.split(';');
			var cityName=new RegExp("(?:^|(?![а-яёАЯЁ])\\W)("+line[0]+ ")(?=(?![а-яёАЯЁ])\\W|$)", 'ui');
			line[2]=line[2].replace('%','');
			line[2]=line[2].replace('\r','');
			line[2]=Number(line[2]);
			console.log(line);
			CitiesInfo.update({name:{$regex:cityName},date:{$gte:firstDate,$lte:secondDate}},{$set:{bkPopularity:[line[2]]}},{upsert:false}).exec((err, rep)=>{
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
		if(nameArray[i]!==date+'_allbookmakers.csv'){
			fs.readFile('wordstat/'+nameArray[i],'utf-8',(err, rep)=>{
				var bk=nameArray[i].split('.')[0];
				var lines=rep.split('\n');
				var j=0;
				var control=lines.length;
				lines.forEach(line=>{
					line=line.split(';');
					var cityName=new RegExp("(?:^|(?![а-яёАЯЁ])\\W)("+line[0]+ ")(?=(?![а-яёАЯЁ])\\W|$)", 'ui');
					line[2]=line[2].replace('%','');
					line[2]=line[2].replace('\r','');
					line[2]=Number(line[2]);
					console.log(line);
					console.log(bk);
					CitiesInfo.update({name:{$regex:cityName},date:{$gte:firstDate,$lte:secondDate}},{$push:{bkPopularity:{bk:bk,bkPopularity:line[2]}}},{upsert:false}).exec((err, reply)=>{
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