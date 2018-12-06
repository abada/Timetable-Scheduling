/**
 * LessonTypesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAllTypes: async function(req, res) {
    let query = "SELECT lesson_type FROM lessontypes GROUP BY lesson_type";
    let types = await LessonTypes.getDatastore().sendNativeQuery(query);

    res.json(types);
  },

  /**
   *   CRUD METHODS (FOR AJAX PURPOSES)
   */

  create: async function(req, res) {
    let lesson_type = req.param("lesson_type");
    let module_code = req.param("module_code");

    let type = await LessonTypes.create({
      lesson_type: lesson_type,
      module_code: module_code
    }).fetch();

    res.json(type);
  },

  destroy: async function(req, res) {
    let lesson_type = req.param("lesson_type");
    let module_code = req.param("module_code");

    let type = await LessonTypes.destroy({lesson_type: lesson_type, module_code: module_code}).fetch();

    res.json(type);
  },

};

