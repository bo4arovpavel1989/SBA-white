//var redis = require('redis');
//var redisClient = redis.createClient();
var passData=require('./../credentials.js').secret;
var customFunctions = require('./customfunctions');
var formidable = require('formidable');
var generateSSID = customFunctions.generateSSID;
var async=require('async');

var bkList=require('./../bklist.js').bkList;

//mongo collections
var EventToGrab = require('./models/mongoModel.js').EventToGrab;
var Session = require('./models/mongoModel.js').Session;
var BookmakerRate = require('./models/mongoModel.js').BookmakerRate;
var BookmakerPage = require('./models/mongoModel.js').BookmakerPage;
var Line = require('./models/mongoModel.js').Line;
var BkPPS = require('./models/mongoModel.js').BkPPS;
var CitiesInfo = require('./models/mongoModel.js').CitiesInfo;
var SalaryInfo = require('./models/mongoModel.js').SalaryInfo;
var Social = require('./models/mongoModel.js').Social;
var Line = require('./models/mongoModel.js').Line;
var BkSitesStats = require('./models/mongoModel.js').BkSitesStats;
var VacancyPage = require('./models/mongoModel.js').VacancyPage;
var Vacancy = require('./models/mongoModel.js').Vacancy;
var Reputation = require('./models/mongoModel.js').Reputation;
var ExpertsPage = require('./models/mongoModel.js').ExpertsPage;
var Feedback = require('./models/mongoModel.js').Feedback;
var Comment = require('./models/mongoModel.js').Comment;




module.exports.getOffline_table=function(req, res){
	try{
		let form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			let bk = fields.bk;
			let city=fields.city;
			if(!city)city='';
			let dateFrom=fields.yearFrom+'-'+fields.monthFrom+'-15';//15-th of the month - its middle
			let dateTo=fields.yearTo+'-'+fields.monthTo+'-15';//15-th of the month - its middle
			let regExpCity = customFunctions.getCityRegexp(city);//made it so coz citynames store in BkPPS as part of address
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
			let city=fields.city;
			let region=fields.region;
			let dates=customFunctions.getFullMonth(fields.year,fields.month);			
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
					SalaryInfo.findOne({region:{$regex:region},date:{$gte:dates[0],$lte:dates[1]}},(err, rep)=>{
						if(rep) data.salary=rep.salary;
						callback();
					});
				},
				(callback)=>{   //getting CitiesStats for all bk (popularity of bookmakers itself)
					 CitiesInfo.findOne({name:{$regex:regExpCity},date:{$gte:dates[0],$lte:dates[1]}},(err, rep)=>{
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

module.exports.getOnlineTrafficData=function(req, res){
	try{
		let form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			let bk=fields.bk;
			var data={bk:bk};
			async.parallel([
			(callback)=>{
				let dates=customFunctions.getFullMonth(fields.yearFrom,fields.monthFrom);
				BkSitesStats.findOne({bk:bk,date:{$gte:dates[0],$lte:dates[1]}}).sort({date:-1}).exec((err, rep)=>{
					if(rep) data.first=rep;
					callback();
				});
			},
			(callback)=>{
				let dates=customFunctions.getFullMonth(fields.yearTo,fields.monthTo);
				BkSitesStats.findOne({bk:bk,date:{$gte:dates[0],$lte:dates[1]}}).sort({date:-1}).exec((err, rep)=>{
					if(rep) data.now=rep;
					callback();
				});
			},
			(callback)=>{
				let date1=fields.yearFrom+'-'+fields.monthFrom+'-15';
				let date2=fields.yearTo+'-'+fields.monthTo+'-15';
				customFunctions.getTrafficDataMiddleMonthes(bk,date1,date2,(err, rep)=>{
					if(rep) data.graph=JSON.stringify(rep);
					callback();
				});
			}
			],
			(err)=>{
				console.log(data);
				if(err)res.status(500).send('error');
				else res.render('components/online_traffic-data',data);
				
			});
		});
	}catch(e){
		res.send(false);
	}
};

module.exports.getOnlineReputationData=function(req, res){
		try{
			let form = new formidable.IncomingForm();
			form.type = 'multipart/form-data';
			form.parse(req, function(err, fields, files) {
				let bk=fields.bk;
				let data={bk:bk};	
				let dateFrom=fields.yearFrom+'-'+fields.monthFrom+'-01';
				let dateTo=fields.yearTo+'-'+fields.monthTo+'-28';
				let datesFrom=customFunctions.getFullMonth(fields.yearFrom,fields.monthFrom);
				let sources=['intelbet.ru','bookmaker-ratings.ru','sports.ru','otzovik.com','vprognoze.ru','zheleznaya stavka (VK)'];
				let index=customFunctions.getRandomInt(0, sources.length-1);
				async.parallel([
				(callback)=>{
					Feedback.find({bk: bk,source:sources[index]},'feedbackText source').sort({date:-1}).limit(5).exec((err, rep)=>{
						data.lastComments=rep;
						callback();
					});
				},
				(callback)=>{
					Feedback.find({bk:bk, date:{$gte:dateFrom,$lte:dateTo}},'source isPositive isNegative isNeutral usermark',function(err, rep){
						data.feedback=rep;
						callback();
					});
				}
				],
				(err)=>{
					if(err)res.status(500).send('error');
					else res.send(data);
				});
			});
		}catch(e){
			res.send(false);
		}
};

module.exports.getEmployementData=function(req, res){
	try{
		let form = new formidable.IncomingForm();
		form.type = 'multipart/form-data';
		form.parse(req, function(err, fields, files) {
			let bk=fields.bk;
			let data={bk:bk};	
			let city=fields.city;
			if(!city)city='';
			let regExpCity = new RegExp(city, 'ui');//made it so coz citynames store in CitiesInfo as one word
			let regExpBk=new RegExp(bk, 'ui');
			let dateFrom=fields.yearFrom+'-'+fields.monthFrom+'-01';
			let dateTo=fields.yearTo+'-'+fields.monthTo+'-28';
			if(bk.length>0)Vacancy.find({bk:{$regex:regExpBk}, area:{$regex:regExpCity},created_at:{$gte:dateFrom,$lte:dateTo}},(err, rep)=>{
								console.log(rep.length);
								res.send(rep);
							});
			else Vacancy.find({area:{$regex:regExpCity},created_at:{$gte:dateFrom,$lte:dateTo}},(err, rep)=>{
								console.log(rep.length);
								res.send(rep);
							});
		});
	}catch(e){
		res.send(false);
	}
};

//admin route handlers

var mongoEditPageModels={
	editrateform:BookmakerRate,
	editbkpageform:BookmakerPage,
	editsocialform:Social,
	editlineform:Line,
	edittrafficform:BkSitesStats,
	editvacancyform:VacancyPage,
	editreputationform:Reputation,
	editexpertsform:ExpertsPage
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


module.exports.getEditPagesForm=function(req, res){
	let form = new formidable.IncomingForm();
	form.type = 'multipart/form-data';
	form.parse(req, function(err, fields, files) {
		let bk = fields.bk;
		let dates=customFunctions.getFullMonth(fields.year,fields.month);
		console.log(dates);
		let collection=mongoEditPageModels[fields.formname];
		console.log(bk)
		console.log(collection)
		if(collection) collection.find({bk:bk,date:{$gte:dates[0],$lte:dates[1]}}).sort({date:-1}).limit(1).exec((err, rep)=>{
							let data={};
							if(rep) data=rep[0];
							console.log(data);
							res.render('forms/'+fields.formname,data);
						});
		else res.status(404).send('fail');
	});
};

module.exports.editFormHandler=function(req, res){
	let formName=req.query.q;
	let collection=mongoEditPageModels[formName];
	console.log(req.body);
	if(collection&&req.body._id)collection.update({_id:req.body._id}, {$set:req.body}, {upsert:false}).exec((err, rep)=>{
									console.log(rep);
									if(!err) res.redirect('/admin')
										else res.end('An error occured: ' + error);
								});
	else res.status(404).send('fail');				
};

module.exports.getEditBKRateForm=function(req, res){
	let form = new formidable.IncomingForm();
	form.type = 'multipart/form-data';
	form.parse(req, function(err, fields, files) {
		let bk = fields.bk;
		var data={};
		BookmakerRate.findOne({bk:bk},function(err,rep){
			if(rep)data=rep;
			data.bk=bk;
			res.render('forms/editrateform',data);
		});	
	});
};

module.exports.editBKRate=function(req, res){
	BookmakerRate.update({bk:req.body.bk},{$set:req.body},{upsert:true}).exec();
	res.redirect('/admin')
};

module.exports.getRateTotalTable=function(req, res){
	var data={bks:[]};
	var control=0;
	for (var i=0;i<bkList.length;i++){
		BookmakerRate.find({bk:bkList[i].bk},(err, rep)=>{
			if(rep){
				data.bks.push(rep[0]);
			}
			control++;
			if(control>=bkList.length)res.render('forms/ratetotaltable',data)
		});
	}
};

module.exports.editBkRateTotalTable=function(req, res){
	console.log(req.body)
	var bkArray=[];
	var dataObject={};
	for (var prop1 in req.body){
		if (bkArray.indexOf(prop1.split('.')[0])==-1) {
			bkArray.push(prop1.split('.')[0]);
			dataObject[prop1.split('.')[0]]={};
		}	
	}
	for (var prop2 in req.body){
		dataObject[prop2.split('.')[0]][prop2.split('.')[1]] = req.body[prop2];
	}
	var control=0;
	for (var prop3 in dataObject){
		let bkToUpdate=prop3;
		let updateData=dataObject[prop3]
		BookmakerRate.update({bk:bkToUpdate},{$set:updateData}).exec((err, rep)=>{
			control++;
			if(control>=bkArray.length) res.redirect('/admin')
		});
	}
};

//old handlers

module.exports.addEvent=function(req, res){
	try{
		console.log(req.body)
		let objectToWrite={};
		objectToWrite=req.body;
		objectToWrite.date = new Date();
		let eventToGrab = new EventToGrab(objectToWrite).save();
		res.end();
	}catch(e){
		res.send('fail')
	}
};