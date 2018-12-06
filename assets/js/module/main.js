$(document).ready(function() {
  $("#modal_lesson_types_select").on("change", function() {
    let option_selected = $(this).find("option:selected");
    if (option_selected.val() == "custom") {
      $("#custom_type_field").show();
      $("#custom_type_field").focus();
    } else {
      $("#custom_type_field").hide();
    }
  });
});

function select_file(target) {
  $(target).click();
}
function submit_file(target) {
  $(target).click();
}

function edit_module_details(module) {
  let module_code = $(module).find(".programme_code_letters").html() + $(module).find(".programme_code_num").html();
  let module_name = $(module).find(".module_name").html();
  let au = parseInt($(module).find(".au").html());
  let cohort = parseInt($(module).find(".cohort").html());
  let lesson_types = $(module).find(".ltype");

  $("#modulecode").val(module_code);
  $("#modulename").val(module_name);
  $("#moduleau").val(au);
  $("#modulecs").val(cohort);

  get_all_lesson_types(lesson_types);

  $("#custom_type_field").val("");
  $("#edit_module_modal").find(".modal_lesson_types").html("");
  for (let i = 0; i < lesson_types.length; i++) {
    let tempDiv = document.createElement("div");
    let type = $(lesson_types[i]).html();

    $(tempDiv).addClass("custom_mod_style");
    $(tempDiv).append("<p class='ltype'>" + type + "</p>");
    $(tempDiv).append("<img src='/images/icons/minus.svg' style='cursor: pointer;' onclick='delete_lesson_type(this.parentNode)' />")

    $("#edit_module_modal").find(".modal_lesson_types").append(tempDiv);
  }

  $("#edit_module_modal").modal("show");
}

function save_details_changes() {
  let module_code = $("#modulecode").val();
  let module_name  = $("#modulename").val();
  let module_au = $("#moduleau").val();
  let module_cohort = $("#modulecs").val();

  $.ajax({
    url: "/module/update",
    method: "POST",
    data: {code: module_code, name: module_name, academic_units: module_au, cohort_size: module_cohort},
    success: function (res) {
      if (res.length > 0) {
        let module = $("#" + module_code);

        $(module).find(".module_name").html(module_name);
        $(module).find(".au").html(module_au);
        $(module).find(".cohort").html(module_cohort);

        $("#edit_staff_modal").modal("hide");
        alert("Module has been updated successfully.");
      }
    }
  });
}

function delete_module(module) {
  let resp = confirm("Are you sure you want to delete this module?");

  if (resp == true) {
    let code = $(module).attr("id");
    $.ajax({
      url: "/module/delete",
      method: "POST",
      data: {code: code},
      success: function (res) {
        if (res.length > 0) {
          $(module).remove();

          alert("Module has been deleted successfully");
        }
      }
    });
  }
}

/** Lesson Types **/
function add_lesson_type() {
  let lesson_type = $("#modal_lesson_types_select option:selected").val() == "custom" ? $("#custom_type_field").val() : $("#modal_lesson_types_select option:selected").val();
  let module_code = $("#modulecode").val();

  if ($("#modal_lesson_types_select option:selected").val() == "custom" && $("#custom_type_field").val() == "") {
    alert("Custom Lesson Type Name Field cannot be empty!");
  } else {
    $.ajax({
      url: "/lesson_types/create",
      method: "POST",
      data: {lesson_type: lesson_type, module_code: module_code},
      success: function (res) {
        if (res != null) {
          let tempDiv = document.createElement("div");

          $(tempDiv).addClass("custom_mod_style");
          $(tempDiv).append("<p class='ltype'>" + lesson_type + "</p>");
          $(tempDiv).append("<img src='/images/icons/minus.svg' style='cursor: pointer;' onclick='delete_lesson_type(this.parentNode)' />")

          $("#edit_module_modal").find(".modal_lesson_types").append(tempDiv);

          let module = $("#" + module_code);
          $(module).find(".ltypebox").append("<span class='ltype' style='margin-left: 5px;'>" + lesson_type + "</span>");

          let types_assigned = $(module).find(".ltype");
          get_all_lesson_types(types_assigned);

          $("#custom_type_field").val("");
        }
      }
    });
  }
}

function get_all_lesson_types(lesson_types) {
  $.ajax({
    url: '/lesson_types/get_all',
    method: 'POST',
    data: {},
    success: function(res) {
      let all_types = res.rows;
      $("#modal_lesson_types_select").html("");
      for (let i = 0; i < all_types.length; i++) {
        let cont = false;

        for (let j = 0; j < lesson_types.length; j++) {
          if ($(lesson_types[j]).html() == all_types[i].lesson_type)
            cont = true;
        }

        if (cont)
          continue;

        $("#modal_lesson_types_select").append("<option value='" + all_types[i].lesson_type + "'>" + all_types[i].lesson_type + "</option>");
      }
      $("#modal_lesson_types_select").append("<option value='custom'>Custom (Add new)</option>");

      if ($("#modal_lesson_types_select option").length > 1)
        $("#custom_type_field").hide();
      else
        $("#custom_type_field").show();
    },
  });
}

function delete_lesson_type(target) {
  let resp = confirm("Are you sure you want to delete this lesson type?");

  if (resp == true) {
    let module_code = $("#modulecode").val();
    let lesson_type = $(target).find(".ltype").html();

    $.ajax({
      url: "/lesson_types/delete",
      method: "POST",
      data: {module_code: module_code, lesson_type: lesson_type},
      success: function (res) {
        if (res.length > 0) {
          $(target).remove();

          let module = $("#" + module_code);
          let types_assigned = $(module).find(".ltype");
          for (let i = 0; i < types_assigned.length; i++) {
            if ($(types_assigned[i]).html() == lesson_type)
              $(types_assigned[i]).remove();
          }

          types_assigned = $(module).find(".ltype");
          get_all_lesson_types(types_assigned);
        }
      }
    });
  }
}


/** Export to excel **/
function export_to_excel() {
  $("#export_modal").find(".modal-body").find("#export_table").remove();
  let modules = $(".module");
  let export_table = document.createElement("table");
  let headers = "<tr>" +
    "<th>Module Code</th>" +
    "<th>Module Name</th>" +
    "<th>AU</th>" +
    "<th>Cohort Size</th>" +
    "<th>Shared Module</th>" +
    "<th>Staff 1</th>" +
    "<th>Staff 2</th>" +
    "<th>Staff 3</th>" +
    "<th>Staff 4</th>" +
    "<th>Staff 5</th>" +
    "<th>Staff 6</th>"
  "</tr>"
  $(export_table).attr("id", "export_table");
  $(export_table).css("display", "none");
  $(export_table).append(headers);

  for (let i = 0; i < modules.length; i++) {
    let row = document.createElement("tr");
    let code = "<td>" + $(modules[i]).attr("id") + "</td>";
    let name = "<td>" + $(modules[i]).find(".module_name").html() + "</td>";
    let au = "<td>" + $(modules[i]).find(".au").html() + "</td>";
    let cohort = "<td>" + $(modules[i]).find(".cohort").html() + "</td>";
    let shared = false;

    if ($(modules[i]).attr("id").slice(0,2) == "CE")
      shared = $("#CZ" + $(modules[i]).attr("id").slice(2,$(modules[i]).attr("id").length)).length == 0 ? false : true;
    else if ($(modules[i]).attr("id").slice(0,2) == "CZ")
      shared = $("#CE" + $(modules[i]).attr("id").slice(2,$(modules[i]).attr("id").length)).length == 0 ? false : true;

    let sharedMod = "<td>" + shared + "</td>";

    $(row).attr("data-code", $(modules[i]).attr("id"));
    $(row).append(code, name, au, cohort, sharedMod);
    $(export_table).append(row);
  }

  // $.ajax({
  //   url: "/staff/show_allocation",
  //   method: "POST",
  //   data: {},
  //   success: function (res) {
  //     console.log(res);
  //     for (let i = 0; i < res.length; i++) {
  //       $(export_table).find("tr[data-code='" + res[i].module_code + "']").append("<td>" + res[i].staff_id + "</td>");
  //     }
  //   }
  // });

  $(".total_modules_label").html("Total Modules: " + modules.length);
  $("#export_modal").find(".modal-body").append(export_table);

  $("#export_modal").modal("show");
}

function exportAs() {
  // let downloadLink = document.createElement("a");
  // let dataType = 'application/vnd.ms-excel';
  let tableSelect = document.getElementById("export_table");
  // let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

  let filename = ($("#export_filename").val() == "" ? "TPS_Modules_Details.xlsx" : $("#export_filename").val() + ".xlsx");

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
