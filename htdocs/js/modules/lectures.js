/**
 * @fileOverview Lectures module
 */
;(function ($) {
    'use strict';

    App.modules.define('lectures', function () {
        var lectures = null;    // internal object representation of stored lectures

        /**
         * Load lectures from localStorage and parse them
         */
        function loadLectures() {

        }

        /**
         * Add lecture
         * @param {Object} json JSON representation of the lecture
         */
        function add(json) {

        }

        /**
         * Get json of the lecture with provided uid
         * @param  {Number} uid Uniq lecture identifier
         * @return {Object}     JSON representation of the lecture
         */
        function get(uid) {

        }

        /**
         * Update lecture
         * Notice: json should have <uid> field. it's necessary attribute for existed record
         * @param  {Object} json JSON representation of the lecture
         */
        function update(json) {

        }

        /**
         * Remove lecture
         * @param  {Number} uid Uniq lecture identifier
         */
        function remove(uid) {

        }

        /**
         * Reset all lectures (typically when import takes place)
         * @param  {Array} list List of lectures
         */
        function reset(list) {

        }

        return {
            init: function () {
                loadLectures();
            },

            /**
             * Check json (specific fields that always should be provided)
             * @return {Boolean} Lecture or not
             */
            check: function (json) {

                /** @todo Check is truthy value ok, or we need bool value as result */
                return  typeof json === 'object' &&

                        // date and time fields
                        json.date && json.time &&
                        /^\d{1,2}\.\d{1,2}\.\d{4}$/.test(json.date) &&
                        /^\d{1,2}:\d{2}$/.test(json.time) &&

                        // lecture fields
                        typeof json.lecture === 'object' && json.lecture.title &&

                        // lecturer fields
                        typeof json.lecturer === 'object' && json.lecturer.name;
            }
        };
    });

}(jQuery));
