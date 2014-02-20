<?php
include 'connexion.php';
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