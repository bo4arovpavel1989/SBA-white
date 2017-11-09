var https = require('https');
var fs=require('fs-extra');
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

BkPPSCoordinates.remove({},(err, rep)=>{
	console.log(rep);
	getCoordinates(0);
});

var actualDate=new Date();
var date1='2010-01-15';
var date2=actualDate.getFullYear()+'-'+(actualDate.getMonth()+1)+'-15'; 
if((actualDate.getMonth()+2)<10) date2=actualDate.getFullYear()+'-0'+(actualDate.getMonth()+1)+'-15'; 

var dateArray=customFunctions.calculateMiddleMonthes(date1,date2);


function

function getCoordinates(j){
	BkPPS.find({bk:bks[j].bk, name:bks[j].name, end:actualStringDate}, (err, rep)=>{
		if(rep.length!=0){
			geocoder.geocode(rep).then(res=>{
				let i=0;
				console.log(j);
				console.log('working on ' + bks[j].name);
				var shortname = bks[j].bk;
				var bkname = bks[j].name;
				try{
					res.result.features.forEach(point=>{
						let bkPPS = new BkPPSCoordinates({bk:shortname, name:bkname, data: point}).save((err, rep2)=>{
							console.log(i + ' ' + bkname);
							i++;
							if(i==res.result.features.length) {
								j++;
								if(j<bks.length) getCoordinates(j);
								else console.log('done')
							}
						});
					});
				}catch(e){
					console.log('an error occured while accessing to geocoder');
					console.log(i + ' ' + bkname);
					j++;
					if(j<bks.length) getCoordinates(j);
					else console.log('done')
				}	
			});
		} else {
			console.log(j);
			console.log('no bk found for tha date');
			j++;
			if(j<bks.length) getCoordinates(j);
			else console.log('done'); 
		}
	});
}
