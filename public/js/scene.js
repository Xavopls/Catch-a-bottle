var my_circle = { //my_circle NO se va guardando en ningun sitio! my_circle se reescribe en cada "pintada" y se PIERDE
	tipo: 'circulo',
	color: 'black',
	size: '8',
	positionX: '2',
	positionY: '2',
};


var clic = 0;
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var background = new Image();
background.src = "./assets/img/canvas_background.PNG";

function draw_pointer(todraw) {
	ctx.beginPath();
	ctx.arc(todraw.positionX, todraw.positionY, todraw.size, 0, 2 * Math.PI, true);
	ctx.fillStyle = todraw.color;
	ctx.fill();
}

function drawFrame() {

	
		draw_pointer(my_circle);
	

	requestAnimationFrame(drawFrame); //Per demanarli al Chrome que requereixi aquesta funcio per cada refresh. La funcio es passa sense els ()
}
drawFrame();

//Esta funcion ayuda a calcular la posicion del canvas ya desplegado en el html y que ayduara a calcular las coordenadas del "mouse"
//inspirado en https://www.kirupa.com/canvas/follow_mouse_cursor.htm
function setCanvas(el) {
	var xPosition = 0;
	var yPosition = 0;

	ctx.drawImage(background, 0, 0); //Pintamos el fondo del canvas

	while (el) {
		xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
		yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
		el = el.offsetParent;
	}
	return {
		x: xPosition,
		y: yPosition
	};
}

function limpia() { //Eliminamos todo lo pintado en el canvas y pintamos de nuevo el fondo
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(background, 0, 0);
}