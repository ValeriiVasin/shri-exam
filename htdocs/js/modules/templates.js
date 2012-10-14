/**
 * @fileOverview Module is responsible for unobtrusive templates loading
 *
 * @todo  Realize ajax loading of template, based on it's name
 */
;(function ($) {

    App.modules.define('templates', function (app) {
        var templates = {}; // cache for templates

        function get(name) {
            var _element = null;

            if (!templates[name]) {
                _element = $('script[data-name="'+ name +'"]');
                if (_element.length === 0) {
                    throw new Error('Template ' + name + ' not found');
                }
                templates[name] = _.template( _element.html() );
            }

            return templates[name];
        }

        return {
            init: $.noop,
            get: get
        };
    });

}(jQuery));
