var https = require('https');
var customFunctions = require('./../lib/customfunctions');
var BookmakerPage = require('./../lib/models/mongoModel.js').BookmakerPage;
var secret=require('./../credentials.js').secret;
var token=secret.vkapi.access_token;
var bks = ['leonbets', 'fonbet', 'bk1xstavka', 'three888', 'winlinebetru', 'olimp_bk_rus', 'ligastavok1x', 'betcityofficial', 'rubaltbet'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules
var async=require('async');
var date=new Date();
var year=date.getFullYear();
var month=date.getMonth();
if (month == 0){year = year-1;month=12};//i get data of pervious month;
var dates=customFunctions.getFullMonth(year,month);

getVKData(0)

function getVKData(i){
	var objectToWrite={sbcrb:0,shares:0,likes:0,comments:0};
	async.series([
		(callback)=>{
			getWall(i, objectToWrite, (err, rep)=>{
				if(err)for(var prop in objectToWrite){objectToWrite[prop]='N/A'}
				callback();
			});
		},
		(callback)=>{
			getGroup(i, objectToWrite, (err, rep)=>{
				if(err)for(var prop in objectToWrite){objectToWrite[prop]='N/A'}
				callback();
			});
		}
	],
	(err)=>{
		console.log(bks[i]);
		console.log(objectToWrite);
		BookmakerPage.update({bk:bks_formatted[i].bk,date:{$gte:dates[0],$lte:dates[1]}},{$set:{'social.vk':objectToWrite}},{upsert:true}).exec((err, rep)=>{	
			i++;
			if(i<bks.length)getVKData(i);
			else console.log('done');
		});
	});
}

function getWall (i, obj, callback){
			var options = {
				host: 'api.vk.com',
				port: 443,
				path: '/method/wall.get?domain='+bks[i]+'&access_token='+token+'&v=5.52',
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
						obj.comments=0;
						obj.likes=0;
						obj.shares=0;
						data.response.items.forEach(post=>{
							obj.likes+=post.likes.count;
							obj.shares+=post.reposts.count;
							obj.comments+=post.comments.count;
						});
						callback(null, obj);
					}catch(e){
						callback(e, null);
					}
				});
			});
			req.end();	
}

function getGroup(i, obj, callback){
	var options = {
				host: 'api.vk.com',
				port: 443,
				path: '/method/groups.getById?group_id='+bks[i]+'&fields=members_count,counters,activity&access_token='+token+'&v=5.52',
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
						obj.sbcrb=data["response"][0]["members_count"];
						if(obj.sbcrb==undefined)throw new Error;
						callback(null, obj);
					}catch(e){
						callback(e, null);
						}
				});
			});
			req.end();
}
 