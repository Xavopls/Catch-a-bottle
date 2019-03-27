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

	client.remove_bottle(id);

	var element = document.querySelector("#fixed_width");
	var child = document.getElementById(id);
	element.removeChild(child);

})