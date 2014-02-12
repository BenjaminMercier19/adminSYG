(function(){
	window.addEventListener('load', onLoadHandler, false);
	localStorage.clear();
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
	    	var value = JSON.stringify(val);
	    	value = value.replace(/"/g,'&quot;');

	    	//alert(value);
	      $select.append("<li><a onClick=\"displayProj('"+ value + "')\" id=\"'" + val.accountsID + "'\">" + val.nom_prenom + "</a></li>");
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
	      $select.append('<li><a onClick="saveInProjAcc(this.id, this.innerText)" id="' + val.ProjectID + '">' + val.ProjectName + '</a></li>');
	    })
	    //localStorage.setitem('mail',val.mail);

	}
	else
	{
		$select.html('');
		$select.html('<li><a id="-1">none available</a></li>');
	}
}

function saveInProjAcc(id, value)
{
	localStorage.setItem('projID',id);
	var myAlert = document.createElement("div");
	myAlert.setAttribute('style','z-index:1000;');
	$.ajax({
		type:"POST",
		data: {accountsID:localStorage.getItem("accountsID"),projectID:id},
		dataType:"json",
		url:"php/setAccProj.php",
		success: function(data,textStatus,jqXHR)
		{
			myAlert.className = "alert alert-dismissable alert-success fade";
			myAlert.innerHTML += "<strong>Success</strong> Project add to user";
		},
		error: function(xhr, ajaxOptions, thrownError)
		{   

			myAlert.className = "alert alert-dismissable alert-warning fade";
			myAlert.innerHTML += "<strong>Warning!</strong>  " + _.string.words((xhr.responseText).toString(),"}")[1];
			var str = _.string.words((xhr.responseText).toString(),"}")[0] + "}";
			var jsonObj = JSON.parse(str);
			localStorage.setItem('projAccID', jsonObj.ProjAccID);
		},
		complete: function()
		{
			$('#progressBar').width("30%");		
			$('#progressBar').attr("aria-valuenow","30");

			var myBut = document.createElement("button");
			myBut.setAttribute('type','button');
			myBut.className = "close";
			myBut.setAttribute('data-dismiss','alert');
			myBut.setAttribute('aria-hidden',true);
			myBut.innerHTML = "&times;";

			myAlert.appendChild(myBut);

			var pgBar = document.getElementById('prog');
			var parent = pgBar.parentNode;
			parent.appendChild(myAlert);


			myAlert.className += " in";

			setTimeout(function(){myAlert.className.replace(/\bin\b/,''); myAlert.className+='out'; myAlert.parentNode.removeChild(myAlert)}, 3000);
			$('.sumUp').append('<span>' + value + '<span>');
			$('.sumUp').append('<br />');
			$('#step3').removeClass("hide");
		}
	})

}

function setRole(roleName)
{
	$('.sumUp').append('<span>' + roleName + '<span>');
	var config = "https://sygdev.systra.info/config_" + localStorage.getItem("logon") + "_" + roleName + ".xml";
	$.ajax({
		type:"POST",
		data: {projAccID:localStorage.getItem("projAccID"), roleName: roleName, config: config},
		dataType:"json",
		url:"php/setRole.php",
		success: function(data,textStatus,jqXHR)
		{
			alert(xhr.textStatus);
			//populateProjList(data,textStatus,jqXHR);
		},
		error: function(xhr, ajaxOptions, thrownError){ 
			//if there is an error append a 'none available' option
		    //$select.html('<li><a id="-1">none available</a></li>');
		    alert(xhr.responseText);
		}
	})

}
