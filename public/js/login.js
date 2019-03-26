var client = new Client();



var login = document.querySelector("#login");
login.addEventListener("click", function () {
	var nickname = document.querySelector("#nickname").value;
	client.login(nickname);
});


const wrapper = document.querySelector("#fixed_width");
wrapper.addEventListener("click", function (e) {
	const isButton = event.target.nodeName === 'BUTTON';

	var id = e.target.id;
	for (var i = 0; i < client.stored_bottles.length; i++) { //busquem el client a la BBDD
		if (client.stored_bottles[i].id == id) {

			//borrar de la meva llista
			client.stored_bottles.splice(i, 1); //remove a la posicio i de 1 element
			//borrar del servidor
			client.remove_bottle(id);
			//borrar del html

			var element = document.querySelector("#fixed_width");
			var child = document.getElementById(id);
			element.removeChild(child);

		}
	}
})