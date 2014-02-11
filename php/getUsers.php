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


$conn =  connexion_db();	
$tsql = "SELECT * FROM  [usersSYG].[dbo].[accounts] WHERE 1 = 1";
$stmt = sqlsrv_query( $conn, $tsql);

$accounts = array();
if ( $stmt )    
{    
	/*if( sqlsrv_fetch( $stmt ) === false) {
		die( print_r( sqlsrv_errors(), true));
	}*/

	if(sqlsrv_has_rows($stmt)){ 
		while( $row = sqlsrv_fetch_array( $stmt) ) {
			$accounts[]=$row;
			
			//echo $row[0].", ".$row[1];
		}
	}
	else
	{
		echo "No results were found.<br />";
		$accounts = array("logFalse");
	}
 }     
else     
{    
	$accounts = array("logFalse");
	echo "Submission unsuccessful.";
	die( print_r( sqlsrv_errors(), true));   
	echo sqlsrv_errors();
}
echo json_encode($accounts);
sqlsrv_free_stmt($stmt);    
sqlsrv_close($conn);//Pour l'instant on ferme mtn sinon on s'en servira plus tard ;)


?>