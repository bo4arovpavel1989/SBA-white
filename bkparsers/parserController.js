var i=0;
var j=0;

var fs=require('fs-extra');

var liveParsers=fs.readdirSync('liveparser');

var lineParsers=fs.readdirSync('lineparser');


var callLiveParsers = function(){
	console.log('live parsing starting...');
	var liveInterval = setInterval(()=>{
		if(i==liveParsers.length) {
			i=0;
			setTimeout(()=>{
				liveParsers.forEach(parser=>{
					delete require.cache[require.resolve('./liveparser/' + parser)];
				});
			}, 6*60*1000);
			clearInterval(liveInterval);
		} else{
			require('./liveparser/' + liveParsers[i]);
			i++;
		}
	}, 60*1000);
};



var callLineParsers = function(){
	console.log('line parsing starting...');
	var lineInterval=setInterval(()=>{
		if(j==lineParsers.length) {
			j=0;
			setTimeout(()=>{
				lineParsers.forEach(parser=>{
					delete require.cache[require.resolve('./lineparser/' + parser)];
				});
			}, 6*60*1000);
			clearInterval(lineInterval);
		} else{
			require('./lineparser/' + lineParsers[j]);
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