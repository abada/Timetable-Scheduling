function select_file(target) {
  $(target).click();
}
function submit_file(target) {
  $(target).click();
}

function edit_group_details(group_item) {
  $("#edit_group_modal").find("#edit_group_index").val($(group_item).find(".group_index").html());
  $("#edit_group_modal").find("#edit_group_size").val($(group_item).find(".group_size").html());

  $("#edit_group_modal").modal("show");
}

function delete_group(group_item) {
  let group_index = $(group_item).find(".group_index").html();

  $.ajax({
    url: '/group/delete',
    method: 'POST',
    data: {group_index: group_index},
    success: function(res) {
      if (res.length > 0) {
        $(group_item).remove();

        alert("Group has been removed successfully.");
      }
    },
  });
}

function save_details_changes() {
  let group_index = $("#edit_group_index").val();
  let group_size = $("#edit_group_size").val();

  if (isNaN(parseInt(group_size)))
    alert("Group size is not in numbers.");
  else {
    $.ajax({
      url: '/group/update',
      method: 'POST',
      data: { group_index: group_index, group_size: group_size },
      success: function(res) {
        if (res.length > 0) {
          $(".group_list .group_item .group_index[data-grpindex='" + group_index + "']").siblings(".group_size").html(group_size);

          alert("Group size updated successfully.");
          $("#edit_group_modal").modal("hide");
        }
      },
    });
  }
}

function export_to_excel() {
  $("#export_modal").find(".modal-body").find("#export_table").remove();
  let groups = $(".group_list > .group_item");
  let export_table = document.createElement("table");
  let headers = "<tr>" +
    "<th>GROUP_INDEX</th>" +
    "<th>GROUP_SIZE</th>" +
    "</tr>";
  $(export_table).attr("id", "export_table");
  $(export_table).css("display", "none");
  $(export_table).append(headers);

  for (let i = 0; i < groups.length; i++) {
    let row = document.createElement("tr");
    let group_index = "<td t='s'>" + $(groups[i]).find(".group_index").html() + "</td>";
    let group_size = "<td t='n'>" + $(groups[i]).find(".group_size").html() + "</td>";

    $(row).append(group_index,group_size);
    $(export_table).append(row);
  }

  $(".total_group_label").html("Total Groups: " + groups.length);
  $("#export_modal").find(".modal-body").append(export_table);

  $("#export_modal").modal("show");
}

function exportAs() {
  let tableSelect = document.getElementById("export_table");

  let filename = ($("#export_filename").val() == "" ? "TPS_Group_Details.xlsx" : $("#export_filename").val() + ".xlsx");

  let wb = XLSX.utils.table_to_book(tableSelect);
  XLSX.writeFile(wb, filename);
}
