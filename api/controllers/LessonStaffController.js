/**
 * LessonStaffController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  create: async function(req, res) {
    let lesson_id = req.param("lesson_id");
    let staff_id = req.param("staff_id");

    let lesson_staff = await LessonStaff.findOrCreate({lesson_id: lesson_id, staff_id: staff_id}, {lesson_id: lesson_id, staff_id: staff_id});

    res.json(lesson_staff);
  },

  show: async function(req, res) {
    let lesson_id = req.param("lesson_id");

    let lesson_staff = await LessonStaff.find({lesson_id: lesson_id});
    let staff_id_arr = [];
    for (let i = 0; i < lesson_staff.length; i++)
      staff_id_arr.push(lesson_staff[i].staff_id);

    let staffs = await Staff.find({staff_id: staff_id_arr});
    for (let i = 0; i < staffs.length; i++) {
      lesson_staff[i].staff_name = staffs[i].name;
    }
    res.json(lesson_staff);
  },

  destroy: async function(req, res) {
    let lesson_id = req.param("lesson_id");
    let staff_id = req.param("staff_id");

    if (lesson_id != null && staff_id != null) {
      let lesson_staff = await LessonStaff.destroy({lesson_id: lesson_id, staff_id: staff_id}).fetch();

      res.json(lesson_staff);
    }
  },
};

