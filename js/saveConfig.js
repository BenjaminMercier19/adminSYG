function saveConfig()
{
	$editLayer = $("#dropZone .target li a");
	$validLayer = $("#dropZoneBis .target li a");
	$bool = false;

	if($('.Role span').eq(1).text() == "Prestataire")
	{
		bool = (($("#titleConfig").val() != "" && $("#titleConfig").val() != null) && ($("#subTitleConfig").val() != "" && $("#subTitleConfig").val() != null) && ($("#respoName").val() != "" && $("#respoName").val() != null) && ($("#inputError2").val()  != "" && $("#inputError2").val()  != null));

	}
	else
	{
		bool = (($("#titleConfig").val() != "" && $("#titleConfig").val() != null) && ($("#subTitleConfig").val() != "" && $("#subTitleConfig").val() != null));
	}

	if(($editLayer.length == 0) || ($validLayer.length == 0) || !bool)
	{
		alert("Set layers before and fill the form correctly please");
	}
	else
	{
		$featLayerUrl = $editLayer[0].href.replace(/MapServer/, 'FeatureServer');
		
		var data = {
			holeEdit : $featLayerUrl,
			holeValid: $validLayer[0].href,
			user: localStorage.getItem("logon"),
			mail: localStorage.getItem("mail"),
			role: $('.Role span').eq(1).text(),
			config: $('.Config span').eq(1).text(),
			xmin: localStorage.getItem("xmin"),
			ymin: localStorage.getItem("ymin"),
			xmax: localStorage.getItem("xmax"),
			ymax: localStorage.getItem("ymax"),
			title: $("#titleConfig").val(),
			subTitle: $("#subTitleConfig").val(),
			respoName: ($('.Role span').eq(1).text() == "Prestataire")? $("#respoName").val() : null,
			responMail: ($('.Role span').eq(1).text() == "Prestataire")? $("#inputError2").val():null,
			standard: $("#selectbasic").val(),
			//TODO: Rajouterle select GrainAnalysis
		};

		$.ajax({
			type:"POST",
			dataType:"json",
			data: data,
			url:"php/saveConfig.php",
			success: function(data,textStatus,jqXHR)
			{
				alert("success");
			},
			error: function(e){
			   //if there is an error append a 'none available' option
			   alert(e.responseText);
			}
		});
	}
}