<?php
function connexion_db(){
	$serverName = "vwpfr010sql133\db_2012"; //serverName\instanceName

	$connectionInfo = array( "Database"=>"usersSYG", "UID"=>"adm_sig", "PWD"=>"Sigfarm@n13");	
	$conn = sqlsrv_connect( $serverName, $connectionInfo);

	if( $conn ) {
		 // echo "Connexion établie.<br />";
	}else{
		 // echo "La connexion n'a pu être établie.<br />";
		 die( print_r( sqlsrv_errors(), true));
	}
	return $conn;
}
