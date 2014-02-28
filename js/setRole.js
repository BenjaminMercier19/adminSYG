function setRole(e)
{
	var roleName = e.target.text;
	var projName = $('.Project')[0].innerText;
	$html = '<span class="glyphicon glyphicon-pencil"></span>';
	$html +='<span>' + roleName + '</span>';
	$('.Role')[0].innerHTML = $html;
	var folderLev2 = "..\\\\..\\\\config\\\\"+projName+"\\\\"+roleName;
	var config = "https://sygdev.systra.info/config/"+projName+"/"+roleName+"/config_" + localStorage.getItem("logon") + "_" + roleName + "_" + projName + ".xml";
	$.ajax({
		type:"POST",
		data: {projAccID:localStorage.getItem("projAccID"), roleName: roleName, config: config, folderLev2: folderLev2},
		dataType:"json",
		url:"php/setRole.php",
		success: function(data,textStatus,jqXHR)
		{
			var myAlert = document.createElement("div");
			if(data.returnStatus == 1)
			{
				myAlert.className = "alert alert-dismissable alert-danger fade";
				myAlert.innerHTML += "<strong>Error!</strong> This user already get this role in config: <a href='"+data.config+"' style='color: inherit;' target='_blank' class='alert-link'>"+data.config+"</a>";
				var p = document.createElement("p");
				var butDanger = document.createElement("button");
				butDanger.setAttribute('type','button');
				butDanger.className = "btn btn-danger";
				butDanger.innerHTML = "Change Service";
				butDanger.addEventListener('click',function(){
					$(".alert").alert('close');
					displayServicesList(getToken());
					//getServicesListInConfig(data.config);
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
			else if (data.returnStatus != 200 && data.returnStatus != 1)
			{
				alert(data.message);
			}
			else
			{
				myAlert.className = "alert alert-dismissable alert-success fade";
				myAlert.innerHTML += "<strong>Success</strong> Project add to user";
				displayServicesList(getToken());
			}
			
			myAlert.insertAdjacentHTML('afterBegin','<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>');

			var pgBar = document.getElementById('prog');
			var parent = pgBar.parentNode;
			parent.appendChild(myAlert);

			myAlert.className += " in";

			/*setTimeout(function(){
					myAlert.className.replace(/\bin\b/,'');
					//myAlert.className+='out'; 
					//myAlert.parentNode.removeChild(myAlert)
				}, 
				3000);*/

			$('#progressBar').width("50%");		
			$('#progressBar').attr("aria-valuenow","50");

			$html = '<span class="glyphicon glyphicon-info-sign"></span>';
			$html +="<span><a href='"+data.config+"' target='_blank' class='alert-link'>"+data.config+"</a></span>";
			$('.Config')[0].innerHTML = $html; 
			

		},
		error: function(e){ 

		    alert(e.responseText);
		}
	});

}