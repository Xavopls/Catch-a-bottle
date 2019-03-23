

//Escucha de boton My Bottles
var MyBottles_buton = document.querySelector("#myBottlesButton");
MyBottles_buton.addEventListener("click", showMyBottles);



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
	context.fillStyle = color;
	context.fill();
	context.closePath();
};


function drawFrame() {

	var canvas = client.canvas;
	var context = client.context;

	context.clearRect(0, 0, canvas.width, canvas.height);


	for (var circle of client.canvas_bottles) {
		makeCircle(context, circle.x, circle.y, circle.color);
	}

	requestAnimationFrame(drawFrame);
}





