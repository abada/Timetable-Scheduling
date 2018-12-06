$(document).ready(function() {
  get_all_modules();
});

function get_all_modules() {
  $.ajax({
    url: '/module/show',
    method: 'POST',
    data: {},
    success: function(res) {
      $("#modules_select").html("");
      for (let i = 0; i < res.length; i++) {
        let div = document.createElement("div");
        $(div).addClass("module_in_selection");
        let checkbox = document.createElement("input");
        $(checkbox).attr("type", "checkbox");
        $(checkbox).attr("id", res[i].code);
        $(checkbox).attr("name", res[i].code);

        checkbox.addEventListener('change', function() {
          if ($(checkbox).prop("checked"))
            $("#selected_modules_label").append("<span name='" + res[i].code + "'>" + res[i].code + " - " + res[i].name + "</span>");
          else
            $("#selected_modules_label").find("span[name='" + res[i].code + "']").remove();
        });

        let label = "<label for='" + res[i].code + "'>" + res[i].code + " - " + res[i].name +"</label>";
        $(div).append(checkbox, label);

        $("#modules_select").append(div);

      };
    },
  });
}

function plan(form) {
  let study_year_sem = $("#study_year_sem").val();
  let end_time = $("#end_time_option > option:selected").val();

  if (study_year_sem == "")
    $(form).find(".submit_btn").click();
  else {
    let urlStr = "/planner/plan?sys=" + study_year_sem + "&endtime=" + end_time;

    let selected_modules = $("#selected_modules_label > span");
    for (let i = 0; i < selected_modules.length; i++) {
      urlStr += "&code[]=" + $(selected_modules[i]).attr("name");
    }

    window.location.href = urlStr;
  }
}

function select_file(target) {
  $(target).click();
}
function submit_file(target) {
  $(target).click();
}
