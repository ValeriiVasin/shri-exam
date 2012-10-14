;(function ($) {
    'use strict';

    App.modules.define('lectures.ui', ['utils', 'templates'], function (app, lectures, utils, templates) {
        var el = {},
            tmpl = {};

        // group lectures template
        tmpl.group = templates.get('lectures-group');
        // modal dialog for lecture
        tmpl.modal = templates.get('lecture-form');

        /**
         * Render lectures
         */
        function render() {
            // render only if lectures exist
            if ( lectures.get() ) {
                el.list.html( lectures.groupLecturesForUI().map(tmpl.group).join('') );
            }
        }

        /**
         * Show modal dialog for create/edit lecture
         * @param  {Number} uid Uniq identifier of the lecture. Not neccessary param
         */
        function modal(uid) {
            var data = {},
                form = null,
                errorField = null;

            if (uid) {
                $.extend(true, data, lectures.get(uid));
                data.date = utils.formatDate(data.datetime);
                data.time = utils.formatTime(data.datetime);
                data.edit = true;
            } else {
                // empty lecture
                data.date = '';
                data.time = '';
                data.lecture = { title: '', url: '' };
                data.lecturer = { name: '', site: '' };
                data.edit = false;
            }

            form = $( tmpl.modal(data) );
            errorField = form.find('.error');

            // submit handler
            form.on('click', '.b-lecture-save', function () {
                var dataToSave = null;

                /**
                 * @todo Detect dirty states of the form and update only if dirty.
                 *       Right now we overwrite lecture even nothing changed.
                 */

                // collect data from DOM
                dataToSave = {
                    date: form.find('[name="date"]').val(),
                    time: form.find('[name="time"]').val(),
                    lecture: {
                        title: form.find('[name="lecture-title"]').val(),
                        url: form.find('[name="lecture-url"]').val()
                    },
                    lecturer: {
                        name: form.find('[name="lecturer-name"]').val(),
                        site: form.find('[name="lecturer-site"]').val()
                    }
                };

                if ( !lectures.check(dataToSave) ) {
                    errorField.slideDown();
                } else {
                    // data is correct and ready to save
                    if (uid) {
                        dataToSave.uid = uid;
                        app.publish('lectures:update', { uid: uid, lecture: dataToSave });
                    } else {
                        app.publish('lectures:add', dataToSave);
                    }
                    el.modal.modal('hide');
                }
            });

            // remove lecture handler
            form.on('click', '.b-lecture-remove', function () {
                var uid = $(this).data('uid');
                app.publish('lectures:remove', uid);
            });

            el.modal.html(form).modal();
        }

        return {
            init: function () {
                el.list = $('.b-content-lectures-list');
                el.addLink = $('.b-lectures-add');
                el.modal = $('.modal');

                // edit click handler
                el.list.on('click', '.b-lecture-edit-link', function (e) {
                    modal( $(this).data('uid') );
                    e.preventDefault();
                });

                el.addLink.on('click', function () {
                    modal();
                });

                app.subscribe('ui:render', render);

                // initial rendering
                render();
            }
        };
    });

}(jQuery));
