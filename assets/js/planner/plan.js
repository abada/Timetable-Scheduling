let event_num = 0;

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
      event_num = res.length;
      for (let i = 0; i < res.length; i++) {
        let lesson_id = res[i].id;
        let study_year_sem = res[i].study_year_sem;
        let lesson_day = res[i].lesson_day;
        let school_weeks = res[i].school_weeks;
        let group_index = res[i].group_index;
        let venueid = res[i].venue_id;
        let venue = res[i].venue;
        let starttime = res[i].start_time;
        let endtime = res[i].end_time;
        let module_code = res[i].module_code;
        let lesson_details_id = res[i].lesson_details_id;
        let lesson_type_id = res[i].lesson_type_id;
        let lesson_type = res[i].lesson_type;
        let no_of_lessons = res[i].no_of_lessons;
        let lesson_week = school_weeks.split(",");
        let duration = (parseInt(endtime.slice(0,2)) - parseInt(starttime.slice(0,2)));

        let frequency = "WEEKLY";
        if (lesson_week.length == 7)
          for (let j = 0; j < lesson_week.length; j++) {
            if (lesson_week[j] % 2 == 0)
              break;
            frequency = "ODD";
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
        $(currentDiv).attr("data-lessondetailsid", lesson_details_id);
        $(currentDiv).attr("data-lessontypeid", lesson_type_id);
        $(currentDiv).attr("data-lessontype", lesson_type);
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

    for (let j = 0; j <= time_slot; j++) {
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


/**
 * Below are the Add , Update and Delete of lessons
 */


/**
 * Author: Wong Yijie
 * edit_lesson() is to allow the user to change the details of that lesson, e.g. the venue of the lesson.
 * @param self
 */
function edit_lesson(self) {
  let params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  let study_year_sem = (params[0].split("="))[1];
  let module_code = $(self).parent().attr("data-mod");
  let day = $(self).parent().parent().parent().parent().attr("data-day");
  let time = $(self).parent().parent().attr("data-time");
  let duration = $(self).attr("data-duration");
  let lesson_id = $(self).attr("data-lessonid");
  let lesson_details_id = $(self).attr("data-lessondetailsid");
  let lesson_type_id = $(self).attr("data-lessontypeid");
  let lesson_type = $(self).attr("data-lessontype");
  let num_of_lessons = $(self).attr("data-numoflessons");
  let venue = $(self).attr("data-venue");
  let venue_id = $(self).attr("data-venueid");
  let group_index = $(self).attr("data-group");
  let freq = $(self).attr("data-weektype");
  let schoolweeks = $(self).attr("data-schoolweeks");

  let days_arr = ["M", "T", "W", "TH", "F"];
  let frequency_arr = ["WEEKLY", "ODD", "EVEN"];
  let modal_body = $('#edit_event_modal').find(".modal-body");
  $(modal_body).html("");

  $('#edit_event_modal_title').html("Edit Lesson - " + module_code);
  $('#edit_event_modal_title').attr("data-lessonid", lesson_id);
  $('#edit_event_modal_title').attr("data-mod", module_code);
  $('#edit_event_modal_title').attr("data-time", time);
  $('#edit_event_modal_title').attr("data-day", day);
  $('#edit_event_modal_title').attr("data-event", $(self).attr("id"));

  let tempDiv = document.createElement("div");
  $(tempDiv).addClass("modal_time_wrapper");
  $(tempDiv).append("<p>Lesson Day</p>", "<p>Start Time:</p>", "<p>Duration:</p>");
  let tempSelect = document.createElement("select");
  $(tempSelect).addClass("form-control");
  $(tempSelect).addClass("custom_select");
  $(tempSelect).attr("name", "lesson_day");

  for (let i = 0; i < days_arr.length; i++) {
    let str;
    if (days_arr[i] == day)
      str = "<option selected>" + days_arr[i] + "</option>";
    else
      str = "<option>" + days_arr[i] + "</option>";
    $(tempSelect).append(str);
  }
  $(tempDiv).append(tempSelect);

  tempSelect = document.createElement("select");
  $(tempSelect).addClass("form-control");
  $(tempSelect).addClass("custom_select");
  $(tempSelect).attr("name", "start_time");
  for (let i = 8; i <= parseInt((params[1].split("=")[1]).slice(0, 2)); i++) {
    let str;
    if (i == parseInt(time.slice(0, 2)))
      str = "<option selected>" + (i < 10 ? "0" + i : i) + (params[1].split("=")[1]).slice(2) + "</option>";
    else
      str = "<option>" + (i < 10 ? "0" + i : i) + (params[1].split("=")[1]).slice(2) + "</option>";
    $(tempSelect).append(str);
  }
  $(tempDiv).append(tempSelect);
  tempSelect = document.createElement("select");
  $(tempSelect).addClass("form-control");
  $(tempSelect).addClass("custom_select");
  $(tempSelect).attr("name", "duration");
  for (let i = 1; i < 10; i++) {
    if (i == duration)
      $(tempSelect).append("<option selected>" + i + "</option>");
    else
      $(tempSelect).append("<option>" + i + "</option>");
  }
  $(tempDiv).append(tempSelect);
  $(modal_body).append(tempDiv);


  /**
   * Lesson Types
   */
  tempDiv = document.createElement("div");
  $(tempDiv).addClass("two_columns_grid");
  $(tempDiv).append("<p>Lesson Type</p>", "<p>Frequency</p>");
  tempSelect = document.createElement("select");
  $(tempDiv).attr("id", "lesson_type_wrapper");
  $(tempDiv).addClass("form-check");
  $(tempDiv).addClass("form-check-inline");
  $(tempSelect).addClass("form-control");
  $(tempSelect).addClass("custom_select");
  $(tempSelect).attr("name", "lesson_type");
  $(tempSelect).on("change", lesson_type_changed);
  $.ajax({
    url: "/lesson_types/get_by_module",
    method: "POST",
    data: {module_code: module_code},
    success: function (res) {
      let all_types = res;
      for (let i = 0; i < all_types.length; i++) {
        if (all_types[i].lesson_type == lesson_type)
          $("select[name=lesson_type]").append("<option id='edit_lesson_type_" + i + "' data-lessontypeid='" + all_types[i].id + "' value='" + all_types[i].lesson_type + "' selected>" + all_types[i].lesson_type + "</option>");
        else
          $("select[name=lesson_type]").append("<option id='edit_lesson_type_" + i + "' data-lessontypeid='" + all_types[i].id + "' value='" + all_types[i].lesson_type + "'>" + all_types[i].lesson_type + "</option>");
      }
    }
  });
  $(tempDiv).append(tempSelect);

  tempSelect = document.createElement("select");
  $(tempSelect).attr("id", "freq_wrapper");
  $(tempSelect).addClass("form-control");
  $(tempSelect).attr("name", "frequency");
  $(tempSelect).on("change", freq_rb_changed);
  tempSelect.venue = venue;
  tempSelect.venue_id = venue_id;
  for (let i = 0; i < 3; i++) {
      $(tempSelect).append("<option value='" + frequency_arr[i] + "'>" + frequency_arr[i] + "</option>");
  }

  $(tempDiv).append(tempSelect);
  $(modal_body).append(tempDiv);

  /**
   * Possible Venues Selection
   */
  tempDiv = document.createElement("div");
  tempSelect = document.createElement("select");
  $(tempDiv).addClass("two_columns_grid");
  $(tempDiv).append("<p>Venue</p>", "<p>Group</p>");
  $(tempSelect).attr("id", "venue_select");
  $(tempSelect).addClass("form-control");
  $(tempSelect).attr("name", "venue_select");

  $.ajax({
    url: "/venue/show",
    method: "POST",
    data: {},//lesson_types_id: lesson_type_id},
    success: function (res) {
      let all_venues = res;
      $("select[name=venue_select]").html("");
      for (let i = 0; i < all_venues.length; i++) {
        if (all_venues[i].name == venue && all_venues[i].id == venue_id)
          $("select[name=venue_select]").append("<option data-venueid='" + all_venues[i].id + "' selected>" + all_venues[i].name + "</option>");
        else
          $("select[name=venue_select]").append("<option data-venueid='" + all_venues[i].id + "'>" + all_venues[i].name + "</option>");
      }
    }
  });

  $(tempDiv).append(tempSelect);

  tempSelect = document.createElement("select");
  $(tempSelect).attr("id", "group_select");
  $(tempSelect).addClass("form-control");
  $(tempSelect).attr("name", "group_select");

  $.ajax({
    url: "/group/show",
    method: "POST",
    data: {},
    success: function (res) {
      let all_groups = res;
      $("select[name=group_select]").html("");
      for (let i = 0; i < all_groups.length; i++) {
        if (all_groups[i].group_index == group_index)
          $("select[name=group_select]").append("<option data-groupindex='" + all_groups[i].group_index + "' selected>" + all_groups[i].group_index + "</option>");
        else
          $("select[name=group_select]").append("<option data-group_index='" + all_groups[i].group_index + "'>" + all_groups[i].group_index + "</option>");
      }
    }
  });

  $(tempDiv).append(tempSelect);

  $(modal_body).append(tempDiv)

  $(modal_body).append("<small>Possible Venues: <span id='p_venues'></span></small>", "<small>Possible Groups: <span id='p_groups'></span></small>");

  $.ajax({
    url: "/possible_venues/show",
    method: "POST",
    data: {lesson_types_id: lesson_type_id},
    success: function (res) {
      let all_venues = res;
      $("#p_venues").html("");
      for (let i = 0; i < all_venues.length; i++) {
        if (i > 0)
          $("#p_venues").append(",");
        $("#p_venues").append(all_venues[i].name);
      }
    }
  });

  $.ajax({
    url: "/possible_groups/show",
    method: "POST",
    data: {lesson_types_id: lesson_type_id},
    success: function (res) {
      let all_groups = res;
      $("#p_groups").html("");
      for (let i = 0; i < all_groups.length; i++) {
        if (i > 0)
          $("#p_groups").append(",");
        $("#p_groups").append(all_groups[i].group_index);
      }
    }
  });

  $(modal_body).append("<div class='dropdown-divider'></div>")

  $(modal_body).find("select[name='frequency'] > option[value=" + freq + "]").prop("selected", true);
  /**
   * Weeks Checkboxes
   */
  tempDiv = document.createElement("div");
  $(tempDiv).addClass("weeks_chooser");

  for (let i = 0; i < 13; i++) {
    $(tempDiv).append("<input type='checkbox' name='weeks' class='custom_checkbox' id='week_" + (i + 1) + "' />");
    $(tempDiv).append("<label class='form-check-label' for='week_" + (i + 1) + "'> Week " + (i + 1) + "</label>");
  }

  $(modal_body).append(tempDiv);
  freq_rb_changed();

  let temp_weeks = schoolweeks.split(",");
  for (let i = 0; i < temp_weeks.length; i++) {
    $("input[type=checkbox][id=week_" + (parseInt(temp_weeks[i])) + "]").prop("checked", true);
  }

  $("#edit_event_modal").modal("show");
}

function lesson_type_changed(evt) {
  let lesson_type_id = $("select[name=lesson_type] > option:selected").attr("data-lessontypeid");
  let venue = evt.target.venue;
  let venue_id = evt.target.venue_id;

  $.ajax({
    url: "/possible_venues/show",
    method: "POST",
    data: {lesson_types_id: lesson_type_id},
    success: function (res) {
      let all_venues = res;
      $("#p_venues").html("");
      for (let i = 0; i < all_venues.length; i++) {
        if (i > 0)
          $("#p_venues").append(",");
        $("#p_venues").append(all_venues[i].name);
      }
    }
  });

  $.ajax({
    url: "/possible_groups/show",
    method: "POST",
    data: {lesson_types_id: lesson_type_id},
    success: function (res) {
      let all_groups = res;
      $("#p_groups").html("");
      for (let i = 0; i < all_groups.length; i++) {
        if (i > 0)
          $("#p_groups").append(",");
        $("#p_groups").append(all_groups[i].group_index);
      }
    }
  });
}

function freq_rb_changed() {
  let modal = $("#edit_event_modal");
  let freq = $(modal).find("select[name='frequency'] > option:selected").val();

  if (freq == "ODD") {
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(odd)").prop("checked", true);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(odd)").prop("disabled", false);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(even)").prop("checked", false);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(even)").prop("disabled", true);
  } else if (freq == "EVEN") {
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(even)").prop("checked", true);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(even)").prop("disabled", false);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(odd)").prop("checked", false);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(odd)").prop("disabled", true);
  } else if (freq == "WEEKLY") {
    $(modal).find(".weeks_chooser input[name='weeks']").prop("disabled", false);
    $(modal).find(".weeks_chooser input[name='weeks']").prop("checked", false);
  }
}

function confirm_edit_event() {
  let event = $("#" + $("#edit_event_modal_title").attr("data-event"));
  let params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  let study_year_sem = (params[0].split("="))[1];
  let lesson_id = $("#edit_event_modal_title").attr("data-lessonid");
  let module_code = $('#edit_event_modal_title').attr("data-mod");
  let day = $('#edit_event_modal').find("select[name='lesson_day'] option:selected").val();
  let time = $('#edit_event_modal').find("select[name='start_time'] option:selected").val();
  let duration = $("#edit_event_modal").find("select[name='duration'] option:selected").val();
  let lesson_type = $("#edit_event_modal").find("select[name='lesson_type'] option:selected").val();
  let lesson_type_id = $("#edit_event_modal").find("select[name='lesson_type'] option:selected").attr("data-lessontypeid");
  let venue = $("#edit_event_modal").find("select[name='venue_select'] option:selected").val();
  let venue_id = $("#edit_event_modal").find("select[name='venue_select'] option:selected").attr("data-venueid");
  let group = $("#edit_event_modal").find("select[name='group_select'] option:selected").val();
  let freq = $("#edit_event_modal").find("select[name='frequency'] option:selected").val();
  let weeks = "";
  let weeksArr = $("#edit_event_modal").find(".weeks_chooser input[name='weeks']:checked");

  for (let i = 0; i < weeksArr.length; i++) {
    if (i > 0)
      weeks += ",";
    weeks += $(weeksArr[i]).attr("id").slice(5, $(weeksArr[i]).attr("id").length);
  }

  $.ajax({
    url: "/lesson/update",
    method: "POST",
    data: {
      lesson_id: lesson_id,
      study_year_sem: study_year_sem,
      module_code: module_code,
      lesson_day: day,
      start_time: time,
      duration: duration,
      lesson_type_id: lesson_type_id,
      venue_id: venue_id,
      group_index: group,
      school_weeks: weeks,
    },
    success: function (res) {
      let currentDiv = document.createElement("div");
      $(currentDiv).attr("draggable", true);
      $(currentDiv).attr("id", $("#edit_event_modal_title").attr("data-event"));
      $(currentDiv).addClass("single_event");
      $(currentDiv).attr("data-lessonid", lesson_id);
      $(currentDiv).attr("data-lessondetailsid", $(event).attr("data-lessondetailsid"));
      $(currentDiv).attr("data-lessontypeid", lesson_type_id);
      $(currentDiv).attr("data-lessontype", lesson_type);
      $(currentDiv).attr("data-weektype", freq);
      $(currentDiv).attr("data-venue", venue);
      $(currentDiv).attr("data-venueid", venue_id);
      $(currentDiv).attr("data-group", group);
      $(currentDiv).attr("data-duration", duration);
      $(currentDiv).attr("data-schoolweeks", weeks);
      $(currentDiv).attr("ondragstart", "drag(event)");
      $(currentDiv).append("<p>" + group + "-" + venue + "(" + freq + ")</p>");
      $(currentDiv).append("<img src='/images/icons/more_2.svg' id='" + $(event).find("img").attr("id") + "' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' style='cursor: pointer;' />");
      let dropdownDiv = document.createElement("div");
      $(dropdownDiv).addClass("dropdown-menu");
      $(dropdownDiv).addClass("event_more_dropdown");
      $(dropdownDiv).attr("aria-labelledby", $(event).find("img").attr("id"));
      $(dropdownDiv).append("<button class='dropdown-item' type='button' onclick='assign_staff(this.parentNode.parentNode);'>Assign Staff</button>");
      $(dropdownDiv).append("<button class='dropdown-item' type='button' onclick='edit_lesson(this.parentNode.parentNode);'>Edit</button>");
      $(dropdownDiv).append("<button class='dropdown-item' type='button' onclick='remove_lesson(this.parentNode.parentNode);'>Remove</button>");
      $(currentDiv).append(dropdownDiv);

      $(".day_group[data-day='" + day + "'] > .time_wrapper > .day_placeholder[data-time='" + time + "'] > .events_group[data-mod='" + module_code + "']").append(currentDiv);

      $(event).remove();
      alert(res);
    }
  });
}

/**
 * Author: Wong Yijie
 * remove_lesson() is to remove delete the lesson from the database and remove from client itself.
 * @param self
 */
function remove_lesson(self) {
  let res = confirm("Are you sure you want to remove this lesson?");
  if (res == true) {
    let lesson_id = $(self).attr("data-lessonid");
    $.ajax({
      url: "/lesson/delete",
      method: "POST",
      data: {lesson_id: lesson_id},
      success: function(res) {
        if (res.length > 0)
          $(self).remove();
      }
    });
  }
}

function assign_staff(self) {
  let module_code = $(self).parent().attr("data-mod");
  let lesson_id = $(self).attr("data-lessonid");
  $("#assign_staff_modal_title").attr("data-lessonid", lesson_id);
  let modal_body = $("#assign_staff_modal").find(".modal-body");
  $(modal_body).html("");
  let tempDiv = document.createElement("div");
  let tempSelect = document.createElement("select");
  $(tempDiv).addClass("staff_select_wrapper")
  $(tempSelect).attr("id", "staff_select");
  $(tempSelect).addClass("form-control");
  $(tempSelect).attr("name", "staff_select");

  $.ajax({
    url: "/staff/get_assigned_module",
    method: "POST",
    data: {module_code: module_code},
    success: function (res) {
      let all_staffs = res;
      $("select[name=staff_select]").html("");
      for (let i = 0; i < all_staffs.length; i++) {
        $("select[name=staff_select]").append("<option data-staffid='" + all_staffs[i].staff_id.staff_id + "'>" + all_staffs[i].staff_id.name + "</option>");
      }
    }
  });

  $(modal_body).append("<label>Assign staff to this lesson:</label>");
  $(tempDiv).append(tempSelect, "<button type='button' onclick='confirm_assign_staff(this.parentNode)' class='btn btn-primary'>Add</button>");
  $(modal_body).append(tempDiv);

  $.ajax({
    url: "/lesson/get_assigned_staff",
    method: "POST",
    data: {lesson_id: lesson_id},
    success: function (res) {
      let staff_assigned = res;
      for (let i = 0; i < staff_assigned.length; i++) {
        let tempDiv = document.createElement("div");
        let staff = staff_assigned[i];

        $(tempDiv).addClass("custom_mod_style");
        $(tempDiv).append("<p id='" + staff.staff_id + "'>" + staff.staff_name + "</p>");
        $(tempDiv).append("<img src='/images/icons/minus.svg' style='cursor: pointer;' onclick='delete_staff_assigned(this.parentNode)' />")

        $(modal_body).append(tempDiv);
      }
    }
  });

  $("#assign_staff_modal").modal("show");
}

function confirm_assign_staff(parent) {
  let lesson_id = $("#assign_staff_modal_title").attr("data-lessonid");
  let staff_id = $(parent).find("select option:selected").attr("data-staffid");
  let staff_name = $(parent).find("select option:selected").val();

  $.ajax({
    url: "/lesson/assign_staff",
    method: "POST",
    data: {lesson_id: lesson_id, staff_id: staff_id},
    success: function (res) {
      let tempDiv = document.createElement("div");
      let staff = res;

      $(tempDiv).addClass("custom_mod_style");
      $(tempDiv).append("<p id='" + staff_id + "'>" + staff_name + "</p>");
      $(tempDiv).append("<img src='/images/icons/minus.svg' style='cursor: pointer;' onclick='delete_staff_assigned(this.parentNode)' />");

      $(parent.parentNode).append(tempDiv);
    }
  });
}

function delete_staff_assigned(parent) {
  let resp = confirm("Are you sure you want to delete this staff assigned?");

  if (resp == true) {
    let lesson_id = $("#assign_staff_modal_title").attr("data-lessonid");
    let staff_id = $(parent).find("p").attr("id");
    $.ajax({
      url: "/lesson/unassign_staff",
      method: "POST",
      data: {lesson_id: lesson_id, staff_id: staff_id},
      success: function (res) {
        alert ("Staff has been successfully unassigned!");
        $(parent).remove();
      }
    });
  }
}


/**
 * Add Lesson
 */

function add_event(target) {
  let module_code = $(target).data("mod");

  $.ajax({
    url: "/lesson_types/get_by_module",
    method: "POST",
    data: {module_code: module_code},
    success: function (res) {
      console.log(res);
      let modal_body = $("#add_event_modal").find(".modal-body");
      $(modal_body).html("");
      if (res.length > 0) {
        let params = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        let days_arr = ["M", "T", "W", "TH", "F"];
        let frequency_arr = ["WEEKLY", "ODD", "EVEN"];
        $('#add_event_modal_title').html("Add Lesson - " + module_code);
        $('#add_event_modal_title').attr("data-mod", module_code);
        $('#add_event_modal_title').attr("data-time", $(target).parent().data("time"));
        $('#add_event_modal_title').attr("data-day", $(target).parent().parent().parent().data("day"));

        let tempDiv = document.createElement("div");
        $(tempDiv).addClass("modal_time_wrapper");
        $(tempDiv).append("<p>Lesson Day</p>", "<p>Start Time:</p>", "<p>Duration:</p>");
        let tempSelect = document.createElement("select");
        $(tempSelect).addClass("form-control");
        $(tempSelect).addClass("custom_select");
        $(tempSelect).attr("name", "lesson_day");

        for (let i = 0; i < days_arr.length; i++) {
          let str;
          if (days_arr[i] == $(target).parent().parent().parent().data("day"))
            str = "<option selected>" + days_arr[i] + "</option>";
          else
            str = "<option>" + days_arr[i] + "</option>";
          $(tempSelect).append(str);
        }
        $(tempDiv).append(tempSelect);

        tempSelect = document.createElement("select");
        $(tempSelect).addClass("form-control");
        $(tempSelect).addClass("custom_select");
        $(tempSelect).attr("name", "start_time");
        for (let i = 8; i <= parseInt((params[1].split("=")[1]).slice(0, 2)); i++) {
          let str = "<option>" + (i < 10 ? "0" + i : i) + (params[1].split("=")[1]).slice(2) + "</option>";
          $(tempSelect).append(str);
        }
        $(tempDiv).append(tempSelect);
        tempSelect = document.createElement("select");
        $(tempSelect).addClass("form-control");
        $(tempSelect).addClass("custom_select");
        $(tempSelect).attr("name", "duration");
        for (let i = 1; i < 10; i++) {
            $(tempSelect).append("<option>" + i + "</option>");
        }
        $(tempDiv).append(tempSelect);
        $(modal_body).append(tempDiv);

        /**
         * Lesson Types
         */
        tempDiv = document.createElement("div");
        $(tempDiv).addClass("two_columns_grid");
        $(tempDiv).append("<p>Lesson Type</p>", "<p>Frequency</p>");
        tempSelect = document.createElement("select");
        $(tempDiv).attr("id", "lesson_type_wrapper");
        $(tempDiv).addClass("form-check");
        $(tempDiv).addClass("form-check-inline");
        $(tempSelect).addClass("form-control");
        $(tempSelect).addClass("custom_select");
        $(tempSelect).attr("name", "lesson_type");
        $(tempSelect).on("change", alesson_type_changed);
        for (let i = 0; i < res.length; i++) {
          $(tempSelect).append("<option id='edit_lesson_type_" + i + "' data-lessontypeid='" + res[i].id + "' value='" + res[i].lesson_type + "'>" + res[i].lesson_type + "</option>");
        }
        $(tempDiv).append(tempSelect);

        tempSelect = document.createElement("select");
        $(tempSelect).attr("id", "freq_wrapper");
        $(tempSelect).addClass("form-control");
        $(tempSelect).attr("name", "frequency");
        $(tempSelect).on("change", afreq_rb_changed);
        for (let i = 0; i < 3; i++) {
          $(tempSelect).append("<option value='" + frequency_arr[i] + "'>" + frequency_arr[i] + "</option>");
        }

        $(tempDiv).append(tempSelect);
        $(modal_body).append(tempDiv);

        /**
         * Possible Venues Selection
         */
        tempDiv = document.createElement("div");
        tempSelect = document.createElement("select");
        $(tempDiv).addClass("two_columns_grid");
        $(tempDiv).append("<p>Venue</p>", "<p>Group</p>");
        $(tempSelect).attr("id", "venue_select");
        $(tempSelect).addClass("form-control");
        $(tempSelect).attr("name", "venue_select");

        $.ajax({
          url: "/venue/show",
          method: "POST",
          data: {},//lesson_types_id: lesson_type_id},
          success: function (res) {
            let all_venues = res;
            $(modal_body).find("select[name=venue_select]").html("");
            for (let i = 0; i < all_venues.length; i++) {
              $(modal_body).find("select[name=venue_select]").append("<option data-venueid='" + all_venues[i].id + "'>" + all_venues[i].name + "</option>");
            }
          }
        });

        $(tempDiv).append(tempSelect);

        tempSelect = document.createElement("select");
        $(tempSelect).attr("id", "group_select");
        $(tempSelect).addClass("form-control");
        $(tempSelect).attr("name", "group_select");

        $.ajax({
          url: "/group/show",
          method: "POST",
          data: {},
          success: function (res) {
            let all_groups = res;
            $(modal_body).find("select[name=group_select]").html("");
            for (let i = 0; i < all_groups.length; i++) {
              $(modal_body).find("select[name=group_select]").append("<option data-group_index='" + all_groups[i].group_index + "'>" + all_groups[i].group_index + "</option>");
            }
          }
        });

        $(tempDiv).append(tempSelect);

        $(modal_body).append(tempDiv)

        $(modal_body).append("<small>Possible Venues: <span id='ap_venues'></span></small>", "<small>Possible Groups: <span id='ap_groups'></span></small>");

        $(modal_body).append("<div class='dropdown-divider'></div>");
        /**
         * Weeks Checkboxes
         */
        tempDiv = document.createElement("div");
        $(tempDiv).addClass("weeks_chooser");

        for (let i = 0; i < 13; i++) {
          $(tempDiv).append("<input type='checkbox' name='weeks' class='custom_checkbox' id='week_" + (i + 1) + "' />");
          $(tempDiv).append("<label class='form-check-label' for='week_" + (i + 1) + "'> Week " + (i + 1) + "</label>");
        }

        $(modal_body).append(tempDiv);

        $.ajax({
          url: "/possible_venues/show",
          method: "POST",
          data: {lesson_types_id: res[0].id},
          success: function (res) {
            let all_venues = res;
            $("#ap_venues").html("");
            for (let i = 0; i < all_venues.length; i++) {
              if (i > 0)
                $("#ap_venues").append(",");
              $("#ap_venues").append(all_venues[i].name);
            }
          }
        });

        $.ajax({
          url: "/possible_groups/show",
          method: "POST",
          data: {lesson_types_id: res[0].id},
          success: function (res) {
            let all_groups = res;
            $("#ap_groups").html("");
            for (let i = 0; i < all_groups.length; i++) {
              if (i > 0)
                $("#ap_groups").append(",");
              $("#ap_groups").append(all_groups[i].group_index);
            }
          }
        });
      }
    }
  });

  $('#add_event_modal').modal('show');
}

function alesson_type_changed(evt) {
  let lesson_type_id = $("#add_event_modal").find("select[name=lesson_type] > option:selected").attr("data-lessontypeid");
  let venue = evt.target.venue;
  let venue_id = evt.target.venue_id;

  $.ajax({
    url: "/possible_venues/show",
    method: "POST",
    data: {lesson_types_id: lesson_type_id},
    success: function (res) {
      let all_venues = res;
      $("#ap_venues").html("");
      for (let i = 0; i < all_venues.length; i++) {
        if (i > 0)
          $("#ap_venues").append(",");
        $("#ap_venues").append(all_venues[i].name);
      }
    }
  });

  $.ajax({
    url: "/possible_groups/show",
    method: "POST",
    data: {lesson_types_id: lesson_type_id},
    success: function (res) {
      let all_groups = res;
      $("#ap_groups").html("");
      for (let i = 0; i < all_groups.length; i++) {
        if (i > 0)
          $("#ap_groups").append(",");
        $("#ap_groups").append(all_groups[i].group_index);
      }
    }
  });
}

function afreq_rb_changed() {
  let modal = $("#add_event_modal");
  let freq = $(modal).find("select[name='frequency'] > option:selected").val();

  if (freq == "ODD") {
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(odd)").prop("checked", true);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(odd)").prop("disabled", false);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(even)").prop("checked", false);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(even)").prop("disabled", true);
  } else if (freq == "EVEN") {
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(even)").prop("checked", true);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(even)").prop("disabled", false);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(odd)").prop("checked", false);
    $(modal).find(".weeks_chooser input[name='weeks']:nth-of-type(odd)").prop("disabled", true);
  } else if (freq == "WEEKLY") {
    $(modal).find(".weeks_chooser input[name='weeks']").prop("disabled", false);
    $(modal).find(".weeks_chooser input[name='weeks']").prop("checked", false);
  }
}
