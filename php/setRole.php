<?php
include 'connexion.php';
$projAccID = $_POST["projAccID"];
$rName = $_POST["roleName"];
$conf = $_POST["config"];
$conn =  connexion_db();	
$params = array($rName,$projAccID);

$tsql = "SELECT * FROM  [usersSYG].[dbo].[RolesSYG] WHERE roleName LIKE ? AND projAccID = ?";
//print_r($value[ProjID]);
$stmt = sqlsrv_query($conn, $tsql, $params);
if( $stmt === false ) {
     //echo 1;
     die( print_r( sqlsrv_errors(), true));
}

if(sqlsrv_has_rows($stmt)){ 
	$row = sqlsrv_fetch_array( $stmt);
	$data = array("error" => "Already Exists");

	echo json_encode(array_merge((array)$data, (array)$row));
	//echo "This user has already a configuration for this project: <a>".$row[3]."</a>";
}
else
{
	$tsql = "INSERT INTO [usersSYG].[dbo].[RolesSYG] (roleName, projAccID, config) VALUES (?,?,?); SELECT SCOPE_IDENTITY()";
	$params = array($rName,$projAccID,$conf);
	$ressource = sqlsrv_query($conn, $tsql, $params);
	if( $ressource === false ) {
	     die( print_r( sqlsrv_errors(), true));
	}
	else
	{
		sqlsrv_next_result($ressource); 
		sqlsrv_fetch($ressource); 
		$data = array("Success" => "A configuration file has been created", "id" => sqlsrv_get_field($ressource, 0), "config" => sqlsrv_get_field($ressource, 3));
		//echo json_encode(sqlsrv_get_field($ressource, 0)); 
		echo json_encode($data);
	}
}
/*
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
		echo json_encode(sqlsrv_get_field($ressource, 0)); 
	}




}*/

sqlsrv_free_stmt($stmt);    
sqlsrv_close($conn);//Pour l'instant on ferme mtn sinon on s'en servira plus tard ;)

?>