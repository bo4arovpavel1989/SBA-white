var PORT = 3000;
var socket = socketCluster.connect(PORT);

function getCoefficients(){
	socket.emit('coefficientsNeeded');
}