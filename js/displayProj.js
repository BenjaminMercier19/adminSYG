
function displayProj(data)
{
	//alert(data);
	try
	{
	   var value = JSON.parse(data); 
	}
	catch(e)
	{
	   var value = data; 
	}

    localStorage.setItem('accountsID', value.accountsID);
	localStorage.setItem('logon', value.logon);
	localStorage.setItem('mail', value.mail);
	$('#progressBar').width("15%");		
	$('#progressBar').attr("aria-valuenow","15");

	$('#step2').removeClass("hide");

	$('.User')[0].innerHTML = '<span>' + _.string.titleize(_.string.humanize(value.nom_prenom)) + '</span>';
}


function displayProjList()
{	

	$("#selectProj").removeClass("hide");
	$(".createProj").addClass("hide");
	$.ajax({
		type:"POST",
		//data: {accountsID:localStorage.getItem("accountsID")},
		dataType:"json",
		url:"php/getProj.php",
		success: function(data,textStatus,jqXHR)
		{
			populateProjList(data,textStatus);
		},
		error: function(){   //if there is an error append a 'none available' option
		   $select.html('<li><a id="-1">none available</a></li>');
		}
	});
}

function populateProjList(data, textStatus)
{
	$select = $('#projList');
	if(textStatus == "success")
	{
		data = data.sort(function(a, b) {
	   		if(a.ProjectName == null)
	   		{
	   			a.ProjectName = "null";
	   		}
	   		if(b.ProjectName == null)
	   		{
	   			b.ProjectName = "null";
	   		}
	      	if (a.ProjectName.toLowerCase() < b.ProjectName.toLowerCase()) return -1;
			if (a.ProjectName.toLowerCase() > b.ProjectName.toLowerCase()) return 1;
    		return 0;
	   	});

	   $select.html('');
	    //iterate over the data and append a select option
	    $.each(data, function(key, val){
	      $select.append('<li><a onClick="saveInProjAcc(this.id, this.innerText)" id="' + val.ProjectID + '">' + _.string.titleize(_.string.humanize(val.ProjectName)) + '</a></li>');
	    });
	    //localStorage.setitem('mail',val.mail);

	}
	else
	{
		$select.html('');
		$select.html('<li><a id="-1">none available</a></li>');
	}
}

function createProj()
{
	$("#selectProj").addClass("hide");
	$(".createProj").removeClass("hide");

}

function saveProj()
{
	var data = {
		projName : _.string.titleize(_.string.humanize($("#createProjInput").val())),
		accID: localStorage.getItem('accountsID')  
	};

	if(data.projName != "" && data.projName != null)
	{
		$.ajax({
			type:"POST",
			dataType:"json",
			data: data,
			url:"php/saveProj.php",
			
			success: function(data,textStatus,jqXHR)
			{
				var myAlert = document.createElement("div");
				myAlert.setAttribute('style','z-index:1000;');
				if(data.returnStatus != 200)
				{
					alert(data.message);
					myAlert.className = "alert alert-dismissable alert-warning fade";
					myAlert.innerHTML += "<strong>Warning!</strong>  " + data.message;
				}
				else
				{
					alert("success");
					//alert(data.message);
					myAlert.className = "alert alert-dismissable alert-success fade";
					myAlert.innerHTML += "<strong>Success</strong> Project add to user";
					localStorage.setItem('projAccID', data.projAccID);
					localStorage.setItem('projID', data.projID);
					$('#progressBar').width("30%");		
					$('#progressBar').attr("aria-valuenow","30");
					$('.Project')[0].innerHTML = '<span>' + data.projName + '</span>';
					$('#step3').removeClass("hide");
					
				}

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