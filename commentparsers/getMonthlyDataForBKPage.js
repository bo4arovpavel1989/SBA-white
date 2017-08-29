var Feedback = require('./../lib/models/mongoModel.js').Feedback;
var customFunctions = require('./../lib/customfunctions');
var bks=require('./../bklist.js').bkList;
var date=new Date();
var year=date.getFullYear();
var month=date.getMonth();
if (month == 0){year = year-1;month=12};//i get data of pervious month;
var dates=customFunctions.getFullMonth(year,month);

getDataForBKPage(0);

function getDataForBKPage(i){
	Feedback.find({bk:bks[i].bk})
}