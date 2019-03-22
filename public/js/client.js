function Client() {

    this.nickname = "";
    this.id = "";
    this.client_bottle_list = [];
    this.canvas_bottles = [];

    this.ws = new WebSocket('ws://localhost:9048');
    //this.ws = new WebSocket('ws://ecv-etic.upf.edu:9048');
    this.ws.z = () => {
        console.log('Websocket connected!');

        // sending a send event to websocket server
        this.ws.send('connected')
    };


    this.onResponse = (resp) => {
        console.log('resp ', resp);
    };


    this.connect = () => {
        this.ws.send("You are connected!")
    };

    this.ws.onmessage = (msg) => {
        var data = JSON.parse(msg.data);
        if (data.status === 'OK' || data.status === 'ERROR') {
            this.onResponse(msg);

        } else if (data.msg_type === 'logged_user') {
            console.log(data)
            initialize(data);


        } else if (data.msg_type === 'catched_bottle') {
            console.log(data)
            catched_bottle(data.bottle);

        } else if (data.msg_type === 'newBottle_added') {
            add_new_bottle(data.bottle);
            console.log(data)
        } else if (data.msg_type === 'newBottle_await') {
            console.log('Faltan ' + (60.0 - (data.time / 1000)) + ' segundos para poder publicar un mensage')
        }

    };

    this.login = (nickname, callback_fn) => {
        var message = {
            'msg_type': 'login_user',
            'nickname': nickname
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    };


    this.search_bottle = (bottle_id, callback_fn) => {
        var message = {
            'msg_type': 'search_bottle',
            'bottle_id': bottle_id
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    };

    this.keep_bottle = (bottle, callback_fn) => {
        var message = {
            'msg_type': 'keep_bottle',
            'nickname': this.nickname,
            'bottle': bottle
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    };

    this.add_bottle = (color, message, callback_fn) => {
        var message = {
            'msg_type': 'new_bottle',
            'nickname': this.nickname,
            'color': color,
            'msg': message

        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    };

    this.remove_bottle = (bottle_id, callback_fn) => {
        var message = {
            'msg_type': 'remove_bottle',
            'client_id': this.id,
            'bottle_id': bottle_id
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    };


    function initialize(data) { //no se perque pero he de posar client abans dompli els propis atributs
        this.client.nickname = data.nickname;
        this.client.id = data.id;
        this.client.client_bottle_list = data.client_bottle_list;
        this.client.canvas_bottles = data.bottle_list;

        document.querySelector("#login_page_container").style.display = "none"; //Ocultamos login y desplegamos el chat
        document.querySelector("#game_page_container").style.display = "inline";

        if(data.client_bottle_list.length>0){
            showMyBottles(data.client_bottle_list)
        }
        canvasPos = setCanvas(canvas);

        //setup canvas
        //de la canvas_bottles assignar posicio random i afegirho al struct
    }

    function catched_bottle(bottle) {
        //pop up del missatge

        //buscar empolla del canvas i borrarla

    }

    function add_new_bottle(bottle) {
        //asignar posicio a la nova bottle
        //afegir bottle al array canvas bottle
    }




    function showMyBottles(list_bottles) {

        for (var i = 0; i < list_bottles.length; i++) { //busquem el client a la BBDD



            var creator = document.createElement("p");
            creator.innerHTML = list_bottles[i].creator;

            var color = document.createElement("p");
            color.innerHTML = list_bottles[i].color;

            var msg = document.createElement("p");
            msg.innerHTML = list_bottles[i].msg;

            var button = document.createElement("button");
            button.innerHTML = 'Delete'
            button.className = 'delete_button'
            button.id = list_bottles[i].id;

            var element = document.createElement("div");
            element.id= list_bottles[i].id;
            element.appendChild(creator)
            element.appendChild(color)
            element.appendChild(msg)
            element.appendChild(button)

            document.querySelector("#left_column_game").appendChild(element);

        }
    }
}