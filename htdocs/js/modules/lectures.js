/**
 * @fileOverview Lectures module
 */
;(function ($) {
    'use strict';

    App.modules.define('lectures', ['utils'], function (app, utils) {
        var lectures = null,    // internal object representation of stored lectures
            uid;

        /**
         * Uniq lecture ID generator
         * @return {Object.Function} Hash with get, add, has methods
         */
        uid = (function () {
            var _time = (new Date()).getTime(), // uniq value in milliseconds
                _uids = {};                     // cache structure, to prevent array indexOf search

            return {

                /**
                 * Return new
                 * @return {Number} uniq identifier for lecture
                 */
                get: function () {
                    while ( _uids[_time] ) {
                        _time += 1;
                    }
                    _uids[ _time ] = true;

                    return _time;
                },

                /**
                 * Add uid to the list
                 */
                add: function (uid) {
                    _uids[uid] = true;
                },

                /**
                 * Check for uid in the list
                 * @param  {Number}  uid Uniq lecture id
                 * @return {Boolean}     Is uid in the list or not
                 */
                has: function (uid) {
                    // nevermind on prototype keys
                    return uid in _uids;
                }
            };
        }());

        /**
         * Load lectures from localStorage and parse them
         */
        function loadLectures() {
            lectures = JSON.parse(localStorage.getItem('lectures'));
            if (lectures) {
                // parse datetime field
                lectures.forEach(function (lecture) {
                    lecture.datetime = new Date(lecture.datetime);
                });
            }
        }

        /**
         * Save lectures object to localStorage
         */
        function saveLectures() {
            localStorage.setItem('lectures', JSON.stringify(lectures));
            // rendering hook for ui module
            app.publish('ui:render');
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
         * Import lectures processing
         * @param  {Object} data Object with <data> key, that contains array of lectures
         */
        function importLectures(data) {
            var localLectures = data.data;

            // add uid and parse data into datetime field
            localLectures = localLectures.map(function (lecture) {
                var dateArray = lecture.date.split('.').map(Number),
                    timeArray = lecture.time.split(':').map(Number),
                    datetime = new Date(dateArray[2], dateArray[1] - 1, dateArray[0], timeArray[0], timeArray[1]);

                lecture.uid = uid.get();
                lecture.datetime = datetime;
                delete lecture.date;
                delete lecture.time;

                return lecture;
            });

            // overwrite global lectures
            lectures = localLectures;
            saveLectures();
        }

        /**
         * Groups lectures by date for UI simple rendering
         * @return {Array.Object} Array of groups JSON
         */
        function groupLecturesForUI() {
            var _lectures = [].concat(lectures),
                keys,
                groups = null,
                groupedLectures,
                DAY = 24 * 60 * 60 * 1000;

            /**
             * @todo Optimize sorting to prevent it each time.
             *       Possibly update lectures
             */

            // order by date
            _lectures.sort(function (a, b) {
                return a.datetime - b.datetime;
            });

            // group sorted lectures by day
            groups = _.groupBy(_lectures, function (lecture) {
                return Math.floor( lecture.datetime.getTime() / DAY );
            });

            // create array of groups
            keys = Object.keys(groups).sort();
            groupedLectures = keys.map(function (key) {
                var lectures = groups[key],
                    datetime = lectures[0].datetime,
                    // previous lecture timestamp (needed for detect empty time fields)
                    prevTimestamp = 0;

                // lectures processing
                lectures = lectures.map(function (lecture, index) {

                    // prevent changes of source
                    lecture = $.extend(true, {}, lecture);

                    // detect if previous lecture has same timestamp
                    lecture.time = prevTimestamp !== lecture.datetime.getTime() ? utils.formatTime(lecture.datetime) : false;
                    prevTimestamp = lecture.datetime.getTime();
                    delete lecture.datetime;

                    return lecture;
                });

                return {
                    date: utils.formatDate(datetime, 'long'),
                    lectures: lectures
                };
            });

            return groupedLectures;
        }

        return {
            init: function () {
                loadLectures();
                app.subscribe('lectures:import', importLectures);
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
            },

            /**
             * Interface for current lectures
             * @return {Array} Current lectures array
             */
            get: function () {
                return lectures;
            },

            groupLecturesForUI: groupLecturesForUI
        };
    });

}(jQuery));
