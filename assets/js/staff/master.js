function select_file(target) {
  $(target).click();
}
function submit_file(target) {
  $(target).click();
}

function export_to_excel() {
  $("#export_modal").find(".modal-body").find("#export_table").remove();
  let staffs = $(".staff_box > .staff_details");
  let export_table = document.createElement("table");
  let headers = "<tr>" +
    "<th>STAFFID</th>" +
    "<th>NAME</th>" +
    "<th>LAST_NAME</th>" +
    "<th>SCHOOL</th>" +
    "<th>DESIGNATION</th>" +
    "<th>ROOM_NO</th>" +
    "<th>EXT_NO</th>" +
    "<th>EMAIL</th>" +
    "<th>Module 1</th>" +
    "<th>Module 2</th>" +
    "<th>Module 3</th>" +
    "<th>Module 4</th>" +
    "<th>Module 5</th>" +
    "<th>Module 6</th>" +
    "</tr>";
  $(export_table).attr("id", "export_table");
  $(export_table).css("display", "none");
  $(export_table).append(headers);

  for (let i = 0; i < staffs.length; i++) {
    let row = document.createElement("tr");
    let email = "<td>" + $(staffs[i]).find(".staff_email").html() + "</td>";
    let staff_id = "<td>" + email.slice(4, email.indexOf("@")) + "</td>";
    let name = "<td>" + $(staffs[i]).find(".staff_name").html() + "</td>";
    let designation = "<td>" + ($(staffs[i]).find(".staff_designation").length == 0 ? "" : $(staffs[i]).find(".staff_designation").html()) + "</td>";
    let last_name = "<td>" + $(staffs[i]).find(".staff_name").data("lastname") + "</td>";
    let school = "<td>" + $(staffs[i]).find(".staff_school").html() + "</td>";
    let room_no = "<td>" + ($(staffs[i]).find(".staff_room_no").length == 0 ? "" : $(staffs[i]).find(".staff_room_no").html()) + "</td>";
    let ext_no = "<td>" + ($(staffs[i]).find(".staff_ext_no").length == 0 ? "" : $(staffs[i]).find(".staff_ext_no").html()) + "</td>";

    $(row).attr("data-staffid", email.slice(4, email.indexOf("@")));
    $(row).append(staff_id,name,last_name,school,designation,room_no,ext_no,email);
    $(export_table).append(row);
  }

  // $.ajax({
  //   url: "/staff/show_allocation",
  //   method: "POST",
  //   data: {},
  //   success: function (res) {
  //     for (let i = 0; i < res.length; i++) {
  //       $(export_table).find("tr[data-staffid='" + res[i].staff_id + "']").append("<td>" + res[i].module_code + "</td>");
  //     }
  //   }
  // });

  $(".total_staff_label").html("Total staffs: " + staffs.length);
  $("#export_modal").find(".modal-body").append(export_table);

  $("#export_modal").modal("show");
}

function exportAs() {
  // let downloadLink = document.createElement("a");
  // let dataType = 'application/vnd.ms-excel';
  let tableSelect = document.getElementById("export_table");
  // let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

  let filename = ($("#export_filename").val() == "" ? "TPS_Staff_Details.xlsx" : $("#export_filename").val() + ".xlsx");

  // document.body.appendChild(downloadLink);
  //
  // if (navigator.msSaveOrOpenBlob) {
  //   let blob = new Blob([String.fromCharCode(0xFEFF), tableHTML], {
  //       type: dataType,
  //   });
  //   navigator.msSaveOrOpenBlob(blob, filename);
  // } else {
  //   downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  //   downloadLink.download = filename;
  //   downloadLink.click();
  // }

  let wb = XLSX.utils.table_to_book(tableSelect);
  XLSX.writeFile(wb, filename);
}

function edit_staff_details(staff) {
  let staff_index = $(staff).parent().data("staffindex");
  $("#edit_staff_modal > .modal-dialog > .modal-content > .modal-header > #modal_label").attr("data-staffindex", staff_index);
  let name = $(staff).find(".staff_name").html();
  let lastname = $(staff).find(".staff_name").data("lastname");
  let email = $(staff).find(".staff_email").html();
  let school = $(staff).find(".staff_school").html();
  let designation = $(staff).find(".staff_designation").html();
  let room_no = $(staff).find(".staff_room_no").html();
  let ext_no = $(staff).find(".staff_ext_no").html();
  let assigned_modules = $(staff).find(".staff_assigned_mods").html() != "" ? $(staff).find(".staff_assigned_mods").html().split(",") : [];

  $("#staffname").val(name);
  $("#stafflastname").val(lastname);
  $("#staffemail").val(email);
  $("#staffdesignation").val(designation);
  $("#staffschool").val(school);
  $("#staffroom").val(room_no);
  $("#staffext").val(ext_no);

  $("#edit_staff_modal").find(".mods_assigned").html("");
  for (let i = 0; i < assigned_modules.length; i++) {
    let tempDiv = document.createElement("div");
    let module_code = assigned_modules[i].trim();

    $(tempDiv).addClass("custom_mod_style");
    $(tempDiv).attr("data-modcode", module_code);
    $(tempDiv).append("<p>" + module_code + "</p>");
    $(tempDiv).append("<img src='/images/icons/minus.svg' style='cursor: pointer;' onclick='delete_mod_assigned(this.parentNode)' />");

    $("#edit_staff_modal").find(".mods_assigned").append(tempDiv);
  }


  $("#edit_staff_modal").modal("show");
}

function save_details_changes() {
  let staff_index = $("#edit_staff_modal").find("#modal_label").attr("data-staffindex");
  let id  = $("#staffemail").val().slice(0, $("#staffemail").val().indexOf("@"));
  let name = $("#staffname").val();
  let lastname = $("#stafflastname").val();
  let designation = $("#staffdesignation").val();
  let school = $("#staffschool").val();
  let room = $("#staffroom").val();
  let ext = $("#staffext").val();

  $.ajax({
    url: "/staff/update",
    method: "POST",
    data: {staffid: id, name: name, lastname: lastname, designation: designation, school: school, room: room, ext: ext},
    success: function (res) {
      if (res.length > 0) {
        let staff = $(".staff_box[data-staffindex='" + staff_index + "'] > .staff_details");

        $(staff).find(".staff_name").html(name);
        $(staff).find(".staff_name").attr("data-lastname", lastname);
        $(staff).find(".staff_school").html(school);
        $(staff).find(".staff_designation").html(designation);
        $(staff).find(".staff_room_no").html(room);
        $(staff).find(".staff_ext_no").html(ext);

        $("#edit_staff_modal").modal("hide");
        alert("Staff has been updated successfully.");
      }
    }
  });
}

function delete_staff(staff) {
  let resp = confirm("Are you sure you want to delete this staff?");

  if (resp == true) {
    let email = $(staff).find(".staff_email").html();
    let id = email.slice(0, email.indexOf("@"));
    $.ajax({
      url: "/staff/delete",
      method: "POST",
      data: {staffid: id},
      success: function (res) {
        if (res.length > 0) {
          $(staff).parent().remove();

          alert("Staff has been deleted successfully");
        }
      }
    });
  }
}

function add_mod_assignment() {
  let staff_index = $("#edit_staff_modal").find("#modal_label").data("staffindex");
  let email = $("#edit_staff_modal").find("#staffemail").val();
  let staff_id = email.slice(0, email.indexOf("@"));
  let code_to_add = $("#edit_staff_modal").find(".mods_options").find("select option:selected").val();
  let modules_assigned = $("#edit_staff_modal").find(".mods_assigned div");

  for (let i = 0; i < modules_assigned.length; i++) {
    if ($(modules_assigned[i]).data("modcode") == code_to_add) {
      alert("Module has already been assigned to this staff!");
      return false;
    }
  }

  $.ajax({
    url: "/staff/assign_module",
    method: "POST",
    data: {staff_id: staff_id, module_code: code_to_add},
    success: function (res) {
      if (res != null) {
        let tempDiv = document.createElement("div");
        let module_code = res.module_code;
        let codeDisplay = "";

        $(tempDiv).addClass("custom_mod_style");
        $(tempDiv).attr("data-modcode", module_code);
        $(tempDiv).append("<p>" + module_code + "</p>");
        $(tempDiv).append("<img src='/images/icons/minus.svg' style='cursor: pointer;' onclick='delete_mod_assigned(this.parentNode)' />")

        $("#edit_staff_modal").find(".mods_assigned").append(tempDiv);
        modules_assigned = $("#edit_staff_modal").find(".mods_assigned div");

        for (let i = 0; i < modules_assigned.length; i++) {
          if (i != 0)
            codeDisplay += " , ";
          codeDisplay += $(modules_assigned[i]).data("modcode");
        }

        $(".staff_box[data-staffindex='" + staff_index + "']").find(".staff_assigned_mods").html(codeDisplay);
      }
    }
  });
}

function delete_mod_assigned(target) {
  let resp = confirm("Are you sure you want to delete this module?");

  if (resp == true) {
    let staff_index = $("#edit_staff_modal").find("#modal_label").data("staffindex");
    let email = $("#edit_staff_modal").find("#staffemail").val();
    let staff_id = email.slice(0, email.indexOf("@"));
    let module_code = $(target).data("modcode");

    $.ajax({
      url: "/staff/unassign_module",
      method: "POST",
      data: {staff_id: staff_id, module_code: module_code},
      success: function (res) {
        if (res.length > 0) {
          $(target).remove();

          let modules_assigned = $("#edit_staff_modal").find(".mods_assigned div");
          let codeDisplay = "";
          for (let i = 0; i < modules_assigned.length; i++) {
            if (i != 0)
              codeDisplay += " , ";
            codeDisplay += $(modules_assigned[i]).data("modcode");
          }

          $(".staff_box[data-staffindex='" + staff_index + "']").find(".staff_assigned_mods").html(codeDisplay);
        }
      }
    });
  }
}
