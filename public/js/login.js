﻿var client = new Client();
var canvasPos;



// JOIN ROOM
var login = document.querySelector("#login");
login.addEventListener("click", function () {
	var nickname = document.querySelector("#nickname").value;
	client.login(nickname);
});

var send = document.querySelector("#send");
send.addEventListener("click", function () {
	var message = document.querySelector("#message").value;
	var color = document.querySelector("#color").value;
	client.add_bottle(color, message);
});

const wrapper = document.querySelector("#left_column_game");
wrapper.addEventListener("click", function (e) {
  const isButton = event.target.nodeName === 'BUTTON';

		var id = e.target.id;
		for (var i = 0; i < client.client_bottle_list.length; i++) { //busquem el client a la BBDD
			if (client.client_bottle_list[i].id == id) {

				//borrar de la meva llista
				client.client_bottle_list.splice(i, 1); //remove a la posicio i de 1 element
				//borrar del servidor
				client.remove_bottle(id);
				//borrar del html

				var element = document.querySelector("#left_column_game");
			var child = document.getElementById(id);
			element.removeChild(child);

			}
		}
})

