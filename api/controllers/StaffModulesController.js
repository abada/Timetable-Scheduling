/**
 * StaffModulesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * CRUD Methods for AJAX Purposes
   */
  create: async function(req, res) {
    let staff_id = req.param("staff_id");
    let module_code = req.param("module_code");

    let staff_allocation = await StaffModules.create({staff_id: staff_id, module_code: module_code}).fetch();

    res.json(staff_allocation);
  },

  destroy: async function(req, res) {
    let staff_id = req.param("staff_id");
    let module_code = req.param("module_code");

    let staff_allocation = await StaffModules.destroy({staff_id: staff_id, module_code: module_code}).fetch();

    res.json(staff_allocation);
  },
};

