<?php
include 'connexion.php';
$accID = $_POST["accountsID"];
$projID = $_POST["projectID"];
$conn =  connexion_db();	
$params = array($accID,$projID);

$tsql = "SELECT * FROM  [usersSYG].[dbo].[Proj_Accounts] WHERE AccountsID = ? AND ProjID = ?";
//print_r($value[ProjID]);
$stmt = sqlsrv_query($conn, $tsql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}

if(sqlsrv_has_rows($stmt)){ 
	$row = sqlsrv_fetch_array( $stmt);
	//print_r($row[0]);
	$data = array("returnStatus" => "0",
					"message" => "This project already exists for this user, add a new role",
					"projAccID" => $row[0]);
	echo json_encode($data);
	//echo "This project already exists for this user, add a new role";
}
else
{
	$tsql = "INSERT INTO [usersSYG].[dbo].[Proj_Accounts] (AccountsID, ProjID) VALUES (?,?); SELECT SCOPE_IDENTITY()";
	$params = array($accID,$projID);
	$ressource = sqlsrv_query($conn, $tsql, $params);
	if( $ressource === false ) {
	     die( print_r( sqlsrv_errors(), true));
	}
	else
	{
		sqlsrv_next_result($ressource); 
		sqlsrv_fetch($ressource);
		$data = array("returnStatus" => "200",
						"message" => "Project linked to user",
						"projAccID" => sqlsrv_get_field($ressource, 0)); 
		//echo json_encode(sqlsrv_get_field($ressource, 0));
		echo json_encode($data); 
	}




}

sqlsrv_free_stmt($stmt);    
sqlsrv_close($conn);//Pour l'instant on ferme mtn sinon on s'en servira plus tard ;)

?>