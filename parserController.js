var i=0;
var parsers=['nightmare-1xstavka.js', 'nightmare-888.js', 'nightmare-baltbet.js', 'nightmare-betcity.js', 
'nightmare-bkolimp.js', 'nightmare-fonbet.js', 'nightmare-winlinebet.js', 'node-phantom-leon.js', 'node-phantom-ligastavok.js'];

setInterval(()=>{
	if(i==parsers.length) {
		i=0;
		parsers.forEach(parser=>{
			delete require.cache[require.resolve('./bkparsers/' + parser)];
		})
	}
	require('./bkparsers/' + parsers[i]);
	i++;
}, 60*1000);