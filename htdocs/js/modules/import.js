/**
 * Data import module
 */
;(function ($) {
    'use strict';

    App.modules.define('import', ['lectures'], function (app, lectures) {
        var el = {};

        /**
         * Prevent default action for tab key
         * and add 4 spaces instead
         */
        function catchTabKey(e) {
            if (e.which === 9) {
                $(this).replaceSelectedText('    ');
                e.preventDefault();
            }
        }

        function importData() {
            var data = el.textarea.val(),
                lecturesJSON = null;

            try {
                lecturesJSON = JSON.parse( $.trim(data) );
                if ($.type(lecturesJSON) !== 'array') {
                    throw new Error('You have been provided not array');
                }

                if ( lecturesJSON.every(lectures.check) ) {
                    app.publish('lectures:import', { data: lecturesJSON });
                } else {
                    throw new Error('Incorrect JSON syntax in import data');
                }
            } catch (err) {
                /**
                 * @todo Error processing
                 */
            }
        }

        return {
            init: function () {
                el.textarea = $(document.getElementById('import-area'));
                el.submit = $('.import-submit');

                el.textarea.on('keydown', catchTabKey);
                el.submit.on('click', importData);
            }
        };
    });

}(jQuery));
