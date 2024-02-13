import frappe


@frappe.whitelist()
def get_candidates():
    return frappe.get_all("Candidate", fields=["name","candidate_name", "email", "experience", "status"])



@frappe.whitelist()
def add_candidate(candidate_name, email, experience, status):
    if frappe.db.exists("Candidate", {"email": email}):
        frappe.throw("Candidate with email {0} already exists".format(email))
    if frappe.db.exists("Candidate", {"candidate_name": candidate_name}):
        frappe.throw("Candidate with Name {0} already exists".format(candidate_name))
    candidate = frappe.new_doc("Candidate")
    candidate.candidate_name = candidate_name
    candidate.email = email
    candidate.experience = experience
    candidate.status = status
    candidate.insert()
    return candidate.candidate_name



@frappe.whitelist()
def edit_candidate(name,candidate_name, email, experience, status):
    if frappe.db.exists("Candidate", {"email": email, "name": ("!=", name)}):
        frappe.throw("Candidate with email {0} already exists".format(email))
    if frappe.db.exists("Candidate", {"candidate_name": candidate_name, "name": ("!=", name)}):
        frappe.throw("Candidate with Name {0} already exists".format(candidate_name))
    candidate = frappe.get_doc("Candidate", name)
    candidate.email = email
    candidate.experience = experience
    candidate.status = status
    candidate.save()
    return candidate.candidate_name

@frappe.whitelist()
def get_candidate(name):
    return frappe.get_doc("Candidate", name)

def remove_rejected_candidates():
    rejected_candidates = frappe.get_all("Candidate", filters={"status": "Rejected"}, fields=["name"])
    for candidate in rejected_candidates:
        frappe.delete_doc("Candidate", candidate.name)
        frappe.db.commit()
