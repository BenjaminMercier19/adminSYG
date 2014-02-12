(function(){
	window.addEventListener('load', onLoadHandler, false);
})();

function onLoadHandler(e)
{
	var page = document.getElementsByClassName('page')[0];
	//alert(getComputedStyle(page, null).marginRight);
	$('.sumUp').width(getComputedStyle(page, null).marginRight);
}

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
	      $select.append('<li><a onClick="displayProj(this.id,  this.innerText)" id="' + val.accountsID + '">' + val.nom_prenom + '</a></li>');
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

function displayProj(id, value)
{
    localStorage.setItem('accountsID',id);

	$('#progressBar').width("15%");		
	$('#progressBar').attr("aria-valuenow","15");

	$('#step2').removeClass("hide");

	$('.sumUp').append('<span>' + value + '<span>');

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
	$select = $('#projList');
	if(textStatus == "success")
	{
	   $select.html('');
	    //iterate over the data and append a select option
	    $.each(data, function(key, val){
	      $select.append('<li><a onClick="saveInProjAcc(this.id)" id="' + val.ProjectID + '">' + val.ProjectName + '</a></li>');
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
	$.ajax({
		type:"POST",
		data: {accountsID:localStorage.getItem("accountsID"),projectID:id},
		dataType:"json",
		url:"php/setAccProj.php",
		success: function(data,textStatus,jqXHR)
		{
			$('#progressBar').width("30%");		
			$('#progressBar').attr("aria-valuenow","30");
			var myAlert = document.createElement("div");
			myAlert.className = "alert alert-dismissable alert-success fade";
			var myBut = document.createElement("button");
			myBut.setAttribute('type','button');
			myBut.className = "close";
			myBut.setAttribute('data-dismiss','alert');
			myBut.setAttribute('aria-hidden',true);
			myBut.innerHTML = "&times;";

			myAlert.appendChild(myBut);
			myAlert.innerHTML += "<strong>Success</strong> Project add to user";
			var pgBar = document.getElementById('prog');
			var parent = pgBar.parentNode;
			parent.appendChild(myAlert);

			myAlert.className += " in";
		},
		error: function(xhr, ajaxOptions, thrownError)
		{   //if there is an error append a 'none available' option
			var myAlert = document.createElement("div");
			myAlert.className = "alert alert-dismissable alert-warning fade";
			var myBut = document.createElement("button");
			myBut.setAttribute('type','button');
			myBut.className = "close";
			myBut.setAttribute('data-dismiss','alert');
			myBut.setAttribute('aria-hidden',true);
			myBut.innerHTML = "&times;";

			myAlert.appendChild(myBut);
			myAlert.innerHTML += "<strong>Error!</strong>  " + _.string.words((xhr.responseText).toString(),"}")[1];

			//alert(_.string.words((xhr.responseText).toString(),"}")[0]);
			
			var pgBar = document.getElementById('prog');
			var parent = pgBar.parentNode;
			parent.appendChild(myAlert);


			myAlert.className += " in";

			setTimeout(function(){myAlert.className.replace(/\bin\b/,''); myAlert.className+='out'}, 3000);

			$('#step3').removeClass("hide");

		}
	})

}
