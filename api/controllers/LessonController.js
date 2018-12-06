/**
 * LessonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  /**
   *  WEB URL ROUTES
   */
  importStars: async function(req, res) {
    req.file("starsFile").upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
      saveAs: req.file("starsFile")._files[0].stream.filename,
    },
    function (err, uploadedFile) {
      if (err) {
        return res.serverError(err);
      } else {
        let moduleFilename = uploadedFile[0].filename;
        let xtension = moduleFilename.slice(moduleFilename.lastIndexOf(".") + 1, moduleFilename.length);
        const fs = require('fs');
        let affectedRows = 0;

        if (xtension == "txt") {
          fs.readFile(uploadedFile[0].fd, 'utf8', async function(err, data) {
            let data_arr = data.split("\r\n");

            for (let i = 0; i < data_arr.length; i++) {
              // Module Related
              let module_code = data_arr[i].slice(5, 11).trim();
              let module = await Module.findOne({code: module_code});

              if (!module)
                continue;

              // Lesson Types Related
              let lesson_type = data_arr[i].slice(11,14);
              let ltype = await LessonTypes.findOrCreate({lesson_type: lesson_type, module_code: module_code}, {lesson_type: lesson_type, module_code: module_code});

              // Lesson Details Related
              let default_no_lessons = 2; //Per week
              let lesson_detail = await LessonDetails.findOrCreate({lesson_types_id: ltype.id}, {no_of_lessons: default_no_lessons, lesson_types_id: ltype.id});

              // Possible Venues Related
              let venue_name = data_arr[i].slice(31, 51).trim();
              let venue = await Venue.findOne({name: venue_name});
              if (!venue) {
                console.log("Venue with the name could not be found! No possible venue will be added for this module's lesson type!");
              } else {
                let possible_venue = await PossibleVenues.findOrCreate({
                  lesson_types_id: ltype.id,
                  venue_id: venue.id,
                }, {
                  lesson_types_id: ltype.id,
                  venue_id: venue.id,
                });
              }

              // Possible Groups Related
              let group_index = data_arr[i].slice(14, 19).trim();
              let group = await Group.findOne({group_index: group_index});
              if (!group) {
                console.log("Group with the index could not be found! No possible group will be added for this module's lesson type!");
              } else {
                let possible_group = await PossibleGroups.findOrCreate({
                  lesson_types_id: ltype.id,
                  group_index: group.group_index,
                }, {
                  lesson_types_id: ltype.id,
                  group_index: group.group_index,
                });
              }

              // Timeslots Related
              let start_time = data_arr[i].slice(21,26);
              let end_time = data_arr[i].slice(26, 31);
              let timeslot = await Timeslots.findOrCreate({start_time: start_time, end_time: end_time}, {
                start_time: start_time,
                end_time: end_time,
              });

              // Lesson Related
              let study_year_sem = data_arr[i].slice(0, 5);
              let lesson_day = data_arr[i].slice(19, 21).trim();
              let school_weeks = "";

              for (let j = 51; j < 64; j++) {
                if (data_arr[i].slice(j, j+1) == " ") {
                  if (school_weeks != "")
                    school_weeks += ",";
                  school_weeks += (j-50);
                }
              }

              let lesson = await Lesson.findOrCreate({
                study_year_sem: study_year_sem,
                lesson_day: lesson_day,
                school_weeks: school_weeks,
                group_index: group_index,
                venue_id: venue.id,
                timeslots_id: timeslot.id,
                lesson_details_id: lesson_detail.id,
              }, {
                study_year_sem: study_year_sem,
                lesson_day: lesson_day,
                school_weeks: school_weeks,
                group_index: group_index,
                venue_id: venue.id,
                timeslots_id: timeslot.id,
                lesson_details_id: lesson_detail.id,
              });

              if (lesson)
                affectedRows++;
            }

            console.log(affectedRows);
          });
        }
        fs.unlink("assets/uploads/" + moduleFilename, function(err) {
          if (err)
            res.serverError(err);
        });
        res.redirect("/planner/by_timeslot");
      }
    });
  },


  /**
   *   CRUD METHODS (FOR AJAX PURPOSES)
   */
  show: async function(req, res) {
    let module_codes = req.param("module_codes");
    let lesson_types = await LessonTypes.find({module_code: module_codes});
    let lesson_types_id = [];

    for (let i = 0; i < lesson_types.length; i++) {
      lesson_types_id.push(lesson_types[i].id);
    }

    let lesson_details = await LessonDetails.find({lesson_types_id: lesson_types_id});
    let lesson_details_id = [];

    for (let i = 0; i < lesson_details.length; i++) {
      lesson_details_id.push(lesson_details[i].id);
    }

    let lessons = await Lesson.find({lesson_details_id: lesson_details_id});

    for (let i = 0; i < lessons.length; i++) {
      let ldetails = (await LessonDetails.findOne({id: lessons[i].lesson_details_id}));
      let ltype = (await LessonTypes.findOne({id: ldetails.lesson_types_id}));
      let timeslot = (await Timeslots.findOne({ id: lessons[i].timeslots_id, }));

      lessons[i].venue = (await Venue.findOne({ id: lessons[i].venue_id, })).name;
      lessons[i].start_time = timeslot.start_time;
      lessons[i].end_time = timeslot.end_time;
      lessons[i].module_code = ltype.module_code;
      lessons[i].lesson_type = ltype.lesson_type;
      lessons[i].no_of_lessons = ldetails.no_of_lessons;
    }

    res.json(lessons);
  },
};

