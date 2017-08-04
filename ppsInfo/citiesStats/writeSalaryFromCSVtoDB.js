var fs = require("fs-extra");
var SalaryInfo = require('./../../lib/models/mongoModel.js').SalaryInfo;

var salaryArray=fs.readdirSync('salary');


salaryArray.forEach(filename=>{
	fs.readFile('salary/'+filename,'utf-8',(err, rep)=>{
		var date;
		date=filename.split('_')[0];
		date=date+'-15';
		rep=rep.split('\n');
		for (let i=1;i<rep.length;i++){
			var words=rep[i].split(';');
			console.log(rep[i]);
			let salary=words[1];
			SalaryInfo.update({region:words[0],salary:salary,date:date},{},{upsert:true}).exec();
		}
	});
});


