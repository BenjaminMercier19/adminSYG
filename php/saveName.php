<?php
include 'connexion.php';

$log = $_POST["login"];
$type_auth = $_POST["type_auth"];
$conn =  connexion_db();	
$params = array($log);
//Vérif si pas dans la BDD
$tsql = "SELECT * FROM  [usersSYG].[dbo].[accounts] WHERE logon = ?";
$stmt = sqlsrv_query($conn, $tsql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}

if(sqlsrv_has_rows($stmt)){ 
	//Ici arrêter le code PHP et proposer d'entrer un nouveau nom
	$row = sqlsrv_fetch_array( $stmt);
	echo json_encode($row);
	echo "This project already exists for this user, add a new role";
}

/*
if($type_auth == 0)
{
	echo "Not from systra";
}
else if ($type_auth == 1)
{
	echo "From systra";
	//Vérifier si elle est dans le LDAP
}*/

?>