/**
 * PossibleGroupsController
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
    let possible_groups = await PossibleGroups.find({lesson_types_id: lesson_types_id});

    res.json(possible_groups);
  },

};

