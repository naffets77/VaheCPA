<?php
require_once('/srv/lib/stripe-php/Stripe.php');

class stripe_configuration{

    //TODO: 7/9/2013 replace with real keys when ready
    public static $secret_key = "sk_test_mkGsLqEW6SLnZa487HYfJVLf"; //sk_live_UIcybit30Z3LxXB7KpbRAmtS
    public static $public_key = "pk_test_czwzkTp2tactuLOEOqbMTRzG"; //pk_live_PpVwQkuyOIGmuxmp9v4KZqtv

    function stripe_configuration(){
        Stripe::setApiKey(stripe_configuration::$secret_key);
    }

}

Stripe::setApiKey(stripe_configuration::$secret_key);


?>