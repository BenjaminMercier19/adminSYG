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
$projAccID = $_POST['projAccID'];

/* Exécute la première requête. */
$sql1 = "DELETE P FROM [dbo].[Proj_Accounts] as P WHERE P.ProjAccID = ?";
$params = array( $projAccID );
$stmt1 = sqlsrv_query( $conn, $sql1, $params );

/* Exécute la seconde requête. */

/* Si les deux requêtes sont exécutées avec succès, on valide la transaction. */
/* Sinon, on annule la transaction. */
if( $stmt1 ) {
     sqlsrv_commit( $conn );
     echo json_encode(array("success" => "Transaction validée", "statement" => "proj"));
} else {
     sqlsrv_rollback( $conn );
     echo json_encode(array("err"=>"Transaction annulée"));
}

?>