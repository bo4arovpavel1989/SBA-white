var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
var cheerio = require('cheerio');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
var links=[];
console.log('betcity-parser');

findLinks();

function findLinks(){
	nightmare
	  .goto('https://betcity.ru/line/competions/ft=1;')
	  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
	  .wait(5000)
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		  console.log('start parsing');
		  var $ = cheerio.load(body);
		  let linksToClick;
		  linksToClick = $('.competitions-content-table-item-text__title').get();
		   console.log(linksToClick);
		  linksToClick.forEach(oneLink=>{
			  console.log(oneLink.attribs.href);
			  links.push(oneLink.attribs.href);
		  });
		  checkLinks(0);
	  })
	  .catch(function (error) {
		console.log(error);
	  });
}

function checkLinks(i){
	if(i<links.length){
		nightmare
		  .goto('https://betcity.ru' + links[i])
		  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
		  .wait(500)
		  .exists('.live-list__championship-event-winner-text')
		  .then(result=>{
			  if(result)checkLinks(i+1);
			  else doGrabbing(i);
		  })
		  .catch(function (error) {
			console.log(error);
			checkLinks(i+1);
		  });
	}else {
		console.log('done')
	}
}

function doGrabbing(i){
	nightmare
	  .goto('https://betcity.ru/' + links[i])
	  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
	  .wait(500)
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		  var $ = cheerio.load(body);
		  let sportSelector = $('.live-list__championship-header-name').get();
		  var sport = sportSelector[0].children[0].children[0].data.split('. ')[0];
		  console.log(sport);
		  checkLinks(i+1);
	  })
	  .catch(function (error) {
		console.log(error);
		checkLinks(i+1);
	  });
}
