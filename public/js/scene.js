var myBottlesButton = document.querySelector("#myBottlesButton");
myBottlesButton.addEventListener("click", showMyBottles);

var sendMessageButton = document.querySelector("#sendMessageButton");
sendMessageButton.addEventListener("click", function () {

	var wrapper = document.querySelector("#colorsList");
	var color = "#"+wrapper.options[wrapper.selectedIndex].id;

	var messageInput = document.querySelector("#message");
	client.add_bottle(color, messageInput.value);
});

function getMousePos(c, evt) {
    var rect = client.canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
};

function makeCircle(context, x, y, color) {
	context.beginPath();
	context.arc(x, y, client.diameter, 0, Math.PI * 2, true);
	context.fillStyle = color =="" ? "#009588" :color;
	context.fill();
	context.closePath();
};

function drawFrame() {
	var canvas = client.canvas;
	var context = client.context;

	context.clearRect(0, 0, canvas.width, canvas.height);

	for (var circle of client.canvas_bottles) {
		var found = false;
		for (var i = 0; i<client.thrown_bottles_ids.length;i++){
			if (client.thrown_bottles_ids[i] === circle.id){
				found = true;
			}
		}
		if (!found){
			makeCircle(context, circle.x, circle.y, circle.color);
		}
	}
	requestAnimationFrame(drawFrame);
}





