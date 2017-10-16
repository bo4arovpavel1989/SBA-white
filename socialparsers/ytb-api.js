var https = require('https');
var customFunctions = require('./../lib/customfunctions');
var BookmakerPage = require('./../lib/models/mongoModel.js').BookmakerPage;
var Social = require('./../lib/models/mongoModel.js').Social;
var secret=require('./../credentials.js').secret;
var token=secret.ytbapi.access_token;
var bks = ['UCWXFqzABGvk0O0xKmCSe4qw', 'fonbet', '1xbettv', 'three888', 'winlinebetru', 'olimp_bk_rus', 'ligastavok1x', 'betcityofficial', 'rubaltbet'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules
var async=require('async');

var date=new Date();
var year=date.getFullYear();
var month=date.getMonth();
if (month == 0){year = year-1;month=12};//i get data of pervious month;
var dates=customFunctions.getFullMonth(year,month);
var dayOfWeek=customFunctions.getDayOfWeek();
var stringMonth=date.getMonth()+1;
if (stringMonth<10) stringMonth='0'+stringMonth;
var stringDate=date.getFullYear()+'-'+stringMonth+'-'+date.getDate();

getYTBData(0)

function getYTBData(i){
	var objectToWrite={sbcrb:0,shares:0,likes:0,comments:0};
	getData(i,objectToWrite,(err, rep)=>{
		if(rep==null)for (var prop in objectToWrite){objectToWrite[prop]='N/A'}
		BookmakerPage.update({bk:bks_formatted[i].bk,date:{$gte:dates[0],$lte:dates[1]}},{$set:{'social.ytb':objectToWrite}},{upsert:true}).exec((err, rep)=>{	
			Social.update({bk:bks_formatted[i].bk,name:bks_formatted[i].name,date:stringDate},{$set:{dayOfWeek:dayOfWeek,ytb:objectToWrite}},{upsert:true}).exec();
			i++;
			if(i<bks.length)getYTBData(i);
			else console.log('done');
		});
	});
}

function getData (i, obj, callback){
			var options = {
				host: 'www.googleapis.com',
				port: 443,
				path: '/youtube/v3/channels?id='+bks[i]+'&key='+token+'&part=statistics',
				method: 'GET'
			};

			var req = https.request(options, function(res) {
				var data='';
				res.on('data', function(d) {
					data +=d;
				});
				res.on('end', ()=>{
					try {
						data=JSON.parse(data);
						obj.posts=Number(data.items[0].statistics.videoCount);
						obj.comments=Number(data.items[0].statistics.commentCount);
						obj.sbcrb=Number(data.items[0].statistics.subscriberCount);
						obj.views=Number(data.items[0].statistics.viewCount);
						obj.likes='N/A';
						obj.shares='N/A';
						callback(null, obj);
					}catch(e){
						callback(e, null);
					}
				});
			});
			req.end();	
}


 