/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  '/': {
    view: 'pages/homepage'
  },

  /**
   * Staff Related Routes
   **/

  '/staff': {
    controller: 'Staff',
    action: 'index',
  },

  '/staff/new_staff': {
    controller: 'Staff',
    action: 'newStaff',
  },

  '/staff/create': {
    controller: 'Staff',
    action: 'create',
  },

  '/staff/show': {
    controller: 'Staff',
    action: 'show',
  },

  '/staff/update': {
    controller: 'Staff',
    action: 'update',
  },

  '/staff/delete': {
    controller: 'Staff',
    action: 'destroy',
  },

  '/staff/import_excel': {
    controller: 'Staff',
    action: 'importExcel',
  },

  '/staff/assign_module': {
    controller: 'StaffModules',
    action: 'create',
  },

  '/staff/get_assigned_module': {
    controller: 'StaffModules',
    action: 'show',
  },

  '/staff/unassign_module': {
    controller: 'StaffModules',
    action: 'destroy',
  },


  /**
   * Module Related Routes
   */

  '/module': {
    controller: 'Module',
    action: 'index',
  },

  '/module/new_module': {
    controller: 'Module',
    action: 'newModule',
  },

  '/module/create': {
    controller: 'Module',
    action: 'create',
  },

  '/module/show': {
    controller: 'Module',
    action: 'show',
  },

  '/module/update': {
    controller: 'Module',
    action: 'update'
  },

  '/module/delete': {
    controller: 'Module',
    action: 'destroy',
  },

  '/module/import_excel': {
    controller: 'Module',
    action: 'importExcel',
  },


  /**
   * Group Related Routes
   */

  '/group': {
    controller: 'Group',
    action: 'index',
  },

  '/group/new_group': {
    controller: 'Group',
    action: 'newGroup',
  },

  '/group/create': {
    controller: 'Group',
    action: 'create',
  },

  '/group/show': {
    controller: 'Group',
    action: 'show',
  },

  '/group/update': {
    controller: 'Group',
    action: 'update',
  },

  '/group/delete': {
    controller: 'Group',
    action: 'destroy',
  },

  '/group/import_excel': {
    controller: 'Group',
    action: 'importExcel',
  },


  /**
   * Venue Related Routes
   */

  '/venue': {
    controller: 'Venue',
    action: 'index',
  },

  '/venue/new_venue': {
    controller: 'Venue',
    action: 'newVenue',
  },

  '/venue/create': {
    controller: 'Venue',
    action: 'create',
  },

  '/venue/show': {
    controller: 'Venue',
    action: 'show',
  },

  '/venue/update': {
    controller: 'Venue',
    action: 'update',
  },

  '/venue/delete': {
    controller: 'Venue',
    action: 'destroy',
  },

  '/venue/import_excel': {
    controller: 'Venue',
    action: 'importExcel',
  },


  /**
   * Lesson Types Related
   */

  '/lesson_types/create': {
    controller: 'LessonTypes',
    action: 'create',
  },

  '/lesson_types/get_all': {
    controller: 'LessonTypes',
    action: 'getAllTypes',
  },

  '/lesson_types/get_by_module': {
    controller: 'LessonTypes',
    action: 'getTypesByModule'
  },

  '/lesson_types/delete': {
    controller: 'LessonTypes',
    action: 'destroy',
  },

  /**
   * Planner Related
   */

  '/planner': {
    view: 'index',
  },

  '/planner/plan': {
    view: 'planner/plan',
  },

  '/planner/by_timeslot': {
    view: 'planner/by_timeslot',
  },

  '/planner/import_stars': {
    controller: 'Lesson',
    action: 'importStars',
  },

  /**
   * Lesson Related
   */

  '/lesson/show': {
    controller: 'Lesson',
    action: 'show',
  },

  '/lesson/update': {
    controller: 'Lesson',
    action: 'update',
  },

  '/lesson/delete': {
    controller: 'Lesson',
    action: 'destroy',
  },

  '/lesson/assign_staff': {
    controller: 'LessonStaff',
    action: 'create',
  },

  '/lesson/get_assigned_staff': {
    controller: 'LessonStaff',
    action: 'show',
  },

  '/lesson/unassign_staff': {
    controller: 'LessonStaff',
    action: 'destroy',
  },


  /**
   * Possible Venues Related
   */

  '/possible_venues/show': {
    controller: 'PossibleVenues',
    action: 'show',
  },

  /**
   * Possible Groups Related
   */

  '/possible_groups/show': {
    controller: 'PossibleGroups',
    action: 'show',
  },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
