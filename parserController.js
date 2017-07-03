var i=0;
var j=0;
var liveParsers=['nightmare-1xstavka.js', 'nightmare-888.js', 'nightmare-baltbet.js', 'nightmare-betcity.js', 'nightmare-bkolimp.js', 'nightmare-fonbet.js', 
'nightmare-winlinebet.js', 'node-phantom-leon.js', 'node-phantom-ligastavok.js'];

var lineParsers=['nightmare-1xstavka-line.js', 'nightmare-888-line.js', 'nightmare-baltbet-line.js', 'nightmare-betcity-line.js', 
'nightmare-bkolimp-line.js', 'nightmare-fonbet-line.js', 'nightmare-winlinebet-line.js', 'node-phantom-leon-line.js', 'nightmare-ligastavok-line.js'];


var callLiveParsers = function(){
	console.log('live parsing starting...');
	var liveInterval = setInterval(()=>{
		if(i==liveParsers.length) {
			i=0;
			setTimeout(()=>{
				liveParsers.forEach(parser=>{
					delete require.cache[require.resolve('./bkparsers/' + parser)];
				});
			}, 6*60*1000);
			clearInterval(liveInterval);
		} else{
			require('./bkparsers/' + liveParsers[i]);
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
					delete require.cache[require.resolve('./bkparsers/' + parser)];
				});
			}, 6*60*1000);
			clearInterval(lineInterval);
		} else{
			require('./bkparsers/' + lineParsers[j]);
			j++;
		}
	}, 60*1000)
};


setInterval(()=>{
	callLineParsers();
}, 60*60*1000);

setInterval(()=>{
	callLiveParsers();
}, 23*60*1000);