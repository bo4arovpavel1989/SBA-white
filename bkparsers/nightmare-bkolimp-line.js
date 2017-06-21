var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Coefficient = require('./../lib/models/mongoModel.js').Coefficient;
var sportSpelling=require('./../lib/customfunctions.js').sportSpelling;
console.log('olimp-parser');
var links=[];
getLinks();
  
  function getLinks(){
	 nightmare
	  .goto('https://olimp.bet/app/prematch')
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 let linksToFind=$('.pei-w').get();
		 linksToFind.forEach(link=>{
			 try{
			 console.log(link.attribs.href)
				links.push(link.attribs.href);
			 }catch(e){}
		 });
		 checkLink(0);
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  }); 
  };
  
  function checkLink(i){
	  if(i<links.length) {
		  nightmare
		  .goto('https://olimp.bet' + links[i])
		  .exists('#eg-1') //thats the name of 1x2 market
		  .then(result=>{
			  if(result)doGrabbing(i);
			  else checkLink(i+1)  
	      })
		  .catch(function (error) {
			console.error('Search failed:', error);
			checkLink(i+1)
		  }); 
	  }else {
		  console.log('done')
	  }
  }
  
  function doGrabbing(i){
	   nightmare
	  .goto('https://olimp.bet' + links[i])
	  .evaluate(function () {
		return document.body.innerHTML;
	  })
	  .then(function (body) {
		 var $ = cheerio.load(body);
		 let markets=$('#eg-1').get();
		 markets.forEach(market=>{
			 try{
			 console.log(market)
				
			 }catch(e){}
		 });
		 checkLink(i+1);
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		checkLink(i+1);
	  });
  }