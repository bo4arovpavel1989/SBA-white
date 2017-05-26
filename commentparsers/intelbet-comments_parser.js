var bks = ['fon', 'bk-leon', '888', 'liga-stavok', '1xstavka', 'bk-olimp', 'winline', 'bk-betcity', 'bk-baltbet'];
var bks_formatted=['fonbet', 'leon', '888', 'ligastavok', '1xstavka', 'olimp', 'winline', 'betcity', 'baltbet']; //bk names as i use it in ither modules


var Nightmare = require('nightmare');		
var nightmare = Nightmare({ show: false });
var cheerio = require('cheerio');
var Comment = require('./../lib/models/mongoModel.js').Comment;
console.log('intelbet_parser');

String.prototype.replaceAll = function(search, replace){
  return this.split(search).join(replace);
}

getFeedback(0);

function getFeedback(i){
	nightmare
	  .goto('http://www.intelbet.ru/bukmekerskye-kontory/' + bks[i] + '/')
	  .wait(1500)
	  .then(()=>{
		  console.log(bks[i]);
		  checkExists('.show-more-comments', i); //check if there is more button on the page. if none - start parsing date
	  })
}

function checkExists(selector, i){
	console.log(1);
	     nightmare.exists(selector) // //check if there is more button on the page. if none - start parsing date
			      .then(result=>{
					if(result)  nightmare.click(selector + '>span') //more button still exists so i click it and start from the beginning
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
		 let comments=$('.comments-body').get();
		 comments.forEach(comment=>{
			 try{
				 var isAdmin = comment.children[1].children[3].attribs.title;
				 if(isAdmin !=='Администратор'&&isAdmin !=='Главный редактор'){
					 let date = isAdmin;
					 let commentContent = comment.children[3].children[0].data.slice(7);
					 commentContent=commentContent.replaceAll(/\t/, '');
					 commentContent=commentContent.replaceAll(/\n/, '');
					  console.log(commentContent);
					 let newComment = new Comment({
						 bk: bks_formatted[bknumer],
						 source: 'intelbet.ru',
						 date: date,
						 comment: commentContent,
						 type: 'comment'
					 }).save()
				 }
			 }catch(e){}
		 });	
		 i++;
		 if(i<bks.length)getFeedback(i); 
	  })
	  .catch(function (error) {
		console.error('Search failed:', error);
	  });
	
	
}