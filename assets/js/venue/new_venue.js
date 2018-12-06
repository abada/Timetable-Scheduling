function add_new_venue(form) {
  let venue_name = $(form).find("#venue_name").val();
  let venue_type = $(form).find("#venue_type").val();
  let venue_capacity = $(form).find("#venue_capacity").val();

  if (venue_name == "" || venue_capacity == "")
    $(form).find(".submit_btn").click();
  else {
    $.ajax({
      url: "/venue/create",
      method: "POST",
      data: {venue_name: venue_name, venue_type: venue_type, venue_capacity: venue_capacity,},
      error: function (res) {
        alert(res.responseText);
      },
      success: function (res) {
        alert("Venue has been created successfully! You'll be redirected to the manage page.");

        window.location.href = "/venue";
      }
    });
  }
}
