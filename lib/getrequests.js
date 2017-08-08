var BkSitesStats = require('./models/mongoModel.js').BkSitesStats;
var BookmakerRate = require('./models/mongoModel.js').BookmakerRate;
var BookmakerPage = require('./models/mongoModel.js').BookmakerPage;
var Line = require('./models/mongoModel.js').Line;
var bkList=require('./../bklist.js').bkList;
var bkList_offline=require('./../bklist.js').bkList_offline;
var regionList=require('./../archive/regions.js').regionList;
var CitiesInfo = require('./models/mongoModel.js').CitiesInfo;
var Reputation = require('./models/mongoModel.js').Reputation;
var Social = require('./models/mongoModel.js').Social;
var Comment = require('./models/mongoModel.js').Comment;
var customFunctions=require('./customfunctions.js');
var async=require('async');


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

module.exports.getBookmakerPage=function(req, res){
	console.log(req.params.id);
	if(req.params.id) BookmakerPage.find({bk: req.params.id}).sort({date:-1}).limit(1).exec((err, rep)=>{
		if(rep){
			let data={layout:'main'};
			data.bk=rep[0];
			res.render('pages/bookmakerpage', data);
		}
	});
};

module.exports.getLinePage=function(req, res){
	if(req.params.id) Line.find({bk: req.params.id}).sort({date:-1}).limit(1).exec((err, rep)=>{
		if(rep){
			let data={layout:'main'};
			data.bk=rep[0];
			res.render('pages/linepage', data);
		}
	});
};

module.exports.getReputationPage=function(req, res){
	if(req.params.id) {
		let data={layout:'main'}
		async.parallel([
		(callback)=>{
			Reputation.find({bk: req.params.id}).sort({date:-1}).limit(1).exec((err, rep)=>{
			if(rep)data.bk=rep[0];
			callback();
		});
		},
		(callback)=>{
			Comment.find({bk: req.params.id}).sort({date:-1}).limit(5).exec((err, rep)=>{
				if(rep)data.lastComments=rep;
				callback();
			});
		}
		],
		(err)=>{
				res.render('pages/reputationpage', data);
		});	
	} else {res.status(404).send('fail')}
};

module.exports.getSocialPage=function(req, res){
	if(req.params.id) {
		let data={layout:'main'}
		Social.find({bk: req.params.id}).sort({date:-1}).limit(1).exec((err, rep)=>{
			if(rep)	data.bk=rep[0];
			res.render('pages/socialpage', data);
		});	
	} else {res.status(404).send('fail')}
};

module.exports.getTrafficPage=function(req, res){
	if(req.params.id) {
		let data={layout:'main'}
		BkSitesStats.find({bk: req.params.id}).sort({date:-1}).limit(1).exec((err, rep)=>{
			if(rep)	data.bk=rep[0];
			res.render('pages/trafficpage', data);
		});	
	} else {res.status(404).send('fail')}
};

module.exports.getOfflinePage=function(req, res){
	let data={layout:'main',bk:bkList_offline};
	res.render('pages/offline', data);
};

module.exports.getOfflineComponent=function(req, res){
	let query=req.params.id;
	let data={bk:bkList_offline, region:regionList};
	res.render('tabs/'+query, data);
};


module.exports.getCitiesOfRegion=function(req, res){
	let region=req.query.region;
	let month=req.query.month;
	let year=req.query.year;
	let dates=customFunctions.getFullMonth(year,month);
	region = new RegExp(region,'ui');
	
	CitiesInfo.find({region:{$regex:region},date:{$gte:dates[0],$lte:dates[1]}},(err, rep)=>{
		var data={city:[]};
		if(rep) rep.forEach(reply=>{
					data.city.push(reply.name);
				});
		res.render('components/citiesofregion', data);
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
	res.sendFile(__dirname + '/bkpps/'+bkpps);
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