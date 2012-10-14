/**
 * Data import module
 */
;(function ($) {
    'use strict';

    App.modules.define('import', ['lectures', 'templates'], function (app, lectures, templates) {
        var el = {},
            errorTmpl = templates.get('import-error');

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
            var data = $.trim( el.textarea.val() ),
                lecturesJSON = null;

            if (data.length === 0) {
                return handleError('Ошибка! Нет данных для импорта.');
            }

            try {
                lecturesJSON = JSON.parse( $.trim(data) );
                if ($.type(lecturesJSON) !== 'array') {
                    return handleError("JSON-структура обязательна должна быть массивом объектов.");
                }

                // we are free to add empty array and perform "clear" of lectures
                if ( lecturesJSON.every(lectures.check) ) {
                    app.publish('lectures:import', { lectures: lecturesJSON });
                } else {
                    return handleError( 'Некоторые обязательные поля не были указаны или формат данных не был соблюден.'+
                                        'Обратите внимание на формат даты: dd.mm.yyyy и формат времени: hh:mm.');
                }
            } catch (err) {
                 handleError("Ошибка при обработки данных. Проверьте правильность JSON-структуры.");
            }
        }

        /**
         * Import error processing
         * @param  {String} message Message to show
         */
        function handleError(message) {
            el.message.html( errorTmpl({ message: message }) );
        }

        return {
            init: function () {
                el.textarea = $(document.getElementById('import-area'));
                el.submit = $('.import-submit');
                el.message = $('.b-import-error');

                el.textarea.on('keydown', catchTabKey);
                el.submit.on('click', importData);
            }
        };
    });

}(jQuery));
