var bkurl = require('./bkurl.js').bkurl;
var bkList=require('./../bklist.js').bkList;
var cheerio = require('cheerio');
var customFunctions=require('./../lib/customfunctions.js');
var BkSitesStats = require('./../lib/models/mongoModel.js').BkSitesStats;
var BookmakerPage = require('./../lib/models/mongoModel.js').BookmakerPage;
var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: true });//need to type captcha at first gotourl
var storedCookies=[];

 
	
parseSimilarweb(0);

function parseSimilarweb(i){
   nightmare
  .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
  .goto(bkurl.resources[i].url)
  .wait('#geo-countries-accordion')
  .evaluate(function () {
	return document.body.innerHTML;
  })
  .then(function (body) {
    var $ = cheerio.load(body);
	var data={};
	var dateMS=Date.parse(new Date());
	dateMS=dateMS-27*24*60*60*1000;
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
	var countries=$('#geo-countries-accordion').get();
	data.countries=[];
	countries[0].children.forEach(country=>{
		try{
		if(country.type=='tag'){
			//console.log(country.children[1].children[1])//this is class 'according-toggle'
			let countryName=country.children[1].children[1].children[3].children[3].children[0].data;
			let countryStat=country.children[1].children[1].children[1].children[1].children[0].data;
			data.countries.push({country:countryName,stat:countryStat});
			
		}
		}catch(e){console.log(e)}
	});
	var referrals=$('ul.websitePage-list').get();
	data.referrals=[];
	referrals[0].children.forEach(referral=>{
		try{
		if(referral.type==='tag'){//this is li.websitePage-...
			let siteName=referral.children[1].children[3].children[0].data;
			let siteStat=referral.children[3].children[0].data;
			data.referrals.push({site:siteName,stat:siteStat});
			console.log(siteName+' '+siteStat);
		}
		}catch(e){console.log(e)}
	});
	var keyWords=$('ul.searchKeywords-list').get();
	data.keyWords=[];
	keyWords[0].children.forEach(line=>{
		try{
			if(line.type==='tag'){
				let keyWord=line.children[3].children[1].children[1].children[0].data;
				let keyWordStat=line.children[3].children[3].children[0].data;
				data.keyWords.push({word:keyWord,stat:keyWordStat});
			}
		}catch(e){console.log(e)}
	});
	var social=$('ul.socialList').get();
	data.social=[];
	social[0].children.forEach(line=>{
		try{
			if(line.type==='tag'){
				let socialNet=line.children[1].attribs['data-sitename'];
				let socialStat=line.children[3].children[3].children[0].data;
				data.social.push({site:socialNet,stat:socialStat});
			}
		}catch(e){console.log(e)}
	});
	console.log(data);
	var name;
	bkList.forEach(bkItem=>{
		if (bkItem.bk===bkurl.resources[i].site)name=bkItem.name;
	});
	var bkStat=new BkSitesStats({bk:bkurl.resources[i].site, name:name,date:dateMS, stats:data}).save(()=>{
		i++;
		if(i<bkurl.resources.length) parseSimilarweb(i);
		else {
			console.log('done');
			return nightmare.end();
		}
	});
	//TODO - update and upsert BookmakerPage with traffic data
		console.log(dateMS);
		let month=new Date(dateMS).getMonth();
		let year=new Date(dateMS).getFullYear();
		let dates=customFunctions.getFullMonth(year,month+1);
		console.log(dates);
		let bkPageData={visits:data.totalVisits,bouncerate:data.bounceRate,direct:data.trafficSource.direct,referral:data.trafficSource.referrals};
		BookmakerPage.update({bk:bkurl.resources[i].site,date:{$gte:dates[0],$lte:dates[1]}},
							{$set:{traffic:bkPageData}},
							{upsert:true}).exec();
  })
  .catch(function (error) {
	console.log(error);  
	i++;
	if(i<bkurl.resources.length) parseSimilarweb(i);
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


