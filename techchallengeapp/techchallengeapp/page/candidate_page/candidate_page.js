frappe.pages['candidate-page'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'candidate',
		single_column: true
	});
	page.set_primary_action('Add Candidate', function() {
        var dialog = new frappe.ui.Dialog({
            title: 'Add New Candidate',
            fields: [
                {fieldname: 'candidate_name', fieldtype: 'Data', label: 'Name', reqd: true},
                {fieldname: 'email', fieldtype: 'Data', label: 'Email', reqd: true},
				{fieldname: 'experience', fieldtype: 'Int', label: 'Experience', reqd: true},
				{fieldname: 'status', fieldtype: 'Select', label: 'Status', reqd: true, options: ["Draft", 'Shortlisted', 'Rejected', 'Hired']}
            ],
            primary_action_label: 'Submit',
            primary_action(values) {
                frappe.call({
                    method: 'techchallengeapp.api.add_candidate',	
                    args: values,
                    callback: function(r) {
                        if(!r.exc) {
                            frappe.msgprint('Candidate added successfully');
                            dialog.hide();
							renderCandidateList(page);
                        }
                    }
                });
            }
        });
        dialog.show();
    });
	$(document).on('click', '#edit-button', function() {
		var name = $(this).parent().find('h5').text();
		frappe.call({
			method: 'techchallengeapp.api.get_candidate', 
			args: {name: name}, 
			callback: function(response) {
				console.log(response.message);
				if(!response.exc) {
					editCandidate(response.message,page);
					setTimeout(function() {
						
					}, 1000);
				}
			}
		});
	});
	renderCandidateList(page);

}


function renderCandidateList(page) {
	$(page.main).empty();
	frappe.call({
        method: 'techchallengeapp.api.get_candidates', 
        args: {}, 
        callback: function(response) {
            console.log(response.message);
			if(!response.exc) {
				var candidates = response.message;
				var candidate_list = '';
				for(var i=0; i<candidates.length; i++) {
					if(i%2 == 0) {
						candidate_list += '<div class="row">';
					}
					candidate_list += '<div class="col-md-4"><div class="card" >';
					candidate_list += '<div class="card-body">';
					candidate_list += '<h5 class="card-title">'+candidates[i].name+'</h5>';
					candidate_list += '<p class="card-text">Name:'+candidates[i].candidate_name+'</p>';
					candidate_list += '<p class="card-text">Email: '+candidates[i].email+'</p>';
					candidate_list += '<p class="card-text">Experience: '+candidates[i].experience+'</p>';
					candidate_list += '<p class="card-text">Status: '+candidates[i].status+'</p>';
					candidate_list += '<button type="button" id="edit-button" class="btn btn-primary" style="position: absolute; top: 20px; right: 10px;">Edit</button>';
					candidate_list += '</div>';
					candidate_list += '</div></div>';
					if(i%2 != 0) {
						candidate_list += '</div>';
					}
				}
				$(candidate_list).appendTo(page.main);
			}
        }
    });
}

function editCandidate(candidate,page) {
    var dialog = new frappe.ui.Dialog({
        title: 'Edit Candidate',
        fields: [
			{fieldname: 'name', fieldtype: 'Data', label: 'Name', reqd: true, default: candidate.name, hidden: true},
            {fieldname: 'candidate_name', fieldtype: 'Data', label: 'Name', reqd: true, default: candidate.candidate_name},
            {fieldname: 'email', fieldtype: 'Data', label: 'Email', reqd: true, default: candidate.email},
            {fieldname: 'experience', fieldtype: 'Int', label: 'Experience', reqd: true, default: candidate.experience},
            {fieldname: 'status', fieldtype: 'Select', label: 'Status', reqd: true, options: ["Draft", 'Shortlisted', 'Rejected', 'Hired'], default: candidate.status}
        ],
        primary_action_label: 'Update',
        primary_action(values) {
            frappe.call({
                method: 'techchallengeapp.api.edit_candidate',	
                args: values,
                callback: function(r) {
                    if(!r.exc) {
                        frappe.msgprint('Candidate updated successfully');
                        dialog.hide();
						renderCandidateList(page);
                    }
                }
            });
        }
    });
    dialog.show();
}