var fs = require("fs-extra");
var SalaryInfo = require('./../../lib/models/mongoModel.js').SalaryInfo;


fs.readFile('salary.csv','utf-8',(err, rep)=>{
	rep=rep.split('\n');
	rep.forEach(line=>{
		//console.log(line);
		var words=line.split(';');
	});
	console.log(rep[0]);
	console.log(rep[1]);
	console.log(rep[2]);
	console.log(rep[3]);
	console.log(rep[4]);
	console.log(rep[5]);
});
