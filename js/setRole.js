function setRole(roleName)
{
	var projName = $('.Project span')[0].innerText;
	alert(projName);
	var myAlert = document.createElement("div");
	$('.Role').append('<span>' + roleName + '<span>');
	var config = "https://sygdev.systra.info/config_" + localStorage.getItem("logon") + "_" + roleName + "_" + projName + ".xml";
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
		    alert(xhr);
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

			$('.Config').append('<span>' + config + '<span>');
			$('.Config').append('<br />');
			$('#step3').removeClass("hide");
		}
	});

}