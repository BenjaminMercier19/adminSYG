<?php

	$holeEdit = $_POST["holeEdit"];
	$holeValid = $_POST["holeValid"];
	$user = $_POST["user"];
	$role = $_POST["role"];
	$mail = $_POST["mail"];
	$config = $_POST["config"];
	$xmin = $_POST["xmin"];
	$ymin = $_POST["ymin"];
	$xmax = $_POST["xmax"];
	$ymax = $_POST["ymax"];
	$title = $_POST["title"];
	$subtitle = $_POST["subTitle"];
	$respoName = $_POST["respoName"];
	$respoMail = $_POST["responMail"];
	$standard = $_POST["standard"];

	$arrConf = explode("info/",$config);
	//arrConf[1]replace / par \
	$arrConf[1] = str_replace('\\', '/', $arrConf[1]); 
	$filename = dirname(dirname( dirname(__FILE__)))."\\".$arrConf[1];

	if (dirname(dirname(__FILE__))."\xml\demo.xml") {
    	
    	$xml = new DOMDocument();
    	$xml->preserveWhiteSpace = false;
    	$xml->formatOutput = true;
		$xml->load(dirname(dirname(__FILE__))."\xml\demo.xml");
		//$xml->load($filename);	
		$layers = $xml->getElementsByTagName('layer') ;
		if($layers->length > 0)
		{
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
		}

		$map = $xml -> getElementsByTagName('map');
		if($map -> length > 0)
		{
			if($map -> item(0) -> hasAttribute('initialextent'))
			{
				$initialextent = $xmin.', '.$ymin.', '.$xmax.', '.$ymax;
				$map -> item(0) -> removeAttribute("initialextent");
	        	$map -> item(0) -> setAttribute("initialextent", $initialextent);
			}
		}

		if($role == 'Validateur')
		{
			$widgetEdit = $xml -> createElement("widget");
			$widgetEdit -> setAttribute("label", "Edit Geotechnician");
			$widgetEdit -> setAttribute("left", "80");
			$widgetEdit -> setAttribute("top", "100");
			$widgetEdit -> setAttribute("icon", "assets/images/i_edit.png");
			$widgetEdit -> setAttribute("config", "widgets/MyEdit/EditValidateurWidget.xml");
			$widgetEdit -> setAttribute("url", "widgets/MyEdit/MyEditWidget.swf");

			$widgetInfo = $xml -> createElement("widget");
			$widgetInfo -> setAttribute("label", "Info");
			$widgetInfo -> setAttribute("left", "80");
			$widgetInfo -> setAttribute("top", "100");
			$widgetInfo -> setAttribute("icon", "assets/images/i_info.png");
			$widgetInfo -> setAttribute("config", "widgets/MyEdit/EditValidateurWidget.xml");
			$widgetInfo -> setAttribute("url", "widgets/Info/InfoWidget.swf");

			$xml -> getElementsByTagName('widgetcontainer') -> item(0) -> appendChild($widgetEdit);
			$xml -> getElementsByTagName('widgetcontainer') -> item(0) -> appendChild($widgetInfo);

			$wC = $xml -> createElement("widgetcontainer");
			$wC -> setAttribute("paneltype", "bottom");
			$wC -> setAttribute("initialstate", "collapsed");
			$wC -> setAttribute("height", "250");
			$wC -> setAttribute("width", "100%");

			$widgetSearchTerm = $xml -> createElement("widget");
			$widgetSearchTerm -> setAttribute("label", "Cherche entités terminées");
			$widgetSearchTerm -> setAttribute("config", "widgets/SearchTermine/SearchTermineWidget.xml");
			$widgetSearchTerm -> setAttribute("url", "widgets/SearchTermine/SearchTermineWidget.swf");

			$xml -> getElementsByTagName('configuration') -> item(0) -> appendChild($wC);
			$xml -> getElementsByTagName('widgetcontainer') -> item(1) -> appendChild($widgetSearchTerm);

		}
		else if($role == 'Prestataire')
		{
			$widgetEdit = $xml -> createElement("widget");
			$widgetEdit -> setAttribute("label", "Edit Geotechnical consultant");
			$widgetEdit -> setAttribute("left", "80");
			$widgetEdit -> setAttribute("top", "100");
			$widgetEdit -> setAttribute("icon", "assets/images/i_edit.png");
			$widgetEdit -> setAttribute("config", "widgets/MyEdit/EditPrestataireWidget.xml");
			$widgetEdit -> setAttribute("url", "widgets/MyEdit/MyEditWidget.swf");

			$widgetInfo = $xml -> createElement("widget");
			$widgetInfo -> setAttribute("label", "Info");
			$widgetInfo -> setAttribute("left", "80");
			$widgetInfo -> setAttribute("top", "100");
			$widgetInfo -> setAttribute("icon", "assets/images/i_info.png");
			$widgetInfo -> setAttribute("config", "widgets/MyEdit/EditValidateurWidget.xml");
			$widgetInfo -> setAttribute("url", "widgets/Info/InfoWidget.swf");

			$xml -> getElementsByTagName('widgetcontainer') -> item(0) -> appendChild($widgetEdit);
			$xml -> getElementsByTagName('widgetcontainer') -> item(0) -> appendChild($widgetInfo);


		}
		else if($role == 'Client')
		{

		}

		//TODO set Title, Subtitle, GrainStandard and Responsable
		if($xml -> getElementsByTagName('name') -> length > 0)
		{
			$xml -> getElementsByTagName('name') -> item(0) -> nodeValue = $respoName;
		}

		if($xml -> getElementsByTagName('title') -> length > 0)
		{
			$xml -> getElementsByTagName('title') -> item(0) -> nodeValue = $title;
		}

		if($xml -> getElementsByTagName('subtitle') -> length > 0)
		{
			$xml -> getElementsByTagName('subtitle') -> item(0) -> nodeValue = $subtitle;
		}

		if($xml -> getElementsByTagName('mail') -> length > 0)
		{
			$xml -> getElementsByTagName('mail') -> item(0) -> nodeValue = $respoMail;
		}

		if($xml -> getElementsByTagName('GrainStandard') -> length > 0)
		{
			$xml -> getElementsByTagName('GrainStandard') -> item(0) -> nodeValue = $standard;
		}
		
		$xml->save($filename);
	}
	//Cas où le fichier n'extiste pas 
	else 
	{
	    echo "Le fichier $filename n'existe pas.";
	}

	/*function createLayers($xml)
	{
		$newLayer = $xml -> createElement("layer");
		$newLayer -> setAttribute("id", "HoleInEdition");
		$newLayer -> setAttribute("label", "HoleInEdition");
		$newLayer -> setAttribute("type", "feature");
		$newLayer -> setAttribute("visible", "true");
		$newLayer -> setAttribute("alpha", "1.0");
		$newLayer -> setAttribute("popupconfig", "popups/PopUp_Hole.xml");
		$newLayer -> setAttribute("url", $holeEdit);
		
		$newLayerBis = $xml -> createElement("layer");
		$newLayerBis -> setAttribute("id", "HoleValidated");
		$newLayerBis -> setAttribute("label", "HoleValidated");
		$newLayerBis -> setAttribute("type", "feature");
		$newLayerBis -> setAttribute("visible", "true");
		$newLayerBis -> setAttribute("alpha", "1.0");
		$newLayerBis -> setAttribute("popupconfig", "popups/PopUp_Hole.xml");
		$newLayerBis -> setAttribute("url", $holeValid);

		$xml -> getElementsByTagName('operationallayers') -> item(0) -> appendChild($newLayer);
		$xml -> getElementsByTagName('operationallayers') -> item(0) -> appendChild($newLayerBis);
	}*/
?>