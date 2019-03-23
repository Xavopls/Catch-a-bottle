function showMyBottles(list_bottles) {

    if(client.client_bottle_list.length>0){
        for (var i = 0; i < list_bottles.length; i++) { //busquem el client a la BBDD

            var creator = document.createElement("p");
            creator.innerHTML = list_bottles[i].creator;

            var color = document.createElement("p");
            color.innerHTML = list_bottles[i].color;

            var msg = document.createElement("p");
            msg.innerHTML = list_bottles[i].msg;

            var button = document.createElement("button");
            button.innerHTML = 'Delete';
            button.className = 'delete_button';
            button.id = list_bottles[i].id;

            var element = document.createElement("div");
            element.id= list_bottles[i].id;
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