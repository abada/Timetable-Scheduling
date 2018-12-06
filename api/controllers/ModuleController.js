/**
 * ModuleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  index: async function(req, res) {
    let modules = await Module.find({}).populate("lesson_types");

    res.view({
      modules: modules,
    });
  },

  newModule: async function(req, res) {
    res.view('module/new_module');
  },

  importExcel: async function(req, res) {
    req.file("moduleFile").upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
        saveAs: req.file("moduleFile")._files[0].stream.filename,
      },
      function (err, uploadedFile) {
        if (err) {
          return res.serverError(err);
        } else {
          let moduleFilename = uploadedFile[0].filename;
          let xtension = moduleFilename.slice(moduleFilename.lastIndexOf(".") + 1, moduleFilename.length);

          let Excel = require('exceljs');
          let path = require('path');
          let filePath = path.resolve("assets/uploads", moduleFilename);

          if (xtension == "xlsx")
          {
            let workbook = new Excel.Workbook();
            workbook.xlsx.readFile(filePath)
              .then(async function() {
                let worksheet = workbook.getWorksheet(1);
                for (let row_index = 2; row_index <= worksheet.rowCount; row_index++) {
                  let row = worksheet.getRow(row_index);
                  let module, sharedModule;
                  try {
                    module = await Module.findOrCreate({ code: row.getCell(1).value }, {
                      code: row.getCell(1).value,
                      name: row.getCell(2).value,
                      academic_units: row.getCell(3).value,
                      cohort_size: row.getCell(4).value,
                    });
                    if (row.getCell(5).value == true) {
                      let tempCode = "CE";
                      if (row.getCell(1).value.toString().slice(0, 2) == "CE")
                        tempCode = "CZ";
                      sharedModule = await Module.findOrCreate({ code: tempCode + row.getCell(1).value.toString().slice(2) }, {
                        code: tempCode + row.getCell(1).value.toString().slice(2),
                        name: row.getCell(2).value,
                        academic_units: row.getCell(3).value,
                        cohort_size: row.getCell(4).value,
                      });
                      let sm = await SharedModule.findOrCreate({module_code_a: module.code, module_code_b: sharedModule.code}, {module_code_a: module.code, module_code_b: sharedModule.code});
                    }
                  } catch(err) {
                    res.serverError(err);
                    break;
                  }

                  /**
                   * Include the above codes with staff modules
                   */

                  /**
                   * Leaving bottom for further enhancement (The excel file to be able to build the behind columns with lecture / tutorial / lab / additional lesson details)
                   */
                  // if (module != null) {
                  //   if (row.getCell(6).value > 0) {
                  //     let lesson = await Lesson.create({
                  //       lesson_type: "LEC",
                  //       num_of_lessons: row.getCell(6).value,
                  //       frequency: row.getCell(8).value,
                  //       module_code: module.code,
                  //     }).fetch();
                  //
                  //     if (lesson) {
                  //       let result = await self.createLessons(row, lesson, 6, 8);
                  //       if (result != "OK")
                  //         res.serverError(result);
                  //     }
                  //   }
                  //
                  //   if (row.getCell(10).value > 0) {
                  //     let lesson = await Lesson.create({
                  //       lesson_type: "TUT",
                  //       num_of_lessons: row.getCell(10).value,
                  //       frequency: row.getCell(12).value,
                  //       module_code: module.code,
                  //     }).fetch();
                  //
                  //     if (lesson) {
                  //       let result = await self.createLessons(row, lesson, 10, 12);
                  //       if (result != "OK")
                  //         res.serverError(result);
                  //     }
                  //   }
                  //
                  //   if (row.getCell(14).value > 0) {
                  //     let lesson = await Lesson.create({
                  //       lesson_type: "LAB",
                  //       num_of_lessons: row.getCell(14).value,
                  //       frequency: row.getCell(16).value,
                  //       module_code: module.code,
                  //     }).fetch();
                  //
                  //     if (lesson) {
                  //       let result = await self.createLessons(row, lesson, 15, 17);
                  //       if (result != "OK")
                  //         res.serverError(result);
                  //     }
                  //   }
                  // }
                }
                // worksheet.eachRow({includeEmpty: true}, function(row, rowNumber) {
                //   let currRow = worksheet.getRow(rowNumber);
                //   let module_code = currRow.getCell(1).value;
                //   let module_name = currRow.getCell(2).value;
                //   let academic_units = currRow.getCell(3).value;
                //   let cohort_size = currRow.getCell(4).value;
                //   let lec_lessons = currRow.getCell(5).value;
                //   let lec_possible_venues = currRow.getCell(6).value;
                //   let lec_freq = currRow.getCell(7).value;
                // });
              })
              .then(function() {
                const filesystem = require('fs');
                filesystem.unlink("assets/uploads/" + moduleFilename, function(err) {
                  if (err)
                    res.serverError(err);
                });
                res.redirect("/module");
              });
          }
          else if (xtension == "csv")
          {

          }
          else
          {
            res.serverError();
          }
        }
      });
  },

  /**
   *   CRUD METHODS (FOR AJAX PURPOSES)
   */
  create: async function(req, res) {
    let code = req.param("code");
    let name = req.param("name");
    let academic_units = req.param("au");
    let cohort_size = req.param("cohort");
    let lesson_types = req.param("lesson_types");

    let module = await Module.find({ code: code });
    if (module.length > 0)
      res.status(460).send("Module with the same ID already exist!");
    else {
      module = await Module.create({
        code: code,
        name: name,
        academic_units: academic_units,
        cohort_size: cohort_size,
      }).fetch();

      let types_created_counter = 0;

      for (let i = 0; i < lesson_types.length; i++) {
        let type = await LessonTypes.create({
          lesson_type: lesson_types[i],
          module_code: code,
        }).fetch();

        if (type.length > 0)
          types_created_counter++;
      }

      res.send([module, types_created_counter]);
    }
  },

  show: async function(req, res) {
    let module_code = req.param("module_code");

    let modules = module_code == null ? await Module.find({}) : await Module.find({module_code: module_code});

    res.json(modules);
  },

  update: async function(req, res) {
    let code = req.param("code");
    let name = req.param("name");
    let academic_units = req.param("academic_units");
    let cohort_size = req.param("cohort_size");

    let module = await Module.update({code: code}).set({name: name, academic_units: academic_units, cohort_size: cohort_size}).fetch();

    res.json(module);
  },

  destroy: async function(req, res) {
    let code = req.param("code");

    let module = await Module.destroy({code: code}).fetch();

    res.json(module);
  },
};

