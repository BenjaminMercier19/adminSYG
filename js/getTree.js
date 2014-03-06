function getTree(callback)
{
	$("#loaderP2").removeClass("hide");
	$("#tree").addClass("hide");
	$.ajax({
		type:"POST",
		dataType:"json",
		url: "php/createJSTree.php",
		success: function(data)
		{
			$("#tree").removeClass("hide");
			$("#loaderP2").addClass("hide");
			$.jstree.defaults.core.themes.variant = "stripes";
			//alert("test");
			var to = false;
			$('#demo_q').keyup(function () {
				if(to) { clearTimeout(to); }
				to = setTimeout(function () {
					var v = $('#demo_q').val();
					$('#jstree_demo_div').jstree(true).search(v);
				}, 250);
			});

			callback(data, null);
			//$('#jstree_demo_div').jstree().refresh();		//return token;
		},
		error: function(e)
		{
			callback(null, e);
			alert("Impossible to get the directories" );
			//callback("Impossible to connect the ArcGIS Server", null);
			//return false;
		}
	});
	
}

function fillTree(data,err)
{
	if(!err)
	{
		$('#jstree_demo_div').jstree({ 
			'core' : 
			{
				'data' : data,
				"themes" : { "stripes" : true },
			},
			"plugins" : [ "search", "contextmenu" ],
			'search' : { 'fuzzy' : false },
            "contextmenu" : {
				items : function(node){
            		if(node.original.type)
            		{
            			return {
                			"Open" : {
                            	"action" : function(nodebis) {
                            		var url = node.a_attr.href;
                            		var win=window.open(url, '_blank');
									win.focus();
								},
                               	"label": "Open"
                        	}
                    	};
            		}
            		else
            		{
            			return {
                			"Open" : {
                				"_disabled" : true,
                				"label":"Open"
                			}

            			};
            		}
				}
            }  
		});

	}
}
function refreshTree(data, err)
{
	if(!err)
	{
		$('#jstree_demo_div').empty().jstree().destroy();
		fillTree(data,err);
	}
	
}