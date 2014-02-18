function saveConfig()
{
	$editLayer = $("#dropZone .target li a");
	$validLayer = $("#dropZoneBis .target li a");

	if(($editLayer.length == 0) || ($validLayer.length == 0))
	{
		alert("set layers before");
	}
	else
	{
		$featLayerUrl = $editLayer[0].href.replace(/MapServer/, 'FeatureServer');
		
		var data = {
			holeEdit : $featLayerUrl,
			holeValid: $validLayer[0].href,
			user: localStorage.getItem("logon"),
			mail: localStorage.getItem("mail"),
			role: $('.Role span')[0].innerText, 
			config: $('.Config span')[0].innerText
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
			error: function(){   //if there is an error append a 'none available' option
			   alert("error");
			}
		});
	}
}