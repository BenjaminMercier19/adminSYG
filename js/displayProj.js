
function displayProj(data)
{
	var value = JSON.parse(data); 
    localStorage.setItem('accountsID', value.accountsID);
	localStorage.setItem('logon', value.logon);
	localStorage.setItem('mail', value.mail);
	$('#progressBar').width("15%");		
	$('#progressBar').attr("aria-valuenow","15");

	$('#step2').removeClass("hide");

	$('.sumUp').append('<span>' + value.nom_prenom + '<span>');
	$('.sumUp').append('<br />');

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
	});
}

function populateProjList(data, textStatus, jqXHR)
{
	$select = $('#projList');
	if(textStatus == "success")
	{
	   $select.html('');
	    //iterate over the data and append a select option
	    $.each(data, function(key, val){
	      $select.append('<li><a onClick="saveInProjAcc(this.id, this.innerText)" id="' + val.ProjectID + '">' + val.ProjectName + '</a></li>');
	    });
	    //localStorage.setitem('mail',val.mail);

	}
	else
	{
		$select.html('');
		$select.html('<li><a id="-1">none available</a></li>');
	}
}