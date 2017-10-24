var https=require('https');
var Vacancy = require('./../lib/models/mongoModel.js').Vacancy;
var bks = ['leon', 1066298, 1206335, 2757107, 991318, 1860203, 223129, 91449, 782901,'atlantik-m',1795968,'betru',1968591, 
'favorit',3051080,'investcompcentr', 'investgarant','johnygame',853796,'matchbet',"melofon",'panorama','rosbet','rosippodrom','rusteletot','Sportbet',
2707907,'williamhill', 'aphrodita','evromir', 'metelitsa', 'mlb','pyatigorskiippodrom', 'rostovskiippodrom'];
var bks_formatted=require('./../bklist.js').bkList_offline;//bk names as i use it in ither modules

getVacancies(0);

function getVacancies(i){
				if(!isNaN(bks[i])){ //coz company id in hh is number
				var options = {
					host: 'api.hh.ru',
					port: 443,
					headers: {'user-agent': 'Mozilla/5.0'},
					path: '/vacancies?employer_id='+bks[i],
					method: 'GET'
				};

				let req = https.request(options, function(res) {
					console.log("statusCode: ", res.statusCode);
					console.log("headers: ", res.headers);
					var data='';
					res.on('data', function(d) {
						//process.stdout.write(d);
						data +=d;
					});
					res.on('end', ()=>{
						data=JSON.parse(data);
						let quantity = data.found;
						let pages = data.pages;
						let vacancies = data.items;
						if(vacancies) vacancies.forEach(vacancy=>{
										try {
										let salary 
										if(vacancy.salary) {
											vacancy.salary.from=(vacancy.salary.from===null) ? 'n/a' : vacancy.salary.from;
											vacancy.salary.to=(vacancy.salary.to===null) ? 'n/a' : vacancy.salary.to;
											salary = vacancy.salary.from + ' - ' + vacancy.salary.to + ' ' + vacancy.salary.currency;
										} else salary = '-';
										let objectToWrite={
												bk:bks_formatted[i].bk,
												company: vacancy.employer.name,
												type: vacancy.name,
												area: vacancy.area.name,
												salary: salary,
												link: vacancy.url,
												description: vacancy.snippet.responsibility,
												created_at:vacancy.created_at
											};
											console.log(objectToWrite);
										let vacancyToWrite=new Vacancy(objectToWrite).save((err, rep)=>{
											i++;
											if(i<bks.length)getVacancies(i);
											else console.log('done');
										});
										} catch(e){}
									});
						else {console.log(bks[i]);}			
						if(quantity>100&&page<pages) getVacancies(page +1);
					
						
					});
				});
				req.end();	
			} else {
				i++;
				if(i<bks.length)getVacancies(i);
				else console.log('done');
			}
}			
