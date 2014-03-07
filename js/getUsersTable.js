function getUsersTable(callback)
{
	$.ajax({
		type:"POST",
		dataType:"json",
		url: "php/getAllUsers.php",
		success: function(data)
		{
			callback(null, data);
			//$('#jstree_demo_div').jstree().refresh();		//return token;
		},
		error: function(e)
		{
			callback("Impossible to get users", null);
			//alert( );
			//callback("Impossible to connect the ArcGIS Server", null);
			//return false;
		}
	});
}

function fillTable(err, data)
{
	if(!err)
	{
		if(!data.err)
		{
			var r = new Array();
			var j = -1, recordId, lastAccID = -1, color="rgb(233,233,233)";
			r[++j] =  '<table><thead><tr><th class="hide">AccID</th><th>Name</th><th class="hide">ProjAccID</th><th>Projects</th><th class="hide">RoleID</th><th>Role</th><th>Config</th><th>Delete</th></tr></thead><tbody>'; 
			for (var i in data)
			{
			    var d = data[i];
			    recordId = (d.RoleID != null)? "roleID" + d.RoleID : (d.ProjAccID != null)? "ProjAccID" + d.ProjAccID : "accountsID" + d.accountsID ;
				r[++j] = '<tr class=';
				r[++j] = recordId;
				r[++j] = '">';
				if(lastAccID != d.accountsID)
				{
					r[++j] = '<td width="1%" class="hide"  style="background-color:';
					r[++j] = (d.rowSpan > 1) ? color : false;
					r[++j] =';" align="center" rowSpan=';
					r[++j] = d.rowSpan;
					r[++j] = '>';
				    r[++j] = (d.accountsID === null) ? "null" : d.accountsID;
				    r[++j] = '</td>';
					r[++j] = '<td width="1%"  style="background-color:'
					r[++j] = (d.rowSpan > 1) ? color : false;
					r[++j] =';" align="center" rowSpan=';
					r[++j] = d.rowSpan;
					r[++j] = '>';
				    r[++j] = (d.nom_prenom === null) ? "null" :_.string.titleize(_.string.humanize(d.nom_prenom.toLowerCase()));
				    r[++j] = '</td>';
				    color = (color == "rgb(233,233,233)") ? "rgb(255,255,255)":"rgb(233,233,233)";
	
				}

				r[++j] = '<td width="1%" class="hide" align="center"> ';
			    r[++j] = d.ProjAccID;
			    r[++j] = '</td>';
				r[++j] = '<td width="1%"  align="center">';
			    r[++j] = (d.ProjectName === null) ? "null" :  _.string.titleize(_.string.humanize(d.ProjectName.toLowerCase()));
			    r[++j] = '</td>';
				r[++j] = '<td width="1%" class="hide"  align="center">';
			    r[++j] = d.RoleID;
			    r[++j] = '</td>';
    			r[++j] = '<td width="1%"  align="center">';
			    r[++j] = (d.roleName === null) ? "null" : d.roleName;
			    r[++j] = '</td>';
    			r[++j] = '<td width="1%"  align="center"><a target="_blank" href="';
			    r[++j] =  (d.config === null) ? "#" : d.config;
			    r[++j] = '">';
			    r[++j] = (d.config === null) ? "null" : d.config;
			    r[++j] = '</a>';
			    r[++j] = '</td>';
			    r[++j] ='<td width="1%"><button type="button" id="'+recordId+'" class="deleteRow btn btn-danger">Delete</button></td>';
				

				r[++j] = '</tr>';
		    	lastAccID = d.accountsID;
			}
			r[++j] = '</tbody></table>';
			$('#usersTable').html(r.join(''));
			$(".deleteRow").on('click', deleteUsersRow);
		}
		else
		{
			alert(data.err);
		}
	}
	else
		alert(err);
	
}

function deleteUsersRow(e)
{
	if(confirm("Voulez vous vraiment supprimer cette ligne?"))
	{
		$tr = $(e.currentTarget.parentNode.parentNode);
		if(e.currentTarget.id.split("roleID").length > 1)
		{
			deleteConfig(e.currentTarget.id.split("roleID")[1], $tr, refreshTable);
			//alert("roleID");
		}
		else if(e.currentTarget.id.split("ProjAccID").length > 1)
		{
			deleteProj(refreshTable, e.currentTarget.id.split("ProjAccID")[1], $tr);
		}
		else if(e.currentTarget.id.split("accountsID").length > 1)
		{
			deleteUser(refreshTable, e.currentTarget.id.split("accountsID")[1], $tr);
		}
	}
	
}

function deleteConfig(roleID, tr, callback)
{
	$.ajax({
		type:"POST",
		data:{roleID: roleID},
		dataType:"json",
		url: "php/deleteConfig.php",
		success: function(data)
		{
			callback(null, data, tr);
			//$('#jstree_demo_div').jstree().refresh();		//return token;
		},
		error: function(e)
		{
			callback(e, null);
			alert("Impossible to delete this config" );
			//callback("Impossible to connect the ArcGIS Server", null);
			//return false;
		}
	});
}

function deleteUser(callback, accID, tr)
{
	$.ajax({
			type:"POST",
			data:{accID: accID},
			dataType:"json",
			url: "php/deleteUser.php",
			success: function(data)
			{
				callback(null, data, tr);
				//$('#jstree_demo_div').jstree().refresh();		//return token;
			},
			error: function(e)
			{
				callback(e, null, null);
				alert("Impossible to get the directories" );
			}
		});
}

function deleteProj(callback, projAccID, tr)
{
		$.ajax({
		type:"POST",
		data:{projAccID: projAccID},
		dataType:"json",
		url: "php/deleteProj.php",
		success: function(data)
		{
			callback(null, data, tr);
			//$('#jstree_demo_div').jstree().refresh();		//return token;
		},
		error: function(e)
		{
			callback(e, null);
			alert("Impossible to delete this config" );
			//callback("Impossible to connect the ArcGIS Server", null);
			//return false;
		}
	});
}


function refreshTable(err, data, tr)
{
	if(!err)
	{
		if(data.success)
		{
			if(data.statement == "config" || data.statement == "proj")
			{
				if(tr)
				{	
					tr.css("background-color","#074D6E");
			        tr.fadeOut(400, function(){
			            if($(this).children().length != 8)
			            {
			            	var sib = $(this);
				            while(sib.children().length != 8)
			    	        {
			    	        	sib = sib.prev();
			        	    }
			        	    sib.children()[0].rowSpan --;
			        	    sib.children()[1].rowSpan --;
			        	    $(this).remove();
			        	}
			        	else if($(this).children().length == 8)
			        	{
			        		if(!$(this).children()[0].rowSpan || $(this).children()[0].rowSpan == 1)
			        		{	
			        			$accID= $(this).find("td.hide").eq(0).text();
			        			deleteUser(refreshTable, $accID, $(this));
			        		}
			        		else
			        		{
			        			$(this).children()[0].rowSpan --;
			        	    	$(this).children()[1].rowSpan --;
			        			var chil = [$(this).children()[0],$(this).children()[1]];
			        			$sib = $(this).next();
			        			$sib.prepend(chil[1]);
			        			$sib.prepend(chil[0]);

			        		}

			        	}
			        	
			        });
			        return false;
				}
			}
			else
			{
				if(tr)
				{	
					tr.css("background-color","#074D6E");
			        tr.fadeOut(400, function(){
						$(this).remove();
			        });
			        return false;
				}
			}
		}
		var message = (data.success)? data.success : data.err
		alert(message);
		/*$("#usersTable").empty();
		getUsersTable(fillTable);*/
	}
}

