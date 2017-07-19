var redis = require('redis');
var redisClient = redis.createClient();
var passData=require('./../credentials.js').secret;
var Session = require('./models/mongoModel.js').Session;
var BookmakerRate = require('./models/mongoModel.js').BookmakerRate;
var BookmakerPage = require('./models/mongoModel.js').BookmakerPage;
var customFunctions = require('./customfunctions');
var formidable = require('formidable');
var generateSSID = customFunctions.generateSSID;

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