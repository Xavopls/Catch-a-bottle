function Bottle() {
    this.id = '';
    this.creator = '';
    this.color = '';
    this.msg = '';
}

var bottle_list = []
var bottle_count = 5;

var bottle = new Bottle();
bottle.id = 1;
bottle.creator = 'daniel';
bottle.color = 'red';
bottle.msg = 'Soy un reddcoin owner'
bottle_list.push(bottle);

var bottle2 = new Bottle();
bottle2.id = 2;
bottle2.creator = 'xavi';
bottle2.color = 'blue';
bottle2.msg = 'Adeua 50 pavis'
bottle_list.push(bottle2);

var bottle3 = new Bottle();
bottle3.id = 3;
bottle3.creator = 'agenjo';
bottle3.color = 'black';
bottle3.msg = 'Tu aplicacion es una mierda'
bottle_list.push(bottle3);

var bottle4 = new Bottle();
bottle4.id = 4;
bottle4.creator = 'roger';
bottle4.color = 'orange';
bottle4.msg = 'Juego a basket'
bottle_list.push(bottle4);

var bottle5 = new Bottle();
bottle5.id = 5;
bottle5.creator = 'estefania';
bottle5.color = 'black';
bottle5.msg = 'Viva maduro'
bottle_list.push(bottle5);

function Client() {
    this.nickname = '';
    this.id = '';
    this.personal_bottle_list = [];
    this.last_bottle = 0;
}

var clients = []
var client_count = 5;

var client = new Client();
client.nickname = 'daniel';
client.id = 1;
client.personal_bottle_list.push(bottle2);
client.personal_bottle_list.push(bottle4);
client.personal_bottle_list.push(bottle5);
clients.push(client);

var client2 = new Client();
client2.nickname = 'xavi';
client2.id = 2;
client2.personal_bottle_list.push(bottle);
client2.personal_bottle_list.push(bottle3);
client2.personal_bottle_list.push(bottle5);
clients.push(client2);

var client3 = new Client();
client3.nickname = 'agenjo';
client3.id = 3;
client3.personal_bottle_list.push(bottle2);
clients.push(client3);

var client4 = new Client();
client4.nickname = 'roger';
client4.id = 4;
client4.personal_bottle_list.push(bottle);
client4.personal_bottle_list.push(bottle2);
clients.push(client4);

var client5 = new Client();
client5.nickname = 'estefania';
client5.id = 5;
clients.push(client5);



// LISTENER SERVER
var express = require('express');
var app = express();
var port = 9047;

app.use(express.static('public'));

app.listen(port, function () {
    console.log("Server running at port: ", port);
});

// WEB SOCKET SERVICE
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 9048
    });

wss.on('connection', function (client) {

    client.on('message', function (message) {

        var client_msg = '';
        try {
            client_msg = JSON.parse(message);
        } catch (e) {
            return
        }
console.log("Nuevo mensaje: "+client_msg)
        switch (client_msg.msg_type) {

            case 'login_user':
                login(client, client_msg);
                break;

            case 'search_bottle':
                searchBottle(client, client_msg);
                break;

            case 'new_bottle':
                newBottle(client, client_msg);
                break;

            case 'keep_bottle':
                keepBottle(client, client_msg);
                break;
            case 'remove_bottle':
                removeBottle(client, client_msg);
                break;
        }
    });
});

function login(client, client_msg) {

    var id;
    var bottle_list_send = [];
    var stored_bottles = [];


    for (var i = 0; i < bottle_list.length; i++) { //aixo es fa per enviar la llista dampolles sense el msg
        var bottle_to_send = new Bottle();
        bottle_to_send.id = bottle_list[i].id;
        bottle_to_send.color = bottle_list[i].color;
        bottle_list_send.push(bottle_to_send);
    }

    for (var i = 0; i < clients.length; i++) { //busquem el client a la BBDD
        if (clients[i].nickname == client_msg.nickname) {
            id = clients[i].id;
            stored_bottles = clients[i].personal_bottle_list;
        }
    }

    if (id == null) { //si aquest punt el id encara esta buit vol dir que no esta a la BBDD

        var new_user = new Client();
        new_user.nickname = client_msg.nickname;
        client_count++;
        new_user.id = client_count;
        clients.push(new_user);

        id = new_user.id;

        console.log('Nuevo usuario: ' + new_user.nickname);

    }

    var msg = {
        'msg_type': 'logged_user',
        'nickname': client_msg.nickname,
        'id': id,
        'bottle_list': bottle_list_send, //botelles generals
        'stored_bottles': stored_bottles //botelles propies de lusuari

    };
    console.log('Usuario logeado: ' + client_msg.nickname);
    client.send(JSON.stringify(msg));

}


function searchBottle(client, client_msg) {
    var id = client_msg.bottle_id;

    //var bottle_list=       Hauriem de carregar desde la BBDD

    for (var i = 0; i < bottle_list.length; i++) {
        if (id == bottle_list[i].id) {
            var msg = {
                'msg_type': 'catched_bottle',
                'bottle': bottle_list[i],
            };
            client.send(JSON.stringify(msg));

            //eliminar bottle de la BBDD
        }
    }
}


function keepBottle(client, client_msg) {
    var bottle = new Bottle();
    bottle = client_msg.bottle;

    for (var i = 0; i < clients.length; i++) { //busquem el client a la BBDD
        if (clients[i].nickname == client_msg.nickname) {
            clients[i].personal_bottle_list.push(bottle)
            console.log(client_msg + ' guarda una botella')
        }
    }
}

function removeBottle(client, client_msg) {
  

    for (var i = 0; i < clients.length; i++) { //busquem el client a la BBDD
        if (clients[i].id == client_msg.client_id) {
            for (var j = 0; j < clients[i].personal_bottle_list.length; j++) {
                if (clients[i].personal_bottle_list[j].id == client_msg.bottle_id) {
                    
                    clients[i].personal_bottle_list.splice(j,1);

                    console.log(clients[i].personal_bottle_list)
                }
            }   
        }
    }

    var msg = {//aixo sha denviar a tothom
        'msg_type': 'removed_bottle',
        'bottle_id': client_msg.bottle_id
    };
    client.send(JSON.stringify(msg));

}


function newBottle(client, client_msg) {

    for (var i = 0; i < clients.length; i++) { //busquem el client a la BBDD
        if (clients[i].nickname == client_msg.nickname) {

            var diff = Math.abs(new Date() - clients[i].last_bottle);

            if (diff > 60000) { //1 minut

                var new_bottle = new Bottle();
                bottle_count++;
                new_bottle.id = bottle_count;
                new_bottle.creator = client_msg.nickname;
                new_bottle.color = client_msg.color;
                new_bottle.msg = client_msg.msg;

                bottle_list.push(new_bottle);

                // throwBottletoWater(client, new_bottle);

                //aqui faltaria enviarli a tothom la nova ampolla, shauria de fer algo semblant a updateuse
                var msg = {
                    'msg_type': 'newBottle_added',
                    'bottle': new_bottle
                };

                clients[i].last_bottle = new Date();
                console.log('Nueva botella añadida');
            } else {

                var msg = {
                    'msg_type': 'newBottle_await',
                    'time': diff
                };
            }
        }
    }

    client.send(JSON.stringify(msg));

}

function throwBottletoWater(client, new_bottle) {
    for (var i = 0; i<clients.length; i++){
        if (clients[i].nickname !== client.nickname){

        }
    }
}