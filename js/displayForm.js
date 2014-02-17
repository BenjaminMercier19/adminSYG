(function(){
	window.addEventListener('load', onLoadHandler, false);
	localStorage.clear();
})();

function onLoadHandler(e)
{
	var page = document.getElementsByClassName('page')[0];
	$('.sumUp').width(getComputedStyle(page, null).marginRight);
}

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
	$('#selectPeople').show();
	//alert("proj");
	$select = $('#myList');
	if(textStatus == "success")
	{
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
	});

}

function setRole(roleName)
{
	var myAlert = document.createElement("div");
	$('.sumUp').append('<span>' + roleName + '<span>');
	var config = "https://sygdev.systra.info/config_" + localStorage.getItem("logon") + "_" + roleName + ".xml";
	$.ajax({
		type:"POST",
		data: {projAccID:localStorage.getItem("projAccID"), roleName: roleName, config: config},
		dataType:"json",
		url:"php/setRole.php",
		success: function(data,textStatus,jqXHR)
		{
			//alert(xhr.textStatus);
			//alert(data);
			if(data.error)
			{
				myAlert.className = "alert alert-dismissable alert-danger fade";
				myAlert.innerHTML += "<strong>Error!</strong> This user already get this role in config: <a href='"+data.config+"' target='_blank' class='alert-link'>"+data.config+"</a>";
				var p = document.createElement("p");
				var butDanger = document.createElement("button");
				butDanger.setAttribute('type','button');
				butDanger.className = "btn btn-danger";
				butDanger.innerHTML = "Change Service";
				butDanger.addEventListener('click',function(){
					$(".alert").alert('close');
					getServicesListInConfig(data.config);
				}, false);
				p.appendChild(butDanger);
				var butDanger2 = document.createElement("button");
				butDanger2.setAttribute('type','button');
				butDanger2.setAttribute('style','float: right;');
				butDanger2.className = "btn btn-danger";
				butDanger2.innerHTML = "Cancel";
				butDanger2.addEventListener('click',function(){
					$(".alert").alert('close');
				}, false);
				p.appendChild(butDanger2);
				myAlert.appendChild(p);
			}
			else
			{
				myAlert.className = "alert alert-dismissable alert-success fade";
				myAlert.innerHTML += "<strong>Success</strong> Project add to user";
			}
		},
		error: function(xhr, ajaxOptions, thrownError){ 
			//if there is an error append a 'none available' option
		    //$select.html('<li><a id="-1">none available</a></li>');
		    //alert(xhr);
		},
		complete: function()
		{
			$('#progressBar').width("50%");		
			$('#progressBar').attr("aria-valuenow","50");

			myAlert.insertAdjacentHTML('afterBegin','<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>');

			var pgBar = document.getElementById('prog');
			var parent = pgBar.parentNode;
			parent.appendChild(myAlert);


			myAlert.className += " in";

			setTimeout(function(){
					myAlert.className.replace(/\bin\b/,'');
					//myAlert.className+='out'; 
					//myAlert.parentNode.removeChild(myAlert)
				}, 
				3000);

			$('.sumUp').append('<span>' + config + '<span>');
			$('.sumUp').append('<br />');
			$('#step3').removeClass("hide");
		}
	});

}


function getServicesListInConfig(url)
{
	var layers = [];

	$.ajax({
		type:"GET",
		dataType:"xml",
		url: url,
		success: function(data,textStatus,jqXHR)
		{
			$(data).find('layer').each(function(){
				var layer = {};
				layer.id = $(this).attr('id');
				layer.url = $(this).attr('url');
				layers.push(layer);			
			});
		},
		complete: function(){	

			getToken(layers);
		}
	});
}

function getToken(layers)
{
	if (localStorage.getItem("token") == undefined)
	{

		$.ajax({
			type:"POST",
			data:{username:"sigadmin", password:"Sigfarm@n13", referer:"https://sygdev.systra.info/adminSYG", f:"json"},
			dataType:"json",
			url: "http://vwpfr010app134:6080/arcgis/tokens/generateToken",
			success: function(data,textStatus,jqXHR)
			{
				$("#step4").removeClass("hide");



				displayServicesList(layers, data.token);
				localStorage.setItem("token", data.token);
			},
			error: function()
			{
				alert("Impossible to connect the ArcGIS Server");
			}
		});
	}
	else
	{
		displayServicesList(layers, localStorage.getItem("token"));
	}
}

function displayServicesList(layers, token)
{
	$.ajax({
		type:"POST",
		data:{token: token, f:"json"},
		dataType:"json",
		url: "https://sygdev.systra.info/arcgis/rest/services/SYG",
		success: function(data,textStatus,jqXHR)
		{
			$serviceList = $('#serviceList');

			$serviceList.html('');

			$.each(data.services, function(key, val){
		    	var value = JSON.stringify(val);
		    	value = value.replace(/"/g,'&quot;');
		    	//alert(value);
		    	if(val.type == "MapServer")
		    	{
    		   	 $serviceList.append("<li><a onClick=\"getLayerList('"+ value + "')\"  id=\"'" + val.name + "'\">" + val.name + "</a></li>");
		    	}
		    });
		},
		error: function()
		{
			alert("Impossible to get SYG services");
		}
	});
}

function getLayerList(value)
{
	var dataSend = JSON.parse(value); 
	
	$(".source, .target").sortable({
		connectWith: ".connected"
	});

	$(".target").on("sortupdate", function(e) {
		updateValues(e);
	});
	/*$(".source").on("sortupdate", function(e) {
		updateValuesBis(e);
	});*/
/*
 	$('ul.target li').livequery(function() {
	  alert('added');
	  
	});*/
	$.ajax({
		type:"POST",
		data:{token: localStorage.getItem("token"), f:"json"},
		dataType:"json",
		url: "https://sygdev.systra.info/arcgis/rest/services/" + dataSend.name +"/MapServer",
		success: function(data,textStatus,jqXHR)
		{
			$layerList = $('#layersList');

			$layerList.html('');

			//$('#dropZone ul')

			$.each(data.layers, function(key, val){
		    	var oResult = JSON.stringify(val);
		    	oResult = oResult.replace(/"/g,'&quot;');
		    	//alert(value);
    		   	$layerList.append("<li><a draggable='true' id=\"'" + val.id + "'\">" + val.name + "</a></li>");
    		   		
		    });
		},
		error: function()
		{
			alert("Impossible to get SYG layers");
		}
	});
}


function updateValues(e)
{
	if(e.currentTarget)
	{
		if ( $('#'+e.currentTarget.parentElement.id+' ul > *').length > 0 ) {
	    	alert('added');
	    	$('#'+e.currentTarget.parentElement.id+' ul').removeClass('connected');
		}
		else
		{
	    	alert('removed1');
	    	$('#'+e.currentTarget.parentElement.id+' ul').addClass('connected');
		}
	}
}


/*function updateValuesBis(e)
{
	if($("#dropZone ul > *").length == 0)
	{
    	alert('removed');
    	$("#dropZone ul").addClass('connected');
	}

	if($("#dropZoneBis ul > *").length == 0)
	{
    	alert('removed Bis');
    	$("#dropZoneBis ul").addClass('connected');
	}
}*/
/*

*/
	
/*	if(textStatus == "success")
	{
	   $select.html('');
	    //iterate over the data and append a select option
	    $.each(data, function(key, val){
	    	var value = JSON.stringify(val);
	    	value = value.replace(/"/g,'&quot;');

	    	//alert(value);
	      $select.append("<li><a onClick=\"displayProj('"+ value + "')\" id=\"'" + val.accountsID + "'\">" + val.nom_prenom + "</a></li>");
	    });*/