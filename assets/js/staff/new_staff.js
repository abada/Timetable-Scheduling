function add_new_staff(form) {
  let staffid = $(form).find("#staffid").val();
  let name = $(form).find("#name").val();
  let lastname = $(form).find("#lname").val();
  let school = $(form).find("#school").val();
  let designation = $(form).find("#designation").val();
  let room = $(form).find("#roomno").val();
  let ext = $(form).find("#extno").val();

  if (staffid == "" || name == "" || lastname == "")
    $(form).find(".submit_btn").click();
  else {
    $.ajax({
      url: "/staff/create",
      method: "POST",
      data: {staffid: staffid, name: name, lastname: lastname, designation: designation, school: school, room: room, ext: ext},
      error: function (res) {
        alert(res.responseText);
      },
      success: function (res) {
        alert("Staff have been created successfully! You'll be redirected to the manage page.");

        window.location.href = "/staff";
      }
    });
  }
}
