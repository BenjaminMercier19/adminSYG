function getTree(callback)
{
	$('#loaderP2').removeClass('hide');
	$('#tree').addClass('hide');
	$.ajax({
		type:'POST',
		dataType:'json',
		url: 'php/createJSTree.php',
		success: function(data)
		{
			$('#tree').removeClass('hide');
			$('#loaderP2').addClass('hide');
			$.jstree.defaults.core.themes.variant = 'stripes';
			//alert('test');
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
			alert('Impossible to get the directories' );
			//callback('Impossible to connect the ArcGIS Server', null);
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
				'themes' : { 'stripes' : true },
				'check_callback':true
			},
			'plugins' : [ 'search', 'contextmenu'],
			'search' : { 'fuzzy' : false },
            'contextmenu' : {
				items : function(node){
            		if(node.original.type)
            		{
            			return {
                			'Open' : {
                            	'action' : function(nodebis) {
                            		var url = node.a_attr.href;
                            		var win=window.open(url, '_blank');
									win.focus();
								},
                               	'label': 'Open'
                        	},
                        	'Delete' : {
                        		'action':  function (data) {
                    						var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
											if(inst.is_selected(obj)) {
												inst.delete_node(inst.get_selected());
											}
											else {
												inst.delete_node(obj);
											}
					                    },
                        		'label': 'Delete'
                        	}
                    	};
            		}
            		else
            		{
            			return {
                			'Open' : {
                				'_disabled' : true,
                				'label':'Open'
                			},
							'Delete' : {
                        		'action':  function (data) {
                    						var inst = $.jstree.reference(data.reference), obj = inst.get_node(data.reference);
											if(inst.is_selected(obj)) {
												inst.delete_node(inst.get_selected());
											}
											else {
												inst.delete_node(obj);
											}
					                    },
                        		'label': 'Delete'
                        	}

            			};
            		}
				}
            }  
		}).bind("delete_node.jstree", function (e, data) { 
			if(!confirm("Are you sure you want to delete?")) { 
			    e.stopImmediatePropagation(); 
			    e.preventDefault();
			    e = false;
			    return false; 
			  }
			  else 
			  {
			  	removeDir(data.node);
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

function removeDir(dir)
{
	var rmdir;
	if(dir.a_attr.href != "#")
	{
		rmdir = dir.a_attr.href.split('info/')[1];
	}
	else 
	{
		if(dir.parents.length == 1)
		{
			rmdir = 'config/'+dir.text;
		}
		else if (dir.parents.length == 2)
		{
			rmdir = 'config/'+$("#jstree_demo_div").jstree("get_text", $("#jstree_demo_div").jstree("get_parent", dir))+"/"+dir.text;
		}
	}
	$.ajax({
		type:'POST',
		data:{rmdir: rmdir},
		dataType:'json',
		url: 'php/removeDir.php',
		success: function(data)
		{
			alert('Directory removed');
			//callback(null, data, dir);
			//$('#jstree_demo_div').jstree().refresh();		//return token;
		},
		error: function(e)
		{
			//callback(e, null);
			alert('Impossible to get the directory' );
			//callback('Impossible to connect the ArcGIS Server', null);
			//return false;
		}
	});
}
