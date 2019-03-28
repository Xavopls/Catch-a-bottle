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


    this.onResponse = (resp) => {};


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
                dialogBox("You can not throw another bottle for " + Math.trunc((60.0 - (data.time / 1000))) + " seconds!");
                break;

            case 'removed_bottle':
                removeStoredBottle(data.bottle_id);
                break;

            case 'delete_bottle_from_printed':
                deleteBottleFromPrinted(data.bottle_id);
                break;

            case 'update_new_bottle':
                addCanvasBottle(data);
                break;

            case 'bottle_not_found':
                dialogBox("Somebody has picked the bottle before you! Be faster next time :)")

                break;

            case 'caught_bottle_timeout':
                dialogBox("You can not get another bottle for " + Math.trunc((60.0 - (data.time / 1000))) + " seconds!");
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

    function initialize(data) {
        this.client.nickname = data.nickname;
        this.client.id = data.id;
        this.client.stored_bottles = data.stored_bottles;
        this.client.canvas_bottles = data.bottle_list;

        document.querySelector("#login_page_container").style.display = "none";
        document.querySelector("#game_page_container").style.display = "inline";

        showCanvas();

        for (var i = 0; i < this.client.canvas_bottles.length; i++) {

            var x = Math.floor(Math.random() * (canvas.width - 100)) + 100;
            var y = Math.floor(Math.random() * (canvas.height - 100)) + 100;

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
        creator.innerHTML = "— " + bottle.creator + " —";
        creator.id = "creator";
        var msg = document.createElement("p");
        msg.innerHTML = "\"" + bottle.msg + "\"";
        msg.id = "received_message";



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

            var wrapper = document.querySelector("#game_page_container");
            var child1 = document.querySelector("#window");
            var child2 = document.querySelector("#overlay");
            wrapper.removeChild(child1);
            wrapper.removeChild(child2);

            //IF STORED BOTTLE LIST IS DEPLOYED, IT IS ADDED AT THE BOTTOM
            if (document.querySelector("#fixed_width").hasChildNodes()) {
                creator = document.createElement("p");
                creator.innerHTML = bottle.creator;

                var color = document.createElement("p");
                color.innerHTML = bottle.color;

                var msg = document.createElement("p");
                msg.innerHTML = bottle.msg;

                var button = document.createElement("button");
                button.innerHTML = 'Delete';
                button.className = 'delete_button';
                button.id = bottle.id;

                var element = document.createElement("div");
                wrapper.id = bottle.id;
                wrapper.className = "message_wrapper";
                wrapper.appendChild(creator);
                wrapper.appendChild(msg);
                wrapper.appendChild(button);

                document.querySelector("#fixed_width").appendChild(wrapper);
            }
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
        var wrapper = document.querySelector("#game_page_container");
        var child1 = document.querySelector("#window");
        var child2 = document.querySelector("#overlay");
        wrapper.removeChild(child1);
        wrapper.removeChild(child2);
    }
}