var bks=require('./../../bklist.js').bkList_offline;
var CitiesInfo = require('./../../lib/models/mongoModel.js').CitiesInfo;
var BkPPS = require('./../../lib/models/mongoModel.js').BkPPS;
var now=new Date();
var nowString;
if(now.getMonth()+1<10)nowString=now.getFullYear()+'-0'+(now.getMonth()+1)+'-01';
else nowString=now.getFullYear()+'-'+(now.getMonth()+1)+'-01';
console.log(nowString);

CitiesInfo.find({date:{$gte:nowString}},(err, reps)=>{
	var i=0;
	var control=reps.length;
	reps.forEach(rep=>{
			let regExpCity = new RegExp(rep.name, 'ui');
			var population=rep.population;
			BkPPS.find({address:{$regex:regExpCity}, end:{$gte:rep.date}},(err, ppses)=>{
				var total=ppses.length;
				var relation=Number(total)/Number(population);
				var bkRelation=[1000*relation];
				var bkQuantity=total;
				console.log(rep.name);
				CitiesInfo.update({name:rep.name, date:rep.date},{$set:{bkRelation:bkRelation,bkQuantity:total}}).exec((err, rep)=>{
					i++;
					if(i==control)getDetailRelation(0);
				});
			});
	});
});

function getDetailRelation(j){
	CitiesInfo.find({date:{$gte:nowString}},(err, reps)=>{
		var i=0;
		var control=reps.length;
		reps.forEach(rep=>{
				let regExpCity = new RegExp(rep.name, 'ui');
				var population=rep.population;
				BkPPS.find({bk:bks[j].bk, address:{$regex:regExpCity}, end:{$gte:rep.date}},(err, ppses)=>{
					var total=ppses.length;
					var relation=Number(total)/Number(population);
					var bkRelation={bk:bks[j].bk,relation:1000*relation}
					console.log(rep.name);
					console.log(bks[j].bk);
					CitiesInfo.update({name:rep.name, date:rep.date},{$push:{bkRelation:bkRelation}}).exec((err, rep)=>{
						i++;
						if(i==control){
							j++;
							if(j<bks.length)getDetailRelation(j);
							else console.log('done');
						}
					});
				});
		});
	});
}