<?php
include 'connexion.php';
$conn = connexion_db();

if( $conn === false ) {
    die( print_r( sqlsrv_errors(), true ));
}

/* Commence la transaction. */
if ( sqlsrv_begin_transaction( $conn ) === false ) {
     die( print_r( sqlsrv_errors(), true ));
}

/* Initialise les valeurs des paramètres. */
$roleID = $_POST['roleID'];

/* Exécute la première requête. */
$sql1 = "DELETE P FROM [dbo].[Proj_Accounts] as P INNER JOIN [dbo].[RolesSYG] as R ON R.projAccID = P.ProjAccID WHERE R.RoleID = ?";
$params = array( $roleID );
$stmt1 = sqlsrv_query( $conn, $sql1, $params );

/* Exécute la seconde requête. */
$sql2 = "DELETE R FROM [dbo].[RolesSYG] as R WHERE R.RoleID = ?";
$stmt2 = sqlsrv_query( $conn, $sql2, $params );

/* Si les deux requêtes sont exécutées avec succès, on valide la transaction. */
/* Sinon, on annule la transaction. */
if( $stmt1 && $stmt2 ) {
     sqlsrv_commit( $conn );
     echo json_encode(array("success" => "Transaction validée", "statement" => "config"));
} else {
     sqlsrv_rollback( $conn );
     echo json_encode(array("err"=>"Transaction annulée"));
}

?>