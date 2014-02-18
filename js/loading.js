(function(){
	window.addEventListener('load', onLoadHandler, false);
	localStorage.clear();
})();

function onLoadHandler(e)
{
	var page = document.getElementsByClassName('page')[0];
	$('.sumUp').width(getComputedStyle(page, null).marginRight);
	$("#setConfig").on('click', saveConfig);				

}