var i=0;
var j=0;

var fs=require('fs-extra');

var liveParsers=fs.readdirSync('liveparser');

var lineParsers=fs.readdirSync('lineparser');

var spawn=require('child_process').spawn;

var callLiveParsers = function(){
	console.log('live parsing starting...');
	var liveInterval = setInterval(()=>{
		if(i==liveParsers.length) {
			i=0;
			clearInterval(liveInterval);
		} else{
			let lp=spawn('node',['liveparser/' + liveParsers[i]]);
			console.log('spawned ' +  liveParsers[i]);
			lp.stdout.on('data',(data)=>{
				console.log(data.toString());
			});
			i++;
		}
	}, 60*1000);
};



var callLineParsers = function(){
	console.log('line parsing starting...');
	var lineInterval=setInterval(()=>{
		if(j==lineParsers.length) {
			j=0;
			clearInterval(lineInterval);
		} else{
			let lp=spawn('node',['lineparser/' + lineParsers[i]]);
			console.log('spawned ' +  lineParsers[i]);
			lp.stdout.on('data',(data)=>{
				console.log(data.toString());
			});
			j++;
		}
	}, 60*1000)
};


setInterval(()=>{
	callLineParsers();
}, 60*60*1000);

setInterval(()=>{
	callLiveParsers();
}, 17*60*1000);