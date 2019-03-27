function Bottle() {
    this.id = '';
    this.creator = '';
    this.color = '';
    this.msg = '';
    this.x = '';
    this.y = '';
}


function Client() {

    this.nickname = "";
    this.id = "";
    this.stored_bottles = [];
    this.canvas_bottles = [];
    this.thrown_bottles_ids = [];
    this.canvas;
    this.context;
    this.diameter = 20;

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

        switch (data.msg_type) {
            case 'logged_user':
                initialize(data);
                break;

            case 'caught_bottle':
                caught_bottle(data.bottle);
                break;

            case 'new_bottle_added_response':
                this.thrown_bottles_ids.push(data.bottle.id);
                break;

            case 'newBottle_await':
                window.alert('You can not throw another bottle for ' + (60.0 - (data.time / 1000)) + ' seconds!')
                break;

            case 'removed_bottle':
                console.log('ASAAAAAAAAAAAAAA')
                removeStoredBottle(data.bottle_id);
                break;

            case 'delete_bottle_from_printed':
                deleteBottleFromPrinted(data.bottle_id);
                break;

            case 'update_new_bottle':
                addCanvasBottle(data);
                break;

            case 'bottle_not_found':
                window.alert('Somebody has picked the bottle before you! Be faster next time :)')
                break;

            case 'caught_bottle_timeout':
                window.alert('You can not get another bottle for ' + (60.0 - (data.time / 1000)) + ' seconds!')
                break;
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


        this.store_bottle = (bottle_id, callback_fn) => {
        var message = {
            'msg_type': 'store_bottle',
            'nickname': this.nickname,
            'bottle_id': bottle_id
        };
        this.ws.send(JSON.stringify(message));
        this.onResponse = callback_fn
    };

    // this.keep_bottle = (bottle, callback_fn) => {
    //     var message = {
    //         'msg_type': 'keep_bottle',
    //         'nickname': this.nickname,
    //         'bottle': bottle
    //     };
    //     this.ws.send(JSON.stringify(message));
    //     this.onResponse = callback_fn
    // };

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
        this.client.stored_bottles = data.stored_bottles;
        this.client.canvas_bottles = data.bottle_list;

        document.querySelector("#login_page_container").style.display = "none"; //Ocultamos login y desplegamos el chat
        document.querySelector("#game_page_container").style.display = "inline";


        showCanvas();




        for (var i = 0; i < this.client.canvas_bottles.length; i++) {

            var x = Math.floor(Math.random() * (canvas.width - 100)) + 100;
            var y = Math.floor(Math.random() * (canvas.height -100)) + 100;

            this.client.canvas_bottles[i].x = x;
            this.client.canvas_bottles[i].y = y;
        }

        drawFrame();

    }

    function caught_bottle(bottle) {
        // STORE CAUGHT BOTTLE INTO MY ARRAY OF STORED BOTTLES
        this.client.stored_bottles.push(bottle);

        var div1 = document.createElement("div");
        div1.id = "overlay";
        div1.className = "overlay";
        var div2 = document.createElement("div");
        div2.id = "window";
        div2.className = "modal";

        var creator = document.createElement("p");
        creator.innerHTML= "— "+bottle.creator+" —";
        creator.id="creator";
        var msg=document.createElement("p");
        msg.innerHTML="\""+bottle.msg+"\"";
        msg.id="recived_message";



        var discard = document.createElement("button");
        discard.innerHTML = 'Discard bottle';
        discard.className = 'discard';
        discard.id = "discard";

        var keep = document.createElement("button");
        keep.innerHTML = 'Keep bottle';
        keep.className = 'keep';
        keep.id = "keep";
        
        div2.appendChild(msg);
        div2.appendChild(creator);
        div2.appendChild(discard);
        div2.appendChild(keep);

        var general_box = document.querySelector("#game_page_container");
        general_box.appendChild(div1);
        general_box.appendChild(div2);
       
        var discard_listener = document.querySelector("#discard");
        discard_listener.addEventListener("click", function () {
            discardSelection(bottle.id);
        });


        var keep_bottle = document.querySelector("#keep");
        keep_bottle.addEventListener("click", function () {

            var element = document.querySelector("#game_page_container");
            var child1 = document.querySelector("#window");
            var child2 = document.querySelector("#overlay");
            element.removeChild(child1);
            element.removeChild(child2);
           
        });



    }

    function addCanvasBottle(data) {
        var new_bottle = new Bottle();
        new_bottle.x = Math.floor((Math.random() * (canvas.width - 100)) + 100);
        new_bottle.y = Math.floor((Math.random() * (canvas.height - 100)) + 100);
        new_bottle.id = data.bottle_id;
        new_bottle.color = data.bottle_color;
        this.client.canvas_bottles.push(new_bottle);
    }

    function deleteBottleFromPrinted(id) {
        for (var i = 0; i < this.client.canvas_bottles.length; i++) {
            if (this.client.canvas_bottles[i].id === id) {
                this.client.canvas_bottles.splice(i, 1);
            }
        }
    }

    function removeStoredBottle(bottle_id) {
        for (var i = 0; i < this.client.stored_bottles.length; i++) {
            if (bottle_id == this.client.stored_bottles[i].id) {
                this.client.stored_bottles.splice(i, 1);
            }
        }
    }


    function discardSelection(bottle_id) {
        this.client.remove_bottle(bottle_id);
        var element = document.querySelector("#game_page_container");
        var child1 = document.querySelector("#window");
        var child2 = document.querySelector("#overlay");
        element.removeChild(child1);
        element.removeChild(child2);
    }
}