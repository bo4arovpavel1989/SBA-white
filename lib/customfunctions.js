var crypto = require('crypto');

var BkPPS = require('./models/mongoModel.js').BkPPS;

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

module.exports.calculateMiddleMonthes=function(date1, date2){
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

module.exports.getAllDatasFromPPS=function(dateArray, data, bk,city,regExpBk,regExpCity,callback){
	
	var i=0;
	var control=dateArray.length;
	
	startGettingPPSData(0);
	
	function startGettingPPSData(i){
		BkPPS.count({bk:{$regex:regExpBk}, address:{$regex:regExpCity}, begin:{$lte:dateArray[i]},end:{$gte:dateArray[i]}}, (err, rep)=>{
				if(rep>0) data.datas.push(rep);
				else data.datas.push(0);
				if(bk!=''&&rep>0) data.bk=bk;
				else if(rep>0)data.bk='Все конторы';
				if(city!='') data.city=city;
				i++;
				if(i==control)callback(data);
				else startGettingPPSData(i);
			});
	}
}

