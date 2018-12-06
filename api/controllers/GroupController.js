/**
 * GroupController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  /**
   *  WEB URL ROUTES
   */

  index: async function(req, res) {
    let groups = await Group.find({});

    res.view({
        groups: groups,
      });
  },

  newGroup: async function(req, res) {
    res.view('group/new_group');
  },

  importExcel: async function (req, res) {
    req.file("groupFile").upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
      saveAs: req.file("groupFile")._files[0].stream.filename,
    },
    function (err, uploadedFile) {
      if (err) {
        return res.serverError(err);
      } else {
        let group_filename = uploadedFile[0].filename;
        let xtension = group_filename.slice(group_filename.lastIndexOf(".") + 1, group_filename.length);

        let Excel = require('exceljs');
        let path = require('path');
        let filePath = path.resolve("assets/uploads", group_filename);

        if (xtension == "xlsx") {
          let workbook = new Excel.Workbook();
          workbook.xlsx.readFile(filePath)
            .then(async function() {
              let worksheet = workbook.getWorksheet(1);
              let row_index = 1;
              if (worksheet.getRow(1).getCell(1).value == "GROUP_INDEX")
                row_index = 2;
              for (row_index; row_index <= worksheet.rowCount; row_index++) {
                let row = worksheet.getRow(row_index);
                try {
                  await Group.findOrCreate(
                  {
                    group_index: row.getCell(1).value,
                  },
                  {
                    group_index: row.getCell(1).value,
                    group_size: row.getCell(2).value,
                  });
                } catch (err) {
                  res.serverError(err);
                  break;
                }
              }
              res.redirect('/group');
            });
        } else if (xtension == "csv") {

        }
      }
    });
  },


  /**
   *   CRUD METHODS (FOR AJAX PURPOSES)
   */
  create: async function(req, res) {
    let group_index = req.param("group_index");
    let group_size = req.param("group_size");

    let group = await Group.find({ group_index: group_index });
    if (group.length > 0)
      res.status(460).send("Group with the same index already exist!");
    else {
      group = await Group.create({
        group_index: group_index,
        group_size: group_size,
      }).fetch();
      res.json(group);
    }
  },

  show: async function(req, res) {
    let group_index = req.param("group_index");
    let groups = group_index == null ? await Group.find({}) : await Group.find({group_index: group_index});

    res.json(groups);
  },

  update: async function(req, res) {
    let group_index = req.param("group_index");
    let group_size = req.param("group_size");

    let group = await Group.update({group_index: group_index}).set({group_size: group_size}).fetch();

    res.json(group);
  },

  destroy: async function(req, res) {
    let group_index = req.param("group_index");

    let group = await Group.destroy({group_index: group_index}).fetch();

    res.json(group);
  },
};

