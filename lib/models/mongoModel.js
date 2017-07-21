var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sba');
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
	date: {type: Date, default: Date.now()},
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

var BkSitesStats = new mongoose.Schema({
	date: {type: Date, default: Date.now()},
	bk:{type: String},
	stats: {type: Object}
});

var BkPPS=new mongoose.Schema({
	bk:{type: String},
	name:{type: String},
	year:{type:Number},
	month:{type:Number},
	lat: {type: Number},
	lon: {type: Number},
	address: {type: String}
});


BkPPSCoordinates=new mongoose.Schema({
	bk:{type: String},
	year:{type:Number},
	month:{type:Number},
	name:{type: String},
	data:{type: Object}
});

CitiesStats=new mongoose.Schema({ //thats collection of cities from parsed FNS data
	name: {type: String},
	date: {type: Date, default: Date.now},
	bkQuantity: {type: Number},
	bkRelation: {type: Array}
});

CitiesInfo=new mongoose.Schema({ //thats collection of cities from wiki
	name: {type: String},
	population: {type: Number},
	bkPopularity: {type: String, default: 84},
	bkQuantity: {type: Number},
	bkRelation: {type: Array},
	coordinates: {type: Array},
	salary: {type: String}
});

Coefficient=new mongoose.Schema({
	bk:{type: String},
	date:{type: Date},
	betType: {type: String},
	averageType: {type: String},
	sport: {type: String},
	marja: {type: String},
	win: {type: String},
	draw: {type: String},
	away: {type: String}
});
 
Feedback=new mongoose.Schema({
	bk: {type: String},
	source: {type: String},
	type: {type: String},
	isPositive: {type: Boolean, default: false},
	positive: {type: String},
	isNegative: {type: Boolean, default: false},
	negative: {type: String},
	neutral: {type: String},
	isNeutral: {type: Boolean, default: false},
	date: {type: String}
});

Comment=new mongoose.Schema({
	bk: {type: String},
	source: {type: String},
	type: {type: String},
	comment: {type: String},
	engComment: {type: String},
	date: {type: String}
});

Complaint=new mongoose.Schema({
	bk: {type: String},
	source: {type: String},
	type: {type: String},
	heading: {type: String},
	complaint: {type: String},
	date: {type: String},
	status: {type: String}
});

Vacancy=new mongoose.Schema({
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

module.exports.Session = mongoose.model('sessiondata', Session);
module.exports.BookmakerPage = mongoose.model('bookmakerpage', BookmakerPage);
module.exports.BookmakerRate = mongoose.model('bookmakerrate', BookmakerRate);
module.exports.Vacancy = mongoose.model('vacancy', Vacancy);
module.exports.Complaint = mongoose.model('complaint', Complaint);
module.exports.Comment = mongoose.model('comment', Comment);
module.exports.Feedback = mongoose.model('feedback', Feedback);
module.exports.Coefficient = mongoose.model('coefficient', Coefficient);
module.exports.CitiesInfo = mongoose.model('citiesinfo', CitiesInfo);
module.exports.CitiesStats = mongoose.model('citiesstats', CitiesStats);
module.exports.BkSitesStats = mongoose.model('bksitesstats', BkSitesStats);
module.exports.BkPPSCoordinates = mongoose.model('bkppscoords', BkPPSCoordinates);
module.exports.BkPPS = mongoose.model('bkpps', BkPPS);