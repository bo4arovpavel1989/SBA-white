var fs = require("fs");
var BkPPS = require('./../lib/models/mongoModel.js').BkPPS;
var bks=require('./../bklist.js').bkList_offline;

/*
bks.forEach(bk=>{
	fs.readFile("ppsAddressesFromFNS/" + bk.bk + 'pps.txt', "utf8", 
             function(error,data){
                console.log("Асинхронное чтение файла");
                if(error) throw error; // если возникла ошибка
			 data = data.split('\n');
			console.log(data.length);
			  data.forEach(lines=>{
				  if (lines.length>5)  {
					  //console.log(lines);
					  lines=lines.split('\r');
					  console.log(lines.length);
					  lines.forEach(line=>{
						   if (line.length>5) {
								let slicePoint = line.indexOf(' ');
								line = line.slice(slicePoint + 1);
							    var bkPPS = new BkPPS({bk:bk.bk, name:bk.name, address: line}).save();
						   }
					  })
				  }
				});
			});

});*/
