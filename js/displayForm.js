function displayUserForm()
{
	//lancer le script PHP pour avoir la liste des users
	$("#loader").show();
	$select = $('#myList');
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"php/getUsers.php",
		success: function(data,textStatus,jqXHR)
		{
			populateUserList(data,textStatus,jqXHR);
		},
		error: function(){   //if there is an error append a 'none available' option
		   $select.html('<li><a id="-1">none available</a></li>');
		}
	});
}

function populateUserList(data, textStatus, jqXHR)
{
	$("#loader").hide();
	$('#selectPeople').removeClass("hide");
	//alert("proj");
	$select = $('#myList');
	if(textStatus == "success")
	{
	   	data = data.sort(function(a, b) {
	   		if(a.nom_prenom == null)
	   		{
	   			a.nom_prenom = "null";
	   		}
	   		if(b.nom_prenom == null)
	   		{
	   			b.nom_prenom = "null";
	   		}
	      	if (a.nom_prenom.toLowerCase() < b.nom_prenom.toLowerCase()) return -1;
			if (a.nom_prenom.toLowerCase() > b.nom_prenom.toLowerCase()) return 1;
    		return 0;
	   	});
	   

	   	$select.html('');
   		//iterate over the data and append a select option
		$.each(data, function(key, val){
	    	var value = JSON.stringify(val);
	    	value = value.replace(/"/g,'&quot;');
	      	$select.append("<li><a onClick=\"displayProj('"+ value + "')\" id=\"'" + val.accountsID + "'\">" + val.nom_prenom + "</a></li>");
	    });
	    //localStorage.setitem('mail',val.mail);

	}
	else
	{
		$select.html('');
		$select.html('<li><a id="-1">none available</a></li>');
	}
}


function createUser()
{
	$('#progressBar').width("0%");		
	$('#progressBar').attr("aria-valuenow","0");
	$('#selectPeople').addClass('hide');
	$('#addForm').removeClass('hide');
	//$('#selectPeople').addClass('hide');
	
}

function createConfigFile(config)
{
	$.ajax({
			type:"POST",
			dataType:"json",
			data: {configName:config},
			url:"php/createXML.php",
			success: function(data,textStatus,jqXHR)
			{
				alert(data);
			},
			error: function(){   //if there is an error append a 'none available' option
			  alert("error");
			}
		});
}

function modifyConfigFile(config)
{

}