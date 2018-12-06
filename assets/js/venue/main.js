function select_file(target) {
  $(target).click();
}
function submit_file(target) {
  $(target).click();
}

function edit_venue_details(group_item) {
  $("#edit_group_modal").find("#edit_venue_name").attr("data-venueid", $(group_item).find(".venue_name").attr("data-venueid"));
  $("#edit_group_modal").find("#edit_venue_name").val($(group_item).find(".venue_name").html());
  $("#edit_group_modal").find("#edit_venue_type").val($(group_item).find(".venue_type").html());
  $("#edit_group_modal").find("#edit_venue_capacity").val($(group_item).find(".venue_capacity").html());

  $("#edit_group_modal").modal("show");
}

function delete_venue(group_item) {
  let venue_id = $(group_item).find(".venue_name").attr("data-venueid");

  $.ajax({
    url: '/venue/delete',
    method: 'POST',
    data: {venueid: venue_id},
    success: function(res) {
      if (res.length > 0) {
        $(group_item).remove();

        alert("Venue has been removed successfully.");
      }
    },
  });
}

function save_details_changes() {
  let venue_id = $("#edit_venue_name").attr("data-venueid");
  let venue_name = $("#edit_venue_name").val();
  let venue_type = $("#edit_venue_type").val();
  let venue_capacity = $("#edit_venue_capacity").val();

  $.ajax({
    url: '/venue/update',
    method: 'POST',
    data: { venue_id: venue_id, venue_name: venue_name, venue_type: venue_type, venue_capacity: venue_capacity },
    success: function(res) {
      if (res.length > 0) {
        let group_item = $(".group_list .group_item .venue_name[data-venueid='" + venue_id + "']");
        $(group_item).html(venue_name);
        $(group_item).siblings(".venue_type").html(venue_type);
        $(group_item).siblings(".venue_capacity").html(venue_capacity);

        alert("Venue details updated successfully.");
        $("#edit_group_modal").modal("hide");
      }
    },
  });
}

function export_to_excel() {
  $("#export_modal").find(".modal-body").find("#export_table").remove();
  let venues = $(".group_items_container > .group_item");
  let export_table = document.createElement("table");
  let headers = "<tr>" +
    "<th>VENUE_NAME</th>" +
    "<th>VENUE_TYPE</th>" +
    "<th>VENUE_CAPACITY</th>" +
    "</tr>";
  $(export_table).attr("id", "export_table");
  $(export_table).css("display", "none");
  $(export_table).append(headers);

  for (let i = 0; i < venues.length; i++) {
    let row = document.createElement("tr");
    let venue_name = "<td t='s'>" + $(venues[i]).find(".venue_name").html() + "</td>";
    let venue_type = "<td t='s'>" + $(venues[i]).find(".venue_type").html() + "</td>";
    let venue_capacity = "<td t='n'>" + $(venues[i]).find(".venue_capacity").html() + "</td>";

    $(row).append(venue_name,venue_type,venue_capacity);
    $(export_table).append(row);
  }

  $(".total_venue_label").html("Total Venues: " + venues.length);
  $("#export_modal").find(".modal-body").append(export_table);

  $("#export_modal").modal("show");
}

function exportAs() {
  let tableSelect = document.getElementById("export_table");

  let filename = ($("#export_filename").val() == "" ? "TPS_Venue_Details.xlsx" : $("#export_filename").val() + ".xlsx");

  let wb = XLSX.utils.table_to_book(tableSelect);
  XLSX.writeFile(wb, filename);
}
