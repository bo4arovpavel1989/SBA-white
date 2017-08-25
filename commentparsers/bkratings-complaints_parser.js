var bks = ['liga-stavok', '888sport', 'fonbet', 'leonbets', '1h-stavka', 'olimp-kz', 'winlinebet', 'betcity', 'baltbet-tsupis'];
var bks_formatted=['ligastavok', 'bk888', 'fonbet', 'leon', 'bk1xbet', 'bkolimp', 'winline', 'betcity', 'baltbet']; //bk names as i use it in ither modules


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Complaint = require('./../lib/models/mongoModel.js').Complaint;
console.log('bookmaker-rating_parser');

String.prototype.replaceAll = function(search, replace){
  return this.split(search).join(replace);
}

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('https://bookmaker-ratings.ru/complaints/?complaint_bookmaker=' + bks[i])
	  .wait(1500)
	  .click('.change-view-btn.list-btn')
	  .wait(1000)
	  .then(()=>{
		  console.log(bks[i]);
		  checkExists('#load-more', i); //check if there is more button on the page. if none - start parsing date
	  })
}

function checkExists(selector, i){
	console.log(1);
	     nightmare.exists(selector) // //check if there is more button on the page. if none - start parsing date
			      .then(result=>{
					if(result)  nightmare.click(selector) //more button hasnt yet hide class so i click it and start from the beginning
										 .wait(3000)
										 .then(()=>{checkExists(selector, i)})							
					else doGrabbing(i);								
				});
}

function doGrabbing(i){
	nightmare.evaluate(()=>{
						return document.body.innerHTML;
					})
	  .then(function (body) {
		  console.log(2);
		 var $ = cheerio.load(body);
		 var bknumer = i;
		 let complaints = $('.block-content').get();
		 var date = new Date();
		 complaints.forEach(complaint=>{
			 try {
				 let complStatus = complaint.children[1].children[3].children[1].children[0].data;
				 complStatus=complStatus.replace(/[^a-zA-ZА-Яа-яЁё]/gi,'').replace(/\s+/gi,', ');
				 switch (complStatus) {
					 case 'Безосновательная':
					 complStatus = 'Необоснованно';
					 break;
					 case 'Удовлетворена':
					 complStatus = 'Решено';
					 break;
					 case 'Обрабатывается':
					 complStatus = 'Рассматривается';
					 break;
					 case 'Не удовлетворена':
					 complStatus = 'Не решено';
					 break;
				 }
				 let complText = complaint.children[5].children[3].children[1].children[0].data;
				 console.log(complText);
				 let complaintToWrite = new Complaint({
					bk: bks_formatted[bknumer],
					source: 'bookmaker-ratings.ru',
					type: 'complaint',
					complaint: complText,
					status: complStatus,
					date:date
				 }).save()
				 
			 }catch(e){console.log(e)}
		 });
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });	
}