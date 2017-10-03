var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var customFunctions = require('./../lib/customfunctions');
var BookmakerPage = require('./../lib/models/mongoModel.js').BookmakerPage;
var Social = require('./../lib/models/mongoModel.js').Social;
var bks = ['leonbets_', 'bk_fonbet_official', 'bk1xstavka', '888', 'winlinebet', 'b.k.olimp', 'ligastavok_official', 'betcity_official', 'rubaltbet'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules

console.log('insta-parser');

var date=new Date();
var year=date.getFullYear();
var month=date.getMonth();
if (month == 0){year = year-1;month=12};//i get data of pervious month;
var dates=customFunctions.getFullMonth(year,month);
var dayOfWeek=customFunctions.getDayOfWeek();
var stringMonth=date.getMonth()+1;
if (stringMonth<10) stringMonth='0'+stringMonth;
var stringDate=date.getFullYear()+'-'+stringMonth+'-'+date.getDate();


getINSTAData(0);

function getINSTAData(i){
   console.log('going... ' + bks[i]);
   nightmare
  .goto('https://www.instagram.com/'+bks[i])
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
			obj.posts=$('#react-root > section > main > article > header > div._o6mpc > ul > li:nth-child(1) > span > span').get()[0].children[0].data;
			obj.sbcrb=$('#react-root > section > main > article > header > div._o6mpc > ul > li:nth-child(2) > span > span').get()[0].attribs.title;
		}catch(e){obj.posts='N/A';obj.sbcrb='N/A'}
		obj.comments='N/A';
		obj.views='N/A';
		obj.likes='N/A';
		obj.shares='N/A';
		console.log(obj);
		BookmakerPage.update({bk:bks_formatted[i].bk,date:{$gte:dates[0],$lte:dates[1]}},{$set:{'social.insta':obj}},{upsert:true}).exec((err, rep)=>{	
			Social.update({bk:bks_formatted[i].bk,date:stringDate},{$set:{dayOfWeek:dayOfWeek,instgm:obj}},{upsert:true}).exec();
			i++;
			if(i<bks.length)getINSTAData(i);
			else console.log('done');
		});
  })
  .catch(function (error) {
	console.log(error);
	i++;
	if(i<bks.length)getINSTAData(i);
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

