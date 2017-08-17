//var customFunctions = require('./../lib/customfunctions.js');
var bkurl = require('./bkurl.js').bkurl;
var cheerio = require('cheerio');
//var BkSitesStats = require('./../lib/models/mongoModel.js').BkSitesStats;
var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });
var storedCookies=[];

 nightmare
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .goto(bkurl.resources[0].url)
  .wait(2000)
  .cookies.get()
  .then((cookies) => {
		console.log(cookies)
        storedCookies = cookies;
		parseSimilarweb(0);
    })
	.catch(function (error) {
		console.log(error)
	});
	


function parseSimilarweb(i){
	storedCookies.forEach((cookiItem)=>{
		nightmare.cookies.set(cookiItem.name, cookiItem.value)
	});
	
   var that=this;
   nightmare
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .goto(bkurl.resources[i].url)
  .wait(2000)
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .then(function (body) {
    var $ = cheerio.load(body);
	var data={};
	var dateMS=Date.parse(new Date());
	dateMS=dateMS-30*24*60*60*1000;
	data.totalVisits = $('.engagementInfo-valueNumber.js-countValue').html();
	data.visitTime = $('.engagementInfo-valueNumber.js-countValue').eq(1).html();
	data.pagesPerVisit = $('.engagementInfo-valueNumber.js-countValue').eq(2).html();
	data.bounceRate = $('.engagementInfo-valueNumber.js-countValue').eq(3).html();
	data.trafficSource = {};
	data.trafficSource.direct = $('.trafficSourcesChart-value').eq(0).html();
	data.trafficSource.referrals = $('.trafficSourcesChart-value').eq(1).html();
	data.trafficSource.search = $('.trafficSourcesChart-value').eq(2).html();
	data.trafficSource.social = $('.trafficSourcesChart-value').eq(3).html();
	data.trafficSource.mail = $('.trafficSourcesChart-value').eq(4).html();
	console.log(data);
	var countries=$('#geo-countries-accordion').get();
	data.countries=[];
	countries[0].children.forEach(country=>{
		try{
		if(country.type=='tag'){
			//console.log(country.children[1].children[1])//this is class 'according-toggle'
			let countryName=country.children[1].children[1].children[3].children[3].children[0].data;
			let countryStat=country.children[1].children[1].children[1].children[1].children[0].data;
			console.log(countryStat);
			data.countries.push({counrty:countryName,stat:countryStat});
			
		}
		}catch(e){console.log(e)}
	});
	var referrals=$('ul.websitePage-list').get();
	referrals[0].children.forEach(referral=>{
		try{
		if(referral.type==='tag'){//this is li.websitePage-...
			let siteName=referral.children[1].children[3].children[0].data;
			let siteStat=referral.children[3].children[0].data;
			data.referrals.push({site:siteName,stat:siteStat});
			console.log(siteName);
		}
		}catch(e){}
	});
  })
  .catch(function (error) {
	i++;
	if(i<bkurl.resources.length) that(i);
	else {
		console.log('done');
		return nightmare.end();
	}
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
