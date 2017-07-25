var request=require('request');
var cheerio = require('cheerio');
var parseString = require('xml2js').parseString;
var fs=require('fs-extra');
var iconv = require('iconv-lite');
var firmSpeller=require('./bkNamesSpeller.js').spellNames;

String.prototype.replaceAll = function(search, replace){
  return this.split(search).join(replace);
}

let headers = {
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		//'Accept-Encoding': 'gzip, deflate, sdch, br',
		//'Cookie': cookie,
		'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4,sr;q=0.2',
		'Upgrade-Insecure-Requests': '1'
	};

let options = {
			url:'https://www.nalog.ru/opendata/7707329152-reestrlicbookmaker/data-20170706-structure-20160308.xml',
			headers:headers,
			encoding:null	
	}; 
	var counter=0;	
	request(options, (err, res, body)=>{
	  if(err){console.log(err);}
	  else{ 
		let $ = cheerio.load(body);
		var bodyWithCorrectEncoding = iconv.decode(body, 'windows-1251');
		parseString(bodyWithCorrectEncoding, function (err, result) {
			let licenses=result.REESTR.LICENZ;
			console.log(licenses[0].BLANK[0].$.NAME_ORG_SOKR)
			licenses.forEach(license=>{
				let blanks=license.BLANK;
				blanks.forEach(blank=>{
					var firm = blank.$.NAME_ORG_SOKR;
					firm=firm.replaceAll('.', '');
					firm=firm.replaceAll('"', '');
					firm=firm.replaceAll("'", '');
					var firmNameStandart=firmSpeller(firm);
					try{
						fs.mkdirSync('ppsAddressesFromFNSXML/'+firmNameStandart);
					} catch(e){}
					var date=blank.$.DATE_BEG;
					date=date.replaceAll('.', '-');
					var dateStraight=date.split('-');
					var dateReverse=dateStraight.reverse();
					var dateFormatted=dateReverse.join('-');
					var dateEnd=blank.$.DATE_END;
					var dateEndFormatted;
					if(dateEnd){
						dateEnd=dateEnd.replaceAll('.', '-');
						var dateEndStraight=dateEnd.split('-');
						var dateEndReverse=dateEndStraight.reverse();
						dateEndFormatted=dateEndReverse.join('-');
						dateEndFormatted='_'+dateEndFormatted;
					} else dateEndFormatted='';
					let addresses=blank.ADRES;
					addresses.forEach(address=>{
						console.log(address);
						console.log(dateFormatted+' '+firmNameStandart+'.dat');
						counter++;
						console.log(counter);
						fs.appendFileSync('ppsAddressesFromFNSXML/'+firmNameStandart+'/'+firmNameStandart+'_'+dateFormatted+dateEndFormatted+'_.dat', address+'\r\n', (err, rep)=>{
							console.log(rep);
							console.log(err);
							
						});
					});
				});			
			});			
		});
	  }
	}); 