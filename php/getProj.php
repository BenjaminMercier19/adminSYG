<?php
include 'connexion.php';

//echo "accID = ".$_POST["accountsID"];
/*$accID = $_POST["accountsID"];
$conn =  connexion_db();	
$tsql = "SELECT * FROM  [usersSYG].[dbo].[Proj_Accounts] WHERE AccountsID = ?";
$stmt = sqlsrv_query( $conn, $tsql,array($accID));

$projAcc = array();
$projList = array();
if ( $stmt )    
{    

	if(sqlsrv_has_rows($stmt)){ 
		while( $row = sqlsrv_fetch_array( $stmt) ) {
			$projAcc[]=$row;
			//echo $row[0].", ".$row[1];
		}
		$projList = getProjList($projAcc);
	}
	else
	{
		echo "No results were found.<br />";
		$projAcc = array("logFalse");

	}
 }     
else     
{    
	$projAcc = array("logFalse");
	echo "Submission unsuccessful.";
	die( print_r( sqlsrv_errors(), true));   
	echo sqlsrv_errors();
}
//print_r($projList);
//print_r($projAcc);
//echo json_encode($projAcc);
echo json_encode($projList);*/



$projRep = array();

$conn =  connexion_db();
//$value = $value * 2;
//echo $value[1]; //colonne du projID	
$tsql = "SELECT * FROM  [usersSYG].[dbo].[Project] WHERE 1 = 1";
//print_r($value[ProjID]);
$stmt = sqlsrv_query($conn, $tsql);
//echo $stmt;
if ( $stmt )    
{    
	/*if( sqlsrv_fetch( $stmt ) === false) {
		die( print_r( sqlsrv_errors(), true));
	}*/

	if(sqlsrv_has_rows($stmt)){ 
		while( $row = sqlsrv_fetch_array( $stmt) ) {
			$projRep[]=array_merge($row);
			//echo $row[0].", ".$row[1];
		}
	}
	else
	{
		echo "No results were found2.<br />";
		$projRep = array("logFalse");

	}
 }     
else     
{    
	$projRep = array("logFalse");
	echo "Submission unsuccessful.";
	die( print_r( sqlsrv_errors(), true));   
	echo sqlsrv_errors();
}
echo json_encode($projRep);
sqlsrv_free_stmt($stmt);    
sqlsrv_close($conn);//Pour l'instant on ferme mtn sinon on s'en servira plus tard ;)


?>