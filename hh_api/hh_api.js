var https=require('https');
var Vacancy = require('./../lib/models/mongoModel.js').Vacancy;

getVacancies(0);

function getVacancies(page){
			var bookmakers = encodeURIComponent('букмекерские');
			var options = {
				host: 'api.hh.ru',
				port: 443,
				headers: {'user-agent': 'Mozilla/5.0'},
				path: '/vacancies?per_page=100&page=' + page + '&text=' + bookmakers,
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
					console.log(data)
					let quantity = data.found;
					let pages = data.pages;
					let vacancies = data.items;
					vacancies.forEach(vacancy=>{
						var salary = vacancy.salary.from + ' - ' + vacancy.salary.to + ' ' + vacancy.salary,currency;
						let vacancyToWrite=new Vacancy({
							company: vacancy.employer.name,
							type: vacancy.name,
							area: vacancy.area.name,
							salary: vacancy,
							link: vacancy.url,
							description: vacancy.snippet.responsibility
						}).save();
					});
					if(quantity>100&&page<pages) getVacancies(page +1);
					
					
				});
			});
			req.end();	
}			
