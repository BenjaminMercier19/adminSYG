<?php 
$rmdir = $_POST["rmdir"];

/*   $arrConf = explode("info/",$config);
   //arrConf[1]replace / par \
   $arrConf[1] = str_replace('\\', '/', $arrConf[1]); */
$rmdir = str_replace('/', '\\', $rmdir);
$rmdir = dirname(dirname( dirname(__FILE__)))."\\".$rmdir;
//echo $rmdir;
if (!file_exists($rmdir))
{
	echo json_encode(array("message" => "Le fichier n'est pas réel"));
}
else
{
	//echo json_encode(array("result"=>"ok"));
	echo json_encode(deleteDirectory($rmdir));
}

function deleteDirectory($dir) {
    if (!file_exists($dir)) return true;
    if (!is_dir($dir)) return unlink($dir);
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') continue;
        if (!deleteDirectory($dir.DIRECTORY_SEPARATOR.$item)) return false;
    }
    return rmdir($dir);
}

?>