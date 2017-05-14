



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