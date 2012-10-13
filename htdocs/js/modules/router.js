/**
 * @fileOverview Simplest router for hash navigation.
 * Without any fallbacks for old browsers that don't support hashchange event (IE8+).
 * When hash change takes place - we will fire special event to our app.
 */
;(function ($) {

    App.modules.define('router', function (app) {

        function hashchange() {
            var hash = location.hash,
                eventSuffix = hash.length ? hash.slice(1) : 'main';

            // fire router event with hash value as only argument
            app.publish('router:' + eventSuffix, hash);
        }

        $(window).on('hashchange', hashchange);

        return {
            init: function () {
                // provide initial router state for subscribers
                app.subscribe('routerstart', hashchange);
            }
        };
    });

}(jQuery));
