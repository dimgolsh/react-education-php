<?php
session_start();

if(isset($_SESSION["auth"]) == true){
    $_SESSION["auth"] = false;
    unset($_SESSION["auth"]);
    session_destroy();
}