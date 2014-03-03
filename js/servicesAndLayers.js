/*function getServicesListInConfig(url)
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

			getToken();
		}
	});
}*/

function getToken()
{
	var token;
	if (localStorage.getItem("token") == undefined)
	{

		$.ajax({
			type:"POST",
			data:{username:"sigadmin", password:"Sigfarm@n13", referer:"https://sygdev.systra.info/adminSYG", f:"json"},
			dataType:"json",
			url: "http://vwpfr010app134:6080/arcgis/tokens/generateToken",
			success: function(data,textStatus,jqXHR)
			{
				//displayServicesList(data.token);
				localStorage.setItem("token", data.token);
				token = data.token;
			},
			error: function()
			{
				alert("Impossible to connect the ArcGIS Server");
			}
		});
	}
	else
	{
		token = localStorage.getItem("token");
		//displayServicesList(localStorage.getItem("token"));
	}
	return token;
}

function displayServicesList(token)
{

	$.ajax({
		type:"POST",
		data:{token: token, f:"json"},
		dataType:"json",
		url: "https://sygdev.systra.info/arcgis/rest/services/SYG",
		success: function(data,textStatus,jqXHR)
		{
			$("#step4").removeClass("hide");
			$('#progressBar').width("75%");		
			$('#progressBar').attr("aria-valuenow","75");
			$('.pt-page-current').animate({
		        scrollTop: $("#step4").offset().top
		    }, 600);
			if($('.Role span').eq(1).text() == "Prestataire")
			{
				$("#respoName").removeClass("hide");
				$("#respoMail").removeClass("hide");
			}

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
	
	$('ul.target').empty();
	$('ul.target').addClass('connected');

	$(".source, .target").sortable({
		connectWith: ".connected"
	});

	$(".target").on("sortupdate", function(e) {
		updateValues(e);
	});

	$.ajax({
		type:"POST",
		data:{token: localStorage.getItem("token"), f:"json"},
		dataType:"json",
		url: "https://sygdev.systra.info/arcgis/rest/services/" + dataSend.name +"/MapServer",
		success: function(data,textStatus,jqXHR)
		{
			localStorage.setItem("xmax", data.initialExtent.xmax);
			localStorage.setItem("xmin", data.initialExtent.xmin);
			localStorage.setItem("ymax", data.initialExtent.ymax);
			localStorage.setItem("ymin", data.initialExtent.ymin);
			
			$layerList = $('#layersList');

			$layerList.html('');

			//$('#dropZone ul')

			$.each(data.layers, function(key, val){
		    	var oResult = JSON.stringify(val);
		    	oResult = oResult.replace(/"/g,'&quot;');
		    	//alert(value);
    		   	$layerList.append("<li><a target='_blank' href=\"https://sygdev.systra.info/arcgis/rest/services/"+dataSend.name+"/MapServer/"+ val.id +"\" draggable='true' id=\"'" + val.id + "'\">" + val.name + "</a></li>");
    		   		
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
	    	$('#'+e.currentTarget.parentElement.id+' ul').removeClass('connected');
		}
		else
		{
	    	$('#'+e.currentTarget.parentElement.id+' ul').addClass('connected');
		}
	}
}