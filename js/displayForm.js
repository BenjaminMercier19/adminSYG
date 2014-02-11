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
			populateUserList(data,textStatus,jqXHR);
		},
		error: function(){   //if there is an error append a 'none available' option
		   $select.html('<li><a id="-1">none available</a></li>');
		}
	})
}


function populateUserList(data, textStatus, jqXHR)
{
	//alert("proj");
	$select = $('#myList');
	if(textStatus == "success")
	{
	   $select.html('');
	    //iterate over the data and append a select option
	    $.each(data, function(key, val){
	      $select.append('<li><a href="#" onClick="displayProj(this.id)" id="' + val.accountsID + '">' + val.nom_prenom + '</a></li>');
	    })
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
	$('#selectPeople').hide();
}

function displayProj(id)
{
    localStorage.setItem('accountsID',id);

	$('#progressBar').width("15%");		
	$('#progressBar').attr("aria-valuenow","15");

	$('#step2').removeClass("hide");

}

function displayProjList()
{	

	$("#selectProj").removeClass("hide");
	$.ajax({
		type:"POST",
		//data: {accountsID:localStorage.getItem("accountsID")},
		dataType:"json",
		url:"php/getProj.php",
		success: function(data,textStatus,jqXHR)
		{
			populateProjList(data,textStatus,jqXHR);
		},
		error: function(){   //if there is an error append a 'none available' option
		   $select.html('<li><a id="-1">none available</a></li>');
		}
	})
}

function populateProjList(data, textStatus, jqXHR)
{
	$(".alert").alert();
	$select = $('#projList');
	if(textStatus == "success")
	{
	   $select.html('');
	    //iterate over the data and append a select option
	    $.each(data, function(key, val){
	      $select.append('<li><a href="#" onClick="saveInProjAcc(this.id)" id="' + val.ProjectID + '">' + val.ProjectName + '</a></li>');
	    })
	    //localStorage.setitem('mail',val.mail);

	}
	else
	{
		$select.html('');
		$select.html('<li><a id="-1">none available</a></li>');
	}
}

function saveInProjAcc(id)
{
	//localStorage.setItem('projID',id);
	$('.alert').addClass('in');
	$('#progressBar').width("30%");		
	$('#progressBar').attr("aria-valuenow","30");
	$.ajax({
		type:"POST",
		data: {accountsID:localStorage.getItem("accountsID"),projectID:id},
		dataType:"json",
		url:"php/setAccProj.php",
		success: function(data,textStatus,jqXHR)
		{
			
		},
		error: function()
		{   //if there is an error append a 'none available' option
		   
		}
	})

}

$('.close').click(function() {

   $('.alert').removeClass('in');

})