var Session = require('./models/mongoModel.js').Session;

module.exports.noMiddleware = function(req, res, next){
	next();
};
module.exports.checkAccess=function(req, res,next){
	if(!req.cookies || !req.cookies.ssid || !req.cookies.login) {
			console.log('check failed');
			res.redirect('/login');
	} else {
		var login = req.cookies.login;
		var session = req.cookies.ssid;
		var answer
		Session.findOne({login: login.toLowerCase()}, 'session', function(err, rep){
			try {
				if (rep){
					answer = (session === rep.session) ? true : false;
					if (answer) {
						next();
					} else {
						res.redirect('/login');
					}
				} else {
					res.redirect('/login');
				}
			} catch(e) {}
		});
	}	
};