/**
 * @fileOverview Module is responsible for navigation:
 * choose what menu item should be highlighted and
 * what block of content should be displayed.
 */

;(function ($) {
    'use strict';

    App.modules.define('navigation', function (app) {
        var el = {},
            items = ['lectures', 'import', 'export'];

        /**
         * Reaction for change navigation state
         * @param  {Object} data Event object, containts {hash, suffix}
         */
        function change(data) {
            var _class = data.suffix === 'main' ? 'lectures' : data.suffix,
                order = items.indexOf(_class);

            // incorrect item has been provided
            // change it to default
            if (order === -1) {
                order = 0;
                _class = 'lectures';
            }

            // show page content
            el.content.removeClass()
                       .addClass('b-content')
                       .addClass('b-' + _class);

            // highlight corresponding menu item
            el.menuItems
                .filter('.active')
                .removeClass()
                .end()
                .eq(order)
                .addClass('active');

        }

        return {
            init: function () {
                el.content = $('.b-content');
                el.menuItems = $('#menu > li');

                app.subscribe('router_change', change);
            }
        };
    });

}(jQuery));
