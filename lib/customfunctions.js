var crypto = require('crypto');

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
