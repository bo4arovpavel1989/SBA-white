var BkSitesStats = require('./models/mongoModel.js').BkSitesStats;
var BookmakerRate = require('./models/mongoModel.js').BookmakerRate;
var bkList=require('./../bklist.js').bkList;



module.exports.getMainPage=function(req, res){
	BookmakerRate.find({}).sort({totalRate: -1}).exec((err, rep)=>{
		if(rep){
			let data={};
			data.bk=rep;
			data.layout='main'
			res.render('pages/main', data);
		}
	});
	
};

module.exports.getOnlinePage=function(req, res){
	BookmakerRate.find({}).sort({totalRate: -1}).exec((err, rep)=>{
		if(rep){
			let data={};
			data.bk=rep;
			data.layout='main'
			res.render('pages/online', data);
		}
	});
};

module.exports.showInfo = function(req, res){
	var today = new Date();
	var yesterday = today - 1000 * 60 * 60 * 24;
	var data = {
		site: [],
		date: today
	};
	BkSitesStats.find({date: {$gt: yesterday}}, function(err, rep){
		if (rep) data.site = rep.reverse();
		console.log(rep);
		res.render('pages/bksitesinfo', data);
	})
};

module.exports.getPPSMapPage=function(req, res){
	res.sendFile('yamap.html', {'root':__dirname + '/../views/static/'});
};
module.exports.getPPSHeatMapPage=function(req, res){
	res.sendFile('yaHeatMap.html', {'root':__dirname + '/../views/static/'});
};

module.exports.getPPSPieMapPage=function(req, res){
	res.sendFile('yaPieMap.html', {'root':__dirname + '/../views/static/'});
};

module.exports.getPPS=function(req, res){
	let bkpps=req.params.id;
	res.sendFile(__dirname + '/bkpps/' + bkpps);
};

module.exports.getEventAddForm=function(req, res){
	res.sendFile('eventaddform.html', {'root':__dirname + '/../views/static/'});
};

module.exports.getEventPage=function(req, res){
	res.sendFile('eventpage.html', {'root':__dirname + '/../views/static/'});
};
module.exports.getAdminPage=function(req, res){
	let data={bk:bkList};
	res.render('pages/admin', data);	
}