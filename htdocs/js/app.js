/**
 *  @fileOverview App creation and initialization
 */

/**
 * Global application namespace
 * @type {Object}
 */
var App = {};

$(function () {
    'use strict';

    // ensure that modules start when DOM is ready
    App.modules.start();
    // start routing
    App.publish('routerstart');
});
