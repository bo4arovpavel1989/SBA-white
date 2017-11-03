var crypto = require('crypto');
var async=require('async');
var easyimg = require('easyimage');
var fs=require('fs-extra');

//archive data
var bks=require('./../bklist.js').bkList_offline;

//mongo collections
var BkPPS = require('./models/mongoModel.js').BkPPS;
var CitiesInfo = require('./models/mongoModel.js').CitiesInfo;
var BkSitesStats = require('./models/mongoModel.js').BkSitesStats;


var getRandomInt = function (min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
module.exports.getRandomInt=getRandomInt;



var getStringDateAndTime = function(date){
	try{
		let year=date.getFullYear();
		let month=date.getMonth()+1;
		if(month<10) month='0'+month;
		let day=date.getDate();
		if(day<10) day='0'+day;
		let stringDate=year+'-'+month+'-'+day;
		let h, m, s, time;
		h=date.getHours();
		m=date.getMinutes();
		s=date.getSeconds();
		if(h<10)h='0' + h;
		if(m<10)h='0' + m;
		if(s<10)h='0' + s;
		time = h + ':' + m + ':' + s;
		return [stringDate,time];
	}catch(e){return false;}
};

module.exports.getStringDateAndTime=getStringDateAndTime;

module.exports.getDayOfWeek=function(){
	var d = new Date();
	var weekday = new Array(7);
	weekday[0] =  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	var n = weekday[d.getDay()];
	return n;
}

module.exports.sportSpelling = function(sport){
	var originalSpell = sport;
	sport=sport.toUpperCase();
	if (sport ==='ФУТБОЛ'||sport ==='FOOTBALL'||sport==='FUTBOL'||sport==='SOCCER') return 'футбол';
	else if (sport==='БАСКЕТБОЛ'||sport==='BASKETBALL'||sport==='BASKETBOL') return 'баскетбол';
	else if (sport==='ВОЛЕЙБОЛ'||sport==='VOLLEYBALL'||sport==='VOLEJBOL') return 'волейбол';
	else if (sport==='ХОККЕЙ'||sport==='ICE_HOCKEY'||sport==='ХОККЕЙ С ШАЙБОЙ'||sport==='ICE-HOCKEY'||sport==='XOKKEJ') return 'хоккей';
	else if(sport==='ТЕННИС'||sport==='TENNIS') return 'теннис';
	else if(sport==='ГАНДБОЛ'||sport==='HANDBALL'||sport==='GANDBOL') return 'гандбол';
	else return originalSpell;
};

module.exports.generateSSID = function (login, callback) {
	var sessionItem;
	sessionItem = getRandomInt(1, 100000);
	sessionItem = login + sessionItem;
	var hashSession = crypto.createHmac('sha256', 'dflkfgkfdlgkd')
						.update(sessionItem)
						.digest('hex');
	callback(hashSession);					
};

var getFullMonth = function(year, month){
	if (Number(month)<10)month='0'+month;
	let dateBegin=year+'-'+month+'-01';//beginning of the month
	let dateMiddle=year+'-'+month+'-15';
	let dateEnd;
	if(Number(month)<12) {
		if(Number(month)<9) dateEnd=year+'-0'+(Number(month)+1)+'-01';//beginning of the next month
		else dateEnd=year+'-'+(Number(month)+1)+'-01';
	}
	else dateEnd=(Number(year)+1)+'-01-01';
	return [dateBegin,dateEnd,dateMiddle];
};

module.exports.getFullMonth=getFullMonth;

var getCityRegexp = function(city){
	let regexpToReturn;
	if (city!='') regexpToReturn= new RegExp('\\s'+city+',\\s', 'ui');
	else regexpToReturn=new RegExp(city, 'ui');
	return regexpToReturn;
};

module.exports.getCityRegexp=getCityRegexp;

var calculateMiddleMonthes=function (date1, date2, options){
	options = options || {};
	
	let date1_formatted = Date.parse(date1);
	let date2_formatted=Date.parse(date2);
	let diff=date2_formatted - date1_formatted;
	let dateArray=[date1];
	
	if( (diff>0&&options.unlimited) || (diff<370*24*60*60*1000)){ //i get unlimited data or data for a year length
		for(let i=date1_formatted;i<=date2_formatted;){
			let checkDate=new Date(i+1000*60*60*24*30);
			let stringCheckDate=checkDate.getFullYear()+'-'+(checkDate.getMonth()+1)+'-15';
			if ((checkDate.getMonth()+1)<10) stringCheckDate=checkDate.getFullYear()+'-0'+(checkDate.getMonth()+1)+'-15';
			checkDate=Date.parse(stringCheckDate);
			if(checkDate<date2_formatted){
				dateArray.push(stringCheckDate);
			} else {
				dateArray.push(date2);
				return dateArray;
			}
			i=checkDate;
		}
	}else{
		return false;
	}
}

module.exports.calculateMiddleMonthes=calculateMiddleMonthes;

module.exports.getTrafficDataMiddleMonthes=function(bk,date1,date2,callback){
	let datesArray=calculateMiddleMonthes(date1,date2);
	var data=[];
	
	if(datesArray)getDataFromDate();
	else getOneMonthData();
	
	function getDataFromDate(){	
		let queriesArray=[];
		datesArray.forEach(date=>{
			queriesArray.push(function(callback2){
				let dateFormatted=new Date(date);
				let year=dateFormatted.getFullYear();
				let month=dateFormatted.getMonth()+1;
				let dates=getFullMonth(year,month);
				BkSitesStats.find({bk:bk,date:{$gte:dates[0],$lte:dates[1]}}).sort({date:-1}).exec((err, rep)=>{
					if(rep&&rep.length>0) data.push({date:year+'-'+month,data:rep[0].stats.totalVisits});
					else  data.push({date:year+'-'+month,data:0});
					callback2();
				});
			});
		});
		
		async.series(queriesArray, err=>{
			callback(err,data);
		});
	}
	
	function getOneMonthData(){
		let dateToFind=new Date(date1);
		let year=dateToFind.getFullYear();
		let month=dateToFind.getMonth()+1;
		let dates=getFullMonth(year,month);
		BkSitesStats.find({bk:bk,date:{$gte:dates[0],$lte:dates[1]}}).sort({date:-1}).exec((err, rep)=>{
			if(rep&&rep.length>0) data.push({date:year+'-'+month,data:rep[0].stats.totalVisits});
			else  data.push({date:year+'-'+month,data:0});
			callback(err, data);
		});
	}
};

var getAllDatasFromPPS =function (data, bk,city,regExpBk,regExpCity,callback){
	var queriesArray=[]; //array of sequence queries to DB to use in async
	
	data.dates.forEach(date=>{
		queriesArray.push(function(callback2){
			BkPPS.count({bk:{$regex:regExpBk}, address:{$regex:regExpCity}, begin:{$lte:date},end:{$gte:date}}, (err, rep)=>{
				data.datas.push(rep);
				if(bk!='') data.bk=bk;
				else data.bk='all_bk';
				if(city!='') data.city=city;
				callback2();
			});
		});	
	});
	
	async.series(queriesArray,(err)=>{
		if(!err)callback(null,data);
		else callback(err, null);
	});
}

module.exports.getAllDatasFromPPS=getAllDatasFromPPS;


module.exports.getDataForLineGraph=function(dateFrom,dateTo,regExpCity,regExpBk,bk,city,callback){
	var data={
			dates:[],
			datas:[]
		};
		var dateArray=calculateMiddleMonthes(dateFrom, dateTo);
		data.dates=dateArray;
		if(dateArray) getAllDatasFromPPS(data,bk,city,regExpBk,regExpCity,(err, reply)=>{
						if(!err)callback(reply);
						else callback(false);
					});
		else callback(false);
};

module.exports.getDataForPieGraph=function(dateFrom,regExpCity,regExpBk,bk,city,callback){
	if(bk=='')bk='Все конторы';
	var data={
		bk:bk,
		date:dateFrom,
		city:city
	};
	BkPPS.count({bk:{$regex:regExpBk}, address:{$regex:regExpCity}, begin:{$lte:dateFrom},end:{$gte:dateFrom}}, (err, rep)=>{
						data.quantity=rep;
						callback(data);
					});	
};

module.exports.getCitiesStatsForBk=function(city,bk,fields,dates,callback){
	let regExpCity = new RegExp("(?:^|(?![а-яёАЯЁ])\\W)("+city+ ")(?=(?![а-яёАЯЁ])\\W|$)", 'ui');//made it so coz citynames store in CitiesInfo as one word
	CitiesInfo.findOne({name:{$regex:regExpCity},date:{$gte:dates[0],$lte:dates[1]}},(err, rep)=>{
		var data={};
		if(rep){
			rep.bkRelation.forEach(arrayItem=>{
				if(arrayItem.bk==bk) data.bkRelation=arrayItem.relation;
			});
			rep.bkPopularity.forEach(arrayItem=>{
				if(arrayItem.bk==bk) data.bkPopularity=arrayItem.bkPopularity;
			});
		}
		callback(data);
	});
};


module.exports.getFullNameOfBk=function(bkname, callback){
	let no_coincidence=true;
	bks.forEach(bk=>{
		if(bkname===bk.bk){
			no_coincidence=false;
			callback(bk.name);
		}
	});
	if(no_coincidence)callback(false);
};


module.exports.saveThumbImage = function(size,src, dst) {
	easyimg.resize({src: src, dst: dst, width:size, height:size}, function(err, stdout, stderr) {
				console.log('wait for resize result');
				if (err) {
					fs.unlink(dst, function(err){
						console.log("Error loading image");
					});
				} 
			}).then(
					function(img) {
						console.log('Resized: ' + img.width + ' x ' + img.height);
					},
					function (err) {
						console.log(err);
						fs.unlink(src, function(err){
							console.log("Error resizing, source delete");
						});
					}
			);	
};