function add_new_group(form) {
  let group_index = $(form).find("#group_index").val();
  let group_size = $(form).find("#group_size").val();

  if (group_index == "" || group_size == "")
    $(form).find(".submit_btn").click();
  else {
    $.ajax({
      url: "/group/create",
      method: "POST",
      data: {group_index: group_index, group_size: group_size},
      error: function (res) {
        alert(res.responseText);
      },
      success: function (res) {
        alert("Group has been created successfully! You'll be redirected to the manage page.");

        window.location.href = "/group";
      }
    });
  }
}
