function showMyBottles(list_bottles) {

    if (client.stored_bottles.length > 0) {
        for (var i = 0; i < client.stored_bottles.length; i++) { //busquem el client a la BBDD
            var creator = document.createElement("p");
            creator.innerHTML = client.stored_bottles[i].creator;

            var color = document.createElement("p");
            color.innerHTML = client.stored_bottles[i].color;

            var msg = document.createElement("p");
            msg.innerHTML = client.stored_bottles[i].msg;

            var button = document.createElement("button");
            button.innerHTML = 'Delete';
            button.className = 'delete_button';
            button.id = client.stored_bottles[i].id;

            var element = document.createElement("div");
            element.id = client.stored_bottles[i].id;
            element.appendChild(creator);
            element.appendChild(color);
            element.appendChild(msg);
            element.appendChild(button);

            document.querySelector("#fixed_width").appendChild(element);
        }
    } else {
        alert("You have no bottles! Hurry up and catch one!");
    }

}

function showCanvas() {


    var body=document.querySelector("body");//primero elimino el video de background
    var video=document.querySelector("#myVideo");
    body.removeChild(video);

    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = window.innerWidth-(350*2);
    canvas.height = window.innerHeight;


    var canvas_box = document.querySelector("#unfixed_width");
    canvas_box.appendChild(canvas);

    client.canvas = canvas;
    client.context = this.client.canvas.getContext('2d');




    client.canvas.addEventListener('click', function (e) {
        var x = e.pageX - client.canvas.offsetLeft;
        var y = e.pageY - client.canvas.offsetTop;
        var id;
        console.log("entra")
        
        client.canvas_bottles.forEach(function (element) {
            if (Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2) < Math.pow(client.diameter, 2)) {
                
                id = element.id;

                //aqui hem de demanari al server el creador i el msg de la botella segons id

                client.search_bottle(id);

            }

        });
    });

}