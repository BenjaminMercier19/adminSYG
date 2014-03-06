<?php
include 'connexion.php';
$conn =  connexion_db();	
$tsql = "SELECT *
			FROM (SELECT T.accountsID, COUNT(*) AS rowSpan
					FROM (SELECT Acc.accountsID, Acc.nom_prenom, Acc.logon, P_A.ProjAccID, P_A.ProjID, P.ProjectName, R.roleName, R.config, R.RoleID
						  FROM [dbo].[accounts] as Acc
							LEFT OUTER JOIN [dbo].[Proj_Accounts] P_A
							ON Acc.accountsID = P_A.AccountsID
							LEFT OUTER JOIN [dbo].RolesSYG R
							ON P_A.ProjAccID = R.projAccID
							LEFT OUTER JOIN [dbo].Project P
							ON P_A.ProjID = P.ProjectID) AS T
					GROUP BY T.accountsID) AS MyResult,
					(SELECT TBis.*
						FROM (SELECT Acc.accountsID, Acc.nom_prenom, Acc.logon, P_A.ProjAccID, P_A.ProjID, P.ProjectName, R.roleName, R.config, R.RoleID
									FROM [dbo].[accounts] as Acc
										LEFT OUTER JOIN [dbo].[Proj_Accounts] P_A
										ON Acc.accountsID = P_A.AccountsID
										LEFT OUTER JOIN [dbo].RolesSYG R
										ON P_A.ProjAccID = R.projAccID
										LEFT OUTER JOIN [dbo].Project P
										ON P_A.ProjID = P.ProjectID) AS TBis) AS MyResultBis
			WHERE MyResult.accountsID = MyResultBis.accountsID
			ORDER BY MyResultBis.nom_prenom, MyResultBis.ProjectName";

$stmt = sqlsrv_query($conn, $tsql);

$users = array();
if ( $stmt )    
{    
	if(sqlsrv_has_rows($stmt)){ 
		//print_r($stmt);
		while( $row = sqlsrv_fetch_array( $stmt) ) {
			$users[]=$row;
			//echo $row[0].", ".$row[1];
		}
	}
	else
	{
		//echo "No results were found.<br />";
		$users = array("err"=>"No user in database");
	}
 }     
else     
{    
	$users = array("err"=>"Can't get the info");
	/*die( print_r( sqlsrv_errors(), true));   
	echo sqlsrv_errors();*/
}
echo json_encode($users);
sqlsrv_free_stmt($stmt);    
sqlsrv_close($conn);



?>