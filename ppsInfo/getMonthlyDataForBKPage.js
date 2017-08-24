var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var BookmakerPage = require('./../lib/models/mongoModel.js').BookmakerPage;
var customFunctions = require('./../lib/customfunctions');
var bkList=require('./../bklist.js').bkList;
var async=require('async');
var date=new Date();
var year=date.getFullYear();
var month=date.getMonth();
if (month == 0){year = year-1;month=12};//i get data of pervious month;
var dates=customFunctions.getFullMonth(year,month);


getPPSData(0);

function getPPSData(i){
	var data={};
	var twoMonthAgoQuantity=0;
	async.parallel([
	(callback)=>{
		BkPPS.count({bk:bkList[i].bk, begin:{$lte:dates[1]},end:{$gte:dates[1]}},function(err, rep){
			data.totalQuantity=rep;
			callback();
		});
	},
	(callback)=>{
		let twoMonthAgo=new Date(dates[0]);
		twoMonthAgo=twoMonthAgo-30*24*60*60*1000;
		BkPPS.count({bk:bkList[i].bk, begin:{$lte:twoMonthAgo},end:{$gte:twoMonthAgo}},function(err, rep){
			twoMonthAgoQuantity=rep;
			callback();
		});
	}
	],(err)=>{
		data.dynamics=data.totalQuantity-twoMonthAgoQuantity;
		console.log(bkList[i].bk);
		console.log(data);
		BookmakerPage.update({bk:bkList[i].bk,date:{$gte:dates[0],$lte:dates[1]}},{$set:{pps:data}},{upsert:true}).exec((err, rep)=>{
			i++;
			if(i<bkList.length)getPPSData(i);
			else console.log('done');
		});
	});
}