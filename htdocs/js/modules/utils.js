;(function ($) {
    'use strict';

    App.modules.define('utils', function () {
        var formatDate;

        /**
         * Format time string from date object
         * @param  {Date} date   Date to format
         * @return {String}      Formated time string, e.g. 19:00
         */
        function formatTime(date) {
            if ( $.type(date) !== 'date' ) {
                throw new Error('Argument should be date object');
            }

            return [date.getHours(), date.getMinutes()]
                    .map(_pad)
                    .join(':');
        }

        formatDate = (function () {
            var MONTHES = [ 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
                // we will get 0 for Sunday
                DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

            /**
             * Format date
             * @param   {Date}  date Date to be formatted
             * @param  {String} type Type, that should be applied. Default: 'short'
             *                       e.g. 'short' (21.10.2012) or 'long' (21 октября 2012)
             *
             * @return {String} Formatted date string
             */
            return function (date, type) {
                type = type || 'short';
                if (type === 'short') {
                    return [ date.getDate(), date.getMonth() + 1, date.getFullYear() ]
                            .map(_pad)
                            .join('.');
                } else {
                    return date.getDate() + ' ' + MONTHES[ date.getMonth() ] + ', ' + DAYS[ date.getDay() ];
                }
            };
        }());

        /**
         * Add leading zeros to number until it will have correct length
         * @param  {Number/String} value Any number or stringified number
         * @param {Number} length Needed length
         * @param {String} symbol Symbol for padding
         * @return {String}       Value with leading zeros
         */
        function pad(value, length, symbol) {
            length = length || 2;
            symbol = symbol || '0';

            value = value.toString();
            while (value.length < length) {
                value = symbol + value;
            }

            return value;
        }

        /**
         * Special usecase of pad function for usage inside of map for numbers
         * @param  {Number} value  Number to be formatted
         * @return {String}        Number with leading zeros
         */
        function _pad(value) {
            return pad(value);
        }


        return {
            init: $.noop,
            pad: pad,
            formatDate: formatDate,
            formatTime: formatTime
        };
    });

}(jQuery));
