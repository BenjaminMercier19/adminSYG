<?php
include 'connexion.php';

$projName = $_POST["projName"];
$accID = $_POST["accID"];

$conn =  connexion_db();	
$params = array($projName);
//Vérif si pas dans la BDD
$tsql = "SELECT * FROM  [usersSYG].[dbo].[Project] WHERE ProjectName = ?";
$stmt = sqlsrv_query($conn, $tsql, $params);
if( $stmt === false ) {
     die( print_r( sqlsrv_errors(), true));
}

if(sqlsrv_has_rows($stmt)){ 
	//Ici arrêter le code PHP et proposer d'entrer un nouveau nom
	$row = sqlsrv_fetch_array( $stmt);
	//echo json_encode($row);
	$return = array("returnStatus" => "0",
					"message" => "Ce projet est déjà dans la BDD");
	echo json_encode($return);
	sqlsrv_free_stmt($stmt);    
	sqlsrv_close($conn);
}
else
{
	addProjInDB();
}


function addProjInDB()
{
	global $projName, $accID, $conn;

	$tsql = "INSERT INTO [usersSYG].[dbo].[Project] (ProjectName) VALUES (?); SELECT SCOPE_IDENTITY()";
	$params = array($projName);
	$ressource = sqlsrv_query($conn, $tsql, $params);
	if( $ressource === false ) {
	    die( print_r( sqlsrv_errors(), true));
	    $data = array("returnStatus" => "3",
						"message" => "Can't insert user in DB");
	    echo json_encode($data);
	}
	else
	{
		sqlsrv_next_result($ressource); 
		//sqlsrv_fetch($ressource); 
		while( $row = sqlsrv_fetch_array( $ressource) ) {
		$data = array("projID" => $row[0],
						"projName" => $projName,
						"returnStatus" => "200",
						"message" => "Project registered");
		}


		$tsqlProjAcc = "INSERT INTO [usersSYG].[dbo].[Proj_Accounts] (ProjID, AccountsID) VALUES (?,?); SELECT SCOPE_IDENTITY()";
		$paramsProjAcc = array($data['projID'], $accID);
		$ressourceProjAcc = sqlsrv_query($conn, $tsqlProjAcc, $paramsProjAcc);
		if( $ressourceProjAcc === false ) {
			die( print_r( sqlsrv_errors(), true));
			$data["message"] = "Can't link project to user in DB";
			$data["returnStatus"] = "3";
		}
		else
		{
			sqlsrv_next_result($ressourceProjAcc); 
			sqlsrv_fetch($ressourceProjAcc);
			$data["message"] = "Project linked to user";
			$data["returnStatus"] = "200";
			$data["projAccID"] = sqlsrv_get_field($ressourceProjAcc, 0);
		}
		sqlsrv_free_stmt($ressourceProjAcc);  		
		echo json_encode($data);
	}
	sqlsrv_free_stmt($ressource);    
	sqlsrv_close($conn);
} 

//returnStatus 
//	0: Project already in DB
//	1: Connexion Impossible à l'annuaire
//  2: User not in LDAP!
//  3: Can't insert in DB
// 200: tout est ok				
?>