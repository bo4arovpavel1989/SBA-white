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
		url:'/employement',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getEmployementPage
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
		url:'/bkpps/:id',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getPPS
	},
	{
		url: '/bkpage/:id',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getBookmakerPage
	},
	{
		url: '/line/:id',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getLinePage
	},
	{
		url:'/reputation/:id',
		middleware:middleware.noMiddleware,
		callback:getRequestsHandlers.getReputationPage
	},
	{
		url:"/social/:id",
		middleware:middleware.noMiddleware,
		callback:getRequestsHandlers.getSocialPage
	},
	{
		url:'/getofflinecomponent/:id',
		middleware: middleware.noMiddleware,
		callback: getRequestsHandlers.getOfflineComponent
	},
	{
		url:'/traffic/:id',
		middleware:middleware.noMiddleware,
		callback:getRequestsHandlers.getTrafficPage
	},
	{
		url:'/experts/:id',
		middleware:middleware.noMiddleware,
		callback:getRequestsHandlers.getExpertsPage
	},
	{
		url:'/getcitiesofregion',
		middleware:middleware.noMiddleware,
		callback:getRequestsHandlers.getCitiesOfRegion
	},
	{
		url:'/autocomplete/:id',
		middleware:middleware.noMiddleware,
		callback:getRequestsHandlers.getAutocomplete
	},
	{
		url:'/datasource',
		middleware:middleware.noMiddleware,
		callback:getRequestsHandlers.getDataSourcePage
	},
	{
		url:'/marketpulse',
		middleware:middleware.noMiddleware,
		callback:getRequestsHandlers.getMarketPulsePage
	},
	//admin routes
	{
		url:'/eventaddform',
		middleware: middleware.checkAccess,
		callback: getRequestsHandlers.getEventAddForm
	},
	{
		url:'/newsaddform',
		middleware:middleware.checkAccess,
		callback: getRequestsHandlers.getNewsAddForm
	},
	{
		url:'/eventpage',
		middleware: middleware.checkAccess,
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
		url:'/getoffline_table',
		middleware:middleware.noMiddleware,
		callback:postRequestsHandlers.getOffline_table
	},
	{
		url:'/getoffline_graph',
		middleware:middleware.noMiddleware,
		callback:postRequestsHandlers.getOffline_graph
	},
	{
		url:'/getoffline_region_potential',
		middleware:middleware.noMiddleware,
		callback:postRequestsHandlers.getOffline_region_potential
	},
	{
		url:'/get_online_traffic_data',
		middleware:middleware.noMiddleware,
		callback:postRequestsHandlers.getOnlineTrafficData
	},
	{
		url:'/get_online_reputation_data',
		middleware:middleware.noMiddleware,
		callback:postRequestsHandlers.getOnlineReputationData
	},
	{
		url:'/getemployementdata',
		middleware:middleware.noMiddleware,
		callback:postRequestsHandlers.getEmployementData
	},
	//admin routes
	{
		url: '/login',
		middleware: middleware.noMiddleware,
		callback: postRequestsHandlers.loginHandler
	},
	{
		url:'/admin/getratetotaltable',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.getRateTotalTable
	},
	{
		url:'/admin/getEditPagesForm',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.getEditPagesForm
	},
	{
		url:'/admin/geteditbkrateform',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.getEditBKRateForm
	},
	{
		url:'/admin/editbkratetotaltable',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.editBkRateTotalTable
	},
	{
		url:'/admin/editbkrate',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.editBKRate
	},
	{
		url:'/admin/editform',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.editFormHandler
	},
	{
		url:'/addevent',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.addEvent
	},
	{
		url:'/addnews',
		middleware:middleware.checkAccess,
		callback:postRequestsHandlers.addNews
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