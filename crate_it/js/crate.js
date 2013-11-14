function  buildFileTree(data) {
    $tree = $('#files').tree({
        data: [data.vfs],
        autoOpen: false,
        dragAndDrop: true,
        usecontextmenu: true,
        onCanMoveTo: function(moved_node, target_node, position) {
                // Implementation of 'endsWith'
                return target_node.id.indexOf('folder', target_node.id.length - 'folder'.length) !== -1;
        },
    });

    $tree.jqTreeContextMenu($('#fileMenu'), {
        "edit": function (node) { alert('Edit node: ' + node.name); },
        "delete": function (node) { alert('Delete node: ' + node.name); },
        "add": function (node) { alert('Add node: ' + node.name); }
    });
    return $tree;
}

// function makeCrateListEditable(){
//     $('#crateList .title').editable(OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=edit_title', {
//         name : 'new_title',
//         indicator : '<img src='+OC.imagePath('crate_it', 'indicator.gif')+'>',
//         tooltip : 'Double click to edit...',
//         event : 'dblclick',
//         style : 'inherit',
//         submitdata : function(value, settings){
//             return {'elementid':this.parentNode.parentNode.getAttribute('id')};
//         }
//     });
// }

function makeCrateListEditable(){
 //    $('span.jqtree-title').on('click', function() {
 //        selectedNode = $filetree.tree('getSelectedNode');
 //        console.log(selectedNode);
 //    });
 //    // $('span.jqtree-title').editable(OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=update_vfs', {
	// $('span.jqtree-title').editable('#', {
	// 	name : 'new_title',
	// 	indicator : '<img src='+OC.imagePath('crate_it', 'indicator.gif')+'>',
	// 	tooltip : 'Double click to edit...',
	// 	event : 'dblclick',
	// 	style : 'inherit',
	// 	submitdata : function(value, settings){
 //            var node = $filetree.tree('getSelectedNode');
 //            console.log(value);
 //            $filetree.tree('updateNode', selectedNode, 'pete');
 //            var data = $filetree.tree('toJson');
 //    		// return {'data': data};
	// 	}
	// });
}

// function makeActionButtonsClickable(){
// 	$('#crateList tr a').click('click', function(event){
// 		var id = this.parentNode.parentNode.parentNode.getAttribute('id');
// 		if($(this).data("action") === 'delete'){
// 			$.ajax({
// 				url:OC.linkTo('crate_it', 'ajax/bagit_handler.php'),
// 				type:'get',
// 				dataType:'html',
// 				data:{'action':'delete', 'file_id':id},
// 				success:function(data){
// 					$('#crateList tr#'+id).remove();
// 					hideMetadata();
// 				},
// 				error:function(data){
					
// 				}
// 			});
// 		}
// 		else{
// 			window.open(OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=preview&file_id='+id, '_blank');
// 		}
// 	});
// }

function removeFORCodes(){
	var first = $('#for_second_level option:first').detach();
	$('#for_second_level').children().remove();
	$('#for_second_level').append(first);
}

function hideMetadata(){
	if($('#crateList tr').length == 0){
		$('#metadata').hide();
	}
}

$(document).ready(function() {
	
	$('#crateList').sortable({
		update: function (event, ui) {
            var neworder = [];
            ui.item.parent().children().each(function () {
                neworder.push(this.id);
            });
            $.get(OC.linkTo('crate_it', 'ajax/bagit_handler.php'),{'action':'update','neworder':neworder});
        }
	});
	
	hideMetadata();
	
	// makeActionButtonsClickable();
	
	$('#crateList').disableSelection();
	// makeCrateListEditable();
	
	$('#download').click('click', function(event) { 
		if($('#crateList tr').length == 0){
			OC.Notification.show('No items in the crate to package');
			setTimeout(OC.Notification.hide(), 3000);
			return;
		}
		OC.Notification.show('Your download is being prepared. This might take some time if the files are big');
		setTimeout(OC.Notification.hide(), 3000);
		window.location = OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=zip';
		
	});
	
	$('#epub').click(function(event) {
		if($('#crateList tr').length == 0){
			OC.Notification.show('No items in the crate to package');
			setTimeout(OC.Notification.hide(), 3000);
			return;
		}
		//get all the html previews available, concatenate 'em all
		OC.Notification.show('Your download is being prepared. This might take some time');
		setTimeout(OC.Notification.hide(), 3000);
		window.location = OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=epub';
	});
	
	$('#clear').click(function(event) {
		$.ajax(OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=clear');
		$('#crateList').empty();
		hideMetadata();
	});

    $('#save_description').click(function() {
        var description = $('#description').val();
        if (description) {
            $.ajax({
                url: OC.linkTo('crate_it', 'ajax/bagit_handler.php'),
                type: 'post',
                dataType: 'json',
                data: {'action': 'describe', 'description': description},
                success: function(data) {
                    OC.Notification.show('Description saved.');
                    setTimeout(OC.Notification.hide(), 3000);
                },
                error: function(data) {
                    OC.Notification.show('There was an error:' + data.statusText);
                    setTimeout(OC.Notification.hide(), 3000);
                    $('#description').focus();
                }
            });
        }
    });
	
	
	$('#subbutton').click(function(event) {
	    $.ajax({
	        url: OC.linkTo('crate_it', 'ajax/bagit_handler.php'),
	        type: 'get',
	        dataType: 'html',
	        data: {'action':'create', 'crate_name':$('#crate_input #create').val()},
	        success: function(data){
	        	$('#crate_input #create').val('');
	        	$("#crates").append('<option id="'+data+'" value="'+data+'" >'+data+'</option>');
	        	OC.Notification.show('Crate '+data+' successfully created');
				setTimeout(OC.Notification.hide(), 3000);
			},
			error: function(data){
				OC.Notification.show(data.statusText);
				setTimeout(OC.Notification.hide(), 3000);
				$('#crate_input #create').focus();
			}
	    });
	    return false;
	});
	
	$('#crateName').editable(OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=rename_crate', {
		name : 'new_name',
		indicator : '<img src='+OC.imagePath('crate_it', 'indicator.gif')+'>',
		tooltip : 'Double click to edit...',
		event : 'dblclick',
		style : 'inherit',
		height : '15px',
		callback : function(value, settings){
			$('#crates').find(':selected').text(value);
            $('#crates').find(':selected').prop("id", value);
            $('#crates').find(':selected').prop("value", value);
		}
	});
	
	$('#crates').change(function(){
		var id = $(this).find(':selected').attr("id");
		if(id === "choose"){
			$('#crateList').empty();
			$('#crateName').text("");
			$('#anzsrc_for').hide();
			return;
		}
		$.ajax({
			url: OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=switch&crate_id='+id,
			type: 'get',
			dataType: 'html',
			success: function(data){
				$.ajax({
					url: OC.linkTo('crate_it', 'ajax/bagit_handler.php'),
					type: 'get',
					dataType: 'json',
					data: {'action': 'get_items'},
					success: function(data){
						$('#crateList').empty();
						$('#crateName').text(id);
						if(data != null && data.titles.length > 0){
							var items = [];
							$.each(data.titles, function(key, value){
								items.push('<tr id="'+value['id']+'"><td><span class="title" style="padding-right: 150px;">'+
										value['title']+'</span></td><td><div style="padding-right: 22px;"><a data-action="view">View</a></div></td>'+
										'<td><div><a data-action="delete" title="Delete"><img src="/owncloud/core/img/actions/delete.svg"></a></div></td></tr>');
							});
							$('#crateList').append(items.join(''));
							$('#metadata').show();
                            $('#description').val(data.description);
						} else {
							hideMetadata();
						}
						// makeCrateListEditable();
						// makeActionButtonsClickable();
					},
					error: function(data){
						var e = data.statusText;
						alert(e);
					}
				});
			},
			error: function(data){
				var e = data.statusText;
				alert(e);
			}
		});
	});
	
	$('#for_top_level').change(function(){
		var id = $(this).find(':selected').attr("id");
		if(id === "select_top"){
			//remove all the child selects
			removeFORCodes();
			return;
		}
		//make a call to the backend, get next level codes, populate option
		$.ajax({
			url: OC.linkTo('crate_it', 'ajax/bagit_handler.php')+'?action=get_for_codes&level='+id,
			type: 'get',
			dataType: 'json',
			success: function(data){
				if(data !=null){
					removeFORCodes();
					for(var i=0; i<data.length; i++){
						$("#for_second_level").append('<option id="'+data[i]+'" value="'+data[i]+'" >'+data[i]+'</option>');
					}
				}
			},
			error: function(data){
				var e = data.statusText;
				alert(e);
			}
		});
	});

    
    $.ajax({
        url: OC.linkTo('crate_it', 'ajax/bagit_handler.php'),
        type: 'get',
        dataType: 'json',
        data: {'action': 'get_items'},
        success: function(data){
            $filetree = buildFileTree(data);
            // NOTE: Could possible move this to vfs root node creation ('open' => true)
            // NOTE: look into the tree.init event
            // makeCrateListEditable();
            var rootnode = $filetree.tree('getNodeById', 'rootfolder'); // NOTE: also see getTree
            $filetree.tree('openNode', rootnode);
        },
        error: function(data){
            var e = data.statusText;
            alert(e);
        }
    });




    // $('#files').bind('tree.dblclick',
    //     function(event) {
    //         // e.node is the clicked node
    //         console.log(event.node);
    //     }
    // );

    // $('#files').bind('tree.move',
    //     function(event) {
    //         event.preventDefault();
    //         event.move_info.do_move();
    //         makeCrateListEditable(); // NOTE: reattach evens after nodes are recreated
    //     }
    // );

	
});	
