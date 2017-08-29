var Feedback = require('./../lib/models/mongoModel.js').Feedback;
var customFunctions = require('./../lib/customfunctions');
var bks=require('./../bklist.js').bkList;
var async=require('async');

getDataForBKPage(0);

function getDataForBKPage(i){
	async.parallel([
	(callback)=>{
		//total
	},
	(callback)=>{
		//negative
	},
	(callback)=>{
		//positive
	},
	(callback)=>{
		//neutral
	}
	],
	(err)=>{
		
	});
	Feedback.find({bk:bks[i].bk},function(err, reps){
		
	});
}