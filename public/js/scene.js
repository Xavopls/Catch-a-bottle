

//Escucha de boton My Bottles
var MyBottles_buton = document.querySelector("#myBottlesButton");
MyBottles_buton.addEventListener("click", showMyBottles);



var canvas = document.querySelector("canvas");

function setCanvas(el) {
	var xPosition = 0;
	var yPosition = 0;

	//ctx.drawImage(background, 0, 0); //Pintamos el fondo del canvas

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