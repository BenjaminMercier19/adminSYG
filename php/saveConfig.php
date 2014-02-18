<?php

	$holeEdit = $_POST["holeEdit"];
	$holeValid = $_POST["holeValid"];
	$user = $_POST["user"];
	$mail = $_POST["mail"];
	$config = $_POST["config"];
	
	$arrConf = explode("info/",$config);
	$filename = dirname(dirname( dirname(__FILE__)))."\\".$arrConf[1];
	if (file_exists($filename)) {
    	$xml = new DOMDocument();
		$xml->load($filename);
		$layers = $xml->getElementsByTagName('layer') ;
		if($layers->length > 0)
		{
			echo "layers".($layers->length);
			foreach ($layers as $layer) {
				if($layer -> getAttribute('id') == "HoleInEdition")
				{
					$layer -> removeAttribute('url');
	        		$layer -> setAttribute("url", $holeEdit);
					echo $layer -> getAttribute('url'); 
				}
				else if($layer -> getAttribute('id') == "HoleValidated")
				{
					$layer -> removeAttribute('url');
	        		$layer -> setAttribute("url", $holeValid);
					echo $layer -> getAttribute('url'); 
				}
			}
			$xml->save($filename);
		}
		else
		{
			$opLayers = $xml -> getElementsByTagName('operationallayers') ;
			echo "oplayers".($opLayers -> length);
			//TODO test si opLayers existe - sinon test si map existe sinon...
		}

	} else {
	    echo "Le fichier $filename n'existe pas.";
	}
?>