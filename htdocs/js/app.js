/**
 *  @fileOverview App creation and initialization
 */

/**
 * Global application namespace
 * @type {Object}
 */
var App = {};

$(function () {
    // ensure that modules start when DOM is ready
    App.modules.start();
});
