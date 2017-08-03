var fs = require("fs-extra");
var SalaryInfo = require('./../../lib/models/mongoModel.js').SalaryInfo;
var now=new Date();
var nowString;
if(now.getMonth()+1<10)nowString=now.getFullYear()+'-0'+(now.getMonth()+1)+'-15';//middle of the current month
else nowString=now.getFullYear()+'-'+(now.getMonth()+1)+'-15';

fs.readFile('salary.csv','utf-8',(err, rep)=>{
	rep=rep.split('\n');
	for (let i=1;i<rep.length;i++){
		var words=rep[i].split(';');
		console.log(rep[i]);
		let sakary=Number(words[1]);
		SalaryInfo.update({region:words[0],salary:words[1],date:nowString},{},{upsert:true}).exec();
	}

});
