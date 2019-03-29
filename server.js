function Bottle() {
    this.id = '';
    this.creator = '';
    this.color = '';
    this.msg = '';
}

var bottle_list = [];



var names= ["Lao Tsé", "Mahatma Gandhi","John Lennon","Charles Baudelaire","Jacinto Benavente","Bob Marley","Confucio","Albert Einstein","Albert Einstein","San Agustín","Casanova","Albert Einstein","Bob Marley","Antonio Machado","Platón","Lao Tsé","Giovanni Boccaccio","Abraham Lincoln","Mahatma Gandhi","Marilyn Monroe"];
var colors=["#f4f4f4","#F44336","#FFC108","#009588"];
var mensakas=["No hay que ir para atrás ni para darse impulso"," No hay caminos para la paz; la paz es el camino","Haz el amor y no la guerra","Para trabajar basta estar convencido de una cosa: que trabajar es menos aburrido que divertirse","Lo peor que hacen los malos es obligarnos a dudar de los buenos","Las guerras seguirán mientras el color de la piel siga siendo más importante que el de los ojos","Aprende a vivir y sabrás morir bien","Cada día sabemos más y entendemos menos","El mundo no está en peligro por las malas personas sino por aquellas que permiten la maldad","La medida del amor es amar sin medida","No hay nada que un hombre no sea capaz de hacer cuando una mujer le mira","Dar el ejemplo no es la principal manera de influir sobre los demás; es la única manera","El dinero no puede comprar la vida","Si es bueno vivir, todavía es mejor soñar, y lo mejor de todo, despertar","La mayor declaración de amor es la que no se hace; el hombre que siente mucho, habla poco","Si das pescado a un hombre hambriento lo nutres durante una jornada. Si le enseñas a pescar, le nutrirás toda su vida","Vale más actuar exponiéndose a arrepentirse de ello, que arrepentirse de no haber hecho nada","Ningún hombre es lo bastante bueno para gobernar a otros sin su consentimiento","Todo lo que se come sin necesidad se roba al estómago de los pobres","Vivir sola es como estar en una fiesta donde nadie te hace caso"];
var bottle_count = names.length + 1;

for (var i = 1; i <= names.length; i++) {
    var bottle = new Bottle();
    bottle.id=i;
    bottle.color=colors[Math.floor(Math.random() * colors.length)];
    bottle.creator=names[i-1]
    bottle.msg=mensakas[i-1]
    bottle_list.push(bottle);
}




var bottle2 = new Bottle();
bottle2.id = 300;
bottle2.creator = 'xavi';
bottle2.color = '#f4f4f4';
bottle2.msg = 'Bebiendo vino, uno ve las cosas diferentes';


var bottle3 = new Bottle();
bottle3.id = 301;
bottle3.creator = 'Manu Carreño';
bottle3.color = '#F44336';
bottle3.msg = 'La webcam esta obsoleta';


var bottle4 = new Bottle();
bottle4.id = 302;
bottle4.creator = 'Roger';
bottle4.color = '#FFC108';
bottle4.msg = 'Juego a basket';


var bottle5 = new Bottle();
bottle5.id = 303;
bottle5.creator = 'Turron_xixona';
bottle5.color = '#009588';
bottle5.msg = 'No se me ocurre nada, sorry gente, un abrazo';




function Client() {
    this.nickname = '';
    this.id = '';
    this.personal_bottle_list = [];
    this.last_bottle_created_time = 0;
    this.last_bottle_picked_time = 0;
}

var clients = [];
var clients_socket = [];
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

            case 'store_bottle':
                storeBottle(client, client_msg);
                break;

            case 'new_bottle':
                newBottle(client, client_msg);
                break;

            // case 'keep_bottle':
            //     keepBottle(client, client_msg);
            //     break;

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
        client.nickname = client_msg.nickname;
        id = new_user.id;

        console.log('Nuevo usuario: ' + new_user.nickname);

    }

    clients_socket.push(client);

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


function storeBottle(client, client_msg) {
    var timeout_info = lastBottlePickedTimeout(client_msg.nickname);
    if (timeout_info[0]) {
        var id = client_msg.bottle_id;
        var found = false;

        for (var i = 0; i < bottle_list.length; i++) {
            // IF NOBODY PICKED THE BOTTLE WHILE THE REQUEST WAS BEING PROCESSED IT WILL APPEAR HERE
            if (id === bottle_list[i].id) {
                var msg = {
                    'msg_type': 'caught_bottle',
                    'bottle': bottle_list[i],
                };
                found = true;

                // STORE BOTTLE IN CLIENT STORED BOTTLE LIST
                for (var j = 0; j<clients.length; j++){
                    if (clients[j].nickname === client_msg.nickname){
                        clients[j].personal_bottle_list.push(bottle_list[i]);
                    }
                }

                client.send(JSON.stringify(msg));

                bottle_list.splice(i,1); //eliminem botella del mar

                // WE SEND THE ID OF THE PICKED BOTTLE TO ALL THE USERS,
                // FOR THEM TO DELETE IT FROM THEIR LOCAL ARRAY OF BOTTLES (SO THEY WON'T PAINT IT IN THEIR LOCAL CANVAS)
                deleteBottle_fromAllClients(id);
            }
        }

        if (!found){
            var msg = {
                'msg_type': 'bottle_not_found'
            };
            client.send(JSON.stringify(msg));
        }
    }

    else {
        var msg = {
            'msg_type': 'caught_bottle_timeout',
            'time': timeout_info[1]
        };
        client.send(JSON.stringify(msg));

    }

}


// function keepBottle(client, client_msg) {
//     var bottle = new Bottle();
//     bottle = client_msg.bottle;
//
//     for (var i = 0; i < clients.length; i++) { //busquem el client a la BBDD
//         if (clients[i].nickname === client_msg.nickname) {
//             clients[i].personal_bottle_list.push(bottle);
//             console.log(client_msg + ' guarda una botella')
//         }
//     }
// }

function removeBottle(client, client_msg) {
    console.log('Removing bottle with ID: ', client_msg.bottle_id);
    for (var i = 0; i < clients.length; i++) { //busquem el client a la BBDD
        if (clients[i].id === client_msg.client_id) {
            for (var j = 0; j < clients[i].personal_bottle_list.length; j++) {
                if (clients[i].personal_bottle_list[j].id == client_msg.bottle_id) {
                    clients[i].personal_bottle_list.splice(j,1);
                    console.log('Succesfully removed');
                }
            }   
        }
    }

    var msg = {
        'msg_type': 'removed_bottle',
        'bottle_id': client_msg.bottle_id
    };
    client.send(JSON.stringify(msg));

}


function newBottle(client, client_msg) {
    var timeout_info = lastBottleThrownTimeout(client_msg.nickname);
    if(timeout_info[0]){
        var new_bottle = new Bottle();
        bottle_count++;
        new_bottle.id = bottle_count;
        new_bottle.creator = client_msg.nickname;
        new_bottle.color = client_msg.color;
        new_bottle.msg = client_msg.msg;

        bottle_list.push(new_bottle);

        // Everybody receives the updated sea bottle list array
        throwBottletoWater(new_bottle);

        var msg = {
            'msg_type': 'new_bottle_added_response',
            'bottle': new_bottle
        };
        console.log('Nueva botella añadida');
    }

    else {
        var msg = {
            'msg_type': 'newBottle_await',
            'time': timeout_info[1]
        };
    }

    client.send(JSON.stringify(msg));

}

function throwBottletoWater(bottle) {
    var msg = {
        'msg_type': 'update_new_bottle',
        'bottle_id' : bottle.id,
        'bottle_color': bottle.color
    };
    for (var i = 0; i<clients_socket.length; i++){
        clients_socket[i].send(JSON.stringify(msg));
    }
}


function deleteBottle_fromAllClients(id){
    var msg = {
        'msg_type': 'delete_bottle_from_printed',
        'bottle_id' : id
    };
    for (var i = 0; i<clients_socket.length;i++){
        clients_socket[i].send(JSON.stringify(msg));
    }
}


var lastBottlePickedTimeout = function(nickname){
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].nickname === nickname) {
            var diff = Math.abs(new Date() - clients[i].last_bottle_picked_time);
            if ( diff > 20000 ){
                clients[i].last_bottle_picked_time = new Date();
                return [true, diff];
            }
            else
                return [false, diff];
        }
    }
};


var lastBottleThrownTimeout = function(nickname){
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].nickname === nickname) {
            var diff = Math.abs(new Date() - clients[i].last_bottle_created_time);
            if ( diff > 20000 ){
                clients[i].last_bottle_created_time = new Date();
                return [true, diff];
            }
            else
                return [false, diff];
        }
    }
};