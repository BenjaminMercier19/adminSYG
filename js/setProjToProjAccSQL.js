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
			$('.sumUp .Project').append('<span>' + value + '<span>');
			$('.sumUp .Project').append('<br />');
			$('#step3').removeClass("hide");
		}
	});
}