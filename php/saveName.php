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

/*if(sqlsrv_has_rows($stmt)){ 
	//Ici arrêter le code PHP et proposer d'entrer un nouveau nom
	$row = sqlsrv_fetch_array( $stmt);
	//echo json_encode($row);
	echo "Cet utilisateur existe déjà";
}
else
{*/
	if($type_auth == 0)
	{
		echo "Not from systra";
	}
	else if ($type_auth == 1)
	{
		//echo "From systra";
		//Vérifier si elle est dans le LDAP
		ldap_auth($log);
	}
//}





function ldap_auth($log){
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
				//print_r($entries);
				echo "Dans l'annuaire !!";
			}
			else
			{
				echo "Veuillez vérifiez votre requête, cette utilisateur ne fait pas partie de l'annuaire SYSTRA !";
			}
		}else{
			// echo ldap_error($ds);
			echo "Connexion impossible à l'annuaire LDAP, veuillez contactez le support SYSTRA";
			ldap_close($ds); // D�connexion 
		}
	}
}


?>