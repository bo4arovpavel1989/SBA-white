var bks = ['fon', 'bk-leon', '888', 'liga-stavok', '1xstavka', 'bk-olimp', 'winline', 'bk-betcity', 'bk-baltbet'];
var bks_formatted=['fonbet', 'leon', 'bk888', 'ligastavok', 'bk1xbet', 'bkolimp', 'winline', 'betcity', 'baltbet']; //bk names as i use it in ither modules


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Complaint = require('./../lib/models/mongoModel.js').Complaint;
console.log('intelbet_parser');

String.prototype.replaceAll = function(search, replace){
  return this.split(search).join(replace);
}

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('http://www.intelbet.ru/complaints/' + bks[i] + '/')
	  .wait(1500)
	  .then(()=>{
		  console.log(bks[i]);
		  scrollScreen(i, 0); //scroll screen to get all data
	  })
}

function scrollScreen(i, currH){
	console.log('scroll');
	var previousHeight, currentHeight=currH;
	previousHeight=currentHeight;
	console.log(currentHeight);
	console.log(previousHeight);
	nightmare
	.evaluate(()=>{
      return document.body.scrollHeight;
    })
	.then(height=>{
		currentHeight=height;
		nightmare
			.scrollTo(currentHeight, 0)
            .wait(3000)
			.then(()=>{
				 if(currentHeight==previousHeight) doGrabbing(i) //check if screen position changed after scroll operation if not - that means all data is loaded
				 else scrollScreen(i, currentHeight);
			 });
	});	
}

function doGrabbing(i){
	nightmare
	  .evaluate(()=>{
						return document.body.innerHTML;
					})
	  .then(function (body) {
		 console.log(2);
		 var $ = cheerio.load(body);
		 var bknumer = i;
		 let complaints = $('.complaint-cell').get();
		 complaints.forEach(complaint=>{
			 try{
				 let complStatus = complaint.children[1].children[1].children[0].data;
				 let complHead = complaint.children[3].children[1].children[0].data;
				 let complText = complaint.children[3].children[3].attribs['data-text'];
				 let date = complaint.children[5].children[1].children[3].children[3].children[0].data;
				 complText = complText.replaceAll(/\t/, '');
				 complHead=complHead.replaceAll(/\t/, '');
				 console.log(complStatus);
				 let complaintToWrite = new Complaint({
					bk: bks_formatted[bknumer],
					source: 'intelbet.ru',
					type: 'complaint',
					heading: complHead,
					complaint: complText,
					date: date,
					status: complStatus
				 }).save();
			 } catch(e){}
		 });
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });
	
	
}