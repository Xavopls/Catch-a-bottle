function showMyBottles(list_bottles) {

    if (client.stored_bottles.length > 0) {
        for (var i = 0; i < client.stored_bottles.length; i++) {
            var creator = document.createElement("p");
            creator.innerHTML = client.stored_bottles[i].creator;

            var color = document.createElement("p");
            color.innerHTML = client.stored_bottles[i].color;

            var msg = document.createElement("p");
            msg.innerHTML = client.stored_bottles[i].msg;

            var button = document.createElement("button");
            button.innerHTML = 'Delete';
            button.className = 'delete_button btn';
            button.id = client.stored_bottles[i].id;

            var element = document.createElement("div");
            element.id = client.stored_bottles[i].id;
            element.className = "message_wrapper";
            element.appendChild(creator);
            //element.appendChild(color);
            element.appendChild(msg);
            element.appendChild(button);

            document.querySelector("#fixed_width").appendChild(element);
        }
    } else {
        dialogBox("You have no bottles! Hurry up and catch one!")
    }

}

function showCanvas() {


    var body = document.querySelector("body");
    var video = document.querySelector("#backgroundVideo");
    body.removeChild(video);

    var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = window.innerWidth - (350 * 2);
    canvas.height = window.innerHeight;


    var canvas_box = document.querySelector("#unfixed_width");
    canvas_box.appendChild(canvas);

    client.canvas = canvas;
    client.context = this.client.canvas.getContext('2d');


    //El sistema de click en un circulo esta inspirado en https://codepen.io/DanielTate/pen/NGLRGg
    client.canvas.addEventListener('click', function (e) {
        var x = e.pageX - client.canvas.offsetLeft;
        var y = e.pageY - client.canvas.offsetTop;
        var id;

        client.canvas_bottles.forEach(function (element) {
            if (Math.pow(x - element.x, 2) + Math.pow(y - element.y, 2) < Math.pow(client.diameter, 2)) {
                id = element.id;
                client.store_bottle(id);
            }
        });
    });

}

function dialogBox(message) {
    var div1 = document.createElement("div");
    div1.id = "overlay";
    div1.className = "overlay";

    var div2 = document.createElement("div");
    div2.id = "dialogBox";
    div2.className = "modal";


    var msg = document.createElement("p");
    msg.innerHTML = message;


    var ok = document.createElement("button");
    ok.innerHTML = 'ok';
    ok.className = 'ok';
    ok.id = "ok";

    div2.appendChild(msg);
    div2.appendChild(ok);

    var wrapper = document.querySelector("#game_page_container");
    wrapper.appendChild(div1);
    wrapper.appendChild(div2);

    var clean_window = document.querySelector("#ok");
    clean_window.addEventListener("click", function () {
        cleanWindow();
    });

};

function cleanWindow() {
    var wrapper = document.querySelector("#game_page_container");
    var child1 = document.querySelector("#dialogBox");
    var child2 = document.querySelector("#overlay");
    wrapper.removeChild(child1);
    wrapper.removeChild(child2);
};