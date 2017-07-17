var redis = require('redis');
var redisClient = redis.createClient();


module.exports.addEvent=function(req, res){
	try{
	console.log(req.body)
	let objectToWrite={};
	redisClient.hmset('eventToGrab', 'leon', req.body.leon,
									'fonbet',req.body.fonbet,
									'fonbetType',req.body.fonbetType,
									'bk888',req.body.bk888,
									'bk1xstavka',req.body.bk1xstavka,
									'winline',req.body.winline,
									'bkolimp',req.body.bkolimp,
									'baltbet',req.body.baltbet,
									'betcity',req.body.betcity,
									'ligastavok',req.body.ligastavok,
									
	(err, rep)=>{
		console.log(rep)
		res.end();
	});
	}catch(e){
		res.send('fail')
	}
};