<?php
include 'connexion.php';
$projAccID = $_POST["projAccID"];
$rName = $_POST["roleName"];
$conf = $_POST["config"];
$folderLev2 = $_POST["folderLev2"];
$conn =  connexion_db();	
$params = array($rName,$projAccID);
$data = array();

if(!is_dir($folderLev2))
{
	$result = mkdir($folderLev2, 0777, true);
	if ($result == 1) {
		setRole();
	} else {
		$data["returnStatus"] = 0;
		$data["message"] = "The folder has not been created at: " . $folderLev2;
		echo json_encode($data);
	}
}
else
{
	setRole();
}
	
function setRole()
{
	global $data, $params, $conn, $rName, $projAccID, $conf;
	$tsql = "SELECT * FROM  [usersSYG].[dbo].[RolesSYG] WHERE roleName LIKE ? AND projAccID = ?";
	$stmt = sqlsrv_query($conn, $tsql, $params);
	if( $stmt === false ) {
		$data["returnStatus"] = 3;
		$data["message"] = "Connexion impossible à la table RolesSYG";
		echo json_encode($data);
	    //die( print_r( sqlsrv_errors(), true));
	}
	
	if(sqlsrv_has_rows($stmt)){ 
		$row = sqlsrv_fetch_array( $stmt);
		$data = array("message" => "Already Exists",
					  "returnStatus" => 1);
	
		echo json_encode(array_merge((array)$data, (array)$row));
		//echo "This user has already a configuration for this project: <a>".$row[3]."</a>";
	}
	else
	{
		$tsql = "INSERT INTO [usersSYG].[dbo].[RolesSYG] (roleName, projAccID, config) VALUES (?,?,?); SELECT SCOPE_IDENTITY()";
		$params = array($rName,$projAccID,$conf);
		$ressource = sqlsrv_query($conn, $tsql, $params);
		if( $ressource === false ) {
			$data["returnStatus"] = 3;
	   		$data["message"] = "Connexion impossible à la table RolesSYG";
	 	  	echo json_encode($data);
		    //die( print_r( sqlsrv_errors(), true));
		}
		else
		{
			sqlsrv_next_result($ressource); 
			sqlsrv_fetch($ressource); 
			$data = array("returnStatus" =>200, 
						"message" => "A configuration is prepared", 
						"id" => sqlsrv_get_field($ressource, 0), 
						"config" => $conf);
			//echo json_encode(sqlsrv_get_field($ressource, 0)); 
			echo json_encode($data);
		}
	}

	sqlsrv_free_stmt($stmt);    
	sqlsrv_close($conn);//Pour l'instant on ferme mtn sinon on s'en servira plus tard ;)
}
?>