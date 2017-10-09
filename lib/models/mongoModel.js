var mongoose = require('mongoose');
var secret=require('./../../credentials.js').secret;
mongoose.connect('mongodb://109.120.170.187:27017/sba', {user:secret.mongo.login, pass:secret.mongo.pass});
//mongoose.connect('mongodb://localhost/sba', {user:secret.mongo.login, pass:secret.mongo.pass});
mongoose.Promise = global.Promise;


var BookmakerPage = new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	date: {type: Date},
	reputation: {type: Object},
	product: {type: Object},
	traffic: {type: Object},
	social: {type:Object},
	vacancy:{type:Object},
	line:{type:Object},
	pps:{type:Object},
	expert:{type:Object}
});

var BookmakerRate = new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	totalRate: {type: Number},
	reputation: {type: Number},
	playerFeedbackRate: {type: Number},
	onlineShareRate: {type: Number},
	offlineShareRate: {type: Number},
	totalShareRate: {type: Number},
	profit: {type: Number},
	expertsMark: {type: Number},
	marja: {type: Number},
	marja_live:{type: Number},
	social:{type: Number},
	product:{type: Number},
	massMedia: {type: Number},
	searchTraffic: {type: Number},
	directTraffic: {type: Number}
});

var Line = new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	date: {type: Date},
	sportQuantity: {type: Number},
	marketQuantity: {type: Number},
	eventQuantity:{type: Number},
	marja_prematch:{type:Number},
	marja_live:{type:Number},
	marja_by_sport:{type:Array},
	events:{type:Array}
});

var Reputation = new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	date: {type: Date},
	comments:{type: Array}
});

var Social=new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	date: {type: Date},
	dayOfWeek:{type:String},
	vk:{type: Object},
	fb:{type: Object},
	instgm:{type: Object},
	ytb:{type: Object}
});

var VacancyPage=new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	date: {type: Date}
});

var ExpertsPage=new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	date: {type: Date}
});

var BkSitesStats = new mongoose.Schema({
	date: {type: Date},
	bk:{type: String},
	name:{type: String},
	stats: {type: Object}
});

var BkPPS=new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	begin:{type:Date},
	end:{type:Date},
	lat: {type: Number},
	lon: {type: Number},
	address: {type: String}
});


var BkPPSCoordinates=new mongoose.Schema({
	bk:{type: String},
	year:{type:Number},
	month:{type:Number},
	name:{type: String},
	data:{type: Object}
});

var CitiesInfo=new mongoose.Schema({ //thats collection of cities from wiki
	name: {type: String},
	region: {type: String},
	date: {type: Date, default: Date.now},
	population: {type: Number},
	bkPopularity: {type: Array},
	bkQuantity: {type: Number},
	bkRelation: {type: Array},
	coordinates: {type: Array},
	salary: {type: String},
	potentialCoefficient: {type: Array}
});

var SalaryInfo=new mongoose.Schema({ //thats collection of regions from parsed wiki
	region: {type: String},
	date: {type: Date},
	salary: {type: Number}
});

var Coefficient=new mongoose.Schema({
	bk:{type: String},
	date:{type: Date},
	betType: {type: String},
	averageType: {type: String},
	sport: {type: String},
	marja: {type: Number},
	win: {type: String},
	draw: {type: String},
	away: {type: String}
});
 
var Feedback=new mongoose.Schema({
	bk: {type: String},
	source: {type: String},
	type: {type: String},
	usermark:{type:Number},
	feedbackText:{type: String, unique: true},
	isPositive: {type: Boolean, default: false},
	positive: {type: String},
	isNegative: {type: Boolean, default: false},
	negative: {type: String},
	neutral: {type: String},
	isNeutral: {type: Boolean, default: false},
	date: {type: Date}
});

var Comment=new mongoose.Schema({
	bk: {type: String},
	source: {type: String},
	type: {type: String},
	comment: {type: String, unique: true},
	engComment: {type: String},
	date: {type: Date}
});

var Complaint=new mongoose.Schema({
	bk: {type: String},
	source: {type: String},
	type: {type: String},
	heading: {type: String},
	complaint: {type: String, unique: true},
	date: {type: Date},
	status: {type: String}
});

var Vacancy=new mongoose.Schema({
	company: {type: String},
	type: {type: String},
	area: {type: String},
	salary: {type: String},
	description: {type: String},
	date: {type: Date, default: Date.now},
	link: {type: String}
});

var Session = new mongoose.Schema({
	login: {type: String, required: true},
	session: {type: String, require: true},
	date: {type: Date, expires: 3600, default: Date.now}
});

var EventToGrab = new mongoose.Schema({
	date:{type:Date},
	leon:{type: String},
	fonbet:{type: String},
	baltbet:{type: String},
	bk888:{type: String},
	bk1xstavka:{type: String},
	winline:{type: String},
	bkolimp:{type: String},
	ligastavok:{type: String},
	betcity:{type: String}
});

module.exports.EventToGrab = mongoose.model('eventtograb', EventToGrab);
module.exports.Session = mongoose.model('sessiondata', Session);
module.exports.Line = mongoose.model('line', Line);
module.exports.ExpertsPage = mongoose.model('expertspage', ExpertsPage);
module.exports.VacancyPage = mongoose.model('vacancypage', VacancyPage);
module.exports.Reputation = mongoose.model('reputation', Reputation);
module.exports.Social = mongoose.model('social', Social);
module.exports.BookmakerPage = mongoose.model('bookmakerpage', BookmakerPage);
module.exports.BookmakerRate = mongoose.model('bookmakerrate', BookmakerRate);
module.exports.Vacancy = mongoose.model('vacancy', Vacancy);
module.exports.Complaint = mongoose.model('complaint', Complaint);
module.exports.Comment = mongoose.model('comment', Comment);
module.exports.Feedback = mongoose.model('feedback', Feedback);
module.exports.Coefficient = mongoose.model('coefficient', Coefficient);
module.exports.CitiesInfo = mongoose.model('citiesinfo', CitiesInfo);
module.exports.SalaryInfo = mongoose.model('salaryinfo', SalaryInfo);
module.exports.BkSitesStats = mongoose.model('bksitesstats', BkSitesStats);
module.exports.BkPPSCoordinates = mongoose.model('bkppscoords', BkPPSCoordinates);
module.exports.BkPPS = mongoose.model('bkpps', BkPPS);