var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var customFunctions = require('./../lib/customfunctions');
var BookmakerPage = require('./../lib/models/mongoModel.js').BookmakerPage;
var Social = require('./../lib/models/mongoModel.js').Social;
var bks = ['nonononon', 'fonbet', 'nonononon', 'nonononon', 'nonononon', 'nonononon', 'ligastavokru', 'nonononon', 'baltbet.ru'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules

console.log('fb-parser');

var date=new Date();
var year=date.getFullYear();
var month=date.getMonth();
if (month == 0){year = year-1;month=12};//i get data of pervious month;
var dates=customFunctions.getFullMonth(year,month);
var dayOfWeek=customFunctions.getDayOfWeek();
var stringMonth=date.getMonth()+1;
if (stringMonth<10) stringMonth='0'+stringMonth;
var stringDate=date.getFullYear()+'-'+stringMonth+'-'+date.getDate();

String.prototype.replaceAll = function(search, replace){
  return this.split(search).join(replace);
}


getFBData(0);

function getFBData(i){
   console.log('going... ' + bks[i]);
   nightmare
  .goto('https://www.facebook.com/'+bks[i])
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .wait(1500)
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .then(function (body) {
	  console.log('start parsing');
		var $ = cheerio.load(body);
		var obj={sbcrb:0,shares:0,likes:0,comments:0};
		try{
			obj.likes=$('div#pages_side_column>div> div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2) > div > div._4bl9 > div').get()[0].children[0].data.replaceAll(/\D/,'');
			obj.likes=Number(obj.likes);
			obj.sbcrb=$('div#pages_side_column>div> div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(3) > div > div._4bl9 > div').get()[0].children[0].data.replaceAll(/\D/,'');
			obj.sbcrb=Number(obj.sbcrb);
		}catch(e){obj.likes='N/A';obj.sbcrb='N/A'}
		console.log(obj)
		obj.comments='N/A';
		obj.views='N/A';
		obj.posts='N/A';
		obj.shares='N/A';
		BookmakerPage.update({bk:bks_formatted[i].bk,date:{$gte:dates[0],$lte:dates[1]}},{$set:{'social.fb':obj}},{upsert:true}).exec((err, rep)=>{	
			Social.update({bk:bks_formatted[i].bk,date:stringDate},{$set:{dayOfWeek:dayOfWeek,fb:obj}},{upsert:true}).exec();
			i++;
			if(i<bks.length)getFBData(i);
			else console.log('done');
		})
  })
  .catch(function (error) {
	console.log(error);
	i++;
	if(i<bks.length)getFBData(i);
	else console.log('done');
  });
}

setTimeout(()=>{
	console.log('timeout stop');
	if(nightmare) {
		try{
		nightmare.end();
		nightmare.proc.disconnect();
		nightmare.proc.kill();
		nightmare.ended = true;
		nightmare = null;
		}catch(e){}
	}
}, 5*60*1000);

