var async=require('async');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var Line = require('./../lib/models/mongoModel.js').Line;
var customFunctions = require('./../lib/customfunctions');
var bkList=require('./../bklist.js').bkList;
var sportList=['футбол','баскетбол','волейбол','хоккей','теннис','гандбол'];
var year, month;
var date;
var dates=customFunctions.getFullMonth(year,month);

bkList.forEach(bk=>{
	var liveMarja, lineMarja, sports;
	sport=[];	
	var data={bk:bk.bk,name:bk.name,date:date};
	async.parallel([
	(callback)=>{
		Coefficient.find({bk:bk.bk,betType:'live', date:{$gte:dates[0],$lte:dates[1]}},function(err,rep){
			if(rep){
				let sum=0;
				rep.forEach(item=>{
					sum +=itm.marja;
				});
				liveMarja=sum/rep.length;
				callback();
			}
		});
	},
	(callback)=>{
		Coefficient.find({bk:bk.bk,betType:'line', date:{$gte:dates[0],$lte:dates[1]}},function(err,rep){
			if(rep){
				let sum=0;
				rep.forEach(item=>{
					sum +=itm.marja;
				});
				liveMarja=sum/rep.length;
				callback();
			}
		});
	},
	(callback)=>{
		sportList.forEach(sportType=>{
			Coefficient.find({bk:bk.bk,sport:sportType,date:{$gte:dates[0],$lte:dates[1]}},function(err,rep){
				if(rep){
				let sumLive=0;
				let liveQuantity=0;
				let sumPrematch=0;
				let prematchQuantity=0;
				rep.forEach(item=>{
					if(item.betType=='live'){sumLive +=item.marja;liveQuantity++}
					if(item.betType=='line'){sumPrematch +=item.marja;prematchQuantity++}
				});
				sport.push({sport:sport,marja_live:sumLive/liveQuantity,marja_prematch:sumPrematch/prematchQuantity})
				callback();
			}
			});
		});
	}
	],
	(err)=>{})
	
	
	
});