var redis = require('redis');
var redisClient = redis.createClient();
var passData=require('./../credentials.js').secret;
var Session = require('./models/mongoModel.js').Session;
var BookmakerRate = require('./models/mongoModel.js').BookmakerRate;
var BookmakerPage = require('./models/mongoModel.js').BookmakerPage;
var customFunctions = require('./customfunctions');
var BkPPS = require('./models/mongoModel.js').BkPPS;
var CitiesInfo = require('./models/mongoModel.js').CitiesInfo;
var SalaryInfo = require('./models/mongoModel.js').SalaryInfo;
var formidable = require('formidable');
var generateSSID = customFunctions.generateSSID;
var async=require('async');

module.exports.getOffline_table=function(req, res){
	try{
		let form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			let bk = fields.bk;
			if(bk=='-')bk='';
			let city=fields.city;
			if(!city)city='';
			let dateFrom=fields.yearFrom+'-'+fields.monthFrom+'-15';//15-th of the month - its middle
			let dateTo=fields.yearTo+'-'+fields.monthTo+'-15';//15-th of the month - its middle
			let regExpCity = customFunctions.getCityRegexp(city);//made it so coz citynames store in BkPPS as part of address
			console.log(regExpCity);
			let regExpBk=new RegExp(bk, 'ui');
			var data={};
			async.parallel([
				(callback)=>{
					BkPPS.count({bk:{$regex:regExpBk}, address:{$regex:regExpCity}, begin:{$lte:dateFrom},end:{$gte:dateFrom}}, (err, rep)=>{
						data.yearFromQuantity=rep;
						data.yearFrom=fields.yearFrom+'-'+fields.monthFrom;
						callback();
					});		
				},
				(callback)=>{
					BkPPS.count({bk:{$regex:regExpBk}, address:{$regex:regExpCity},  begin:{$lte:dateTo},end:{$gte:dateTo}}, (err, rep)=>{
						data.yearToQuantity=rep;
						data.yearTo=fields.yearTo+'-'+fields.monthTo;
						callback();
					});	
				},
				(callback)=>{
					if(bk!='')customFunctions.getFullNameOfBk(bk, (rep)=>{
						if(rep) data.bk=rep;
						callback();
					});
					else {
						 data.bk='Все конторы';
						 callback();
					}
				},
				(callback)=>{
					if(city!='') data.city=city;
					callback();
				}
			],
			(err)=>{
				res.render('components/offline_table-table',data);
			});
		});
	}catch(e){
		res.send('fail')
	}
};

module.exports.getOffline_graph=function(req, res){
	try{
		let form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			let bk = fields.bk;
			if(bk=='-')bk='';
			let city=fields.city;
			if(!city)city='';
			let dateFrom=fields.yearFrom+'-'+fields.monthFrom+'-15';
			let dateTo=fields.yearTo+'-'+fields.monthTo+'-15';
			let regExpCity = customFunctions.getCityRegexp(city);//made it so coz citynames store in BkPPS as part of address
			let regExpBk=new RegExp(bk, 'ui');
			let graph=fields.graph;
			if(graph==='linegraph'){
				customFunctions.getDataForLineGraph(dateFrom,dateTo,regExpCity,regExpBk,bk,city,(rep)=>{
					res.send(rep);
				});
			}
			else if(graph==='piegraph'){
				customFunctions.getDataForPieGraph(dateFrom,regExpCity,regExpBk,bk,city,(rep)=>{
					res.send(rep);
				});
			}
		});
	}catch(e){
		res.send(false);
	}
};

module.exports.getOffline_region_potential=function(req, res){
	try{
		let form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			let bk = fields.bk;
			if(bk=='-')bk='';
			let city=fields.city;
			let region=fields.region;
			
			let dateBegin=fields.year+'-'+fields.month+'-01';//beginning of the month
			let dateEnd;
			if(Number(fields.month)<12) {
				if(Number(fields.month)<9) dateEnd=fields.year+'-0'+(Number(fields.month)+1)+'-01';//beginning of the next month
				else dateEnd=fields.year+'-'+(Number(fields.month)+1)+'-01';
				}
			else dateEnd=(Number(fields.year)+1)+'-01-01';
			
			let regExpCity = new RegExp("(?:^|(?![а-яёАЯЁ])\\W)("+city+ ")(?=(?![а-яёАЯЁ])\\W|$)", 'ui');//made it so coz citynames store in CitiesInfo as one word
			let regExpBk=new RegExp(bk, 'ui');
			let RegExpRegion=new RegExp(region,'ui');
			
			var data={
				dateToFind:fields.year+'-'+fields.month,
				city:city,
				bk:bk,
				salary:'?',
				allBkRelation:'?',
				sportPopularity:'?',
				bkPopularity:'-',
				bkRelation:'-'
			};
			
			async.parallel([
				(callback)=>{  //getting salary info for region
					SalaryInfo.findOne({region:{$regex:region},date:{$gte:dateBegin,$lte:dateEnd}},(err, rep)=>{
						if(rep) data.salary=rep.salary;
						callback();
					});
				},
				(callback)=>{   //getting CitiesStats for all bk (popularity of bookmakers itself)
					 CitiesInfo.findOne({name:{$regex:regExpCity},date:{$gte:dateBegin,$lte:dateEnd}},(err, rep)=>{
						if(rep) {
								data.allBkRelation=rep.bkRelation[0]?rep.bkRelation[0]:'?';
								data.sportPopularity=rep.bkPopularity[0]?rep.bkPopularity[0]:'?';
							} 
						callback();
					});
				},
				(callback)=>{ //getting info for certain bk
					if(bk!=='')customFunctions.getCitiesStatsForBk(city,bk,fields,(reply)=>{
									data.bkPopularity=reply.bkPopularity?reply.bkPopularity:'?';
									data.bkRelation=reply.bkRelation?reply.bkRelation:'?';
									callback();
							});
					else callback();		
				}
			],(err)=>{
				console.log(data);
				res.render('components/offline_region_potential-table',data);
			});
			
				
		});
	}catch(e){
		res.send(false);
	}
};


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

module.exports.loginHandler = function (req, res) {
				console.log(req.body['login']);
				console.log(req.body['password']);	
				var login = req.body['login'];
				var passwd = req.body['password'];
				var loginUpperCase = login.toUpperCase();
				if(loginUpperCase===passData.authData.login.toUpperCase()&&passwd===passData.authData.pass){
					Session.find({login: passData.authData.login}).remove().exec(function(){/*deleting old session*/
								generateSSID(login, function(SSID){
									var session = new Session({login: passData.authData.login, session: SSID}).save(function(err, rep){
										res.cookie('ssid', SSID, {maxAge: 3600000});
										res.cookie('login', login, {maxAge: 3600000});
										res.redirect('/admin');
									});
								});	
							});
				}else {res.end('wrong password');}
};

module.exports.getEditRateForm=function(req,res){
	let form = new formidable.IncomingForm();
	form.type = 'multipart/form-data';
	form.parse(req, function(err, fields, files) {
		let bk = fields.bk;
		BookmakerRate.findOne({bk:bk},(err, rep)=>{
			let data={};
			if(rep) data=rep;
			data.bk=bk;
			res.render('forms/editrateform',data);
		});
	});
};

module.exports.editRate=function(req, res){
	let data = req.body;
	BookmakerRate.update({bk:req.body.bk}, data, {upsert:true}).exec((err, rep)=>{
		if(!err) res.redirect('/admin')
			else res.end('An error occured: ' + error);
	});
};

module.exports.getEditBkPageForm=function(req, res){
	let form = new formidable.IncomingForm();
	form.type = 'multipart/form-data';
	form.parse(req, function(err, fields, files) {
		let bk = fields.bk;
		BookmakerPage.findOne({bk:bk},(err, rep)=>{
			let data={};
			if(rep) data=rep;
			data.bk=bk;
			res.render('forms/editbkpageform',data);
		});
	});
};

module.exports.editBkPage=function(req, res){
	let data = req.body;
	BookmakerPage.update({bk:req.body.bk}, data, {upsert:true}).exec((err, rep)=>{
		if(!err) res.redirect('/admin')
			else res.end('An error occured: ' + error);
	});
};