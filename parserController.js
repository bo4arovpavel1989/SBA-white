var i=0;
var liveParsers=['nightmare-1xstavka.js', 'nightmare-888.js', 'nightmare-baltbet.js', 'nightmare-betcity.js', 'nightmare-bkolimp.js', 'nightmare-fonbet.js', 
'nightmare-winlinebet.js', 'node-phantom-leon.js', 'node-phantom-ligastavok.js'];

var lineParsers=['nightmare-1xstavka-line.js', 'nightmare-888-line.js', 'nightmare-baltbet-line.js', 'nightmare-betcity-line.js', 
'nightmare-bkolimp-line.js', 'nightmare-fonbet-line.js', 'nightmare-winlinebet-line.js', 'node-phantom-leon-line.js', 'nightmare-ligastavok-line.js'];

callLiveParsers();

function callLiveParsers(){
	setInterval(()=>{
		if(i==liveParsers.length) {
			i=0;
			liveParsers.forEach(parser=>{
				delete require.cache[require.resolve('./bkparsers/' + parser)];
			})
		}
		require('./bkparsers/' + liveParsers[i]);
		i++;
	}, 60*1000);
}

function callLineParsers(){
	setInterval(()=>{
		if(i==lineParsers.length) {
			i=0;
			lineParsers.forEach(parser=>{
				delete require.cache[require.resolve('./bkparsers/' + parser)];
			})
		}
		require('./bkparsers/' + lineParsers[i]);
		i++;
	}, 60*1000);
}