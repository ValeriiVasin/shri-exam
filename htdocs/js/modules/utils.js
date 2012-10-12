;(function ($) {
    'use strict';

    App.modules.define('utils', function () {

        return {
            init: $.noop,

            /**
             * Add leading zeros to number until it will have correct length
             * @param  {Number/String} value Any number or stringified number
             * @param {Number} length Needed length
             * @param {String} symbol Symbol for padding
             * @return {String}       Value with leading zeros
             */
            pad: function (value, length, symbol) {
                length = length || 2;
                symbol = symbol || '0';

                value = value.toString();
                while (value.length < length) {
                    value = symbol + value;
                }

                return value;
            }
        };
    });

}(jQuery));
