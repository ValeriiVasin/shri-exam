;(function ($) {
    'use strict';

    App.modules.define('export', ['lectures', 'utils'], function (app, lectures, utils) {
        var el = {};

        function exportJSON() {
            var json = lectures.get();

            if (json) {
                // provide export format
                json = json.map(function (element) {
                    var _element = $.extend(true, {}, element); // copy existed object to prevent any changes

                    _element.date = utils.formatDate(_element.datetime);
                    _element.time = utils.formatTime(_element.datetime);

                    delete _element.datetime;
                    delete _element.uid;

                    return _element;
                });

                // export it as code
                el.code.html( JSON.stringify(json, undefined, 4));

                // highlight code
                Prism.highlightElement( el.code.get(0) );
            }
            /**
             * @todo Provide processing when there are no lectures to export
             */
        }

        return {
            init: function () {
                el.code = $(document.getElementById('export-json'));
                app.subscribe('router:export', exportJSON);
            }
        };
    });

}(jQuery));
