$(document).ready(function() {
  var path = window.location.pathname;
  var xpath = path.split('/');

  if (path == "/")
    $("#navhome").css("backgroundColor", "#ed8a63");
  else if (xpath[1] == "staff") {
    $("#navstaff").css("backgroundColor", "#ed8a63");
    $("#staff_submenu").addClass("show");
    if (!xpath[2])
      $("#staff_submenu > p:nth(0)").css("background-color", "rgba(255,255,255,0.4)");
    else
      $("#staff_submenu > p[data-submenu='" + xpath[2] + "']").css("background-color", "rgba(255,255,255,0.4)");
  } else if (xpath[1] == "module") {
    $("#navmod").css("backgroundColor", "#ed8a63");
    $("#module_submenu").addClass("show");
    if (!xpath[2])
      $("#module_submenu > p:nth(0)").css("background-color", "rgba(255,255,255,0.4)");
    else
      $("#module_submenu > p[data-submenu='" + xpath[2] + "']").css("background-color", "rgba(255,255,255,0.4)");
  } else if (xpath[1] == "group") {
    $("#navgroup").css("backgroundColor", "#ed8a63");
    $("#group_submenu").addClass("show");
    if (!xpath[2])
      $("#group_submenu > p:nth(0)").css("background-color", "rgba(255,255,255,0.4)");
    else
      $("#group_submenu > p[data-submenu='" + xpath[2] + "']").css("background-color", "rgba(255,255,255,0.4)");
  } else if (xpath[1] == "venue") {
    $("#navvenue").css("backgroundColor", "#ed8a63");
    $("#venue_submenu").addClass("show");
    if (!xpath[2])
      $("#venue_submenu > p:nth(0)").css("background-color", "rgba(255,255,255,0.4)");
    else
      $("#venue_submenu > p[data-submenu='" + xpath[2] + "']").css("background-color", "rgba(255,255,255,0.4)");
  } else if (xpath[1] == "planner") {
    $("#navplanner").css("backgroundColor", "#ed8a63");
    $("#planner_submenu").addClass("show");
    if (!xpath[2])
      $("#planner_submenu > p:nth(0)").css("background-color", "rgba(255,255,255,0.4)");
    else
      $("#planner_submenu > p[data-submenu='" + xpath[2] + "']").css("background-color", "rgba(255,255,255,0.4)");
  }
});

function redirect(url) {
  window.location.href = url;
}

function toggle_collapse(target) {
  var path = window.location.pathname;
  var xpath = path.split('/');

  if (window.innerWidth <= 1200 || xpath[2] == "plan") {
    redirect("/"+ $(target).data("menu"));
  } else {
    $($(target).data("target")).toggle();
  }
}
