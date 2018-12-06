$(document).ready(function() {
  $("#all_lesson_types_select").on("change", function() {
    let option_selected = $(this).find("option:selected");
    if (option_selected.val() == "custom") {
      $("#custom_type_field").show();
      $("#custom_type_field").focus();
    } else {
      $("#custom_type_field").hide();
    }
  });
});

function new_lesson_type(parent) {
  let lesson_type = $("#all_lesson_types_select").val() == "custom" ? $("#custom_type_field").val() : $("#all_lesson_types_select").val();
  let tempDiv = document.createElement("div");

  $(tempDiv).addClass("custom_mod_style");
  $(tempDiv).append("<p class='ltype' name='lessontype'>" + lesson_type + "</p>");
  $(tempDiv).append("<img src='/images/icons/minus.svg' style='cursor: pointer;' onclick='delete_lesson_type(this.parentNode)' />")

  $(parent.parentNode).append(tempDiv);
}

function delete_lesson_type(target) {
  let resp = confirm("Are you sure you want to delete this lesson type?");

  if (resp == true) {
    $(target).remove();
  }
}

function add_new_module(target) {
  let form = $(target).parent();
  let modulecode = $(form).find("#modulecode").val();
  let name = $(form).find("#name").val();
  let au = $(form).find("#au").val();
  let cohort = $(form).find("#cohort").val();
  let ltypes = [];

  for (let i = 0; i < $("p.ltype").length; i++)
    ltypes.push($("p.ltype")[i].innerHTML);

  if (modulecode == "" || name == "" || au == "" || cohort == "")
    $(form).find(".submit_btn").click();
  else {
    $.ajax({
      url: "/module/create",
      method: "POST",
      data: {code: modulecode, name: name, au: au, cohort: cohort, lesson_types: ltypes},
      error: function (res) {
        alert(res.responseText);
      },
      success: function (res) {
        alert("Module have been created successfully! You'll be redirected to the manage page.");

        window.location.href = "/module";
      }
    });
  }
}
