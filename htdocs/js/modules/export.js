;(function ($) {
    'use strict';

    App.modules.define('export', ['lectures', 'utils'], function (app, lectures, utils) {
        var el = {};

        function exportJSON() {
            var json = lectures.get();

            if (json) {
                // provide export format
                json = json.map(function (element) {
                    var datetime = element.datetime;

                    // default padding for string
                    function pad(value) {
                        return utils.pad(value);
                    }

                    element.date = [
                            datetime.getDate(),
                            datetime.getMonth() + 1,
                            datetime.getFullYear()
                        ]
                        .map(pad)
                        .join('.');

                    element.time = [
                            datetime.getHours(),
                            datetime.getMinutes()
                        ]
                        .map(pad)
                        .join(':');

                    delete element.datetime;
                    delete element.uid;

                    return element;
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
                app.subscribe('export', exportJSON);
            }
        };
    });

}(jQuery));
