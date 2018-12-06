/**
 * VenueController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  /**
   *  WEB URL ROUTES
   */

  index: async function(req, res) {
    let venues = await Venue.find({});

    res.view({
      venues: venues,
    });
  },

  newVenue: async function(req, res) {
    res.view('venue/new_venue');
  },

  importExcel: async function(req, res) {
    req.file("venueFile").upload({
        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads'),
        saveAs: req.file("venueFile")._files[0].stream.filename,
      },
      function (err, uploadedFile) {
        if (err) {
          return res.serverError(err);
        } else {
          let venue_filename = uploadedFile[0].filename;
          let xtension = venue_filename.slice(venue_filename.lastIndexOf(".") + 1, venue_filename.length);

          let Excel = require('exceljs');
          let path = require('path');
          let filePath = path.resolve("assets/uploads", venue_filename);

          if (xtension == "xlsx") {
            let workbook = new Excel.Workbook();
            workbook.xlsx.readFile(filePath)
              .then(async function() {
                let worksheet = workbook.getWorksheet(1);
                let row_index = 1;
                if (worksheet.getRow(1).getCell(1).value == "VENUE_NAME")
                  row_index = 2;
                for (row_index; row_index <= worksheet.rowCount; row_index++) {
                  let row = worksheet.getRow(row_index);
                  try {
                    await Venue.findOrCreate(
                      {
                        name: row.getCell(1).value,
                      },
                      {
                        name: row.getCell(1).value,
                        type: row.getCell(2).value,
                        capacity: row.getCell(3).value,
                      });
                  } catch (err) {
                    res.serverError(err);
                    break;
                  }
                }
                res.redirect('/venue');
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
    let venue_name = req.param("venue_name");
    let venue_type = req.param("venue_type");
    let venue_capacity = req.param("venue_capacity");

    let venue = await Venue.find({ name: venue_name, type: venue_type, capacity: venue_capacity, });
    if (venue.length > 0)
      res.status(460).send("Venue already exist! Please try again.");
    else {
      venue = await Venue.create({
        name: venue_name,
        type: venue_type,
        capacity: venue_capacity,
      }).fetch();
      res.json(venue);
    }
  },

  show: async function(req, res) {
  },

  update: async function(req, res) {
    let venue_id = req.param("venue_id");
    let venue_name = req.param("venue_name");
    let venue_type = req.param("venue_type");
    let venue_capacity = req.param("venue_capacity");

    let venue = await Venue.update({id: venue_id}).set({name: venue_name, type: venue_type, capacity: venue_capacity}).fetch();

    res.json(venue);
  },

  destroy: async function(req, res) {
    let venue_id = req.param("venueid");

    let venue = await Venue.destroy({id: venue_id}).fetch();

    res.json(venue);
  },
};

