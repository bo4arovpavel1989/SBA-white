var Feedback = require('./../lib/models/mongoModel.js').Feedback;
var Complaint = require('./../lib/models/mongoModel.js').Complaint;
var Comment = require('./../lib/models/mongoModel.js').Comment;
var analyze = require('sentiment');

Comment.find({}, (err, reps)=>{
	if(reps){
		reps.forEach(rep=>{
			try {
			let score = analyze(rep.engComment);
			console.log('===============\n');
			console.log('score: ' + score.score + '\n');
			console.log(rep.comment);
			console.log('===============\n');
			}catch(e){}
		});
	}
});