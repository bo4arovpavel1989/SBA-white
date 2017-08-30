var bks = ['leonbets_com-bukmekerskaya_kontora_leon', 
'fonbet_com-bukmeykerskaya_kontora', 
'bukmekerskaya_kontora_1hstavka', 
'888', 
'bukmekerskaya_kontora_winline_russia_moscow', 
'oimpru_com-bukmekerskaya_kontora_olimp_russia', 
'bukmekerskaya_kontora_liga_stavok', 
'bukmekerskaya_kontora_betcity',
 'bukmekerskaya_kontora_baltbet_russia_udmurtiya'];
var bks_formatted=require('./../bklist.js').bkList;//bk names as i use it in ither modules

var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Feedback = require('./../lib/models/mongoModel.js').Feedback;
console.log('otzovik_parser');

getFeedback(0);

function getFeedback(i){
	if(bks[i]!=='888') //coz theri is no feedback for 888 in otzovik.com
	nightmare
	  .goto('http://otzovik.com/reviews/'+bks[i]+'/order_date_desc/')
	  .wait(1500)
	  .evaluate(()=>{
					return document.body.innerHTML;
	   })
	  .then((body)=>{
		  var $ = cheerio.load(body);
		  var userMark=$('#rating_head').get()[0].attribs['title'].split(': ')[1];
		  var date = new Date();
		  console.log(userMark)
		  var bknumer = i;
		  var commentSections=$('.catproduct2').get();
		  var control=0;
		  commentSections.forEach(section=>{
			  try{
				  let isNegative, isNeutral, isPositive, feedbackText;
				  let feedbackObject=({
						bk: bks_formatted[bknumer].bk,
						source: 'otzovik.com',
						type: 'feedback',
						date:date
				  });
				  let rating=0;
				  section.children.forEach(child=>{
					  if(child.name==='div'){
						  if(child.attribs['class']==='rating_star_y')rating++;
					  } else if(child.name==='p') {
						  if(child.attribs['itemprop']==='description')feedbackText=child.children[0].data
					  }
				  });
				 if (rating == 3) {feedbackObject.isNeutral=true; feedbackObject.neutral = feedbackText;}
				 else if (rating > 3) {feedbackObject.isPositive=true; feedbackObject.positive = feedbackText;}
				 else if (rating < 3) {feedbackObject.isNegative=true; feedbackObject.negative = feedbackText;}	
				 console.log(feedbackObject);
				 feedbackObject.feedbackText=feedbackText;
				 let dataToWrite = new Feedback(feedbackObject).save((err, rep)=>{
					 control++;
					 if(control==commentSections.length){
						i++;
						if(i<bks.length)getFeedback(i);
						else console.log('done'); 
					 }
				 });
			  }catch(e){
				  console.log(e);
				  control++;
					 if(control==commentSections.length){
						i++;
						if(i<bks.length)getFeedback(i);
						else console.log('done'); 
					 }
			  }
		  });
	
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
		i++;
		if(i<bks.length)getFeedback(i);
		else console.log('done');
	  });
	else {
		i++;
		getFeedback(i);
	}
}

