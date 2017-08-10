var crypto = require('crypto');

//archive data
var bks=require('./../bklist.js').bkList_offline;

//mongo collections
var BkPPS = require('./models/mongoModel.js').BkPPS;
var CitiesInfo = require('./models/mongoModel.js').CitiesInfo;


var getRandomInt = function (min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
};



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
	let dateBegin=year+'-'+month+'-01';//beginning of the month
	let dateEnd;
	if(Number(month)<12) {
		if(Number(month)<9) dateEnd=year+'-0'+(Number(month)+1)+'-01';//beginning of the next month
		else dateEnd=year+'-'+(Number(month)+1)+'-01';
	}
	else dateEnd=(Number(year)+1)+'-01-01';
	return [dateBegin,dateEnd];
};

module.exports.getFullMonth=getFullMonth;

var getCityRegexp = function(city){
	let regexpToReturn;
	if (city!='') regexpToReturn= new RegExp('\\s'+city+',\\s', 'ui');
	else regexpToReturn=new RegExp(city, 'ui');
	return regexpToReturn;
};

module.exports.getCityRegexp=getCityRegexp;

var calculateMiddleMonthes=function (date1, date2){
	let date1_formatted = Date.parse(date1);
	let date2_formatted=Date.parse(date2);
	let diff=date2_formatted - date1_formatted;
	let dateArray=[date1];
	if(diff>0){
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

var getAllDatasFromPPS =function (dateArray, data, bk,city,regExpBk,regExpCity,callback){
	
	var i=0;
	var control=dateArray.length;
	
	startGettingPPSData(0);
	
	function startGettingPPSData(i){
		BkPPS.count({bk:{$regex:regExpBk}, address:{$regex:regExpCity}, begin:{$lte:dateArray[i]},end:{$gte:dateArray[i]}}, (err, rep)=>{
				if(rep>0) data.datas.push(rep);
				else data.datas.push(0);
				if(bk!=''&&rep>0) data.bk=bk;
				else if(rep>0)data.bk='all_bk';
				if(city!='') data.city=city;
				i++;
				if(i==control)callback(data);
				else startGettingPPSData(i);
			});
	}
}

module.exports.getAllDatasFromPPS=getAllDatasFromPPS;


module.exports.getDataForLineGraph=function(dateFrom,dateTo,regExpCity,regExpBk,bk,city,callback){
	var data={
			dates:[],
			datas:[]
		};
		var dateArray=calculateMiddleMonthes(dateFrom, dateTo);
		data.dates=dateArray;
		console.log(dateArray);
		if(dateArray) getAllDatasFromPPS(dateArray, data,bk,city,regExpBk,regExpCity,(reply)=>{
						callback(data)
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

module.exports.getCitiesStatsForBk=function(city,bk,fields,callback){
	let regExpCity = new RegExp("(?:^|(?![а-яёАЯЁ])\\W)("+city+ ")(?=(?![а-яёАЯЁ])\\W|$)", 'ui');//made it so coz citynames store in CitiesInfo as one word
	CitiesInfo.findOne({name:{$regex:regExpCity}},(err, rep)=>{
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
}
