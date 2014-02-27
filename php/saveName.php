<?php
include 'connexion.php';

$log = $_POST["login"];
$type_auth = $_POST["type_auth"];
$pwd = $_POST["pwd"];
$mail = $_POST["mail"];
$nom_prenom = $_POST["nom_prenom"];
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
	//echo json_encode($row);
	$return = array("returnStatus" => "0",
					"message" => "Cet utilisateur existe déjà, veuillez rechercher parmis les utilisateurs existants");
	echo json_encode($return);
	sqlsrv_free_stmt($stmt);    
	sqlsrv_close($conn);
}
else
{
	if($type_auth == 0)
	{
		//echo "Not from systra";
		addUserInDB();
	}
	else if ($type_auth == 1)
	{
		//Vérifier si elle est dans le LDAP
		ldap_auth();
	}
}


function ldap_auth(){
	global $log, $conn, $nom_prenom, $mail;
	$ldap_url = 'SWPFR010DCS121';
	$ldap_dn = "dc=systra,dc=info";
	
	$loginDefault = "ro_planfarman";
	$passwordDefault = 'PL@NF@rman2013';
	$params = "" ;
	$ldap_domain = 'adsystra';
	 
	
	if($ds = ldap_connect( $ldap_url )){
		//// // echo 'pass1' ;
		ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
		ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);
		ldap_set_option($ds, LDAP_OPT_SIZELIMIT, 2000); 	
			
		if(ldap_bind($ds, $loginDefault.'@'.$ldap_domain, $passwordDefault )){
		
		
			$filter = "(&(objectclass=user)(samaccountname=".$log."))";
			$result=@ldap_search($ds, "OU=Comptes Individuels Standards,OU=Utilisateurs,DC=systra,DC=info", "$filter");
			$entries = ldap_get_entries($ds, $result);
			$binddn = $entries[0]["dn"];
			if($binddn)
			{
				/*print_r($entries[0]["mail"][0]);
				print_r($entries[0]["name"][0]);*/
				$nom_prenom = $entries[0]["name"][0];
				$mail = $entries[0]["mail"][0];
				//echo "Dans l'annuaire !!";
				//Ajouter l'utilisateur à la Base
				addUserInDB();
			}
			else
			{
				$return = array("returnStatus" => "2",
								"message" => "Cet utilisateur ne fait pas partie de l'annuaire SYSTRA !!");
				echo json_encode($return);
			}
		}
		else
		{
			$return = array("returnStatus" => "1",
								"message" => "Connexion impossible à l'annuaire LDAP, veuillez contactez le support SYSTRA");
			echo json_encode($return);
			ldap_close($ds); // D�connexion 
		}
	}
	else
	{
		$return = array("returnStatus" => "1",
						"message" => "Connexion impossible à l'annuaire LDAP, veuillez contactez le support SYSTRA");
		echo json_encode($return);
	}
}

function addUserInDB()
{
	global $log, $mail, $nom_prenom, $pwd, $conn, $type_auth;

	$tsql = "INSERT INTO [usersSYG].[dbo].[accounts] (nom_prenom, mail, logon, type_auth) VALUES (?,?,?,?); SELECT SCOPE_IDENTITY()";
	$params = array($nom_prenom,$mail,$log, $type_auth);
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
		$data = array("accountsID" => $row[0],
						"logon" => $log,
						"mail" => $mail, 
						"nom_prenom" => $nom_prenom, 
						"returnStatus" => "200",
						"message" => "User registered");
		}

		if($type_auth == 0)
		{
			$tsqlPWD = "INSERT INTO [usersSYG].[dbo].[pwd] (accountsID, pwd) VALUES (?,?); SELECT SCOPE_IDENTITY()";
			$paramsPWD = array($data['id'], $pwd);
			$ressourcePWD = sqlsrv_query($conn, $tsqlPWD, $paramsPWD);
			if( $ressourcePWD === false ) {
				die( print_r( sqlsrv_errors(), true));
				$data["message"] = "Can't insert user in DB";
				$data["returnStatus"] = "3";
			}
			else
			{
				sqlsrv_next_result($ressourcePWD); 
				sqlsrv_fetch($ressourcePWD);
				$data["message"] = "User registered";
				$data["returnStatus"] = "200";
			}
			//echo json_encode(sqlsrv_get_field($ressource, 0)); 
		}
		echo json_encode($data);
		sqlsrv_free_stmt($ressourcePWD);    
		
	}
	sqlsrv_free_stmt($ressource);    
	sqlsrv_close($conn);//
} 

//returnStatus 
//	0: User in DB
//	1: Connexion Impossible à l'annuaire
//  2: User not in LDAP!
//  3: Can't insert in DB
// 200: tout est ok				
?>