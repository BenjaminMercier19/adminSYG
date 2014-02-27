function saveName()
{
	var data = {
			login :($("#addForm select").val() == 0) ? $("#exampleInputlogin2").val() : $("#exampleInputlogin1").val(), 
			type_auth: $("#addForm select").val(),
			pwd: ($("#addForm select").val() == 0) ? $("#exampleInputPWD2").val() : null, 
			mail: ($("#addForm select").val() == 0) ? $("#exampleInputMail2").val() : null,
			nom_prenom:($("#addForm select").val() == 0) ? $("#exampleInputNom_Prenom2").val() : null  
	};
	var bool = false;
	if(data.type_auth == 0)
	{
		bool = ((data.pwd != "" && data.pwd != null) && (data.mail != "" && data.mail != null) && (data.nom_prenom != "" && data.nom_prenom != null) && (data.login != ""));
	}
	else if (data.type_auth == 1)
	{
		bool = (data.login != "");
	}

	if(bool)
	{
		$.ajax({
			type:"POST",
			dataType:"json",
			data: data,
			url:"php/saveName.php",
			success: function(data,textStatus,jqXHR)
			{
				if(data.returnStatus != 200)
				{
					alert(data.message);
				}
				else
				{
					//alert("success");
					alert(data.message);
					displayProj(data);
					// ici lancer les callbacks de succès
				}
			},
			error: function(e){
			   alert(e.responseText);
			}
		});

	}
	else
	{
		alert("Saisissez l'ensemble des champs SVP");
	}
}