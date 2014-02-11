function displayUserForm()
{
	//lancer le script PHP pour avoir la liste des users
	$('#selectPeople').show();
	$select = $('#myList');
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"php/getUsers.php",
		success: function(data,textStatus,jqXHR)
		{
			populateList(data,textStatus,jqXHR);
		},
		error: function(){   //if there is an error append a 'none available' option
		   $select.html('<li><a id="-1">none available</a></li>');
		}
	})
}

function populateList(data, textStatus, jqXHR)
{

	if(textStatus == "success")
	{
	   $select.html('');
	    //iterate over the data and append a select option
	    $.each(data, function(key, val){
	      $select.append('<li><a href="#" onClick="displayProj(this.id)" id="' + val.accountsID + '">' + val.nom_prenom + '</a></li>');
	    })
	}
	else
	{
		$select.html('');
		$select.html('<li><a id="-1">none available</a></li>');
	}
}

function createUser()
{
	$('#selectPeople').hide();
}

function displayProj(id)
{
	alert("proj" + id)
}