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
		 goToLinks(0);
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  }); 
  };
  
  function goToLinks(i){
	  if(i<links.length) {
		  nightmare
		  .goto('https://olimp.bet/' + links[i])
		  .evaluate(function () {
			return document.body.innerHTML;
		  })
		  .then(function (body) {
			 var $ = cheerio.load(body);
			 
		  })
		  .catch(function (error) {
			console.error('Search failed:', error);
		  }); 
	  }else {
		  console.log('done')
	  }
  }