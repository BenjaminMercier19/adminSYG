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
$accID = $_POST['accID'];

/* Exécute la première requête. */
$sql1 = "DELETE Pwd FROM [dbo].[pwd] as Pwd WHERE Pwd.accountsID = ?";
$params = array( $accID );
$stmt1 = sqlsrv_query( $conn, $sql1, $params );

/* Exécute la seconde requête. */
$sql2 = "DELETE A FROM [dbo].[accounts] as A WHERE A.accountsID = ?";
$stmt2 = sqlsrv_query( $conn, $sql2, $params );

/* Si les deux requêtes sont exécutées avec succès, on valide la transaction. */
/* Sinon, on annule la transaction. */
if( $stmt1 && $stmt2 ) {
     sqlsrv_commit( $conn );
     echo json_encode(array("success" => "Transaction validée", "statement" => "user"));
} else {
     sqlsrv_rollback( $conn );
     echo json_encode(array("err"=>"Transaction annulée, veuillez vérifier la requête manuellement dans le SQL133. Pour info, l'accountsID est: ".$accID));
}

?>