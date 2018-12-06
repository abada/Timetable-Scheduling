/**
 * StaffController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   *  WEB URL ROUTES
   */
  index: async function(req, res) {
    let staffs = await Staff.find({}).populate("modules_assigned");
    let modules = await Module.find({});
    res.view({
      staffs: staffs,
      modules: modules,
    });
  },

  newStaff: async function(req, res) {
    res.view('staff/new_staff');
  },

  'importExcel': async function(req, res) {
    req.file("staffFile").upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
      saveAs: req.file("staffFile")._files[0].stream.filename,
    },
    function(err , uploadedFile) {
      if (err) {
        return res.serverError(err);
      } else {
        let staffFilename = uploadedFile[0].filename;
        let xtension = staffFilename.slice(staffFilename.lastIndexOf(".") + 1, staffFilename.length);

        let Excel = require('exceljs');
        let path = require('path');
        let filePath = path.resolve("assets/uploads", staffFilename);

        if (xtension == "xlsx") {
          let workbook = new Excel.Workbook();
          workbook.xlsx.readFile(filePath)
            .then(async function () {
              let worksheet = workbook.getWorksheet(1);
              if (worksheet.getRow(1).getCell(1).value == "STAFFID") {
                for (let row_index = 2; row_index <= worksheet.rowCount; row_index++) {
                  let row = worksheet.getRow(row_index);
                  let staff;
                  try {
                    if (row.getCell(1).value != null) {
                      staff = await Staff.findOrCreate({staff_id: row.getCell(1).value}, {
                        staff_id: row.getCell(1).value,
                        name: row.getCell(2).value,
                        last_name: row.getCell(3).value,
                        school: row.getCell(4).value,
                        designation: row.getCell(5).value,
                        room_no: row.getCell(6).value,
                        ext_no: row.getCell(7).value,
                        email: row.getCell(8).value == null ? row.getCell(1).value + "@ntu.edu.sg" : row.getCell(8).text,
                      });
                    }
                  } catch (err) {
                    res.serverError(err);
                    break;
                  }

                  // for (let column_index = 9; column_index <= worksheet.columnCount; column_index++) {
                  //   if (row.getCell(column_index).value != null) {
                  //     await StaffAllocation.findOrCreate({staff_id: staff.staff_id, module_code: row.getCell(column_index).value}, {
                  //       staff_id: staff.staff_id,
                  //       module_code: row.getCell(column_index).value,
                  //     });
                  //   }
                  // }
                }
              }
            })
            .then(function () {
              const filesystem = require('fs');
              filesystem.unlink("assets/uploads/" + staffFilename, function(err) {
                if (err)
                  res.serverError(err);
              });
              res.redirect("/staff");
            });
        }
      }
    });
  },

  /**
   *   CRUD METHODS (FOR AJAX PURPOSES)
   */
  create: async function(req, res) {
    let staff_id = req.param("staffid");
    let name = req.param("name");
    let last_name = req.param("lastname");
    let designation = req.param("designation") == "" ? null : req.param("designation");
    let school = req.param("school") == "" ? null : req.param("school");
    let room = req.param("room") == "" ? null : req.param("room");
    let ext = req.param("ext") == "" ? null : req.param("ext");
    let email = staff_id + "@ntu.edu.sg";

    let staff = await Staff.find({ staff_id: staff_id });
    if (staff.length > 0)
      res.status(460).send("Staff with the same ID already exist!");
    else {
      staff = await Staff.create({
        staff_id: staff_id,
        name: name,
        last_name: last_name,
        designation: designation,
        school: school,
        room_no: room,
        ext_no: ext,
        email: email,
      }).fetch();
      res.json(staff);
    }
  },

  show: async function(req, res) {
    let staff_id = req.param("staffid");
    let promise_1 = staff_id == null ? Staff.find({}) : Staff.find({staff_id: staff_id});

    Promise.all([promise_1]).then(function(result) {
      res.json(result);
    });
  },

  update: async function(req, res) {
    let staff_id = req.param("staffid");
    let name = req.param("name");
    let last_name = req.param("lastname");
    let designation = req.param("designation") == "" ? null : req.param("designation");
    let school = req.param("school") == "" ? null : req.param("school");
    let room = req.param("room") == "" ? null : req.param("room");
    let ext = req.param("ext") == "" ? null : req.param("ext");

    let staff = await Staff.update({staff_id: staff_id}).set({name: name, last_name: last_name, designation: designation, school: school, room_no: room, ext_no: ext}).fetch();

    res.json(staff);
  },

  destroy: async function(req, res) {
    let staff_id = req.param("staffid");

    // await StaffAllocation.destroy({staff_id: staff_id});
    let staff = await Staff.destroy({staff_id: staff_id}).fetch();

    res.json(staff);
  },

};

