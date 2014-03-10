(function(){
	window.addEventListener('load', onLoadHandler, false);
	localStorage.clear();
})();

function onLoadHandler(e)
{
	//Set width of SumUp panel
	var page = document.getElementsByClassName('page')[0];
	
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

	//Set listener for Role
	$("#roleList li").on('click', setRole);


    //Set listenr for saving config file
	$("#setConfig").on('click', saveConfig);


	$("#launchTree").on('click', function(e)
		{
			getTree(fillTree);
		});
	$("#refreshTree").on('click', function(e)
		{
			getTree(refreshTree);
		});

	

	/*
	*
	*
	*
	*
	*
	*
	*
	*
	*
	*
	*/
	
	var PageTransitions = (function() {

	var $main = $( '#pt-main' ),
		$pages = $main.children( 'div.pt-page' ),
		$old = "Nouvelle Configuration",
		animcursor = 1,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;
	
	function init() {

		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		$pages.eq( current ).addClass( 'pt-page-current' );

		$('#myNav li').on("click",function( el, ev ) {
				if(!isAnimating)
				{
					el.preventDefault();
					if(!$(el.currentTarget).hasClass("active"))
					{
						if(($(el.currentTarget).find('a').eq(0).text() == "Nouvelle Configuration") || $old == "Nouvelle Configuration")
						{
							$(".sumUp").animate({
								right: parseInt($(".sumUp").css('right'),10) == 0 ? $("#pt-main").css('width'):0
						    }, 600, "easeOutQuad");
						    $("#footer").animate({
								right: parseInt($(".sumUp").css('right'),10) == 0 ? $("#pt-main").css('width'):'20%'
						    }, 600, "easeOutQuad");
							//.fadeOut(200, null)
						}
						$old = $(el.currentTarget).find('a').eq(0).text();
	
						$('#myNav li').removeClass('active');
						$(el.currentTarget).addClass('active');
						nextPage(1, $(el.currentTarget).attr("data-animation"));
					}
				}
			}
		);

	}

	function nextPage( animation, pageToGo ) {

		if( isAnimating ) {
			return false;
		}

		isAnimating = true;
		
		var $currPage = $pages.eq( current );
		if(parseInt(current) < parseInt(pageToGo))
		{
			animation = 1;
		}
		else if (parseInt(current) > parseInt(pageToGo))
		{
			animation = 2;
		}
		if(pageToGo == "0")
		{
			$('#step2').addClass('hide');
			$('#step3').addClass('hide');
			$('#step4').addClass('hide');
			$('#progressBar').width("0%");		
			$('#progressBar').attr("aria-valuenow","0");
			$(".sumUp div").empty();
		}
		else if(pageToGo == "1")
		{
			getTree(fillTree);
		}
		else if(pageToGo == "2")
		{
			getUsersTable(fillTable);
		}

		current = pageToGo;

		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
			outClass = '', inClass = '';

		switch( animation ) {

			case 1:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;

		}

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}

	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
	}

	init();

	return { init : init };

	})();

}