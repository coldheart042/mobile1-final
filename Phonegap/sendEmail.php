<?php
$to = 'coldheart042@gmail.com';
$compressedOrder = $_GET["compressedOrder"];
$pizzaOrder = json_decode($compressedOrder); // JSON array of pizza class objects passed through as a string, then decoded
$compressedAddress = $_GET["compressedAddress"];
$deliveryAddress = json_decode($compressedAddress); // JSON array of the address and credit card fields.
$message = ''; // Concatenated menagerie of all fields from order and addresses.

foreach($pizzaOrder as $pizza){     // Pizza order iterator
    foreach($pizza as $component){
        if(get_class($component)!=Array()){
            $message = $message . $component . "\r \n";
            }
        else {
            foreach($component as $topping){
                $message = $message . "\t";
                $message = $message . $topping . "\r \n";
            }
        }

    }
}

$message = $message . "Card info and addresses: \r \n";
foreach($deliveryAddress as $addressComponent){
    $message = $message . $addressComponent . "\r \n";
}

mail($to, "Pizza Order", $message);