var Nightmare = require('nightmare');
  
var nightmare = Nightmare({ show: true });
var cheerio = require('cheerio');
var CitiesInfo = require('./../../lib/models/mongoModel.js').CitiesInfo;

var fs=require('fs-extra');

var now=new Date();
var nowString;
if(now.getMonth()+1<10)nowString=now.getFullYear()+'-0'+(now.getMonth()+1)+'-01';//beginning of the current month
else nowString=now.getFullYear()+'-'+(now.getMonth()+1)+'-01';
var nextMonth;
if(now.getMonth()+2<10)nextMonth=now.getFullYear()+'-0'+(now.getMonth()+2)+'-01';//beginning of the nextt month
else if(now.getMonth()+2<13)nextMonth=now.getFullYear()+'-'+(now.getMonth()+2)+'-01';
else nextMonth=now.getFullYear()+1+'-01-01';

CitiesInfo.find({date:{$gte:nowString, $lte:nextMonth}},(err, reps)=>{
	var i=0;
	if(reps)goGrabbing(reps, i);
});

  
function goGrabbing(array, i){
		console.log(array[i].name);
		nightmare	
		  .goto('https://rabota.yandex.ru/salary')
		  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
		  .wait('.salary-search__search-form')
		  .type('.salary-search__search-form>span.input:nth-child(2)>span>input', '1')
		  .click('.salary-search__search-form>span.input:nth-child(2)>span>input')
		  .type('body','\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008')
		  .type('.salary-search__search-form>span.input:nth-child(2)>span>input', array[i].name)
		  .wait(1000)
		  .mousedown('body > div.popup > div > ul > li:nth-child(1)')
		  .mouseover('body > div.popup > div > ul > li:nth-child(1)')
		  .click('body > div.popup > div > ul > li:nth-child(1)')
		  .click('.salary-search__search-form>button')
		  .wait(2000)
		  .evaluate(function () {
			return document.body.innerHTML;
		  })
		  .then(function (body) {
			  console.log('start parsing');
			  var $ = cheerio.load(body);
			  console.log($('h1.heading.salary-search__heading').get()[0].children[0].data);
			  let salary=$('h1.heading.salary-search__heading').get()[0].children[0].data;
			  salary=salary.replace(/[^-0-9]/gim,'');
			  fs.appendFileSync('salary.dat',array[i].name+'-'+salary+'\r\n');
			  i++;
			  if(i<array.length)goGrabbing(array, i);
			  else console.log(done);
		  })
		  .catch(function (error) {
			console.log(error);
			 i++;
			 if(i<array.length)goGrabbing(array, i);
			  else console.log(done);
		  });

}


