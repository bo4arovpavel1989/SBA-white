var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var fs=require('fs');
Coefficient.find({}, (err, reps)=>{
	reps.forEach(rep=>{
		fs.appendFile('sporttypeSpelling/' + rep.bk + '.dat', rep.sport + '\r\n', (err, rep)=>{
			console.log(rep);
		});
	});
});