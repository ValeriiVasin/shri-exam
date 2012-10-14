;(function ($) {
    'use strict';

    App.modules.define('lectures.ui', ['utils', 'templates'], function (app, lectures, utils, templates) {
        var el = {},
            tmpl = {};

        // group lectures template
        tmpl.group = templates.get('lectures-group');

        /**
         * Render lectures
         */
        function render() {
            el.list.html( lectures.groupLecturesForUI().map(tmpl.group).join('') );
        }

        return {
            init: function () {
                el.list = $('.b-content-lectures-list');
                app.subscribe('ui:render', render);

                // initial rendering
                render();
            }
        };
    });

}(jQuery));
