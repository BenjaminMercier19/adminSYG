function saveName()
{
	if($("#addForm input").val() != "")
	{
		alert("Login ok");
		var data = {
			login : $("#addForm input").val(),
			type_auth: $("#addForm select").val()
		};

		$.ajax({
			type:"POST",
			dataType:"json",
			data: data,
			url:"php/saveName.php",
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
	else
	{
		alert("Please enter a valid login");
	}
}