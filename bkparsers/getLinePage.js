var async=require('async');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var BookmakerPage = require('./../lib/models/mongoModel.js').BookmakerPage;
var Line = require('./../lib/models/mongoModel.js').Line;
var customFunctions = require('./../lib/customfunctions');
var bkList=require('./../bklist.js').bkList;
var sportList=['футбол','баскетбол','волейбол','хоккей','теннис','гандбол'];
var date=new Date();
var year=date.getFullYear();
var month=date.getMonth();
if (month == 0){year = year-1;month=12};//i get data of pervious month;
var dates=customFunctions.getFullMonth(year,month);


getLinePageDate(0)


function getLinePageDate(i){
	var liveMarja, lineMarja, sports;
	sport=[];	
	var data={bk:bkList[i].bk,name:bkList[i].name,date:dates[2]};
	console.log('start doing '+ bkList[i].bk);
	async.parallel([
	(callback)=>{
		Coefficient.find({bk:bkList[i].bk,betType:'live', date:{$gte:dates[0],$lte:dates[1]}},function(err,rep){
			if(rep){
				let sum=0;
				let quantity=0;
				rep.forEach(item=>{
					if(!isNaN(Number(item.marja))){sum +=Number(item.marja);quantity++;}
				});
				liveMarja=(sum/quantity).toFixed(2);
				console.log(bkList[i].bk);
				console.log('live marja '+liveMarja);
			}
			callback();
		});
	},
	(callback)=>{
		Coefficient.find({bk:bkList[i].bk,betType:'line', date:{$gte:dates[0],$lte:dates[1]}},function(err,rep){
			if(rep){
				let sum=0;
				let quantity=0;
				rep.forEach(item=>{
					if(!isNaN(Number(item.marja))){sum +=Number(item.marja);quantity++;}
				});
				lineMarja=(sum/quantity).toFixed(2);
				console.log(bkList[i].bk);
				console.log('line marja '+lineMarja);
			}
			callback();
		});
	},
	(callback)=>{
		var control=0;
		sportList.forEach(sportType=>{
			Coefficient.find({bk:bkList[i].bk,sport:sportType,date:{$gte:dates[0],$lte:dates[1]}},function(err,rep){
				if(rep){
					let sumLive=0;
					let liveQuantity=0;
					let sumPrematch=0;
					let prematchQuantity=0;
					rep.forEach(item=>{
						if(item.betType=='live'&&!isNaN(Number(item.marja))){sumLive +=Number(item.marja);liveQuantity++}
						if(item.betType=='line'&&!isNaN(Number(item.marja))){sumPrematch +=Number(item.marja);prematchQuantity++}
					});
					sport.push({sport:sportType,marja_live:(sumLive/liveQuantity).toFixed(2),marja_prematch:(sumPrematch/prematchQuantity).toFixed(2)});
					console.log(bkList[i].bk);
					console.log('sport marja '+sportType + ' live - ' + sumLive/liveQuantity + ' line - ' + sumPrematch/prematchQuantity);
					control++;
					if(control==sportList.length)callback();
				} else callback();
			});
		});
	}
	],
	(err)=>{
		data.marja_live=liveMarja;
		data.marja_prematch=lineMarja;
		data.marja_by_sport=sport;
		console.log(data);
		BookmakerPage.update({bk:bkList[i].bk,date:{$gte:dates[0],$lte:dates[1]}},{$set:{'line.marja_prematch':lineMarja,'line.marja_live':liveMarja}},{upsert:true}).exec();
		var linePage=new Line(data).save((err, rep)=>{
			i++;
			if(i<bkList.length)getLinePageDate(i);
			else console.log('done')
		});
	});
}