var getRequestsHandlers = require('./getrequests.js');
var postRequestsHandlers = require('./postrequests.js');
var middleware = require('./middleware.js');

var getRequests = [
	{
		url:'/',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getMainPage
	},
	{
		url:'/online',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getOnlinePage
	},
	{
		url: '/showinfo',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.showInfo
	},
	{
		url:'/offline',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getOfflinePage
	},
	{
		url:'/heatmap',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getPPSHeatMapPage
	},
	{
		url:'/piemap',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getPPSPieMapPage
	},
	{
		url:'/bkpps/:year/:month/:id',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getPPS
	},
	{
		url: '/bkpage/:id',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getBookmakerPage
	},
	{
		url:'/getofflinecomponent/:id',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getOfflineComponent
	},
	//admin routes
	{
		url:'/eventaddform',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getEventAddForm
	},
	{
		url:'/eventpage',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getEventPage
	},
	{
		url: '/login',
		middleware: middleware.noMiddleware,
		callback: function(req, res) {
			res.sendFile(__dirname + '/html/login.html');
		}
	},
	{
		url: '/admin',
		middleware: middleware.checkAccess,
		callback: getRequestsHandlers.getAdminPage
	}
];

var postRequests = [
	{
		url:'/addevent',
		middleware:middleware.noMiddleware,
		callback:postRequestsHandlers.addEvent
	},
	{
		url: '/login',
		middleware: middleware.noMiddleware,
		callback: postRequestsHandlers.loginHandler
	},
	{
		url:'/admin/getEditRateForm',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.getEditRateForm
	},
	{
		url:'/admin/editRate',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.editRate
	},
	{
		url: '/admin/geteditbkpageform',
		middleware: middleware.checkAccess,
		callback:postRequestsHandlers.getEditBkPageForm
	},
	{
		url: '/admin/editBkPage',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.editBkPage
	}
];

var deleteRequests = [

];

var router = function (app) {
	getRequests.forEach(function(request){
		app.get(request.url, request.middleware, request.callback);
	});
	postRequests.forEach(function(request){
		app.post(request.url, request.middleware, request.callback)
	});
	deleteRequests.forEach(function(request){
		app.delete(request.url, request.middleware, request.callback)
	});
};

module.exports.router = router;