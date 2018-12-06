$(document).ready(function () {
  let params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  let modules_selected = [];
  let end_time = (params[1].split("="))[1];

  for (let i = 2; i < params.length; i++)
    modules_selected.push((params[i].split("="))[1]);

  get_modules_details(modules_selected);
  setup_planner(modules_selected, end_time);
});

function get_modules_details(modules_selected) {
  $.ajax({
    url: '/lesson/show',
    method: 'POST',
    data: {module_codes: modules_selected},
    success: function(res) {
      $("#modules_select").html("");
      for (let i = 0; i < res.length; i++) {
        let lesson_id = res[i].id;
        let study_year_sem = res[i].study_year_sem;
        let lesson_day = res[i].lesson_day;
        let school_weeks = res[i].school_weeks;
        let group_index = res[i].group_index;
        let venueid = res[i].venueid;
        let venue = res[i].venue;
        let starttime = res[i].start_time;
        let endtime = res[i].end_time;
        let module_code = res[i].module_code;
        let lesson_type = res[i].lesson_type;
        let no_of_lessons = res[i].no_of_lessons;
        let lesson_week = school_weeks.split(",");
        let duration = (parseInt(endtime.slice(0,2)) - parseInt(starttime.slice(0,2)));

        let frequency = "WEEKLY";
        if (lesson_week.length == 7)
          for (let j = 0; j < lesson_week.length; j++) {
            if (lesson_week[j] % 2 == 0)
              break;
            frequency == "ODD";
          }
        else if (lesson_week.length == 6)
          for (let j = 0; j < lesson_week.length; j++) {
            if (lesson_week[j] % 2 == 1)
              break;
            frequency = "EVEN";
          }

        let currentDiv = document.createElement("div");
        $(currentDiv).attr("draggable", true);
        $(currentDiv).attr("id", "event_" + i);
        $(currentDiv).addClass("single_event");
        $(currentDiv).attr("data-lessonid", lesson_id);
        $(currentDiv).attr("data-lessontype", lesson_type);
        $(currentDiv).attr("data-numoflessons", no_of_lessons);
        $(currentDiv).attr("data-weektype", frequency);
        $(currentDiv).attr("data-venue", venue);
        $(currentDiv).attr("data-venueid", venueid);
        $(currentDiv).attr("data-group", group_index);
        $(currentDiv).attr("data-duration", duration);
        $(currentDiv).attr("data-schoolweeks", school_weeks);
        $(currentDiv).attr("ondragstart", "drag(event)");
        $(currentDiv).append("<p>" + group_index + "-" + venue + "(" + frequency + ")</p>");
        $(currentDiv).append("<img src='/images/icons/more_2.svg' id='more_btn_" + i + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='cursor: pointer;' />");
        let dropdownDiv = document.createElement("div");
        $(dropdownDiv).addClass("dropdown-menu");
        $(dropdownDiv).addClass("event_more_dropdown");
        $(dropdownDiv).attr("aria-labelledby", "more_btn_" + i);
        $(dropdownDiv).append("<button class='dropdown-item' type='button' onclick='assign_staff(this.parentNode.parentNode);'>Assign Staff</button>");
        $(dropdownDiv).append("<button class='dropdown-item' type='button' onclick='edit_lesson(this.parentNode.parentNode);'>Edit</button>");
        $(dropdownDiv).append("<button class='dropdown-item' type='button' onclick='remove_lesson(this.parentNode.parentNode);'>Remove</button>");
        $(currentDiv).append(dropdownDiv);

        $(".day_group[data-day='" + lesson_day + "'] > .time_wrapper > .day_placeholder[data-time='" + starttime + "'] > .events_group[data-mod='" + module_code + "']").append(currentDiv);
      }
    },
  });
}

/**
 * Initialize the planner in accordance with the time and module selected.
 * @param modules_selected
 * @param end_time
 */
function setup_planner(modules_selected, end_time) {
  let days_arr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let days_short_arr = ["M", "T", "W", "TH", "F", "S"];
  let time_arr = ["08:30", "09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:30", "20:30", "21:30", "22:30", "23:30"];
  let time_slot = time_arr.indexOf(end_time);

  for (let i = 0; i < modules_selected.length; i++) {
    $("#weekly_planner > .header").append("<p class='day_title'>" + modules_selected[i] + "</p>");
  }

  for (let i = 0; i < 5; i++) {
    let day_group = document.createElement("div");
    $(day_group).addClass("day_group");
    $(day_group).attr("data-day", days_short_arr[i]);

    let title = "<p class='title'>" + days_arr[i] + "</p>";
    $(day_group).append(title);

    let time_wrapper = document.createElement("div");
    $(time_wrapper).addClass("time_wrapper");

    for (let j = 0; j < time_slot; j++) {
      let day_placeholder = document.createElement("div");
      $(day_placeholder).addClass("day_placeholder");
      $(day_placeholder).attr("data-time", time_arr[j]);
      let time_title = "<p class='time_title'>" + time_arr[j] + "</p>";
      $(day_placeholder).append(time_title);
      for (let k = 0; k < modules_selected.length; k++) {
        let events_group = "<div class='events_group' data-mod='" + modules_selected[k] + "' ondragover='allowDrop(event);' ondrop='dragndrop_event(event);' ondblclick='add_event(this);'></div>";
        $(day_placeholder).append(events_group);
      }
      $(time_wrapper).append(day_placeholder);
    }
    $(day_group).append(time_wrapper);
    $(".planner_content").append(day_group);
  }
}



/**
 * Author: Wong Yijie
 * @param ev - Event object
 */
function dragndrop_event(ev) {
  ev.preventDefault();

  let element = ev.target;
  let day = ev.dataTransfer.getData("day_slot");
  let time = ev.dataTransfer.getData("time_slot");
  let module_code = ev.dataTransfer.getData("module_code");
  if ($(element).hasClass("single_event")) {
    element = ev.target.parentNode;
  }
  else if ($(element).parent().hasClass("single_event")) {
    element = ev.target.parentNode.parentNode;
  }
  if ($(element).parent().data("time") != time || $(element).parent().parent().parent().data("day") != day || $(element).data("mod") != module_code) {
    $(element).append(document.getElementById(ev.dataTransfer.getData("elementID")));
  }
}

/**
 * Author: Wong Yijie
 * @param ev - Event object
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Author: Wong Yijie
 * drag() is to transfer details of the parent element and current element.
 * @param ev - Event object
 */
function drag(ev) {
  ev.dataTransfer.setData("elementID", ev.target.id);
  ev.dataTransfer.setData("module_code", $(ev.target.parentNode).data("mod"));
  ev.dataTransfer.setData("day_slot", $(ev.target.parentNode.parentNode.parentNode.parentNode).data("day"));
  ev.dataTransfer.setData("time_slot", $(ev.target.parentNode.parentNode).data("time"));
}
