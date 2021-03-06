
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
	$('#progressBar').width("25%");		
	$('#progressBar').attr("aria-valuenow","25");
	$('.sumUp div').empty();

	$('#step2').removeClass("hide");
	$('#step3').addClass('hide');
	$('#step4').addClass('hide');
	$('.pt-page-current').animate({
        scrollTop: $("#step2").offset().top
    }, 600);	


	$html = '<span class="glyphicon glyphicon-user"></span>';
	$html += '<span>' + _.string.titleize(_.string.humanize(value.nom_prenom)) + '</span>';
	$('.User')[0].innerHTML = $html;
}


function displayProjList()
{	

	$("#selectProj").removeClass("hide");
	$(".createProj").addClass("hide");
	$('#step3').addClass('hide');
	$('#step4').addClass('hide');
	$('.sumUp div').not(".User");
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
	      $select.append('<li><a onClick="saveInProjAcc(this.id, this.innerText)" id="' + val.ProjectID + '">' + _.string.titleize(_.string.humanize(val.ProjectName.toLowerCase())) + '</a></li>');
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
	$('#step3').addClass('hide');
	$('#step4').addClass('hide');
	$('.sumUp div').not(".User");

}

function saveProj()
{
	var data = {
		projName : _.string.titleize(_.string.humanize($("#createProjInput").val().toLowerCase())),
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
					$('#progressBar').width("50%");		
					$('#progressBar').attr("aria-valuenow","50");

					$html = '<span class="glyphicon glyphicon-road"></span>';
					$html +='<span>' + data.projName + '</span>';
					$('.Project')[0].innerHTML = $html;
					
					$('#step3').removeClass("hide");
					$('.pt-page-current').animate({
				        scrollTop: $("#step3").offset().top
				    }, 600);
					$('.Role').empty();
					$('.Config').empty();
					$('#step4').addClass('hide');
					
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

				setTimeout(function(){$(".alert").removeClass('in')}, 3000);

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