
var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
BkPPS.find({end:{$lte:'2016-09-15',$gte:'2016-08-14'}}, (err, reps)=>{
	reps.forEach(rep=>{
		BkPPS.find({bk:rep.bk, begin:{$gte:'2016-09-14',$lte:'2016-10-16'}}, (err, rep)=>{
			console.log(rep)
		})
	})
})