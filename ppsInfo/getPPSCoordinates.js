var https = require('https');
let secret = 'AIzaSyBkhoB5RgaYw19-QWiFDoUc2AtTO-Sc2P0';
var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var BkPPSCoordinates = require('./../lib/models/mongoModel.js').BkPPSCoordinates;

var MultiGeocoder = require('multi-geocoder'),
geocoder = new MultiGeocoder({ coordorder: 'latlong', lang: 'ru-RU' });
   provider = geocoder.getProvider();

// Переопределяем метод getText(), извлекающий из переданного массива адреса,
// которые требуется геокодировать.
provider.getText = function (point) {
    let text =point.address;
    return text;
};

BkPPSCoordinates.find({},(err, rep)=>{
	console.log(rep);
});

var bks=require('./../bklist.js').bkList_offline;



getCoordinates(2009, 1, 0);

function getCoordinates(year, month, j){
	BkPPS.find({bk:bks[j].bk, name:bks[j].name, year:year, month:month}, (err, rep)=>{
		if(rep.length!=0){
			geocoder.geocode(rep).then(res=>{
				let i=0;
				console.log('working on ' + bks[j].name);
				var shortname = bks[j].bk;
				var bkname = bks[j].name;
				try{
					res.result.features.forEach(point=>{
						let bkPPS = new BkPPSCoordinates({bk:shortname, name:bkname, year:year, month:month, data: point}).save((err, rep2)=>{
							console.log(i + ' ' + bkname);
							i++;
							if(i==res.result.features.length-1) {
								j++;
								if(j<bks.length) getCoordinates(year, month, j);
								else console.log('done')
							}
						});
					});
				}catch(e){
					console.log(i + ' ' + bkname);
					i++;
					if(i==res.result.features.length-1) {
								j++;
								if(j<bks.length) getCoordinates(year, month, j);
								else console.log('done')
							}
					}
			});
		} else {
			j++;
			if(j<bks.length) getCoordinates(year, month, j);
			else {
				month++;
				if(month==13){
					month=1;
					year++;
					j=0;
					console.log(year+'-'+month);
					if(year<2018) getCoordinates(year, month, j);
					else console.log('done');
				} else {
					j=0;
					console.log(year+'-'+month);
					getCoordinates(year, month, j);
				}
			}
		}
	});
}
