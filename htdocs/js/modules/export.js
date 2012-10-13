;(function ($) {
    'use strict';

    App.modules.define('export', ['lectures', 'utils'], function (app, lectures, utils) {
        var el = {};

        function exportJSON() {
            var json = lectures.get();

            if (json) {
                // provide export format
                json = json.map(function (element) {
                    var _element = $.extend(true, {}, element), // copy existed object to prevent any changes
                        datetime = _element.datetime;

                    // default padding for string
                    function pad(value) {
                        return utils.pad(value);
                    }

                    _element.date = [
                            datetime.getDate(),
                            datetime.getMonth() + 1,
                            datetime.getFullYear()
                        ]
                        .map(pad)
                        .join('.');

                    _element.time = [
                            datetime.getHours(),
                            datetime.getMinutes()
                        ]
                        .map(pad)
                        .join(':');

                    delete _element.datetime;
                    delete _element.uid;

                    return _element;
                });

                // export it as code
                el.code.html( JSON.stringify(lectures.get(), undefined, 2));

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
