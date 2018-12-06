/**
 * PossibleVenuesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  /**
   *   CRUD METHODS (FOR AJAX PURPOSES)
   */
  show: async function(req, res) {
    let lesson_types_id = req.param("lesson_types_id");
    let possible_venues = await PossibleVenues.find({lesson_types_id: lesson_types_id});
    let venues_id_arr = [];
    for (let i = 0; i < possible_venues.length; i++) {
      venues_id_arr.push(possible_venues[i].venue_id);
    }

    let venues = await Venue.find({id: venues_id_arr});

    res.json(venues);
  },

};

