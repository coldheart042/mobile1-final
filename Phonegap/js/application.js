/*This is where Google maps goes*/

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var destination = new google.maps.LatLng(47.699607, -117.411909);
var origin;
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            origin = pos;
        });
    }
    else{
        origin = destination;        // Kind of a lazy workaround...
    }
    var mapOptions = {
        zoom:17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: destination
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    var marker = new google.maps.Marker({
        position:destination,
        map: map
    })
    directionsDisplay.setMap(map);
}

function calcRoute() {

    var request = {
        origin:origin,
        destination:destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

// End Google

/*This is where javascript goes*/

    // Helper functions
function btnDisable(button) {
        button.button('disable');
        button.button('refresh');
}

function btnEnable(button){
    button.button('enable');
    button.button('refresh');
}

function cbrDisable(input) {
    input.checkboxradio('disable');
    input.checkboxradio('refresh');
}

function cbrEnable(input){
    input.checkboxradio('enable');
    input.checkboxradio('refresh');
}


$(document).ready(function () {
    // Global Variables
    var start = $('#start');
    var finish = $('#finish');
    var menuButtons = $('.menuControls');
    var menuButtons1 = $('.menuControls1');
    var toppings = $('.topping');
    var save = $('#saveAsFavorite');
    var crust = $('.crust');
    var sauce = $('.sauce');
    var pizza;
    var load = $('#loadFavorite');
    var submit = $('#submit');
    var pizzaOrder = [];
    var phone = $('.phone');
    var deliveryAddress = [];
    var currentOrderForm = $('.currentOrderForm');

    function log(info){
        console.log(info);               //For testing
    }

    phone.textinput();



    function addAddress(control){
        deliveryAddress.push(control.val())
    }

    function handleMenu() {
        if (pizza == '') {
            btnEnable(menuButtons);
            cbrEnable(menuButtons1);
        }
        else {
            btnDisable(menuButtons);
            cbrDisable(menuButtons1)
        }

        start.click(function () {
            btnDisable(start);
            pizza = [[]];
            btnEnable(menuButtons);
            cbrEnable(menuButtons1);
        });

        crust.click(function(){
            var value = this.getAttribute('value');
            var index = pizza[0].lastIndexOf(value);
            if (index < 0) pizza[0].push(value);
            else pizza[0].splice(index, 1);
        });

        sauce.click(function(){
            var value = this.getAttribute('value');
            var index = pizza[0].lastIndexOf(value);
            if (index < 0) pizza[0].push(value);
            else pizza[0].splice(index, 1);
        });

        toppings.click(function(){
            var value = this.getAttribute('name');
            var index = pizza[0].lastIndexOf(value);
            if (index < 0) pizza[0].push(value);
            else pizza[0].splice(index, 1);
        });

        save.click(function(){
            if (typeof(Storage)!= 'undefined' )localStorage.setItem('favoriteOrder', JSON.stringify(pizzaOrder));
            else alert('Sorry, your browser does not support this feature.')
        });

        load.click(function(){                 // Somehow deletes local favorite when refreshed!!!
            if (typeof (Storage)!= 'undefined'){
                var string = localStorage.getItem('favoriteOrder');
                pizzaOrder = JSON.parse(string);
                log(pizzaOrder);
            }
            else alert('Sorry, your browser does not support this feature.')
        });

        finish.click(function(){
            log(pizza);
            pizzaOrder.push(pizza);
            menuButtons1.attr('checked',false).checkboxradio('refresh');
            btnDisable(finish);
            cbrDisable(menuButtons1);
            btnEnable(start);
            var list = document.createElement('ul');
            for(item in pizza){
                var itemTag = document.createElement('li');
                if (pizza[item].constructor != Array) {
                    itemTag.innerText = pizza[item];
                } else {
                    var toppingList = document.createElement('ul');
                    for (subItem in pizza[item]) {
                        var toppingItem = document.createElement('li');
                        toppingItem.innerText = pizza[item][subItem];
                        toppingList.appendChild(toppingItem);
                        itemTag.appendChild(toppingList);
                    }
                }
                list.appendChild(itemTag);
            }
            $('#currentOrderForm').append(list);
            pizza = '';
        });


    }

    function handleOrder(){
        btnDisable(submit);

        $("#deliverHere").click(function(){
            addAddress($('#cardName'));
            addAddress($('#cardNumber'));
            addAddress($('#cardCrv'));
            addAddress($('#card1'));
            addAddress($('#card2'));
            addAddress($('#cardc'));
            addAddress($('#cards'));
            addAddress($('#cardz'));
            deliveryAddress.push("Deliver Here!")
        });

        $("#deliverThere").click(function(){
            addAddress($('#cardName'));
            addAddress($('#cardNumber'));
            addAddress($('#cardCrv'));
            addAddress($('#card1'));
            addAddress($('#card2'));
            addAddress($('#cardc'));
            addAddress($('#cards'));
            addAddress($('#cardz'));
        });

        $("#deliveryAddress").click(function(){
            btnEnable(submit);
            addAddress($('#del1'));
            addAddress($('#del2'));
            addAddress($('#delc'));
            addAddress($('#dels'));
            addAddress($('#delz'));
            log(deliveryAddress);
        });

        submit.click(function(){    //Hope this works!
            log(JSON.stringify(pizzaOrder));
            $.get("sendEmail.php?compressedOrder=" + JSON.stringify(pizzaOrder)+"&compressedAddress=" + JSON.stringify(deliveryAddress));
        });
    }

    // If the page is refreshed
    if ($.mobile.activePage.attr('id') == 'menu') handleMenu();
    // Menu page - disables the menu buttons and the finish button
    $('#menu').on("pageinit", handleMenu)

    // If the page is refreshed
    if ($.mobile.activePage.attr('id') == 'order') handleOrder();
    // Menu page - disables the menu buttons and the finish button
    $('#order').on("pageinit", handleOrder)

});
