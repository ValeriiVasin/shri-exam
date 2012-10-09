/**
 * @author Valeriy Vasin (invis89@gmail.com)
 * @fileOverview Simple modules dependencies managment tool
 */

var App = App || {},
    modules;

App.modules = (function () {
    var _modules = {},  // cache of modules
        _debug = false; // debug mode

    return {
        /**
         * Module definition
         * @param  {String} name         Module name
         * @param  {Array} dependencies  Module dependencies
         * @param  {Function} creator    Module initialize function
         * @return {Object}              Hash with module methods
         */
        define: function (name, dependencies, creator) {
            var nested,             // placeholder array for nested modules (module and submodule)
                nestedLen,          // cached length for nested modules
                submodule = false;  // will be changed to true, if it's a submodule

            if (typeof dependencies === 'function') {
                creator = dependencies;
                dependencies = [];
            }

            nested = name.split('.');
            nestedLen = nested.length;
            if (nestedLen > 2) {
                throw new Error('Probably you have defined more than two levels of nesting.');
            } else if (nestedLen === 2) {
                // submodule
                dependencies.unshift(nested[0]);
                submodule = true;
            }

            _modules[name] = {
                create: creator,
                dependencies: dependencies,
                submodule: submodule,
                instance: null
            };
        },

        /**
         * Start module(-s)
         * @param  {String/Array} name Name of module(-s) to start
         */
        start: function (name) {
            var that = this,
                type = Object.prototype.toString.call(name).slice(8, -1).toLowerCase(),
                prop,
                args;

            switch (type) {
                case 'string':
                    // start single module
                    // check for module initialization

                    if ( !_modules[name] ) {
                        throw new Error('Module '+ name + ' has not been defined or added on the page. Define it and add on the page, please.');
                    }

                    if ( _modules[name].instance !== null ) {
                        if (_debug) {
                            console.log('module '+ name +' has been started yet');
                        }
                        return;
                    }

                    // start all dependencies
                    if (_modules[name].dependencies.length) {
                        // prevent containing self module inside of dependencies
                        if ( _modules[name].dependencies.indexOf(name) !== -1 ) {
                            throw new Error('Module '+ name + ' contains itself inside of dependencies');
                        }
                        this.start(_modules[name].dependencies);
                    }

                    // start module/submodule
                    args = [App];
                    // push all dependencies as arguments in defined order
                    _modules[name].dependencies.forEach(function (dependency) {
                        args.push( _modules[dependency].instance );
                    });

                    if (_modules[name].submodule ) {
                        args.push( _modules[ name.split('.')[0] ].instance );
                    }
                    _modules[name].instance = _modules[name].create.apply(this, args);

                    if (typeof _modules[name].instance.init !== 'function') {
                        throw new Error('Module '+ name +' should have init method');
                    }
                    _modules[name].instance.init();
                    if (_debug) {
                        console.log("Module " + name + ' started!');
                    }
                    break;

                case 'array':
                    // start few modules
                    name.forEach(function (moduleName) {
                        that.start(moduleName);
                    });
                    break;

                default:
                    // start all modules
                    for (prop in _modules) {
                        if (_modules.hasOwnProperty(prop)) {
                            this.start(prop);
                        }
                    }
                    break;
            }
        },

        /**
         * Get module instance
         * @param  {String} name Module name
         * @return {Object}      Module instance (hash with methods)
         */
        get: function (name) {
            return _modules[name] ? _modules[name].instance : null;
        }
    };
}());
