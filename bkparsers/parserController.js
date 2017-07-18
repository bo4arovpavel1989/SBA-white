var i=0;
var j=0;
var liveParsers=['nightmare-bk1xbet.js', 'nightmare-bk888.js', 'nightmare-baltbet.js', 'nightmare-betcity.js', 'nightmare-bkolimp.js', 'nightmare-fonbet.js', 
'nightmare-winline.js', 'node-phantom-leon.js', 'node-phantom-ligastavok.js'];

var lineParsers=['nightmare-bk1xbet-line.js', 'nightmare-bk888-line.js', 'nightmare-baltbet-line.js', 'nightmare-betcity-line.js', 
'nightmare-bkolimp-line.js', 'nightmare-fonbet-line.js', 'nightmare-winline-line.js', 'node-phantom-leon-line.js', 'nightmare-ligastavok-line.js'];


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
			require('./bkparsers/liveparsers.' + liveParsers[i]);
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
			require('./bkparsers/lineparsers/' + lineParsers[j]);
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