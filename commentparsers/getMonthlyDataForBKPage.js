var Feedback = require('./../lib/models/mongoModel.js').Feedback;
var BookmakerPage = require('./../lib/models/mongoModel.js').BookmakerPage;
var customFunctions = require('./../lib/customfunctions');
var bkList=require('./../bklist.js').bkList;
var async=require('async');
var date=new Date();
var year=date.getFullYear();
var month=date.getMonth();
if (month == 0){year = year-1;month=12};//i get data of pervious month;
var dates=customFunctions.getFullMonth(year,month);

getDataForBKPage(0);

function getDataForBKPage(i){
	var data={};
	async.parallel([
	(callback)=>{
		//total
		Feedback.count({bk:bkList[i].bk},function(err, rep){
			data.totalFeedbacks=rep;
			callback();
		});
	},
	(callback)=>{
		//negative
		Feedback.count({bk:bkList[i].bk,isNegative:true},function(err, rep){
			data.negativeFeedbacks=rep;
			callback();
		});
	},
	(callback)=>{
		//positive
		Feedback.count({bk:bkList[i].bk,isPositive:true},function(err, rep){
			data.positiveFeedbacks=rep;
			callback();
		});
	},
	(callback)=>{
		//neutral
		Feedback.count({bk:bkList[i].bk,isNeutral:true},function(err, rep){
			data.neutralFeedbacks=rep;
			callback();
		});
	}
	],
	(err)=>{
		console.log(err)
		console.log(dates);
		BookmakerPage.update({bk:bkList[i].bk,date:{$gte:dates[0],$lte:dates[1]}},{$set:{reputation:data}},{upsert:true}).exec((err, rep)=>{
			i++;
			if(i<bkList.length) getDataForBKPage(i);
			else console.log('done');
		})
	});
	
}

