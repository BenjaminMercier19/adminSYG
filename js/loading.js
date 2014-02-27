(function(){
	window.addEventListener('load', onLoadHandler, false);
	localStorage.clear();
})();

function onLoadHandler(e)
{
	//Set width of SumUp panel
	var page = document.getElementsByClassName('page')[0];
	$('.sumUp').width(getComputedStyle(page, null).marginRight);
	
	//Set listener for user menu
    $("#addUserBut").on("click", createUser);
    $('#chooseUserBut').on('click', displayUserForm);

	$(".setName").on('click', saveName);	

	$(".withLdap").on("submit", function()
	{
		return false;
	});


	$(".withoutLdap").on("submit", function()
	{
		return false;
	});

	$("#ldap").on('change', function(){
		if(this.value == '1')//dans l'entreprise
		{
			$(".withLdap").removeClass('hide');
			$(".withoutLdap").addClass('hide');
		}
		else if (this.value == '0')
		{
			$(".withoutLdap").removeClass('hide');
			$(".withLdap").addClass('hide');
		}
	});	

	//Set listener for project menu
    $("#createProj").on("click", createProj);
    $('#chooseProj').on('click', displayProjList);
	$(".setProj").on('click', saveProj);	

    //Set listenr for saving config file
	$("#setConfig").on('click', saveConfig);

	



 
}