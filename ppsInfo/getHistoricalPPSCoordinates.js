var https = require('https');
var fs=require('fs-extra');
var async=require('async');
var customFunctions=require('./../lib/customfunctions.js')
let secret = 'AIzaSyBkhoB5RgaYw19-QWiFDoUc2AtTO-Sc2P0';
var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var BkPPSCoordinates = require('./../lib/models/mongoModel.js').BkPPSCoordinates;
var bks=require('./../bklist.js').bkList_offline;
var MultiGeocoder = require('multi-geocoder'),
geocoder = new MultiGeocoder({ coordorder: 'latlong', lang: 'ru-RU' });
   provider = geocoder.getProvider();

// Переопределяем метод getText(), извлекающий из переданного массива адреса,
// которые требуется геокодировать.
provider.getText = function (point) {
    let text =point.address;
    return text;
};


var actualDate=new Date();
var date1='2014-04-15';//start from here coz i got coords of previous time
var date2=actualDate.getFullYear()+'-'+actualDate.getMonth()+'-15'; //date of previous month
if(actualDate.getMonth()<10) date2=actualDate.getFullYear()+'-0'+actualDate.getMonth()+'-15'; 
if(actualDate.getMonth()==0)  date2=actualDate.getFullYear()-1+'12-15';

	
var dateArray=customFunctions.calculateMiddleMonthes(date1,date2,{unlimited:true});

getHistoricalCoordinates(dateArray);

function getHistoricalCoordinates(a){
	console.log(a)
	let queries=[];
	a.forEach(date=>{
		queries.push(function(callback){
			getCoordinates(0,date,()=>{
				callback();
			});
		});
	});
	async.series(queries,(err)=>{
		console.log('done');
	});
}

function getCoordinates(j,date,callback){
	
	var actualDate=new Date(date);//dates to write in pps coordinates db
	var actualStringDate,actualStringDate2;
	var month=actualDate.getMonth()+1;
	var year=actualDate.getFullYear();
	
	recursion(j,date);
	
	function recursion(j,date){
		BkPPS.find({bk:bks[j].bk, name:bks[j].name,  begin:{$lte:date},end:{$gte:date}}, (err, rep)=>{
			if(rep.length!=0){
				console.log('making geocode request for '+bks[j].bk);
				let timerId = setTimeout(()=>{recursion(j,date)}, 15*60*60*1000);//if geocoder doesnt response make next try
				geocoder.geocode(rep).then(res=>{
					clearTimeout(timerId);
					let i=0;
					console.log(j);
					console.log('working on ' + bks[j].name);
					console.log(res);
					console.log(res.result.features.length);
					var shortname = bks[j].bk;
					var bkname = bks[j].name;
					try{
						res.result.features.forEach(point=>{
							let bkPPS = new BkPPSCoordinates({bk:shortname, name:bkname, data: point,month:month,year:year}).save((err, rep2)=>{
								console.log(date);
								console.log(i + ' ' + bkname);
								i++;
								if(i==res.result.features.length) {
									j++;
									if(j<bks.length) recursion(j,date);
									else callback();
								}
							});
						});
					}catch(e){
						console.log('an error occured while accessing to geocoder');
						console.log(i + ' ' + bkname);
						j++;
						if(j<bks.length) recursion(j,date);
						else callback();
					}	
				});
			} else {
				console.log(bks[j].bk);
				console.log('no pps of bk found for tha date: '+date);
				j++;
				if(j<bks.length) recursion(j,date);
				else callback(); 
			}
		});
	}
}