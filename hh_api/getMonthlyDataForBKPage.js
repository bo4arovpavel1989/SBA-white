var Vacancy = require('./../lib/models/mongoModel.js').Vacancy;
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
		Vacancy.count({bk:bkList[i].bk},function(err, rep){
			data.opened=rep;
			callback();
		});
	},
	(callback)=>{
		//last month
		Vacancy.count({bk:bkList[i].bk,created_at:{$gte:dates[0],$lte:dates[1]}},function(err, rep){
			data.lastopened=rep;
			callback();
		});
	}
	],
	(err)=>{
		console.log(err)
		console.log(dates);
		BookmakerPage.update({bk:bkList[i].bk,date:{$gte:dates[0],$lte:dates[1]}},{$set:{vacancy:data}},{upsert:true}).exec((err, rep)=>{
			i++;
			if(i<bkList.length) getDataForBKPage(i);
			else console.log('done');
		})
	});
	
}