function showMyBottles(list_bottles) {

    if(client.stored_bottles.length>0){
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
            element.id= client.stored_bottles[i].id;
            element.appendChild(creator);
            element.appendChild(color);
            element.appendChild(msg);
            element.appendChild(button);

            document.querySelector("#left_column_game").appendChild(element);
        }
    }

    else {
        alert("You have no bottles! Hurry up and catch one!");
    }

}