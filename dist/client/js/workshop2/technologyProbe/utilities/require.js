'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.3.6 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, https://github.com/requirejs/requirejs/blob/master/LICENSE
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, _require, define;
(function (global, setTimeout) {
  var req,
      s,
      head,
      baseElement,
      dataMain,
      src,
      interactiveScript,
      currentlyAddingScript,
      mainScript,
      subPath,
      version = '2.3.6',
      commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg,
      cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
      jsSuffixRegExp = /\.js$/,
      currDirRegExp = /^\.\//,
      op = Object.prototype,
      ostring = op.toString,
      hasOwn = op.hasOwnProperty,
      isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
      isWebWorker = !isBrowser && typeof importScripts !== 'undefined',

  //PS3 indicates loaded and complete, but need to wait for complete
  //specifically. Sequence is 'loading', 'loaded', execution,
  // then 'complete'. The UA check is unfortunate, but not sure how
  //to feature test w/o causing perf issues.
  readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/,
      defContextName = '_',

  //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
  isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
      contexts = {},
      cfg = {},
      globalDefQueue = [],
      useInteractive = false;

  //Could match something like ')//comment', do not lose the prefix to comment.
  function commentReplace(match, singlePrefix) {
    return singlePrefix || '';
  }

  function isFunction(it) {
    return ostring.call(it) === '[object Function]';
  }

  function isArray(it) {
    return ostring.call(it) === '[object Array]';
  }

  /**
   * Helper function for iterating over an array. If the func returns
   * a true value, it will break out of the loop.
   */
  function each(ary, func) {
    if (ary) {
      var i;
      for (i = 0; i < ary.length; i += 1) {
        if (ary[i] && func(ary[i], i, ary)) {
          break;
        }
      }
    }
  }

  /**
   * Helper function for iterating over an array backwards. If the func
   * returns a true value, it will break out of the loop.
   */
  function eachReverse(ary, func) {
    if (ary) {
      var i;
      for (i = ary.length - 1; i > -1; i -= 1) {
        if (ary[i] && func(ary[i], i, ary)) {
          break;
        }
      }
    }
  }

  function hasProp(obj, prop) {
    return hasOwn.call(obj, prop);
  }

  function getOwn(obj, prop) {
    return hasProp(obj, prop) && obj[prop];
  }

  /**
   * Cycles over properties in an object and calls a function for each
   * property value. If the function returns a truthy value, then the
   * iteration is stopped.
   */
  function eachProp(obj, func) {
    var prop;
    for (prop in obj) {
      if (hasProp(obj, prop)) {
        if (func(obj[prop], prop)) {
          break;
        }
      }
    }
  }

  /**
   * Simple function to mix in properties from source into target,
   * but only if target does not already have a property of the same name.
   */
  function mixin(target, source, force, deepStringMixin) {
    if (source) {
      eachProp(source, function (value, prop) {
        if (force || !hasProp(target, prop)) {
          if (deepStringMixin && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value && !isArray(value) && !isFunction(value) && !(value instanceof RegExp)) {

            if (!target[prop]) {
              target[prop] = {};
            }
            mixin(target[prop], value, force, deepStringMixin);
          } else {
            target[prop] = value;
          }
        }
      });
    }
    return target;
  }

  //Similar to Function.prototype.bind, but the 'this' object is specified
  //first, since it is easier to read/figure out what 'this' will be.
  function bind(obj, fn) {
    return function () {
      return fn.apply(obj, arguments);
    };
  }

  function scripts() {
    return document.getElementsByTagName('script');
  }

  function defaultOnError(err) {
    throw err;
  }

  //Allow getting a global that is expressed in
  //dot notation, like 'a.b.c'.
  function getGlobal(value) {
    if (!value) {
      return value;
    }
    var g = global;
    each(value.split('.'), function (part) {
      g = g[part];
    });
    return g;
  }

  /**
   * Constructs an error with a pointer to an URL with more information.
   * @param {String} id the error ID that maps to an ID on a web page.
   * @param {String} message human readable error.
   * @param {Error} [err] the original error, if there is one.
   *
   * @returns {Error}
   */
  function makeError(id, msg, err, requireModules) {
    var e = new Error(msg + '\nhttps://requirejs.org/docs/errors.html#' + id);
    e.requireType = id;
    e.requireModules = requireModules;
    if (err) {
      e.originalError = err;
    }
    return e;
  }

  if (typeof define !== 'undefined') {
    //If a define is already in play via another AMD loader,
    //do not overwrite.
    return;
  }

  if (typeof requirejs !== 'undefined') {
    if (isFunction(requirejs)) {
      //Do not overwrite an existing requirejs instance.
      return;
    }
    cfg = requirejs;
    requirejs = undefined;
  }

  //Allow for a require config object
  if (typeof _require !== 'undefined' && !isFunction(_require)) {
    //assume it is a config object.
    cfg = _require;
    _require = undefined;
  }

  function newContext(contextName) {
    var inCheckLoaded,
        Module,
        context,
        handlers,
        checkLoadedTimeoutId,
        _config = {
      //Defaults. Do not set a default for map
      //config to speed up normalize(), which
      //will run faster if there is no default.
      waitSeconds: 7,
      baseUrl: './',
      paths: {},
      bundles: {},
      pkgs: {},
      shim: {},
      config: {}
    },
        registry = {},

    //registry of just enabled modules, to speed
    //cycle breaking code when lots of modules
    //are registered, but not activated.
    enabledRegistry = {},
        undefEvents = {},
        defQueue = [],
        _defined = {},
        urlFetched = {},
        bundlesMap = {},
        requireCounter = 1,
        unnormalizedCounter = 1;

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
      var i, part;
      for (i = 0; i < ary.length; i++) {
        part = ary[i];
        if (part === '.') {
          ary.splice(i, 1);
          i -= 1;
        } else if (part === '..') {
          // If at the start, or previous value is still ..,
          // keep them so that when converted to a path it may
          // still work when converted to a path, even though
          // as an ID it is less than ideal. In larger point
          // releases, may be better to just kick out an error.
          if (i === 0 || i === 1 && ary[2] === '..' || ary[i - 1] === '..') {
            continue;
          } else if (i > 0) {
            ary.splice(i - 1, 2);
            i -= 2;
          }
        }
      }
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @param {Boolean} applyMap apply the map config to the value. Should
     * only be done if this normalization is for a dependency ID.
     * @returns {String} normalized name
     */
    function normalize(name, baseName, applyMap) {
      var pkgMain,
          mapValue,
          nameParts,
          i,
          j,
          nameSegment,
          lastIndex,
          foundMap,
          foundI,
          foundStarMap,
          starI,
          normalizedBaseParts,
          baseParts = baseName && baseName.split('/'),
          map = _config.map,
          starMap = map && map['*'];

      //Adjust any relative paths.
      if (name) {
        name = name.split('/');
        lastIndex = name.length - 1;

        // If wanting node ID compatibility, strip .js from end
        // of IDs. Have to do this here, and not in nameToUrl
        // because node allows either .js or non .js to map
        // to same file.
        if (_config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
          name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
        }

        // Starts with a '.' so need the baseName
        if (name[0].charAt(0) === '.' && baseParts) {
          //Convert baseName to array, and lop off the last part,
          //so that . matches that 'directory' and not name of the baseName's
          //module. For instance, baseName of 'one/two/three', maps to
          //'one/two/three.js', but we want the directory, 'one/two' for
          //this normalization.
          normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
          name = normalizedBaseParts.concat(name);
        }

        trimDots(name);
        name = name.join('/');
      }

      //Apply map config if available.
      if (applyMap && map && (baseParts || starMap)) {
        nameParts = name.split('/');

        outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
          nameSegment = nameParts.slice(0, i).join('/');

          if (baseParts) {
            //Find the longest baseName segment match in the config.
            //So, do joins on the biggest to smallest lengths of baseParts.
            for (j = baseParts.length; j > 0; j -= 1) {
              mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

              //baseName segment has config, find if it has one for
              //this name.
              if (mapValue) {
                mapValue = getOwn(mapValue, nameSegment);
                if (mapValue) {
                  //Match, update name to the new value.
                  foundMap = mapValue;
                  foundI = i;
                  break outerLoop;
                }
              }
            }
          }

          //Check for a star map match, but just hold on to it,
          //if there is a shorter segment match later in a matching
          //config, then favor over this star map.
          if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
            foundStarMap = getOwn(starMap, nameSegment);
            starI = i;
          }
        }

        if (!foundMap && foundStarMap) {
          foundMap = foundStarMap;
          foundI = starI;
        }

        if (foundMap) {
          nameParts.splice(0, foundI, foundMap);
          name = nameParts.join('/');
        }
      }

      // If the name points to a package's name, use
      // the package main instead.
      pkgMain = getOwn(_config.pkgs, name);

      return pkgMain ? pkgMain : name;
    }

    function removeScript(name) {
      if (isBrowser) {
        each(scripts(), function (scriptNode) {
          if (scriptNode.getAttribute('data-requiremodule') === name && scriptNode.getAttribute('data-requirecontext') === context.contextName) {
            scriptNode.parentNode.removeChild(scriptNode);
            return true;
          }
        });
      }
    }

    function hasPathFallback(id) {
      var pathConfig = getOwn(_config.paths, id);
      if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
        //Pop off the first array value, since it failed, and
        //retry
        pathConfig.shift();
        context.require.undef(id);

        //Custom require that does not do map translation, since
        //ID is "absolute", already mapped/resolved.
        context.makeRequire(null, {
          skipMap: true
        })([id]);

        return true;
      }
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
      var prefix,
          index = name ? name.indexOf('!') : -1;
      if (index > -1) {
        prefix = name.substring(0, index);
        name = name.substring(index + 1, name.length);
      }
      return [prefix, name];
    }

    /**
     * Creates a module mapping that includes plugin prefix, module
     * name, and path. If parentModuleMap is provided it will
     * also normalize the name via require.normalize()
     *
     * @param {String} name the module name
     * @param {String} [parentModuleMap] parent module map
     * for the module name, used to resolve relative names.
     * @param {Boolean} isNormalized: is the ID already normalized.
     * This is true if this call is done for a define() module ID.
     * @param {Boolean} applyMap: apply the map config to the ID.
     * Should only be true if this map is for a dependency.
     *
     * @returns {Object}
     */
    function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
      var url,
          pluginModule,
          suffix,
          nameParts,
          prefix = null,
          parentName = parentModuleMap ? parentModuleMap.name : null,
          originalName = name,
          isDefine = true,
          normalizedName = '';

      //If no name, then it means it is a require call, generate an
      //internal name.
      if (!name) {
        isDefine = false;
        name = '_@r' + (requireCounter += 1);
      }

      nameParts = splitPrefix(name);
      prefix = nameParts[0];
      name = nameParts[1];

      if (prefix) {
        prefix = normalize(prefix, parentName, applyMap);
        pluginModule = getOwn(_defined, prefix);
      }

      //Account for relative paths if there is a base name.
      if (name) {
        if (prefix) {
          if (isNormalized) {
            normalizedName = name;
          } else if (pluginModule && pluginModule.normalize) {
            //Plugin is loaded, use its normalize method.
            normalizedName = pluginModule.normalize(name, function (name) {
              return normalize(name, parentName, applyMap);
            });
          } else {
            // If nested plugin references, then do not try to
            // normalize, as it will not normalize correctly. This
            // places a restriction on resourceIds, and the longer
            // term solution is not to normalize until plugins are
            // loaded and all normalizations to allow for async
            // loading of a loader plugin. But for now, fixes the
            // common uses. Details in #1131
            normalizedName = name.indexOf('!') === -1 ? normalize(name, parentName, applyMap) : name;
          }
        } else {
          //A regular module.
          normalizedName = normalize(name, parentName, applyMap);

          //Normalized name may be a plugin ID due to map config
          //application in normalize. The map config values must
          //already be normalized, so do not need to redo that part.
          nameParts = splitPrefix(normalizedName);
          prefix = nameParts[0];
          normalizedName = nameParts[1];
          isNormalized = true;

          url = context.nameToUrl(normalizedName);
        }
      }

      //If the id is a plugin id that cannot be determined if it needs
      //normalization, stamp it with a unique ID so two matching relative
      //ids that may conflict can be separate.
      suffix = prefix && !pluginModule && !isNormalized ? '_unnormalized' + (unnormalizedCounter += 1) : '';

      return {
        prefix: prefix,
        name: normalizedName,
        parentMap: parentModuleMap,
        unnormalized: !!suffix,
        url: url,
        originalName: originalName,
        isDefine: isDefine,
        id: (prefix ? prefix + '!' + normalizedName : normalizedName) + suffix
      };
    }

    function getModule(depMap) {
      var id = depMap.id,
          mod = getOwn(registry, id);

      if (!mod) {
        mod = registry[id] = new context.Module(depMap);
      }

      return mod;
    }

    function on(depMap, name, fn) {
      var id = depMap.id,
          mod = getOwn(registry, id);

      if (hasProp(_defined, id) && (!mod || mod.defineEmitComplete)) {
        if (name === 'defined') {
          fn(_defined[id]);
        }
      } else {
        mod = getModule(depMap);
        if (mod.error && name === 'error') {
          fn(mod.error);
        } else {
          mod.on(name, fn);
        }
      }
    }

    function onError(err, errback) {
      var ids = err.requireModules,
          notified = false;

      if (errback) {
        errback(err);
      } else {
        each(ids, function (id) {
          var mod = getOwn(registry, id);
          if (mod) {
            //Set error on module, so it skips timeout checks.
            mod.error = err;
            if (mod.events.error) {
              notified = true;
              mod.emit('error', err);
            }
          }
        });

        if (!notified) {
          req.onError(err);
        }
      }
    }

    /**
     * Internal method to transfer globalQueue items to this context's
     * defQueue.
     */
    function takeGlobalQueue() {
      //Push all the globalDefQueue items into the context's defQueue
      if (globalDefQueue.length) {
        each(globalDefQueue, function (queueItem) {
          var id = queueItem[0];
          if (typeof id === 'string') {
            context.defQueueMap[id] = true;
          }
          defQueue.push(queueItem);
        });
        globalDefQueue = [];
      }
    }

    handlers = {
      'require': function require(mod) {
        if (mod.require) {
          return mod.require;
        } else {
          return mod.require = context.makeRequire(mod.map);
        }
      },
      'exports': function exports(mod) {
        mod.usingExports = true;
        if (mod.map.isDefine) {
          if (mod.exports) {
            return _defined[mod.map.id] = mod.exports;
          } else {
            return mod.exports = _defined[mod.map.id] = {};
          }
        }
      },
      'module': function module(mod) {
        if (mod.module) {
          return mod.module;
        } else {
          return mod.module = {
            id: mod.map.id,
            uri: mod.map.url,
            config: function config() {
              return getOwn(_config.config, mod.map.id) || {};
            },
            exports: mod.exports || (mod.exports = {})
          };
        }
      }
    };

    function cleanRegistry(id) {
      //Clean up machinery used for waiting modules.
      delete registry[id];
      delete enabledRegistry[id];
    }

    function breakCycle(mod, traced, processed) {
      var id = mod.map.id;

      if (mod.error) {
        mod.emit('error', mod.error);
      } else {
        traced[id] = true;
        each(mod.depMaps, function (depMap, i) {
          var depId = depMap.id,
              dep = getOwn(registry, depId);

          //Only force things that have not completed
          //being defined, so still in the registry,
          //and only if it has not been matched up
          //in the module already.
          if (dep && !mod.depMatched[i] && !processed[depId]) {
            if (getOwn(traced, depId)) {
              mod.defineDep(i, _defined[depId]);
              mod.check(); //pass false?
            } else {
              breakCycle(dep, traced, processed);
            }
          }
        });
        processed[id] = true;
      }
    }

    function checkLoaded() {
      var err,
          usingPathFallback,
          waitInterval = _config.waitSeconds * 1000,

      //It is possible to disable the wait interval by using waitSeconds of 0.
      expired = waitInterval && context.startTime + waitInterval < new Date().getTime(),
          noLoads = [],
          reqCalls = [],
          stillLoading = false,
          needCycleCheck = true;

      //Do not bother if this call was a result of a cycle break.
      if (inCheckLoaded) {
        return;
      }

      inCheckLoaded = true;

      //Figure out the state of all the modules.
      eachProp(enabledRegistry, function (mod) {
        var map = mod.map,
            modId = map.id;

        //Skip things that are not enabled or in error state.
        if (!mod.enabled) {
          return;
        }

        if (!map.isDefine) {
          reqCalls.push(mod);
        }

        if (!mod.error) {
          //If the module should be executed, and it has not
          //been inited and time is up, remember it.
          if (!mod.inited && expired) {
            if (hasPathFallback(modId)) {
              usingPathFallback = true;
              stillLoading = true;
            } else {
              noLoads.push(modId);
              removeScript(modId);
            }
          } else if (!mod.inited && mod.fetched && map.isDefine) {
            stillLoading = true;
            if (!map.prefix) {
              //No reason to keep looking for unfinished
              //loading. If the only stillLoading is a
              //plugin resource though, keep going,
              //because it may be that a plugin resource
              //is waiting on a non-plugin cycle.
              return needCycleCheck = false;
            }
          }
        }
      });

      if (expired && noLoads.length) {
        //If wait time expired, throw error of unloaded modules.
        err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
        err.contextName = context.contextName;
        return onError(err);
      }

      //Not expired, check for a cycle.
      if (needCycleCheck) {
        each(reqCalls, function (mod) {
          breakCycle(mod, {}, {});
        });
      }

      //If still waiting on loads, and the waiting load is something
      //other than a plugin resource, or there are still outstanding
      //scripts, then just try back later.
      if ((!expired || usingPathFallback) && stillLoading) {
        //Something is still waiting to load. Wait for it, but only
        //if a timeout is not already in effect.
        if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
          checkLoadedTimeoutId = setTimeout(function () {
            checkLoadedTimeoutId = 0;
            checkLoaded();
          }, 50);
        }
      }

      inCheckLoaded = false;
    }

    Module = function Module(map) {
      this.events = getOwn(undefEvents, map.id) || {};
      this.map = map;
      this.shim = getOwn(_config.shim, map.id);
      this.depExports = [];
      this.depMaps = [];
      this.depMatched = [];
      this.pluginMaps = {};
      this.depCount = 0;

      /* this.exports this.factory
         this.depMaps = [],
         this.enabled, this.fetched
      */
    };

    Module.prototype = {
      init: function init(depMaps, factory, errback, options) {
        options = options || {};

        //Do not do more inits if already done. Can happen if there
        //are multiple define calls for the same module. That is not
        //a normal, common case, but it is also not unexpected.
        if (this.inited) {
          return;
        }

        this.factory = factory;

        if (errback) {
          //Register for errors on this module.
          this.on('error', errback);
        } else if (this.events.error) {
          //If no errback already, but there are error listeners
          //on this module, set up an errback to pass to the deps.
          errback = bind(this, function (err) {
            this.emit('error', err);
          });
        }

        //Do a copy of the dependency array, so that
        //source inputs are not modified. For example
        //"shim" deps are passed in here directly, and
        //doing a direct modification of the depMaps array
        //would affect that config.
        this.depMaps = depMaps && depMaps.slice(0);

        this.errback = errback;

        //Indicate this module has be initialized
        this.inited = true;

        this.ignore = options.ignore;

        //Could have option to init this module in enabled mode,
        //or could have been previously marked as enabled. However,
        //the dependencies are not known until init is called. So
        //if enabled previously, now trigger dependencies as enabled.
        if (options.enabled || this.enabled) {
          //Enable this module and dependencies.
          //Will call this.check()
          this.enable();
        } else {
          this.check();
        }
      },

      defineDep: function defineDep(i, depExports) {
        //Because of cycles, defined callback for a given
        //export can be called more than once.
        if (!this.depMatched[i]) {
          this.depMatched[i] = true;
          this.depCount -= 1;
          this.depExports[i] = depExports;
        }
      },

      fetch: function fetch() {
        if (this.fetched) {
          return;
        }
        this.fetched = true;

        context.startTime = new Date().getTime();

        var map = this.map;

        //If the manager is for a plugin managed resource,
        //ask the plugin to load it now.
        if (this.shim) {
          context.makeRequire(this.map, {
            enableBuildCallback: true
          })(this.shim.deps || [], bind(this, function () {
            return map.prefix ? this.callPlugin() : this.load();
          }));
        } else {
          //Regular dependency.
          return map.prefix ? this.callPlugin() : this.load();
        }
      },

      load: function load() {
        var url = this.map.url;

        //Regular dependency.
        if (!urlFetched[url]) {
          urlFetched[url] = true;
          context.load(this.map.id, url);
        }
      },

      /**
       * Checks if the module is ready to define itself, and if so,
       * define it.
       */
      check: function check() {
        if (!this.enabled || this.enabling) {
          return;
        }

        var err,
            cjsModule,
            id = this.map.id,
            depExports = this.depExports,
            exports = this.exports,
            factory = this.factory;

        if (!this.inited) {
          // Only fetch if not already in the defQueue.
          if (!hasProp(context.defQueueMap, id)) {
            this.fetch();
          }
        } else if (this.error) {
          this.emit('error', this.error);
        } else if (!this.defining) {
          //The factory could trigger another require call
          //that would result in checking this module to
          //define itself again. If already in the process
          //of doing that, skip this work.
          this.defining = true;

          if (this.depCount < 1 && !this.defined) {
            if (isFunction(factory)) {
              //If there is an error listener, favor passing
              //to that instead of throwing an error. However,
              //only do it for define()'d  modules. require
              //errbacks should not be called for failures in
              //their callbacks (#699). However if a global
              //onError is set, use that.
              if (this.events.error && this.map.isDefine || req.onError !== defaultOnError) {
                try {
                  exports = context.execCb(id, factory, depExports, exports);
                } catch (e) {
                  err = e;
                }
              } else {
                exports = context.execCb(id, factory, depExports, exports);
              }

              // Favor return value over exports. If node/cjs in play,
              // then will not have a return value anyway. Favor
              // module.exports assignment over exports object.
              if (this.map.isDefine && exports === undefined) {
                cjsModule = this.module;
                if (cjsModule) {
                  exports = cjsModule.exports;
                } else if (this.usingExports) {
                  //exports already set the defined value.
                  exports = this.exports;
                }
              }

              if (err) {
                err.requireMap = this.map;
                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                err.requireType = this.map.isDefine ? 'define' : 'require';
                return onError(this.error = err);
              }
            } else {
              //Just a literal value
              exports = factory;
            }

            this.exports = exports;

            if (this.map.isDefine && !this.ignore) {
              _defined[id] = exports;

              if (req.onResourceLoad) {
                var resLoadMaps = [];
                each(this.depMaps, function (depMap) {
                  resLoadMaps.push(depMap.normalizedMap || depMap);
                });
                req.onResourceLoad(context, this.map, resLoadMaps);
              }
            }

            //Clean up
            cleanRegistry(id);

            this.defined = true;
          }

          //Finished the define stage. Allow calling check again
          //to allow define notifications below in the case of a
          //cycle.
          this.defining = false;

          if (this.defined && !this.defineEmitted) {
            this.defineEmitted = true;
            this.emit('defined', this.exports);
            this.defineEmitComplete = true;
          }
        }
      },

      callPlugin: function callPlugin() {
        var map = this.map,
            id = map.id,

        //Map already normalized the prefix.
        pluginMap = makeModuleMap(map.prefix);

        //Mark this as a dependency for this plugin, so it
        //can be traced for cycles.
        this.depMaps.push(pluginMap);

        on(pluginMap, 'defined', bind(this, function (plugin) {
          var load,
              normalizedMap,
              normalizedMod,
              bundleId = getOwn(bundlesMap, this.map.id),
              name = this.map.name,
              parentName = this.map.parentMap ? this.map.parentMap.name : null,
              localRequire = context.makeRequire(map.parentMap, {
            enableBuildCallback: true
          });

          //If current map is not normalized, wait for that
          //normalized name to load instead of continuing.
          if (this.map.unnormalized) {
            //Normalize the ID if the plugin allows it.
            if (plugin.normalize) {
              name = plugin.normalize(name, function (name) {
                return normalize(name, parentName, true);
              }) || '';
            }

            //prefix and name should already be normalized, no need
            //for applying map config again either.
            normalizedMap = makeModuleMap(map.prefix + '!' + name, this.map.parentMap, true);
            on(normalizedMap, 'defined', bind(this, function (value) {
              this.map.normalizedMap = normalizedMap;
              this.init([], function () {
                return value;
              }, null, {
                enabled: true,
                ignore: true
              });
            }));

            normalizedMod = getOwn(registry, normalizedMap.id);
            if (normalizedMod) {
              //Mark this as a dependency for this plugin, so it
              //can be traced for cycles.
              this.depMaps.push(normalizedMap);

              if (this.events.error) {
                normalizedMod.on('error', bind(this, function (err) {
                  this.emit('error', err);
                }));
              }
              normalizedMod.enable();
            }

            return;
          }

          //If a paths config, then just load that file instead to
          //resolve the plugin, as it is built into that paths layer.
          if (bundleId) {
            this.map.url = context.nameToUrl(bundleId);
            this.load();
            return;
          }

          load = bind(this, function (value) {
            this.init([], function () {
              return value;
            }, null, {
              enabled: true
            });
          });

          load.error = bind(this, function (err) {
            this.inited = true;
            this.error = err;
            err.requireModules = [id];

            //Remove temp unnormalized modules for this module,
            //since they will never be resolved otherwise now.
            eachProp(registry, function (mod) {
              if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                cleanRegistry(mod.map.id);
              }
            });

            onError(err);
          });

          //Allow plugins to load other code without having to know the
          //context or how to 'complete' the load.
          load.fromText = bind(this, function (text, textAlt) {
            /*jslint evil: true */
            var moduleName = map.name,
                moduleMap = makeModuleMap(moduleName),
                hasInteractive = useInteractive;

            //As of 2.1.0, support just passing the text, to reinforce
            //fromText only being called once per resource. Still
            //support old style of passing moduleName but discard
            //that moduleName in favor of the internal ref.
            if (textAlt) {
              text = textAlt;
            }

            //Turn off interactive script matching for IE for any define
            //calls in the text, then turn it back on at the end.
            if (hasInteractive) {
              useInteractive = false;
            }

            //Prime the system by creating a module instance for
            //it.
            getModule(moduleMap);

            //Transfer any config to this other module.
            if (hasProp(_config.config, id)) {
              _config.config[moduleName] = _config.config[id];
            }

            try {
              req.exec(text);
            } catch (e) {
              return onError(makeError('fromtexteval', 'fromText eval for ' + id + ' failed: ' + e, e, [id]));
            }

            if (hasInteractive) {
              useInteractive = true;
            }

            //Mark this as a dependency for the plugin
            //resource
            this.depMaps.push(moduleMap);

            //Support anonymous modules.
            context.completeLoad(moduleName);

            //Bind the value of that module to the value for this
            //resource ID.
            localRequire([moduleName], load);
          });

          //Use parentName here since the plugin's name is not reliable,
          //could be some weird string with no path that actually wants to
          //reference the parentName's path.
          plugin.load(map.name, localRequire, load, _config);
        }));

        context.enable(pluginMap, this);
        this.pluginMaps[pluginMap.id] = pluginMap;
      },

      enable: function enable() {
        enabledRegistry[this.map.id] = this;
        this.enabled = true;

        //Set flag mentioning that the module is enabling,
        //so that immediate calls to the defined callbacks
        //for dependencies do not trigger inadvertent load
        //with the depCount still being zero.
        this.enabling = true;

        //Enable each dependency
        each(this.depMaps, bind(this, function (depMap, i) {
          var id, mod, handler;

          if (typeof depMap === 'string') {
            //Dependency needs to be converted to a depMap
            //and wired up to this module.
            depMap = makeModuleMap(depMap, this.map.isDefine ? this.map : this.map.parentMap, false, !this.skipMap);
            this.depMaps[i] = depMap;

            handler = getOwn(handlers, depMap.id);

            if (handler) {
              this.depExports[i] = handler(this);
              return;
            }

            this.depCount += 1;

            on(depMap, 'defined', bind(this, function (depExports) {
              if (this.undefed) {
                return;
              }
              this.defineDep(i, depExports);
              this.check();
            }));

            if (this.errback) {
              on(depMap, 'error', bind(this, this.errback));
            } else if (this.events.error) {
              // No direct errback on this module, but something
              // else is listening for errors, so be sure to
              // propagate the error correctly.
              on(depMap, 'error', bind(this, function (err) {
                this.emit('error', err);
              }));
            }
          }

          id = depMap.id;
          mod = registry[id];

          //Skip special modules like 'require', 'exports', 'module'
          //Also, don't call enable if it is already enabled,
          //important in circular dependency cases.
          if (!hasProp(handlers, id) && mod && !mod.enabled) {
            context.enable(depMap, this);
          }
        }));

        //Enable each plugin that is used in
        //a dependency
        eachProp(this.pluginMaps, bind(this, function (pluginMap) {
          var mod = getOwn(registry, pluginMap.id);
          if (mod && !mod.enabled) {
            context.enable(pluginMap, this);
          }
        }));

        this.enabling = false;

        this.check();
      },

      on: function on(name, cb) {
        var cbs = this.events[name];
        if (!cbs) {
          cbs = this.events[name] = [];
        }
        cbs.push(cb);
      },

      emit: function emit(name, evt) {
        each(this.events[name], function (cb) {
          cb(evt);
        });
        if (name === 'error') {
          //Now that the error handler was triggered, remove
          //the listeners, since this broken Module instance
          //can stay around for a while in the registry.
          delete this.events[name];
        }
      }
    };

    function callGetModule(args) {
      //Skip modules already defined.
      if (!hasProp(_defined, args[0])) {
        getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
      }
    }

    function removeListener(node, func, name, ieName) {
      //Favor detachEvent because of IE9
      //issue, see attachEvent/addEventListener comment elsewhere
      //in this file.
      if (node.detachEvent && !isOpera) {
        //Probably IE. If not it will throw an error, which will be
        //useful to know.
        if (ieName) {
          node.detachEvent(ieName, func);
        }
      } else {
        node.removeEventListener(name, func, false);
      }
    }

    /**
     * Given an event from a script node, get the requirejs info from it,
     * and then removes the event listeners on the node.
     * @param {Event} evt
     * @returns {Object}
     */
    function getScriptData(evt) {
      //Using currentTarget instead of target for Firefox 2.0's sake. Not
      //all old browsers will be supported, but this one was easy enough
      //to support and still makes sense.
      var node = evt.currentTarget || evt.srcElement;

      //Remove the listeners once here.
      removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
      removeListener(node, context.onScriptError, 'error');

      return {
        node: node,
        id: node && node.getAttribute('data-requiremodule')
      };
    }

    function intakeDefines() {
      var args;

      //Any defined modules in the global queue, intake them now.
      takeGlobalQueue();

      //Make sure any remaining defQueue items get properly processed.
      while (defQueue.length) {
        args = defQueue.shift();
        if (args[0] === null) {
          return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
        } else {
          //args are id, deps, factory. Should be normalized by the
          //define() function.
          callGetModule(args);
        }
      }
      context.defQueueMap = {};
    }

    context = {
      config: _config,
      contextName: contextName,
      registry: registry,
      defined: _defined,
      urlFetched: urlFetched,
      defQueue: defQueue,
      defQueueMap: {},
      Module: Module,
      makeModuleMap: makeModuleMap,
      nextTick: req.nextTick,
      onError: onError,

      /**
       * Set a configuration for the context.
       * @param {Object} cfg config object to integrate.
       */
      configure: function configure(cfg) {
        //Make sure the baseUrl ends in a slash.
        if (cfg.baseUrl) {
          if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
            cfg.baseUrl += '/';
          }
        }

        // Convert old style urlArgs string to a function.
        if (typeof cfg.urlArgs === 'string') {
          var urlArgs = cfg.urlArgs;
          cfg.urlArgs = function (id, url) {
            return (url.indexOf('?') === -1 ? '?' : '&') + urlArgs;
          };
        }

        //Save off the paths since they require special processing,
        //they are additive.
        var shim = _config.shim,
            objs = {
          paths: true,
          bundles: true,
          config: true,
          map: true
        };

        eachProp(cfg, function (value, prop) {
          if (objs[prop]) {
            if (!_config[prop]) {
              _config[prop] = {};
            }
            mixin(_config[prop], value, true, true);
          } else {
            _config[prop] = value;
          }
        });

        //Reverse map the bundles
        if (cfg.bundles) {
          eachProp(cfg.bundles, function (value, prop) {
            each(value, function (v) {
              if (v !== prop) {
                bundlesMap[v] = prop;
              }
            });
          });
        }

        //Merge shim
        if (cfg.shim) {
          eachProp(cfg.shim, function (value, id) {
            //Normalize the structure
            if (isArray(value)) {
              value = {
                deps: value
              };
            }
            if ((value.exports || value.init) && !value.exportsFn) {
              value.exportsFn = context.makeShimExports(value);
            }
            shim[id] = value;
          });
          _config.shim = shim;
        }

        //Adjust packages if necessary.
        if (cfg.packages) {
          each(cfg.packages, function (pkgObj) {
            var location, name;

            pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;

            name = pkgObj.name;
            location = pkgObj.location;
            if (location) {
              _config.paths[name] = pkgObj.location;
            }

            //Save pointer to main module ID for pkg name.
            //Remove leading dot in main, so main paths are normalized,
            //and remove any trailing .js, since different package
            //envs have different conventions: some use a module name,
            //some use a file name.
            _config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main').replace(currDirRegExp, '').replace(jsSuffixRegExp, '');
          });
        }

        //If there are any "waiting to execute" modules in the registry,
        //update the maps for them, since their info, like URLs to load,
        //may have changed.
        eachProp(registry, function (mod, id) {
          //If module already has init called, since it is too
          //late to modify them, and ignore unnormalized ones
          //since they are transient.
          if (!mod.inited && !mod.map.unnormalized) {
            mod.map = makeModuleMap(id, null, true);
          }
        });

        //If a deps array or a config callback is specified, then call
        //require with those args. This is useful when require is defined as a
        //config object before require.js is loaded.
        if (cfg.deps || cfg.callback) {
          context.require(cfg.deps || [], cfg.callback);
        }
      },

      makeShimExports: function makeShimExports(value) {
        function fn() {
          var ret;
          if (value.init) {
            ret = value.init.apply(global, arguments);
          }
          return ret || value.exports && getGlobal(value.exports);
        }
        return fn;
      },

      makeRequire: function makeRequire(relMap, options) {
        options = options || {};

        function localRequire(deps, callback, errback) {
          var id, map, requireMod;

          if (options.enableBuildCallback && callback && isFunction(callback)) {
            callback.__requireJsBuild = true;
          }

          if (typeof deps === 'string') {
            if (isFunction(callback)) {
              //Invalid call
              return onError(makeError('requireargs', 'Invalid require call'), errback);
            }

            //If require|exports|module are requested, get the
            //value for them from the special handlers. Caveat:
            //this only works while module is being defined.
            if (relMap && hasProp(handlers, deps)) {
              return handlers[deps](registry[relMap.id]);
            }

            //Synchronous access to one module. If require.get is
            //available (as in the Node adapter), prefer that.
            if (req.get) {
              return req.get(context, deps, relMap, localRequire);
            }

            //Normalize module name, if it contains . or ..
            map = makeModuleMap(deps, relMap, false, true);
            id = map.id;

            if (!hasProp(_defined, id)) {
              return onError(makeError('notloaded', 'Module name "' + id + '" has not been loaded yet for context: ' + contextName + (relMap ? '' : '. Use require([])')));
            }
            return _defined[id];
          }

          //Grab defines waiting in the global queue.
          intakeDefines();

          //Mark all the dependencies as needing to be loaded.
          context.nextTick(function () {
            //Some defines could have been added since the
            //require call, collect them.
            intakeDefines();

            requireMod = getModule(makeModuleMap(null, relMap));

            //Store if map config should be applied to this require
            //call for dependencies.
            requireMod.skipMap = options.skipMap;

            requireMod.init(deps, callback, errback, {
              enabled: true
            });

            checkLoaded();
          });

          return localRequire;
        }

        mixin(localRequire, {
          isBrowser: isBrowser,

          /**
           * Converts a module name + .extension into an URL path.
           * *Requires* the use of a module name. It does not support using
           * plain URLs like nameToUrl.
           */
          toUrl: function toUrl(moduleNamePlusExt) {
            var ext,
                index = moduleNamePlusExt.lastIndexOf('.'),
                segment = moduleNamePlusExt.split('/')[0],
                isRelative = segment === '.' || segment === '..';

            //Have a file extension alias, and it is not the
            //dots from a relative path.
            if (index !== -1 && (!isRelative || index > 1)) {
              ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
              moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
            }

            return context.nameToUrl(normalize(moduleNamePlusExt, relMap && relMap.id, true), ext, true);
          },

          defined: function defined(id) {
            return hasProp(_defined, makeModuleMap(id, relMap, false, true).id);
          },

          specified: function specified(id) {
            id = makeModuleMap(id, relMap, false, true).id;
            return hasProp(_defined, id) || hasProp(registry, id);
          }
        });

        //Only allow undef on top level require calls
        if (!relMap) {
          localRequire.undef = function (id) {
            //Bind any waiting define() calls to this context,
            //fix for #408
            takeGlobalQueue();

            var map = makeModuleMap(id, relMap, true),
                mod = getOwn(registry, id);

            mod.undefed = true;
            removeScript(id);

            delete _defined[id];
            delete urlFetched[map.url];
            delete undefEvents[id];

            //Clean queued defines too. Go backwards
            //in array so that the splices do not
            //mess up the iteration.
            eachReverse(defQueue, function (args, i) {
              if (args[0] === id) {
                defQueue.splice(i, 1);
              }
            });
            delete context.defQueueMap[id];

            if (mod) {
              //Hold on to listeners in case the
              //module will be attempted to be reloaded
              //using a different config.
              if (mod.events.defined) {
                undefEvents[id] = mod.events;
              }

              cleanRegistry(id);
            }
          };
        }

        return localRequire;
      },

      /**
       * Called to enable a module if it is still in the registry
       * awaiting enablement. A second arg, parent, the parent module,
       * is passed in for context, when this method is overridden by
       * the optimizer. Not shown here to keep code compact.
       */
      enable: function enable(depMap) {
        var mod = getOwn(registry, depMap.id);
        if (mod) {
          getModule(depMap).enable();
        }
      },

      /**
       * Internal method used by environment adapters to complete a load event.
       * A load event could be a script load or just a load pass from a synchronous
       * load call.
       * @param {String} moduleName the name of the module to potentially complete.
       */
      completeLoad: function completeLoad(moduleName) {
        var found,
            args,
            mod,
            shim = getOwn(_config.shim, moduleName) || {},
            shExports = shim.exports;

        takeGlobalQueue();

        while (defQueue.length) {
          args = defQueue.shift();
          if (args[0] === null) {
            args[0] = moduleName;
            //If already found an anonymous module and bound it
            //to this name, then this is some other anon module
            //waiting for its completeLoad to fire.
            if (found) {
              break;
            }
            found = true;
          } else if (args[0] === moduleName) {
            //Found matching define call for this script!
            found = true;
          }

          callGetModule(args);
        }
        context.defQueueMap = {};

        //Do this after the cycle of callGetModule in case the result
        //of those calls/init calls changes the registry.
        mod = getOwn(registry, moduleName);

        if (!found && !hasProp(_defined, moduleName) && mod && !mod.inited) {
          if (_config.enforceDefine && (!shExports || !getGlobal(shExports))) {
            if (hasPathFallback(moduleName)) {
              return;
            } else {
              return onError(makeError('nodefine', 'No define call for ' + moduleName, null, [moduleName]));
            }
          } else {
            //A script that does not call define(), so just simulate
            //the call for it.
            callGetModule([moduleName, shim.deps || [], shim.exportsFn]);
          }
        }

        checkLoaded();
      },

      /**
       * Converts a module name to a file path. Supports cases where
       * moduleName may actually be just an URL.
       * Note that it **does not** call normalize on the moduleName,
       * it is assumed to have already been normalized. This is an
       * internal API, not a public one. Use toUrl for the public API.
       */
      nameToUrl: function nameToUrl(moduleName, ext, skipExt) {
        var paths,
            syms,
            i,
            parentModule,
            url,
            parentPath,
            bundleId,
            pkgMain = getOwn(_config.pkgs, moduleName);

        if (pkgMain) {
          moduleName = pkgMain;
        }

        bundleId = getOwn(bundlesMap, moduleName);

        if (bundleId) {
          return context.nameToUrl(bundleId, ext, skipExt);
        }

        //If a colon is in the URL, it indicates a protocol is used and it is just
        //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
        //or ends with .js, then assume the user meant to use an url and not a module id.
        //The slash is important for protocol-less URLs as well as full paths.
        if (req.jsExtRegExp.test(moduleName)) {
          //Just a plain path, not module name lookup, so just return it.
          //Add extension if it is included. This is a bit wonky, only non-.js things pass
          //an extension, this method probably needs to be reworked.
          url = moduleName + (ext || '');
        } else {
          //A module that needs to be converted to a path.
          paths = _config.paths;

          syms = moduleName.split('/');
          //For each module name segment, see if there is a path
          //registered for it. Start with most specific name
          //and work up from it.
          for (i = syms.length; i > 0; i -= 1) {
            parentModule = syms.slice(0, i).join('/');

            parentPath = getOwn(paths, parentModule);
            if (parentPath) {
              //If an array, it means there are a few choices,
              //Choose the one that is desired
              if (isArray(parentPath)) {
                parentPath = parentPath[0];
              }
              syms.splice(0, i, parentPath);
              break;
            }
          }

          //Join the path parts together, then figure out if baseUrl is needed.
          url = syms.join('/');
          url += ext || (/^data\:|^blob\:|\?/.test(url) || skipExt ? '' : '.js');
          url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : _config.baseUrl) + url;
        }

        return _config.urlArgs && !/^blob\:/.test(url) ? url + _config.urlArgs(moduleName, url) : url;
      },

      //Delegates to req.load. Broken out as a separate function to
      //allow overriding in the optimizer.
      load: function load(id, url) {
        req.load(context, id, url);
      },

      /**
       * Executes a module callback function. Broken out as a separate function
       * solely to allow the build system to sequence the files in the built
       * layer in the right sequence.
       *
       * @private
       */
      execCb: function execCb(name, callback, args, exports) {
        return callback.apply(exports, args);
      },

      /**
       * callback for script loads, used to check status of loading.
       *
       * @param {Event} evt the event from the browser for the script
       * that was loaded.
       */
      onScriptLoad: function onScriptLoad(evt) {
        //Using currentTarget instead of target for Firefox 2.0's sake. Not
        //all old browsers will be supported, but this one was easy enough
        //to support and still makes sense.
        if (evt.type === 'load' || readyRegExp.test((evt.currentTarget || evt.srcElement).readyState)) {
          //Reset interactive script so a script node is not held onto for
          //to long.
          interactiveScript = null;

          //Pull out the name of the module and the context.
          var data = getScriptData(evt);
          context.completeLoad(data.id);
        }
      },

      /**
       * Callback for script errors.
       */
      onScriptError: function onScriptError(evt) {
        var data = getScriptData(evt);
        if (!hasPathFallback(data.id)) {
          var parents = [];
          eachProp(registry, function (value, key) {
            if (key.indexOf('_@r') !== 0) {
              each(value.depMaps, function (depMap) {
                if (depMap.id === data.id) {
                  parents.push(key);
                  return true;
                }
              });
            }
          });
          return onError(makeError('scripterror', 'Script error for "' + data.id + (parents.length ? '", needed by: ' + parents.join(', ') : '"'), evt, [data.id]));
        }
      }
    };

    context.require = context.makeRequire();
    return context;
  }

  /**
   * Main entry point.
   *
   * If the only argument to require is a string, then the module that
   * is represented by that string is fetched for the appropriate context.
   *
   * If the first argument is an array, then it will be treated as an array
   * of dependency string names to fetch. An optional function callback can
   * be specified to execute when all of those dependencies are available.
   *
   * Make a local req variable to help Caja compliance (it assumes things
   * on a require that are not standardized), and to give a short
   * name for minification/local scope use.
   */
  req = requirejs = function requirejs(deps, callback, errback, optional) {

    //Find the right context, use default
    var context,
        config,
        contextName = defContextName;

    // Determine if have config object in the call.
    if (!isArray(deps) && typeof deps !== 'string') {
      // deps is a config object
      config = deps;
      if (isArray(callback)) {
        // Adjust args if there are dependencies
        deps = callback;
        callback = errback;
        errback = optional;
      } else {
        deps = [];
      }
    }

    if (config && config.context) {
      contextName = config.context;
    }

    context = getOwn(contexts, contextName);
    if (!context) {
      context = contexts[contextName] = req.s.newContext(contextName);
    }

    if (config) {
      context.configure(config);
    }

    return context.require(deps, callback, errback);
  };

  /**
   * Support require.config() to make it easier to cooperate with other
   * AMD loaders on globally agreed names.
   */
  req.config = function (config) {
    return req(config);
  };

  /**
   * Execute something after the current tick
   * of the event loop. Override for other envs
   * that have a better solution than setTimeout.
   * @param  {Function} fn function to execute later.
   */
  req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
    setTimeout(fn, 4);
  } : function (fn) {
    fn();
  };

  /**
   * Export require as a global, but only if it does not already exist.
   */
  if (!_require) {
    _require = req;
  }

  req.version = version;

  //Used to filter out dependencies that are already paths.
  req.jsExtRegExp = /^\/|:|\?|\.js$/;
  req.isBrowser = isBrowser;
  s = req.s = {
    contexts: contexts,
    newContext: newContext
  };

  //Create default context.
  req({});

  //Exports some context-sensitive methods on global require.
  each(['toUrl', 'undef', 'defined', 'specified'], function (prop) {
    //Reference from contexts instead of early binding to default context,
    //so that during builds, the latest instance of the default context
    //with its config gets used.
    req[prop] = function () {
      var ctx = contexts[defContextName];
      return ctx.require[prop].apply(ctx, arguments);
    };
  });

  if (isBrowser) {
    head = s.head = document.getElementsByTagName('head')[0];
    //If BASE tag is in play, using appendChild is a problem for IE6.
    //When that browser dies, this can be removed. Details in this jQuery bug:
    //http://dev.jquery.com/ticket/2709
    baseElement = document.getElementsByTagName('base')[0];
    if (baseElement) {
      head = s.head = baseElement.parentNode;
    }
  }

  /**
   * Any errors that require explicitly generates will be passed to this
   * function. Intercept/override it if you want custom error handling.
   * @param {Error} err the error object.
   */
  req.onError = defaultOnError;

  /**
   * Creates the node for the load command. Only used in browser envs.
   */
  req.createNode = function (config, moduleName, url) {
    var node = config.xhtml ? document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') : document.createElement('script');
    node.type = config.scriptType || 'text/javascript';
    node.charset = 'utf-8';
    node.async = true;
    return node;
  };

  /**
   * Does the request to load a module for the browser case.
   * Make this a separate function to allow other environments
   * to override it.
   *
   * @param {Object} context the require context to find state.
   * @param {String} moduleName the name of the module.
   * @param {Object} url the URL to the module.
   */
  req.load = function (context, moduleName, url) {
    var config = context && context.config || {},
        node;
    if (isBrowser) {
      //In the browser so use a script tag
      node = req.createNode(config, moduleName, url);

      node.setAttribute('data-requirecontext', context.contextName);
      node.setAttribute('data-requiremodule', moduleName);

      //Set up load listener. Test attachEvent first because IE9 has
      //a subtle issue in its addEventListener and script onload firings
      //that do not match the behavior of all other browsers with
      //addEventListener support, which fire the onload event for a
      //script right after the script execution. See:
      //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
      //UNFORTUNATELY Opera implements attachEvent but does not follow the script
      //script execution mode.
      if (node.attachEvent &&
      //Check if node.attachEvent is artificially added by custom script or
      //natively supported by browser
      //read https://github.com/requirejs/requirejs/issues/187
      //if we can NOT find [native code] then it must NOT natively supported.
      //in IE8, node.attachEvent does not have toString()
      //Note the test for "[native code" with no closing brace, see:
      //https://github.com/requirejs/requirejs/issues/273
      !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !isOpera) {
        //Probably IE. IE (at least 6-8) do not fire
        //script onload right after executing the script, so
        //we cannot tie the anonymous define call to a name.
        //However, IE reports the script as being in 'interactive'
        //readyState at the time of the define call.
        useInteractive = true;

        node.attachEvent('onreadystatechange', context.onScriptLoad);
        //It would be great to add an error handler here to catch
        //404s in IE9+. However, onreadystatechange will fire before
        //the error handler, so that does not help. If addEventListener
        //is used, then IE will fire error before load, but we cannot
        //use that pathway given the connect.microsoft.com issue
        //mentioned above about not doing the 'script execute,
        //then fire the script load event listener before execute
        //next script' that other browsers do.
        //Best hope: IE10 fixes the issues,
        //and then destroys all installs of IE 6-9.
        //node.attachEvent('onerror', context.onScriptError);
      } else {
        node.addEventListener('load', context.onScriptLoad, false);
        node.addEventListener('error', context.onScriptError, false);
      }
      node.src = url;

      //Calling onNodeCreated after all properties on the node have been
      //set, but before it is placed in the DOM.
      if (config.onNodeCreated) {
        config.onNodeCreated(node, config, moduleName, url);
      }

      //For some cache cases in IE 6-8, the script executes before the end
      //of the appendChild execution, so to tie an anonymous define
      //call to the module name (which is stored on the node), hold on
      //to a reference to this node, but clear after the DOM insertion.
      currentlyAddingScript = node;
      if (baseElement) {
        head.insertBefore(node, baseElement);
      } else {
        head.appendChild(node);
      }
      currentlyAddingScript = null;

      return node;
    } else if (isWebWorker) {
      try {
        //In a web worker, use importScripts. This is not a very
        //efficient use of importScripts, importScripts will block until
        //its script is downloaded and evaluated. However, if web workers
        //are in play, the expectation is that a build has been done so
        //that only one script needs to be loaded anyway. This may need
        //to be reevaluated if other use cases become common.

        // Post a task to the event loop to work around a bug in WebKit
        // where the worker gets garbage-collected after calling
        // importScripts(): https://webkit.org/b/153317
        setTimeout(function () {}, 0);
        importScripts(url);

        //Account for anonymous modules
        context.completeLoad(moduleName);
      } catch (e) {
        context.onError(makeError('importscripts', 'importScripts failed for ' + moduleName + ' at ' + url, e, [moduleName]));
      }
    }
  };

  function getInteractiveScript() {
    if (interactiveScript && interactiveScript.readyState === 'interactive') {
      return interactiveScript;
    }

    eachReverse(scripts(), function (script) {
      if (script.readyState === 'interactive') {
        return interactiveScript = script;
      }
    });
    return interactiveScript;
  }

  //Look for a data-main script attribute, which could also adjust the baseUrl.
  if (isBrowser && !cfg.skipDataMain) {
    //Figure out baseUrl. Get it from the script tag with require.js in it.
    eachReverse(scripts(), function (script) {
      //Set the 'head' where we can append children by
      //using the script's parent.
      if (!head) {
        head = script.parentNode;
      }

      //Look for a data-main attribute to set main script for the page
      //to load. If it is there, the path to data main becomes the
      //baseUrl, if it is not already set.
      dataMain = script.getAttribute('data-main');
      if (dataMain) {
        //Preserve dataMain in case it is a path (i.e. contains '?')
        mainScript = dataMain;

        //Set final baseUrl if there is not already an explicit one,
        //but only do so if the data-main value is not a loader plugin
        //module ID.
        if (!cfg.baseUrl && mainScript.indexOf('!') === -1) {
          //Pull off the directory of data-main for use as the
          //baseUrl.
          src = mainScript.split('/');
          mainScript = src.pop();
          subPath = src.length ? src.join('/') + '/' : './';

          cfg.baseUrl = subPath;
        }

        //Strip off any trailing .js since mainScript is now
        //like a module name.
        mainScript = mainScript.replace(jsSuffixRegExp, '');

        //If mainScript is still a path, fall back to dataMain
        if (req.jsExtRegExp.test(mainScript)) {
          mainScript = dataMain;
        }

        //Put the data-main script in the files to load.
        cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

        return true;
      }
    });
  }

  /**
   * The function that handles definitions of modules. Differs from
   * require() in that a string for the module should be the first argument,
   * and the function to execute after dependencies are loaded should
   * return a value to define the module corresponding to the first argument's
   * name.
   */
  define = function define(name, deps, callback) {
    var node, context;

    //Allow for anonymous modules
    if (typeof name !== 'string') {
      //Adjust args appropriately
      callback = deps;
      deps = name;
      name = null;
    }

    //This module may not have dependencies
    if (!isArray(deps)) {
      callback = deps;
      deps = null;
    }

    //If no name, and callback is a function, then figure out if it a
    //CommonJS thing with dependencies.
    if (!deps && isFunction(callback)) {
      deps = [];
      //Remove comments from the callback string,
      //look for require calls, and pull them into the dependencies,
      //but only if there are function args.
      if (callback.length) {
        callback.toString().replace(commentRegExp, commentReplace).replace(cjsRequireRegExp, function (match, dep) {
          deps.push(dep);
        });

        //May be a CommonJS thing even without require calls, but still
        //could use exports, and module. Avoid doing exports and module
        //work though if it just needs require.
        //REQUIRES the function to expect the CommonJS variables in the
        //order listed below.
        deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
      }
    }

    //If in IE 6-8 and hit an anonymous define() call, do the interactive
    //work.
    if (useInteractive) {
      node = currentlyAddingScript || getInteractiveScript();
      if (node) {
        if (!name) {
          name = node.getAttribute('data-requiremodule');
        }
        context = contexts[node.getAttribute('data-requirecontext')];
      }
    }

    //Always save off evaluating the def call until the script onload handler.
    //This allows multiple modules to be in a file without prematurely
    //tracing dependencies, and allows for anonymous module support,
    //where the module name is not known until the script onload event
    //occurs. If no context, use the global queue, and get it processed
    //in the onscript load callback.
    if (context) {
      context.defQueue.push([name, deps, callback]);
      context.defQueueMap[name] = true;
    } else {
      globalDefQueue.push([name, deps, callback]);
    }
  };

  define.amd = {
    jQuery: true
  };

  /**
   * Executes the text. Normally just uses eval, but can be modified
   * to use a better, environment-specific call. Only used for transpiling
   * loader plugins, not for plain JS modules.
   * @param {String} text the text to execute/evaluate.
   */
  req.exec = function (text) {
    /*jslint evil: true */
    return eval(text);
  };

  //Set up with config info.
  req(cfg);
})(undefined, typeof setTimeout === 'undefined' ? undefined : setTimeout);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlcXVpcmUuanMiXSwibmFtZXMiOlsicmVxdWlyZWpzIiwicmVxdWlyZSIsImRlZmluZSIsImdsb2JhbCIsInNldFRpbWVvdXQiLCJyZXEiLCJzIiwiaGVhZCIsImJhc2VFbGVtZW50IiwiZGF0YU1haW4iLCJzcmMiLCJpbnRlcmFjdGl2ZVNjcmlwdCIsImN1cnJlbnRseUFkZGluZ1NjcmlwdCIsIm1haW5TY3JpcHQiLCJzdWJQYXRoIiwidmVyc2lvbiIsImNvbW1lbnRSZWdFeHAiLCJjanNSZXF1aXJlUmVnRXhwIiwianNTdWZmaXhSZWdFeHAiLCJjdXJyRGlyUmVnRXhwIiwib3AiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJvc3RyaW5nIiwidG9TdHJpbmciLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsImlzQnJvd3NlciIsIndpbmRvdyIsIm5hdmlnYXRvciIsImRvY3VtZW50IiwiaXNXZWJXb3JrZXIiLCJpbXBvcnRTY3JpcHRzIiwicmVhZHlSZWdFeHAiLCJwbGF0Zm9ybSIsImRlZkNvbnRleHROYW1lIiwiaXNPcGVyYSIsIm9wZXJhIiwiY29udGV4dHMiLCJjZmciLCJnbG9iYWxEZWZRdWV1ZSIsInVzZUludGVyYWN0aXZlIiwiY29tbWVudFJlcGxhY2UiLCJtYXRjaCIsInNpbmdsZVByZWZpeCIsImlzRnVuY3Rpb24iLCJpdCIsImNhbGwiLCJpc0FycmF5IiwiZWFjaCIsImFyeSIsImZ1bmMiLCJpIiwibGVuZ3RoIiwiZWFjaFJldmVyc2UiLCJoYXNQcm9wIiwib2JqIiwicHJvcCIsImdldE93biIsImVhY2hQcm9wIiwibWl4aW4iLCJ0YXJnZXQiLCJzb3VyY2UiLCJmb3JjZSIsImRlZXBTdHJpbmdNaXhpbiIsInZhbHVlIiwiUmVnRXhwIiwiYmluZCIsImZuIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJzY3JpcHRzIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJkZWZhdWx0T25FcnJvciIsImVyciIsImdldEdsb2JhbCIsImciLCJzcGxpdCIsInBhcnQiLCJtYWtlRXJyb3IiLCJpZCIsIm1zZyIsInJlcXVpcmVNb2R1bGVzIiwiZSIsIkVycm9yIiwicmVxdWlyZVR5cGUiLCJvcmlnaW5hbEVycm9yIiwidW5kZWZpbmVkIiwibmV3Q29udGV4dCIsImNvbnRleHROYW1lIiwiaW5DaGVja0xvYWRlZCIsIk1vZHVsZSIsImNvbnRleHQiLCJoYW5kbGVycyIsImNoZWNrTG9hZGVkVGltZW91dElkIiwiY29uZmlnIiwid2FpdFNlY29uZHMiLCJiYXNlVXJsIiwicGF0aHMiLCJidW5kbGVzIiwicGtncyIsInNoaW0iLCJyZWdpc3RyeSIsImVuYWJsZWRSZWdpc3RyeSIsInVuZGVmRXZlbnRzIiwiZGVmUXVldWUiLCJkZWZpbmVkIiwidXJsRmV0Y2hlZCIsImJ1bmRsZXNNYXAiLCJyZXF1aXJlQ291bnRlciIsInVubm9ybWFsaXplZENvdW50ZXIiLCJ0cmltRG90cyIsInNwbGljZSIsIm5vcm1hbGl6ZSIsIm5hbWUiLCJiYXNlTmFtZSIsImFwcGx5TWFwIiwicGtnTWFpbiIsIm1hcFZhbHVlIiwibmFtZVBhcnRzIiwiaiIsIm5hbWVTZWdtZW50IiwibGFzdEluZGV4IiwiZm91bmRNYXAiLCJmb3VuZEkiLCJmb3VuZFN0YXJNYXAiLCJzdGFySSIsIm5vcm1hbGl6ZWRCYXNlUGFydHMiLCJiYXNlUGFydHMiLCJtYXAiLCJzdGFyTWFwIiwibm9kZUlkQ29tcGF0IiwidGVzdCIsInJlcGxhY2UiLCJjaGFyQXQiLCJzbGljZSIsImNvbmNhdCIsImpvaW4iLCJvdXRlckxvb3AiLCJyZW1vdmVTY3JpcHQiLCJzY3JpcHROb2RlIiwiZ2V0QXR0cmlidXRlIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwiaGFzUGF0aEZhbGxiYWNrIiwicGF0aENvbmZpZyIsInNoaWZ0IiwidW5kZWYiLCJtYWtlUmVxdWlyZSIsInNraXBNYXAiLCJzcGxpdFByZWZpeCIsInByZWZpeCIsImluZGV4IiwiaW5kZXhPZiIsInN1YnN0cmluZyIsIm1ha2VNb2R1bGVNYXAiLCJwYXJlbnRNb2R1bGVNYXAiLCJpc05vcm1hbGl6ZWQiLCJ1cmwiLCJwbHVnaW5Nb2R1bGUiLCJzdWZmaXgiLCJwYXJlbnROYW1lIiwib3JpZ2luYWxOYW1lIiwiaXNEZWZpbmUiLCJub3JtYWxpemVkTmFtZSIsIm5hbWVUb1VybCIsInBhcmVudE1hcCIsInVubm9ybWFsaXplZCIsImdldE1vZHVsZSIsImRlcE1hcCIsIm1vZCIsIm9uIiwiZGVmaW5lRW1pdENvbXBsZXRlIiwiZXJyb3IiLCJvbkVycm9yIiwiZXJyYmFjayIsImlkcyIsIm5vdGlmaWVkIiwiZXZlbnRzIiwiZW1pdCIsInRha2VHbG9iYWxRdWV1ZSIsInF1ZXVlSXRlbSIsImRlZlF1ZXVlTWFwIiwicHVzaCIsInVzaW5nRXhwb3J0cyIsImV4cG9ydHMiLCJtb2R1bGUiLCJ1cmkiLCJjbGVhblJlZ2lzdHJ5IiwiYnJlYWtDeWNsZSIsInRyYWNlZCIsInByb2Nlc3NlZCIsImRlcE1hcHMiLCJkZXBJZCIsImRlcCIsImRlcE1hdGNoZWQiLCJkZWZpbmVEZXAiLCJjaGVjayIsImNoZWNrTG9hZGVkIiwidXNpbmdQYXRoRmFsbGJhY2siLCJ3YWl0SW50ZXJ2YWwiLCJleHBpcmVkIiwic3RhcnRUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJub0xvYWRzIiwicmVxQ2FsbHMiLCJzdGlsbExvYWRpbmciLCJuZWVkQ3ljbGVDaGVjayIsIm1vZElkIiwiZW5hYmxlZCIsImluaXRlZCIsImZldGNoZWQiLCJkZXBFeHBvcnRzIiwicGx1Z2luTWFwcyIsImRlcENvdW50IiwiaW5pdCIsImZhY3RvcnkiLCJvcHRpb25zIiwiaWdub3JlIiwiZW5hYmxlIiwiZmV0Y2giLCJlbmFibGVCdWlsZENhbGxiYWNrIiwiZGVwcyIsImNhbGxQbHVnaW4iLCJsb2FkIiwiZW5hYmxpbmciLCJjanNNb2R1bGUiLCJkZWZpbmluZyIsImV4ZWNDYiIsInJlcXVpcmVNYXAiLCJvblJlc291cmNlTG9hZCIsInJlc0xvYWRNYXBzIiwibm9ybWFsaXplZE1hcCIsImRlZmluZUVtaXR0ZWQiLCJwbHVnaW5NYXAiLCJwbHVnaW4iLCJub3JtYWxpemVkTW9kIiwiYnVuZGxlSWQiLCJsb2NhbFJlcXVpcmUiLCJmcm9tVGV4dCIsInRleHQiLCJ0ZXh0QWx0IiwibW9kdWxlTmFtZSIsIm1vZHVsZU1hcCIsImhhc0ludGVyYWN0aXZlIiwiZXhlYyIsImNvbXBsZXRlTG9hZCIsImhhbmRsZXIiLCJ1bmRlZmVkIiwiY2IiLCJjYnMiLCJldnQiLCJjYWxsR2V0TW9kdWxlIiwiYXJncyIsInJlbW92ZUxpc3RlbmVyIiwibm9kZSIsImllTmFtZSIsImRldGFjaEV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImdldFNjcmlwdERhdGEiLCJjdXJyZW50VGFyZ2V0Iiwic3JjRWxlbWVudCIsIm9uU2NyaXB0TG9hZCIsIm9uU2NyaXB0RXJyb3IiLCJpbnRha2VEZWZpbmVzIiwibmV4dFRpY2siLCJjb25maWd1cmUiLCJ1cmxBcmdzIiwib2JqcyIsInYiLCJleHBvcnRzRm4iLCJtYWtlU2hpbUV4cG9ydHMiLCJwYWNrYWdlcyIsInBrZ09iaiIsImxvY2F0aW9uIiwibWFpbiIsImNhbGxiYWNrIiwicmV0IiwicmVsTWFwIiwicmVxdWlyZU1vZCIsIl9fcmVxdWlyZUpzQnVpbGQiLCJnZXQiLCJ0b1VybCIsIm1vZHVsZU5hbWVQbHVzRXh0IiwiZXh0IiwibGFzdEluZGV4T2YiLCJzZWdtZW50IiwiaXNSZWxhdGl2ZSIsInNwZWNpZmllZCIsImZvdW5kIiwic2hFeHBvcnRzIiwiZW5mb3JjZURlZmluZSIsInNraXBFeHQiLCJzeW1zIiwicGFyZW50TW9kdWxlIiwicGFyZW50UGF0aCIsImpzRXh0UmVnRXhwIiwidHlwZSIsInJlYWR5U3RhdGUiLCJkYXRhIiwicGFyZW50cyIsImtleSIsIm9wdGlvbmFsIiwiY3R4IiwiY3JlYXRlTm9kZSIsInhodG1sIiwiY3JlYXRlRWxlbWVudE5TIiwiY3JlYXRlRWxlbWVudCIsInNjcmlwdFR5cGUiLCJjaGFyc2V0IiwiYXN5bmMiLCJzZXRBdHRyaWJ1dGUiLCJhdHRhY2hFdmVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbk5vZGVDcmVhdGVkIiwiaW5zZXJ0QmVmb3JlIiwiYXBwZW5kQ2hpbGQiLCJnZXRJbnRlcmFjdGl2ZVNjcmlwdCIsInNjcmlwdCIsInNraXBEYXRhTWFpbiIsInBvcCIsImFtZCIsImpRdWVyeSIsImV2YWwiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUlBLFNBQUosRUFBZUMsUUFBZixFQUF3QkMsTUFBeEI7QUFDQyxXQUFVQyxNQUFWLEVBQWtCQyxVQUFsQixFQUE4QjtBQUM3QixNQUFJQyxHQUFKO0FBQUEsTUFBU0MsQ0FBVDtBQUFBLE1BQVlDLElBQVo7QUFBQSxNQUFrQkMsV0FBbEI7QUFBQSxNQUErQkMsUUFBL0I7QUFBQSxNQUF5Q0MsR0FBekM7QUFBQSxNQUNFQyxpQkFERjtBQUFBLE1BQ3FCQyxxQkFEckI7QUFBQSxNQUM0Q0MsVUFENUM7QUFBQSxNQUN3REMsT0FEeEQ7QUFBQSxNQUVFQyxVQUFVLE9BRlo7QUFBQSxNQUdFQyxnQkFBZ0IsdUNBSGxCO0FBQUEsTUFJRUMsbUJBQW1CLGdEQUpyQjtBQUFBLE1BS0VDLGlCQUFpQixPQUxuQjtBQUFBLE1BTUVDLGdCQUFnQixPQU5sQjtBQUFBLE1BT0VDLEtBQUtDLE9BQU9DLFNBUGQ7QUFBQSxNQVFFQyxVQUFVSCxHQUFHSSxRQVJmO0FBQUEsTUFTRUMsU0FBU0wsR0FBR00sY0FUZDtBQUFBLE1BVUVDLFlBQVksQ0FBQyxFQUFFLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsT0FBT0MsU0FBUCxLQUFxQixXQUF0RCxJQUFxRUQsT0FBT0UsUUFBOUUsQ0FWZjtBQUFBLE1BV0VDLGNBQWMsQ0FBQ0osU0FBRCxJQUFjLE9BQU9LLGFBQVAsS0FBeUIsV0FYdkQ7O0FBWUU7QUFDQTtBQUNBO0FBQ0E7QUFDQUMsZ0JBQWNOLGFBQWFFLFVBQVVLLFFBQVYsS0FBdUIsZUFBcEMsR0FDWixZQURZLEdBQ0cscUJBakJuQjtBQUFBLE1Ba0JFQyxpQkFB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R0FqRUQ7O0FBbUVBblIsU0FBT2dVLEdBQVAsR0FBYTtBQUNYQyxZQUFRO0FBREcsR0FBYjs7QUFJQTs7Ozs7O0FBTUE5VCxNQUFJaVAsSUFBSixHQUFXLFVBQVVMLElBQVYsRUFBZ0I7QUFDekI7QUFDQSxXQUFPbUYsS0FBS25GLElBQUwsQ0FBUDtBQUNELEdBSEQ7O0FBS0E7QUFDQTVPLE1BQUlrQyxHQUFKO0FBQ0QsQ0F0bEVBLGFBc2xFUSxPQUFPbkMsVUFBUCxLQUFzQixXQUF0QixHQUFvQ21GLFNBQXBDLEdBQWdEbkYsVUF0bEV4RCxDQUFEIiwiZmlsZSI6InJlcXVpcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogdmltOiBldDp0cz00OnN3PTQ6c3RzPTRcbiAqIEBsaWNlbnNlIFJlcXVpcmVKUyAyLjMuNiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycy5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLCBodHRwczovL2dpdGh1Yi5jb20vcmVxdWlyZWpzL3JlcXVpcmVqcy9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cbi8vTm90IHVzaW5nIHN0cmljdDogdW5ldmVuIHN0cmljdCBzdXBwb3J0IGluIGJyb3dzZXJzLCAjMzkyLCBhbmQgY2F1c2VzXG4vL3Byb2JsZW1zIHdpdGggcmVxdWlyZWpzLmV4ZWMoKS90cmFuc3BpbGVyIHBsdWdpbnMgdGhhdCBtYXkgbm90IGJlIHN0cmljdC5cbi8qanNsaW50IHJlZ2V4cDogdHJ1ZSwgbm9tZW46IHRydWUsIHNsb3BweTogdHJ1ZSAqL1xuLypnbG9iYWwgd2luZG93LCBuYXZpZ2F0b3IsIGRvY3VtZW50LCBpbXBvcnRTY3JpcHRzLCBzZXRUaW1lb3V0LCBvcGVyYSAqL1xuXG52YXIgcmVxdWlyZWpzLCByZXF1aXJlLCBkZWZpbmU7XG4oZnVuY3Rpb24gKGdsb2JhbCwgc2V0VGltZW91dCkge1xuICB2YXIgcmVxLCBzLCBoZWFkLCBiYXNlRWxlbWVudCwgZGF0YU1haW4sIHNyYyxcbiAgICBpbnRlcmFjdGl2ZVNjcmlwdCwgY3VycmVudGx5QWRkaW5nU2NyaXB0LCBtYWluU2NyaXB0LCBzdWJQYXRoLFxuICAgIHZlcnNpb24gPSAnMi4zLjYnLFxuICAgIGNvbW1lbnRSZWdFeHAgPSAvXFwvXFwqW1xcc1xcU10qP1xcKlxcL3woW146XCInPV18XilcXC9cXC8uKiQvbWcsXG4gICAgY2pzUmVxdWlyZVJlZ0V4cCA9IC9bXi5dXFxzKnJlcXVpcmVcXHMqXFwoXFxzKltcIiddKFteJ1wiXFxzXSspW1wiJ11cXHMqXFwpL2csXG4gICAganNTdWZmaXhSZWdFeHAgPSAvXFwuanMkLyxcbiAgICBjdXJyRGlyUmVnRXhwID0gL15cXC5cXC8vLFxuICAgIG9wID0gT2JqZWN0LnByb3RvdHlwZSxcbiAgICBvc3RyaW5nID0gb3AudG9TdHJpbmcsXG4gICAgaGFzT3duID0gb3AuaGFzT3duUHJvcGVydHksXG4gICAgaXNCcm93c2VyID0gISEodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50KSxcbiAgICBpc1dlYldvcmtlciA9ICFpc0Jyb3dzZXIgJiYgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnLFxuICAgIC8vUFMzIGluZGljYXRlcyBsb2FkZWQgYW5kIGNvbXBsZXRlLCBidXQgbmVlZCB0byB3YWl0IGZvciBjb21wbGV0ZVxuICAgIC8vc3BlY2lmaWNhbGx5LiBTZXF1ZW5jZSBpcyAnbG9hZGluZycsICdsb2FkZWQnLCBleGVjdXRpb24sXG4gICAgLy8gdGhlbiAnY29tcGxldGUnLiBUaGUgVUEgY2hlY2sgaXMgdW5mb3J0dW5hdGUsIGJ1dCBub3Qgc3VyZSBob3dcbiAgICAvL3RvIGZlYXR1cmUgdGVzdCB3L28gY2F1c2luZyBwZXJmIGlzc3Vlcy5cbiAgICByZWFkeVJlZ0V4cCA9IGlzQnJvd3NlciAmJiBuYXZpZ2F0b3IucGxhdGZvcm0gPT09ICdQTEFZU1RBVElPTiAzJyA/XG4gICAgICAvXmNvbXBsZXRlJC8gOiAvXihjb21wbGV0ZXxsb2FkZWQpJC8sXG4gICAgZGVmQ29udGV4dE5hbWUgPSAnXycsXG4gICAgLy9PaCB0aGUgdHJhZ2VkeSwgZGV0ZWN0aW5nIG9wZXJhLiBTZWUgdGhlIHVzYWdlIG9mIGlzT3BlcmEgZm9yIHJlYXNvbi5cbiAgICBpc09wZXJhID0gdHlwZW9mIG9wZXJhICE9PSAndW5kZWZpbmVkJyAmJiBvcGVyYS50b1N0cmluZygpID09PSAnW29iamVjdCBPcGVyYV0nLFxuICAgIGNvbnRleHRzID0ge30sXG4gICAgY2ZnID0ge30sXG4gICAgZ2xvYmFsRGVmUXVldWUgPSBbXSxcbiAgICB1c2VJbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICBcbiAgLy9Db3VsZCBtYXRjaCBzb21ldGhpbmcgbGlrZSAnKS8vY29tbWVudCcsIGRvIG5vdCBsb3NlIHRoZSBwcmVmaXggdG8gY29tbWVudC5cbiAgZnVuY3Rpb24gY29tbWVudFJlcGxhY2UobWF0Y2gsIHNpbmdsZVByZWZpeCkge1xuICAgIHJldHVybiBzaW5nbGVQcmVmaXggfHwgJyc7XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGlzRnVuY3Rpb24oaXQpIHtcbiAgICByZXR1cm4gb3N0cmluZy5jYWxsKGl0KSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfVxuICBcbiAgZnVuY3Rpb24gaXNBcnJheShpdCkge1xuICAgIHJldHVybiBvc3RyaW5nLmNhbGwoaXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9XG4gIFxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIGZvciBpdGVyYXRpbmcgb3ZlciBhbiBhcnJheS4gSWYgdGhlIGZ1bmMgcmV0dXJuc1xuICAgKiBhIHRydWUgdmFsdWUsIGl0IHdpbGwgYnJlYWsgb3V0IG9mIHRoZSBsb29wLlxuICAgKi9cbiAgZnVuY3Rpb24gZWFjaChhcnksIGZ1bmMpIHtcbiAgICBpZiAoYXJ5KSB7XG4gICAgICB2YXIgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGFyeVtpXSAmJiBmdW5jKGFyeVtpXSwgaSwgYXJ5KSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIGZvciBpdGVyYXRpbmcgb3ZlciBhbiBhcnJheSBiYWNrd2FyZHMuIElmIHRoZSBmdW5jXG4gICAqIHJldHVybnMgYSB0cnVlIHZhbHVlLCBpdCB3aWxsIGJyZWFrIG91dCBvZiB0aGUgbG9vcC5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2hSZXZlcnNlKGFyeSwgZnVuYykge1xuICAgIGlmIChhcnkpIHtcbiAgICAgIHZhciBpO1xuICAgICAgZm9yIChpID0gYXJ5Lmxlbmd0aCAtIDE7IGkgPiAtMTsgaSAtPSAxKSB7XG4gICAgICAgIGlmIChhcnlbaV0gJiYgZnVuYyhhcnlbaV0sIGksIGFyeSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgZnVuY3Rpb24gaGFzUHJvcChvYmosIHByb3ApIHtcbiAgICByZXR1cm4gaGFzT3duLmNhbGwob2JqLCBwcm9wKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gZ2V0T3duKG9iaiwgcHJvcCkge1xuICAgIHJldHVybiBoYXNQcm9wKG9iaiwgcHJvcCkgJiYgb2JqW3Byb3BdO1xuICB9XG4gIFxuICAvKipcbiAgICogQ3ljbGVzIG92ZXIgcHJvcGVydGllcyBpbiBhbiBvYmplY3QgYW5kIGNhbGxzIGEgZnVuY3Rpb24gZm9yIGVhY2hcbiAgICogcHJvcGVydHkgdmFsdWUuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGEgdHJ1dGh5IHZhbHVlLCB0aGVuIHRoZVxuICAgKiBpdGVyYXRpb24gaXMgc3RvcHBlZC5cbiAgICovXG4gIGZ1bmN0aW9uIGVhY2hQcm9wKG9iaiwgZnVuYykge1xuICAgIHZhciBwcm9wO1xuICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgIGlmIChoYXNQcm9wKG9iaiwgcHJvcCkpIHtcbiAgICAgICAgaWYgKGZ1bmMob2JqW3Byb3BdLCBwcm9wKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICAvKipcbiAgICogU2ltcGxlIGZ1bmN0aW9uIHRvIG1peCBpbiBwcm9wZXJ0aWVzIGZyb20gc291cmNlIGludG8gdGFyZ2V0LFxuICAgKiBidXQgb25seSBpZiB0YXJnZXQgZG9lcyBub3QgYWxyZWFkeSBoYXZlIGEgcHJvcGVydHkgb2YgdGhlIHNhbWUgbmFtZS5cbiAgICovXG4gIGZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlLCBmb3JjZSwgZGVlcFN0cmluZ01peGluKSB7XG4gICAgaWYgKHNvdXJjZSkge1xuICAgICAgZWFjaFByb3Aoc291cmNlLCBmdW5jdGlvbiAodmFsdWUsIHByb3ApIHtcbiAgICAgICAgaWYgKGZvcmNlIHx8ICFoYXNQcm9wKHRhcmdldCwgcHJvcCkpIHtcbiAgICAgICAgICBpZiAoZGVlcFN0cmluZ01peGluICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiZcbiAgICAgICAgICAgICFpc0FycmF5KHZhbHVlKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSkgJiZcbiAgICAgICAgICAgICEodmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghdGFyZ2V0W3Byb3BdKSB7XG4gICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWl4aW4odGFyZ2V0W3Byb3BdLCB2YWx1ZSwgZm9yY2UsIGRlZXBTdHJpbmdNaXhpbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgXG4gIC8vU2ltaWxhciB0byBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCwgYnV0IHRoZSAndGhpcycgb2JqZWN0IGlzIHNwZWNpZmllZFxuICAvL2ZpcnN0LCBzaW5jZSBpdCBpcyBlYXNpZXIgdG8gcmVhZC9maWd1cmUgb3V0IHdoYXQgJ3RoaXMnIHdpbGwgYmUuXG4gIGZ1bmN0aW9uIGJpbmQob2JqLCBmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cbiAgXG4gIGZ1bmN0aW9uIHNjcmlwdHMoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgfVxuICBcbiAgZnVuY3Rpb24gZGVmYXVsdE9uRXJyb3IoZXJyKSB7XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIFxuICAvL0FsbG93IGdldHRpbmcgYSBnbG9iYWwgdGhhdCBpcyBleHByZXNzZWQgaW5cbiAgLy9kb3Qgbm90YXRpb24sIGxpa2UgJ2EuYi5jJy5cbiAgZnVuY3Rpb24gZ2V0R2xvYmFsKHZhbHVlKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB2YXIgZyA9IGdsb2JhbDtcbiAgICBlYWNoKHZhbHVlLnNwbGl0KCcuJyksIGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICBnID0gZ1twYXJ0XTtcbiAgICB9KTtcbiAgICByZXR1cm4gZztcbiAgfVxuICBcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYW4gZXJyb3Igd2l0aCBhIHBvaW50ZXIgdG8gYW4gVVJMIHdpdGggbW9yZSBpbmZvcm1hdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIHRoZSBlcnJvciBJRCB0aGF0IG1hcHMgdG8gYW4gSUQgb24gYSB3ZWIgcGFnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgaHVtYW4gcmVhZGFibGUgZXJyb3IuXG4gICAqIEBwYXJhbSB7RXJyb3J9IFtlcnJdIHRoZSBvcmlnaW5hbCBlcnJvciwgaWYgdGhlcmUgaXMgb25lLlxuICAgKlxuICAgKiBAcmV0dXJucyB7RXJyb3J9XG4gICAqL1xuICBmdW5jdGlvbiBtYWtlRXJyb3IoaWQsIG1zZywgZXJyLCByZXF1aXJlTW9kdWxlcykge1xuICAgIHZhciBlID0gbmV3IEVycm9yKG1zZyArICdcXG5odHRwczovL3JlcXVpcmVqcy5vcmcvZG9jcy9lcnJvcnMuaHRtbCMnICsgaWQpO1xuICAgIGUucmVxdWlyZVR5cGUgPSBpZDtcbiAgICBlLnJlcXVpcmVNb2R1bGVzID0gcmVxdWlyZU1vZHVsZXM7XG4gICAgaWYgKGVycikge1xuICAgICAgZS5vcmlnaW5hbEVycm9yID0gZXJyO1xuICAgIH1cbiAgICByZXR1cm4gZTtcbiAgfVxuICBcbiAgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy9JZiBhIGRlZmluZSBpcyBhbHJlYWR5IGluIHBsYXkgdmlhIGFub3RoZXIgQU1EIGxvYWRlcixcbiAgICAvL2RvIG5vdCBvdmVyd3JpdGUuXG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICBpZiAodHlwZW9mIHJlcXVpcmVqcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihyZXF1aXJlanMpKSB7XG4gICAgICAvL0RvIG5vdCBvdmVyd3JpdGUgYW4gZXhpc3RpbmcgcmVxdWlyZWpzIGluc3RhbmNlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjZmcgPSByZXF1aXJlanM7XG4gICAgcmVxdWlyZWpzID0gdW5kZWZpbmVkO1xuICB9XG4gIFxuICAvL0FsbG93IGZvciBhIHJlcXVpcmUgY29uZmlnIG9iamVjdFxuICBpZiAodHlwZW9mIHJlcXVpcmUgIT09ICd1bmRlZmluZWQnICYmICFpc0Z1bmN0aW9uKHJlcXVpcmUpKSB7XG4gICAgLy9hc3N1bWUgaXQgaXMgYSBjb25maWcgb2JqZWN0LlxuICAgIGNmZyA9IHJlcXVpcmU7XG4gICAgcmVxdWlyZSA9IHVuZGVmaW5lZDtcbiAgfVxuICBcbiAgZnVuY3Rpb24gbmV3Q29udGV4dChjb250ZXh0TmFtZSkge1xuICAgIHZhciBpbkNoZWNrTG9hZGVkLCBNb2R1bGUsIGNvbnRleHQsIGhhbmRsZXJzLFxuICAgICAgY2hlY2tMb2FkZWRUaW1lb3V0SWQsXG4gICAgICBjb25maWcgPSB7XG4gICAgICAgIC8vRGVmYXVsdHMuIERvIG5vdCBzZXQgYSBkZWZhdWx0IGZvciBtYXBcbiAgICAgICAgLy9jb25maWcgdG8gc3BlZWQgdXAgbm9ybWFsaXplKCksIHdoaWNoXG4gICAgICAgIC8vd2lsbCBydW4gZmFzdGVyIGlmIHRoZXJlIGlzIG5vIGRlZmF1bHQuXG4gICAgICAgIHdhaXRTZWNvbmRzOiA3LFxuICAgICAgICBiYXNlVXJsOiAnLi8nLFxuICAgICAgICBwYXRoczoge30sXG4gICAgICAgIGJ1bmRsZXM6IHt9LFxuICAgICAgICBwa2dzOiB7fSxcbiAgICAgICAgc2hpbToge30sXG4gICAgICAgIGNvbmZpZzoge31cbiAgICAgIH0sXG4gICAgICByZWdpc3RyeSA9IHt9LFxuICAgICAgLy9yZWdpc3RyeSBvZiBqdXN0IGVuYWJsZWQgbW9kdWxlcywgdG8gc3BlZWRcbiAgICAgIC8vY3ljbGUgYnJlYWtpbmcgY29kZSB3aGVuIGxvdHMgb2YgbW9kdWxlc1xuICAgICAgLy9hcmUgcmVnaXN0ZXJlZCwgYnV0IG5vdCBhY3RpdmF0ZWQuXG4gICAgICBlbmFibGVkUmVnaXN0cnkgPSB7fSxcbiAgICAgIHVuZGVmRXZlbnRzID0ge30sXG4gICAgICBkZWZRdWV1ZSA9IFtdLFxuICAgICAgZGVmaW5lZCA9IHt9LFxuICAgICAgdXJsRmV0Y2hlZCA9IHt9LFxuICAgICAgYnVuZGxlc01hcCA9IHt9LFxuICAgICAgcmVxdWlyZUNvdW50ZXIgPSAxLFxuICAgICAgdW5ub3JtYWxpemVkQ291bnRlciA9IDE7XG4gICAgXG4gICAgLyoqXG4gICAgICogVHJpbXMgdGhlIC4gYW5kIC4uIGZyb20gYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cy5cbiAgICAgKiBJdCB3aWxsIGtlZXAgYSBsZWFkaW5nIHBhdGggc2VnbWVudCBpZiBhIC4uIHdpbGwgYmVjb21lXG4gICAgICogdGhlIGZpcnN0IHBhdGggc2VnbWVudCwgdG8gaGVscCB3aXRoIG1vZHVsZSBuYW1lIGxvb2t1cHMsXG4gICAgICogd2hpY2ggYWN0IGxpa2UgcGF0aHMsIGJ1dCBjYW4gYmUgcmVtYXBwZWQuIEJ1dCB0aGUgZW5kIHJlc3VsdCxcbiAgICAgKiBhbGwgcGF0aHMgdGhhdCB1c2UgdGhpcyBmdW5jdGlvbiBzaG91bGQgbG9vayBub3JtYWxpemVkLlxuICAgICAqIE5PVEU6IHRoaXMgbWV0aG9kIE1PRElGSUVTIHRoZSBpbnB1dCBhcnJheS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnkgdGhlIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdHJpbURvdHMoYXJ5KSB7XG4gICAgICB2YXIgaSwgcGFydDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGFydCA9IGFyeVtpXTtcbiAgICAgICAgaWYgKHBhcnQgPT09ICcuJykge1xuICAgICAgICAgIGFyeS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgaSAtPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHBhcnQgPT09ICcuLicpIHtcbiAgICAgICAgICAvLyBJZiBhdCB0aGUgc3RhcnQsIG9yIHByZXZpb3VzIHZhbHVlIGlzIHN0aWxsIC4uLFxuICAgICAgICAgIC8vIGtlZXAgdGhlbSBzbyB0aGF0IHdoZW4gY29udmVydGVkIHRvIGEgcGF0aCBpdCBtYXlcbiAgICAgICAgICAvLyBzdGlsbCB3b3JrIHdoZW4gY29udmVydGVkIHRvIGEgcGF0aCwgZXZlbiB0aG91Z2hcbiAgICAgICAgICAvLyBhcyBhbiBJRCBpdCBpcyBsZXNzIHRoYW4gaWRlYWwuIEluIGxhcmdlciBwb2ludFxuICAgICAgICAgIC8vIHJlbGVhc2VzLCBtYXkgYmUgYmV0dGVyIHRvIGp1c3Qga2ljayBvdXQgYW4gZXJyb3IuXG4gICAgICAgICAgaWYgKGkgPT09IDAgfHwgKGkgPT09IDEgJiYgYXJ5WzJdID09PSAnLi4nKSB8fCBhcnlbaSAtIDFdID09PSAnLi4nKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICBhcnkuc3BsaWNlKGkgLSAxLCAyKTtcbiAgICAgICAgICAgIGkgLT0gMjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSByZWxhdGl2ZSBtb2R1bGUgbmFtZSwgbGlrZSAuL3NvbWV0aGluZywgbm9ybWFsaXplIGl0IHRvXG4gICAgICogYSByZWFsIG5hbWUgdGhhdCBjYW4gYmUgbWFwcGVkIHRvIGEgcGF0aC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSB0aGUgcmVsYXRpdmUgbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlTmFtZSBhIHJlYWwgbmFtZSB0aGF0IHRoZSBuYW1lIGFyZyBpcyByZWxhdGl2ZVxuICAgICAqIHRvLlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXBwbHlNYXAgYXBwbHkgdGhlIG1hcCBjb25maWcgdG8gdGhlIHZhbHVlLiBTaG91bGRcbiAgICAgKiBvbmx5IGJlIGRvbmUgaWYgdGhpcyBub3JtYWxpemF0aW9uIGlzIGZvciBhIGRlcGVuZGVuY3kgSUQuXG4gICAgICogQHJldHVybnMge1N0cmluZ30gbm9ybWFsaXplZCBuYW1lXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplKG5hbWUsIGJhc2VOYW1lLCBhcHBseU1hcCkge1xuICAgICAgdmFyIHBrZ01haW4sIG1hcFZhbHVlLCBuYW1lUGFydHMsIGksIGosIG5hbWVTZWdtZW50LCBsYXN0SW5kZXgsXG4gICAgICAgIGZvdW5kTWFwLCBmb3VuZEksIGZvdW5kU3Rhck1hcCwgc3RhckksIG5vcm1hbGl6ZWRCYXNlUGFydHMsXG4gICAgICAgIGJhc2VQYXJ0cyA9IChiYXNlTmFtZSAmJiBiYXNlTmFtZS5zcGxpdCgnLycpKSxcbiAgICAgICAgbWFwID0gY29uZmlnLm1hcCxcbiAgICAgICAgc3Rhck1hcCA9IG1hcCAmJiBtYXBbJyonXTtcbiAgICAgIFxuICAgICAgLy9BZGp1c3QgYW55IHJlbGF0aXZlIHBhdGhzLlxuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgbmFtZSA9IG5hbWUuc3BsaXQoJy8nKTtcbiAgICAgICAgbGFzdEluZGV4ID0gbmFtZS5sZW5ndGggLSAxO1xuICAgICAgICBcbiAgICAgICAgLy8gSWYgd2FudGluZyBub2RlIElEIGNvbXBhdGliaWxpdHksIHN0cmlwIC5qcyBmcm9tIGVuZFxuICAgICAgICAvLyBvZiBJRHMuIEhhdmUgdG8gZG8gdGhpcyBoZXJlLCBhbmQgbm90IGluIG5hbWVUb1VybFxuICAgICAgICAvLyBiZWNhdXNlIG5vZGUgYWxsb3dzIGVpdGhlciAuanMgb3Igbm9uIC5qcyB0byBtYXBcbiAgICAgICAgLy8gdG8gc2FtZSBmaWxlLlxuICAgICAgICBpZiAoY29uZmlnLm5vZGVJZENvbXBhdCAmJiBqc1N1ZmZpeFJlZ0V4cC50ZXN0KG5hbWVbbGFzdEluZGV4XSkpIHtcbiAgICAgICAgICBuYW1lW2xhc3RJbmRleF0gPSBuYW1lW2xhc3RJbmRleF0ucmVwbGFjZShqc1N1ZmZpeFJlZ0V4cCwgJycpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBTdGFydHMgd2l0aCBhICcuJyBzbyBuZWVkIHRoZSBiYXNlTmFtZVxuICAgICAgICBpZiAobmFtZVswXS5jaGFyQXQoMCkgPT09ICcuJyAmJiBiYXNlUGFydHMpIHtcbiAgICAgICAgICAvL0NvbnZlcnQgYmFzZU5hbWUgdG8gYXJyYXksIGFuZCBsb3Agb2ZmIHRoZSBsYXN0IHBhcnQsXG4gICAgICAgICAgLy9zbyB0aGF0IC4gbWF0Y2hlcyB0aGF0ICdkaXJlY3RvcnknIGFuZCBub3QgbmFtZSBvZiB0aGUgYmFzZU5hbWUnc1xuICAgICAgICAgIC8vbW9kdWxlLiBGb3IgaW5zdGFuY2UsIGJhc2VOYW1lIG9mICdvbmUvdHdvL3RocmVlJywgbWFwcyB0b1xuICAgICAgICAgIC8vJ29uZS90d28vdGhyZWUuanMnLCBidXQgd2Ugd2FudCB0aGUgZGlyZWN0b3J5LCAnb25lL3R3bycgZm9yXG4gICAgICAgICAgLy90aGlzIG5vcm1hbGl6YXRpb24uXG4gICAgICAgICAgbm9ybWFsaXplZEJhc2VQYXJ0cyA9IGJhc2VQYXJ0cy5zbGljZSgwLCBiYXNlUGFydHMubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZWRCYXNlUGFydHMuY29uY2F0KG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cmltRG90cyhuYW1lKTtcbiAgICAgICAgbmFtZSA9IG5hbWUuam9pbignLycpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvL0FwcGx5IG1hcCBjb25maWcgaWYgYXZhaWxhYmxlLlxuICAgICAgaWYgKGFwcGx5TWFwICYmIG1hcCAmJiAoYmFzZVBhcnRzIHx8IHN0YXJNYXApKSB7XG4gICAgICAgIG5hbWVQYXJ0cyA9IG5hbWUuc3BsaXQoJy8nKTtcbiAgICAgICAgXG4gICAgICAgIG91dGVyTG9vcDogZm9yIChpID0gbmFtZVBhcnRzLmxlbmd0aDsgaSA+IDA7IGkgLT0gMSkge1xuICAgICAgICAgIG5hbWVTZWdtZW50ID0gbmFtZVBhcnRzLnNsaWNlKDAsIGkpLmpvaW4oJy8nKTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoYmFzZVBhcnRzKSB7XG4gICAgICAgICAgICAvL0ZpbmQgdGhlIGxvbmdlc3QgYmFzZU5hbWUgc2VnbWVudCBtYXRjaCBpbiB0aGUgY29uZmlnLlxuICAgICAgICAgICAgLy9TbywgZG8gam9pbnMgb24gdGhlIGJpZ2dlc3QgdG8gc21hbGxlc3QgbGVuZ3RocyBvZiBiYXNlUGFydHMuXG4gICAgICAgICAgICBmb3IgKGogPSBiYXNlUGFydHMubGVuZ3RoOyBqID4gMDsgaiAtPSAxKSB7XG4gICAgICAgICAgICAgIG1hcFZhbHVlID0gZ2V0T3duKG1hcCwgYmFzZVBhcnRzLnNsaWNlKDAsIGopLmpvaW4oJy8nKSk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvL2Jhc2VOYW1lIHNlZ21lbnQgaGFzIGNvbmZpZywgZmluZCBpZiBpdCBoYXMgb25lIGZvclxuICAgICAgICAgICAgICAvL3RoaXMgbmFtZS5cbiAgICAgICAgICAgICAgaWYgKG1hcFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbWFwVmFsdWUgPSBnZXRPd24obWFwVmFsdWUsIG5hbWVTZWdtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAobWFwVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIC8vTWF0Y2gsIHVwZGF0ZSBuYW1lIHRvIHRoZSBuZXcgdmFsdWUuXG4gICAgICAgICAgICAgICAgICBmb3VuZE1hcCA9IG1hcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgZm91bmRJID0gaTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyTG9vcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy9DaGVjayBmb3IgYSBzdGFyIG1hcCBtYXRjaCwgYnV0IGp1c3QgaG9sZCBvbiB0byBpdCxcbiAgICAgICAgICAvL2lmIHRoZXJlIGlzIGEgc2hvcnRlciBzZWdtZW50IG1hdGNoIGxhdGVyIGluIGEgbWF0Y2hpbmdcbiAgICAgICAgICAvL2NvbmZpZywgdGhlbiBmYXZvciBvdmVyIHRoaXMgc3RhciBtYXAuXG4gICAgICAgICAgaWYgKCFmb3VuZFN0YXJNYXAgJiYgc3Rhck1hcCAmJiBnZXRPd24oc3Rhck1hcCwgbmFtZVNlZ21lbnQpKSB7XG4gICAgICAgICAgICBmb3VuZFN0YXJNYXAgPSBnZXRPd24oc3Rhck1hcCwgbmFtZVNlZ21lbnQpO1xuICAgICAgICAgICAgc3RhckkgPSBpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCFmb3VuZE1hcCAmJiBmb3VuZFN0YXJNYXApIHtcbiAgICAgICAgICBmb3VuZE1hcCA9IGZvdW5kU3Rhck1hcDtcbiAgICAgICAgICBmb3VuZEkgPSBzdGFySTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGZvdW5kTWFwKSB7XG4gICAgICAgICAgbmFtZVBhcnRzLnNwbGljZSgwLCBmb3VuZEksIGZvdW5kTWFwKTtcbiAgICAgICAgICBuYW1lID0gbmFtZVBhcnRzLmpvaW4oJy8nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBJZiB0aGUgbmFtZSBwb2ludHMgdG8gYSBwYWNrYWdlJ3MgbmFtZSwgdXNlXG4gICAgICAvLyB0aGUgcGFja2FnZSBtYWluIGluc3RlYWQuXG4gICAgICBwa2dNYWluID0gZ2V0T3duKGNvbmZpZy5wa2dzLCBuYW1lKTtcbiAgICAgIFxuICAgICAgcmV0dXJuIHBrZ01haW4gPyBwa2dNYWluIDogbmFtZTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcmVtb3ZlU2NyaXB0KG5hbWUpIHtcbiAgICAgIGlmIChpc0Jyb3dzZXIpIHtcbiAgICAgICAgZWFjaChzY3JpcHRzKCksIGZ1bmN0aW9uIChzY3JpcHROb2RlKSB7XG4gICAgICAgICAgaWYgKHNjcmlwdE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXJlcXVpcmVtb2R1bGUnKSA9PT0gbmFtZSAmJlxuICAgICAgICAgICAgc2NyaXB0Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVxdWlyZWNvbnRleHQnKSA9PT0gY29udGV4dC5jb250ZXh0TmFtZSkge1xuICAgICAgICAgICAgc2NyaXB0Tm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdE5vZGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gaGFzUGF0aEZhbGxiYWNrKGlkKSB7XG4gICAgICB2YXIgcGF0aENvbmZpZyA9IGdldE93bihjb25maWcucGF0aHMsIGlkKTtcbiAgICAgIGlmIChwYXRoQ29uZmlnICYmIGlzQXJyYXkocGF0aENvbmZpZykgJiYgcGF0aENvbmZpZy5sZW5ndGggPiAxKSB7XG4gICAgICAgIC8vUG9wIG9mZiB0aGUgZmlyc3QgYXJyYXkgdmFsdWUsIHNpbmNlIGl0IGZhaWxlZCwgYW5kXG4gICAgICAgIC8vcmV0cnlcbiAgICAgICAgcGF0aENvbmZpZy5zaGlmdCgpO1xuICAgICAgICBjb250ZXh0LnJlcXVpcmUudW5kZWYoaWQpO1xuICAgICAgICBcbiAgICAgICAgLy9DdXN0b20gcmVxdWlyZSB0aGF0IGRvZXMgbm90IGRvIG1hcCB0cmFuc2xhdGlvbiwgc2luY2VcbiAgICAgICAgLy9JRCBpcyBcImFic29sdXRlXCIsIGFscmVhZHkgbWFwcGVkL3Jlc29sdmVkLlxuICAgICAgICBjb250ZXh0Lm1ha2VSZXF1aXJlKG51bGwsIHtcbiAgICAgICAgICBza2lwTWFwOiB0cnVlXG4gICAgICAgIH0pKFtpZF0pO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vVHVybnMgYSBwbHVnaW4hcmVzb3VyY2UgdG8gW3BsdWdpbiwgcmVzb3VyY2VdXG4gICAgLy93aXRoIHRoZSBwbHVnaW4gYmVpbmcgdW5kZWZpbmVkIGlmIHRoZSBuYW1lXG4gICAgLy9kaWQgbm90IGhhdmUgYSBwbHVnaW4gcHJlZml4LlxuICAgIGZ1bmN0aW9uIHNwbGl0UHJlZml4KG5hbWUpIHtcbiAgICAgIHZhciBwcmVmaXgsXG4gICAgICAgIGluZGV4ID0gbmFtZSA/IG5hbWUuaW5kZXhPZignIScpIDogLTE7XG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZyhpbmRleCArIDEsIG5hbWUubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbcHJlZml4LCBuYW1lXTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG1vZHVsZSBtYXBwaW5nIHRoYXQgaW5jbHVkZXMgcGx1Z2luIHByZWZpeCwgbW9kdWxlXG4gICAgICogbmFtZSwgYW5kIHBhdGguIElmIHBhcmVudE1vZHVsZU1hcCBpcyBwcm92aWRlZCBpdCB3aWxsXG4gICAgICogYWxzbyBub3JtYWxpemUgdGhlIG5hbWUgdmlhIHJlcXVpcmUubm9ybWFsaXplKClcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIHRoZSBtb2R1bGUgbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbcGFyZW50TW9kdWxlTWFwXSBwYXJlbnQgbW9kdWxlIG1hcFxuICAgICAqIGZvciB0aGUgbW9kdWxlIG5hbWUsIHVzZWQgdG8gcmVzb2x2ZSByZWxhdGl2ZSBuYW1lcy5cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGlzTm9ybWFsaXplZDogaXMgdGhlIElEIGFscmVhZHkgbm9ybWFsaXplZC5cbiAgICAgKiBUaGlzIGlzIHRydWUgaWYgdGhpcyBjYWxsIGlzIGRvbmUgZm9yIGEgZGVmaW5lKCkgbW9kdWxlIElELlxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYXBwbHlNYXA6IGFwcGx5IHRoZSBtYXAgY29uZmlnIHRvIHRoZSBJRC5cbiAgICAgKiBTaG91bGQgb25seSBiZSB0cnVlIGlmIHRoaXMgbWFwIGlzIGZvciBhIGRlcGVuZGVuY3kuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1ha2VNb2R1bGVNYXAobmFtZSwgcGFyZW50TW9kdWxlTWFwLCBpc05vcm1hbGl6ZWQsIGFwcGx5TWFwKSB7XG4gICAgICB2YXIgdXJsLCBwbHVnaW5Nb2R1bGUsIHN1ZmZpeCwgbmFtZVBhcnRzLFxuICAgICAgICBwcmVmaXggPSBudWxsLFxuICAgICAgICBwYXJlbnROYW1lID0gcGFyZW50TW9kdWxlTWFwID8gcGFyZW50TW9kdWxlTWFwLm5hbWUgOiBudWxsLFxuICAgICAgICBvcmlnaW5hbE5hbWUgPSBuYW1lLFxuICAgICAgICBpc0RlZmluZSA9IHRydWUsXG4gICAgICAgIG5vcm1hbGl6ZWROYW1lID0gJyc7XG4gICAgICBcbiAgICAgIC8vSWYgbm8gbmFtZSwgdGhlbiBpdCBtZWFucyBpdCBpcyBhIHJlcXVpcmUgY2FsbCwgZ2VuZXJhdGUgYW5cbiAgICAgIC8vaW50ZXJuYWwgbmFtZS5cbiAgICAgIGlmICghbmFtZSkge1xuICAgICAgICBpc0RlZmluZSA9IGZhbHNlO1xuICAgICAgICBuYW1lID0gJ19AcicgKyAocmVxdWlyZUNvdW50ZXIgKz0gMSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIG5hbWVQYXJ0cyA9IHNwbGl0UHJlZml4KG5hbWUpO1xuICAgICAgcHJlZml4ID0gbmFtZVBhcnRzWzBdO1xuICAgICAgbmFtZSA9IG5hbWVQYXJ0c1sxXTtcbiAgICAgIFxuICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICBwcmVmaXggPSBub3JtYWxpemUocHJlZml4LCBwYXJlbnROYW1lLCBhcHBseU1hcCk7XG4gICAgICAgIHBsdWdpbk1vZHVsZSA9IGdldE93bihkZWZpbmVkLCBwcmVmaXgpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvL0FjY291bnQgZm9yIHJlbGF0aXZlIHBhdGhzIGlmIHRoZXJlIGlzIGEgYmFzZSBuYW1lLlxuICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICAgIGlmIChpc05vcm1hbGl6ZWQpIHtcbiAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gbmFtZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBsdWdpbk1vZHVsZSAmJiBwbHVnaW5Nb2R1bGUubm9ybWFsaXplKSB7XG4gICAgICAgICAgICAvL1BsdWdpbiBpcyBsb2FkZWQsIHVzZSBpdHMgbm9ybWFsaXplIG1ldGhvZC5cbiAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gcGx1Z2luTW9kdWxlLm5vcm1hbGl6ZShuYW1lLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gbm9ybWFsaXplKG5hbWUsIHBhcmVudE5hbWUsIGFwcGx5TWFwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiBuZXN0ZWQgcGx1Z2luIHJlZmVyZW5jZXMsIHRoZW4gZG8gbm90IHRyeSB0b1xuICAgICAgICAgICAgLy8gbm9ybWFsaXplLCBhcyBpdCB3aWxsIG5vdCBub3JtYWxpemUgY29ycmVjdGx5LiBUaGlzXG4gICAgICAgICAgICAvLyBwbGFjZXMgYSByZXN0cmljdGlvbiBvbiByZXNvdXJjZUlkcywgYW5kIHRoZSBsb25nZXJcbiAgICAgICAgICAgIC8vIHRlcm0gc29sdXRpb24gaXMgbm90IHRvIG5vcm1hbGl6ZSB1bnRpbCBwbHVnaW5zIGFyZVxuICAgICAgICAgICAgLy8gbG9hZGVkIGFuZCBhbGwgbm9ybWFsaXphdGlvbnMgdG8gYWxsb3cgZm9yIGFzeW5jXG4gICAgICAgICAgICAvLyBsb2FkaW5nIG9mIGEgbG9hZGVyIHBsdWdpbi4gQnV0IGZvciBub3csIGZpeGVzIHRoZVxuICAgICAgICAgICAgLy8gY29tbW9uIHVzZXMuIERldGFpbHMgaW4gIzExMzFcbiAgICAgICAgICAgIG5vcm1hbGl6ZWROYW1lID0gbmFtZS5pbmRleE9mKCchJykgPT09IC0xID9cbiAgICAgICAgICAgICAgbm9ybWFsaXplKG5hbWUsIHBhcmVudE5hbWUsIGFwcGx5TWFwKSA6XG4gICAgICAgICAgICAgIG5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vQSByZWd1bGFyIG1vZHVsZS5cbiAgICAgICAgICBub3JtYWxpemVkTmFtZSA9IG5vcm1hbGl6ZShuYW1lLCBwYXJlbnROYW1lLCBhcHBseU1hcCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy9Ob3JtYWxpemVkIG5hbWUgbWF5IGJlIGEgcGx1Z2luIElEIGR1ZSB0byBtYXAgY29uZmlnXG4gICAgICAgICAgLy9hcHBsaWNhdGlvbiBpbiBub3JtYWxpemUuIFRoZSBtYXAgY29uZmlnIHZhbHVlcyBtdXN0XG4gICAgICAgICAgLy9hbHJlYWR5IGJlIG5vcm1hbGl6ZWQsIHNvIGRvIG5vdCBuZWVkIHRvIHJlZG8gdGhhdCBwYXJ0LlxuICAgICAgICAgIG5hbWVQYXJ0cyA9IHNwbGl0UHJlZml4KG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgICAgICBwcmVmaXggPSBuYW1lUGFydHNbMF07XG4gICAgICAgICAgbm9ybWFsaXplZE5hbWUgPSBuYW1lUGFydHNbMV07XG4gICAgICAgICAgaXNOb3JtYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgICBcbiAgICAgICAgICB1cmwgPSBjb250ZXh0Lm5hbWVUb1VybChub3JtYWxpemVkTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy9JZiB0aGUgaWQgaXMgYSBwbHVnaW4gaWQgdGhhdCBjYW5ub3QgYmUgZGV0ZXJtaW5lZCBpZiBpdCBuZWVkc1xuICAgICAgLy9ub3JtYWxpemF0aW9uLCBzdGFtcCBpdCB3aXRoIGEgdW5pcXVlIElEIHNvIHR3byBtYXRjaGluZyByZWxhdGl2ZVxuICAgICAgLy9pZHMgdGhhdCBtYXkgY29uZmxpY3QgY2FuIGJlIHNlcGFyYXRlLlxuICAgICAgc3VmZml4ID0gcHJlZml4ICYmICFwbHVnaW5Nb2R1bGUgJiYgIWlzTm9ybWFsaXplZCA/XG4gICAgICAgICdfdW5ub3JtYWxpemVkJyArICh1bm5vcm1hbGl6ZWRDb3VudGVyICs9IDEpIDpcbiAgICAgICAgJyc7XG4gICAgICBcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICBuYW1lOiBub3JtYWxpemVkTmFtZSxcbiAgICAgICAgcGFyZW50TWFwOiBwYXJlbnRNb2R1bGVNYXAsXG4gICAgICAgIHVubm9ybWFsaXplZDogISFzdWZmaXgsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBvcmlnaW5hbE5hbWU6IG9yaWdpbmFsTmFtZSxcbiAgICAgICAgaXNEZWZpbmU6IGlzRGVmaW5lLFxuICAgICAgICBpZDogKHByZWZpeCA/XG4gICAgICAgICAgcHJlZml4ICsgJyEnICsgbm9ybWFsaXplZE5hbWUgOlxuICAgICAgICAgIG5vcm1hbGl6ZWROYW1lKSArIHN1ZmZpeFxuICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZ2V0TW9kdWxlKGRlcE1hcCkge1xuICAgICAgdmFyIGlkID0gZGVwTWFwLmlkLFxuICAgICAgICBtb2QgPSBnZXRPd24ocmVnaXN0cnksIGlkKTtcbiAgICAgIFxuICAgICAgaWYgKCFtb2QpIHtcbiAgICAgICAgbW9kID0gcmVnaXN0cnlbaWRdID0gbmV3IGNvbnRleHQuTW9kdWxlKGRlcE1hcCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBtb2Q7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIG9uKGRlcE1hcCwgbmFtZSwgZm4pIHtcbiAgICAgIHZhciBpZCA9IGRlcE1hcC5pZCxcbiAgICAgICAgbW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBpZCk7XG4gICAgICBcbiAgICAgIGlmIChoYXNQcm9wKGRlZmluZWQsIGlkKSAmJlxuICAgICAgICAoIW1vZCB8fCBtb2QuZGVmaW5lRW1pdENvbXBsZXRlKSkge1xuICAgICAgICBpZiAobmFtZSA9PT0gJ2RlZmluZWQnKSB7XG4gICAgICAgICAgZm4oZGVmaW5lZFtpZF0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtb2QgPSBnZXRNb2R1bGUoZGVwTWFwKTtcbiAgICAgICAgaWYgKG1vZC5lcnJvciAmJiBuYW1lID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgZm4obW9kLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb2Qub24obmFtZSwgZm4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIG9uRXJyb3IoZXJyLCBlcnJiYWNrKSB7XG4gICAgICB2YXIgaWRzID0gZXJyLnJlcXVpcmVNb2R1bGVzLFxuICAgICAgICBub3RpZmllZCA9IGZhbHNlO1xuICAgICAgXG4gICAgICBpZiAoZXJyYmFjaykge1xuICAgICAgICBlcnJiYWNrKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlYWNoKGlkcywgZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgdmFyIG1vZCA9IGdldE93bihyZWdpc3RyeSwgaWQpO1xuICAgICAgICAgIGlmIChtb2QpIHtcbiAgICAgICAgICAgIC8vU2V0IGVycm9yIG9uIG1vZHVsZSwgc28gaXQgc2tpcHMgdGltZW91dCBjaGVja3MuXG4gICAgICAgICAgICBtb2QuZXJyb3IgPSBlcnI7XG4gICAgICAgICAgICBpZiAobW9kLmV2ZW50cy5lcnJvcikge1xuICAgICAgICAgICAgICBub3RpZmllZCA9IHRydWU7XG4gICAgICAgICAgICAgIG1vZC5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGlmICghbm90aWZpZWQpIHtcbiAgICAgICAgICByZXEub25FcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIEludGVybmFsIG1ldGhvZCB0byB0cmFuc2ZlciBnbG9iYWxRdWV1ZSBpdGVtcyB0byB0aGlzIGNvbnRleHQnc1xuICAgICAqIGRlZlF1ZXVlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRha2VHbG9iYWxRdWV1ZSgpIHtcbiAgICAgIC8vUHVzaCBhbGwgdGhlIGdsb2JhbERlZlF1ZXVlIGl0ZW1zIGludG8gdGhlIGNvbnRleHQncyBkZWZRdWV1ZVxuICAgICAgaWYgKGdsb2JhbERlZlF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBlYWNoKGdsb2JhbERlZlF1ZXVlLCBmdW5jdGlvbihxdWV1ZUl0ZW0pIHtcbiAgICAgICAgICB2YXIgaWQgPSBxdWV1ZUl0ZW1bMF07XG4gICAgICAgICAgaWYgKHR5cGVvZiBpZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGVmUXVldWVNYXBbaWRdID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVmUXVldWUucHVzaChxdWV1ZUl0ZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgZ2xvYmFsRGVmUXVldWUgPSBbXTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaGFuZGxlcnMgPSB7XG4gICAgICAncmVxdWlyZSc6IGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgaWYgKG1vZC5yZXF1aXJlKSB7XG4gICAgICAgICAgcmV0dXJuIG1vZC5yZXF1aXJlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAobW9kLnJlcXVpcmUgPSBjb250ZXh0Lm1ha2VSZXF1aXJlKG1vZC5tYXApKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdleHBvcnRzJzogZnVuY3Rpb24gKG1vZCkge1xuICAgICAgICBtb2QudXNpbmdFeHBvcnRzID0gdHJ1ZTtcbiAgICAgICAgaWYgKG1vZC5tYXAuaXNEZWZpbmUpIHtcbiAgICAgICAgICBpZiAobW9kLmV4cG9ydHMpIHtcbiAgICAgICAgICAgIHJldHVybiAoZGVmaW5lZFttb2QubWFwLmlkXSA9IG1vZC5leHBvcnRzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIChtb2QuZXhwb3J0cyA9IGRlZmluZWRbbW9kLm1hcC5pZF0gPSB7fSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ21vZHVsZSc6IGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgaWYgKG1vZC5tb2R1bGUpIHtcbiAgICAgICAgICByZXR1cm4gbW9kLm1vZHVsZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKG1vZC5tb2R1bGUgPSB7XG4gICAgICAgICAgICBpZDogbW9kLm1hcC5pZCxcbiAgICAgICAgICAgIHVyaTogbW9kLm1hcC51cmwsXG4gICAgICAgICAgICBjb25maWc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGdldE93bihjb25maWcuY29uZmlnLCBtb2QubWFwLmlkKSB8fCB7fTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBleHBvcnRzOiBtb2QuZXhwb3J0cyB8fCAobW9kLmV4cG9ydHMgPSB7fSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgZnVuY3Rpb24gY2xlYW5SZWdpc3RyeShpZCkge1xuICAgICAgLy9DbGVhbiB1cCBtYWNoaW5lcnkgdXNlZCBmb3Igd2FpdGluZyBtb2R1bGVzLlxuICAgICAgZGVsZXRlIHJlZ2lzdHJ5W2lkXTtcbiAgICAgIGRlbGV0ZSBlbmFibGVkUmVnaXN0cnlbaWRdO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBicmVha0N5Y2xlKG1vZCwgdHJhY2VkLCBwcm9jZXNzZWQpIHtcbiAgICAgIHZhciBpZCA9IG1vZC5tYXAuaWQ7XG4gICAgICBcbiAgICAgIGlmIChtb2QuZXJyb3IpIHtcbiAgICAgICAgbW9kLmVtaXQoJ2Vycm9yJywgbW9kLmVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyYWNlZFtpZF0gPSB0cnVlO1xuICAgICAgICBlYWNoKG1vZC5kZXBNYXBzLCBmdW5jdGlvbiAoZGVwTWFwLCBpKSB7XG4gICAgICAgICAgdmFyIGRlcElkID0gZGVwTWFwLmlkLFxuICAgICAgICAgICAgZGVwID0gZ2V0T3duKHJlZ2lzdHJ5LCBkZXBJZCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy9Pbmx5IGZvcmNlIHRoaW5ncyB0aGF0IGhhdmUgbm90IGNvbXBsZXRlZFxuICAgICAgICAgIC8vYmVpbmcgZGVmaW5lZCwgc28gc3RpbGwgaW4gdGhlIHJlZ2lzdHJ5LFxuICAgICAgICAgIC8vYW5kIG9ubHkgaWYgaXQgaGFzIG5vdCBiZWVuIG1hdGNoZWQgdXBcbiAgICAgICAgICAvL2luIHRoZSBtb2R1bGUgYWxyZWFkeS5cbiAgICAgICAgICBpZiAoZGVwICYmICFtb2QuZGVwTWF0Y2hlZFtpXSAmJiAhcHJvY2Vzc2VkW2RlcElkXSkge1xuICAgICAgICAgICAgaWYgKGdldE93bih0cmFjZWQsIGRlcElkKSkge1xuICAgICAgICAgICAgICBtb2QuZGVmaW5lRGVwKGksIGRlZmluZWRbZGVwSWRdKTtcbiAgICAgICAgICAgICAgbW9kLmNoZWNrKCk7IC8vcGFzcyBmYWxzZT9cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrQ3ljbGUoZGVwLCB0cmFjZWQsIHByb2Nlc3NlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcHJvY2Vzc2VkW2lkXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGNoZWNrTG9hZGVkKCkge1xuICAgICAgdmFyIGVyciwgdXNpbmdQYXRoRmFsbGJhY2ssXG4gICAgICAgIHdhaXRJbnRlcnZhbCA9IGNvbmZpZy53YWl0U2Vjb25kcyAqIDEwMDAsXG4gICAgICAgIC8vSXQgaXMgcG9zc2libGUgdG8gZGlzYWJsZSB0aGUgd2FpdCBpbnRlcnZhbCBieSB1c2luZyB3YWl0U2Vjb25kcyBvZiAwLlxuICAgICAgICBleHBpcmVkID0gd2FpdEludGVydmFsICYmIChjb250ZXh0LnN0YXJ0VGltZSArIHdhaXRJbnRlcnZhbCkgPCBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAgICAgbm9Mb2FkcyA9IFtdLFxuICAgICAgICByZXFDYWxscyA9IFtdLFxuICAgICAgICBzdGlsbExvYWRpbmcgPSBmYWxzZSxcbiAgICAgICAgbmVlZEN5Y2xlQ2hlY2sgPSB0cnVlO1xuICAgICAgXG4gICAgICAvL0RvIG5vdCBib3RoZXIgaWYgdGhpcyBjYWxsIHdhcyBhIHJlc3VsdCBvZiBhIGN5Y2xlIGJyZWFrLlxuICAgICAgaWYgKGluQ2hlY2tMb2FkZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpbkNoZWNrTG9hZGVkID0gdHJ1ZTtcbiAgICAgIFxuICAgICAgLy9GaWd1cmUgb3V0IHRoZSBzdGF0ZSBvZiBhbGwgdGhlIG1vZHVsZXMuXG4gICAgICBlYWNoUHJvcChlbmFibGVkUmVnaXN0cnksIGZ1bmN0aW9uIChtb2QpIHtcbiAgICAgICAgdmFyIG1hcCA9IG1vZC5tYXAsXG4gICAgICAgICAgbW9kSWQgPSBtYXAuaWQ7XG4gICAgICAgIFxuICAgICAgICAvL1NraXAgdGhpbmdzIHRoYXQgYXJlIG5vdCBlbmFibGVkIG9yIGluIGVycm9yIHN0YXRlLlxuICAgICAgICBpZiAoIW1vZC5lbmFibGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoIW1hcC5pc0RlZmluZSkge1xuICAgICAgICAgIHJlcUNhbGxzLnB1c2gobW9kKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCFtb2QuZXJyb3IpIHtcbiAgICAgICAgICAvL0lmIHRoZSBtb2R1bGUgc2hvdWxkIGJlIGV4ZWN1dGVkLCBhbmQgaXQgaGFzIG5vdFxuICAgICAgICAgIC8vYmVlbiBpbml0ZWQgYW5kIHRpbWUgaXMgdXAsIHJlbWVtYmVyIGl0LlxuICAgICAgICAgIGlmICghbW9kLmluaXRlZCAmJiBleHBpcmVkKSB7XG4gICAgICAgICAgICBpZiAoaGFzUGF0aEZhbGxiYWNrKG1vZElkKSkge1xuICAgICAgICAgICAgICB1c2luZ1BhdGhGYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgICAgIHN0aWxsTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBub0xvYWRzLnB1c2gobW9kSWQpO1xuICAgICAgICAgICAgICByZW1vdmVTY3JpcHQobW9kSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIW1vZC5pbml0ZWQgJiYgbW9kLmZldGNoZWQgJiYgbWFwLmlzRGVmaW5lKSB7XG4gICAgICAgICAgICBzdGlsbExvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCFtYXAucHJlZml4KSB7XG4gICAgICAgICAgICAgIC8vTm8gcmVhc29uIHRvIGtlZXAgbG9va2luZyBmb3IgdW5maW5pc2hlZFxuICAgICAgICAgICAgICAvL2xvYWRpbmcuIElmIHRoZSBvbmx5IHN0aWxsTG9hZGluZyBpcyBhXG4gICAgICAgICAgICAgIC8vcGx1Z2luIHJlc291cmNlIHRob3VnaCwga2VlcCBnb2luZyxcbiAgICAgICAgICAgICAgLy9iZWNhdXNlIGl0IG1heSBiZSB0aGF0IGEgcGx1Z2luIHJlc291cmNlXG4gICAgICAgICAgICAgIC8vaXMgd2FpdGluZyBvbiBhIG5vbi1wbHVnaW4gY3ljbGUuXG4gICAgICAgICAgICAgIHJldHVybiAobmVlZEN5Y2xlQ2hlY2sgPSBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgaWYgKGV4cGlyZWQgJiYgbm9Mb2Fkcy5sZW5ndGgpIHtcbiAgICAgICAgLy9JZiB3YWl0IHRpbWUgZXhwaXJlZCwgdGhyb3cgZXJyb3Igb2YgdW5sb2FkZWQgbW9kdWxlcy5cbiAgICAgICAgZXJyID0gbWFrZUVycm9yKCd0aW1lb3V0JywgJ0xvYWQgdGltZW91dCBmb3IgbW9kdWxlczogJyArIG5vTG9hZHMsIG51bGwsIG5vTG9hZHMpO1xuICAgICAgICBlcnIuY29udGV4dE5hbWUgPSBjb250ZXh0LmNvbnRleHROYW1lO1xuICAgICAgICByZXR1cm4gb25FcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvL05vdCBleHBpcmVkLCBjaGVjayBmb3IgYSBjeWNsZS5cbiAgICAgIGlmIChuZWVkQ3ljbGVDaGVjaykge1xuICAgICAgICBlYWNoKHJlcUNhbGxzLCBmdW5jdGlvbiAobW9kKSB7XG4gICAgICAgICAgYnJlYWtDeWNsZShtb2QsIHt9LCB7fSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvL0lmIHN0aWxsIHdhaXRpbmcgb24gbG9hZHMsIGFuZCB0aGUgd2FpdGluZyBsb2FkIGlzIHNvbWV0aGluZ1xuICAgICAgLy9vdGhlciB0aGFuIGEgcGx1Z2luIHJlc291cmNlLCBvciB0aGVyZSBhcmUgc3RpbGwgb3V0c3RhbmRpbmdcbiAgICAgIC8vc2NyaXB0cywgdGhlbiBqdXN0IHRyeSBiYWNrIGxhdGVyLlxuICAgICAgaWYgKCghZXhwaXJlZCB8fCB1c2luZ1BhdGhGYWxsYmFjaykgJiYgc3RpbGxMb2FkaW5nKSB7XG4gICAgICAgIC8vU29tZXRoaW5nIGlzIHN0aWxsIHdhaXRpbmcgdG8gbG9hZC4gV2FpdCBmb3IgaXQsIGJ1dCBvbmx5XG4gICAgICAgIC8vaWYgYSB0aW1lb3V0IGlzIG5vdCBhbHJlYWR5IGluIGVmZmVjdC5cbiAgICAgICAgaWYgKChpc0Jyb3dzZXIgfHwgaXNXZWJXb3JrZXIpICYmICFjaGVja0xvYWRlZFRpbWVvdXRJZCkge1xuICAgICAgICAgIGNoZWNrTG9hZGVkVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaGVja0xvYWRlZFRpbWVvdXRJZCA9IDA7XG4gICAgICAgICAgICBjaGVja0xvYWRlZCgpO1xuICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBpbkNoZWNrTG9hZGVkID0gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIE1vZHVsZSA9IGZ1bmN0aW9uIChtYXApIHtcbiAgICAgIHRoaXMuZXZlbnRzID0gZ2V0T3duKHVuZGVmRXZlbnRzLCBtYXAuaWQpIHx8IHt9O1xuICAgICAgdGhpcy5tYXAgPSBtYXA7XG4gICAgICB0aGlzLnNoaW0gPSBnZXRPd24oY29uZmlnLnNoaW0sIG1hcC5pZCk7XG4gICAgICB0aGlzLmRlcEV4cG9ydHMgPSBbXTtcbiAgICAgIHRoaXMuZGVwTWFwcyA9IFtdO1xuICAgICAgdGhpcy5kZXBNYXRjaGVkID0gW107XG4gICAgICB0aGlzLnBsdWdpbk1hcHMgPSB7fTtcbiAgICAgIHRoaXMuZGVwQ291bnQgPSAwO1xuICAgICAgXG4gICAgICAvKiB0aGlzLmV4cG9ydHMgdGhpcy5mYWN0b3J5XG4gICAgICAgICB0aGlzLmRlcE1hcHMgPSBbXSxcbiAgICAgICAgIHRoaXMuZW5hYmxlZCwgdGhpcy5mZXRjaGVkXG4gICAgICAqL1xuICAgIH07XG4gICAgXG4gICAgTW9kdWxlLnByb3RvdHlwZSA9IHtcbiAgICAgIGluaXQ6IGZ1bmN0aW9uIChkZXBNYXBzLCBmYWN0b3J5LCBlcnJiYWNrLCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBcbiAgICAgICAgLy9EbyBub3QgZG8gbW9yZSBpbml0cyBpZiBhbHJlYWR5IGRvbmUuIENhbiBoYXBwZW4gaWYgdGhlcmVcbiAgICAgICAgLy9hcmUgbXVsdGlwbGUgZGVmaW5lIGNhbGxzIGZvciB0aGUgc2FtZSBtb2R1bGUuIFRoYXQgaXMgbm90XG4gICAgICAgIC8vYSBub3JtYWwsIGNvbW1vbiBjYXNlLCBidXQgaXQgaXMgYWxzbyBub3QgdW5leHBlY3RlZC5cbiAgICAgICAgaWYgKHRoaXMuaW5pdGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmZhY3RvcnkgPSBmYWN0b3J5O1xuICAgICAgICBcbiAgICAgICAgaWYgKGVycmJhY2spIHtcbiAgICAgICAgICAvL1JlZ2lzdGVyIGZvciBlcnJvcnMgb24gdGhpcyBtb2R1bGUuXG4gICAgICAgICAgdGhpcy5vbignZXJyb3InLCBlcnJiYWNrKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50cy5lcnJvcikge1xuICAgICAgICAgIC8vSWYgbm8gZXJyYmFjayBhbHJlYWR5LCBidXQgdGhlcmUgYXJlIGVycm9yIGxpc3RlbmVyc1xuICAgICAgICAgIC8vb24gdGhpcyBtb2R1bGUsIHNldCB1cCBhbiBlcnJiYWNrIHRvIHBhc3MgdG8gdGhlIGRlcHMuXG4gICAgICAgICAgZXJyYmFjayA9IGJpbmQodGhpcywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vRG8gYSBjb3B5IG9mIHRoZSBkZXBlbmRlbmN5IGFycmF5LCBzbyB0aGF0XG4gICAgICAgIC8vc291cmNlIGlucHV0cyBhcmUgbm90IG1vZGlmaWVkLiBGb3IgZXhhbXBsZVxuICAgICAgICAvL1wic2hpbVwiIGRlcHMgYXJlIHBhc3NlZCBpbiBoZXJlIGRpcmVjdGx5LCBhbmRcbiAgICAgICAgLy9kb2luZyBhIGRpcmVjdCBtb2RpZmljYXRpb24gb2YgdGhlIGRlcE1hcHMgYXJyYXlcbiAgICAgICAgLy93b3VsZCBhZmZlY3QgdGhhdCBjb25maWcuXG4gICAgICAgIHRoaXMuZGVwTWFwcyA9IGRlcE1hcHMgJiYgZGVwTWFwcy5zbGljZSgwKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZXJyYmFjayA9IGVycmJhY2s7XG4gICAgICAgIFxuICAgICAgICAvL0luZGljYXRlIHRoaXMgbW9kdWxlIGhhcyBiZSBpbml0aWFsaXplZFxuICAgICAgICB0aGlzLmluaXRlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmlnbm9yZSA9IG9wdGlvbnMuaWdub3JlO1xuICAgICAgICBcbiAgICAgICAgLy9Db3VsZCBoYXZlIG9wdGlvbiB0byBpbml0IHRoaXMgbW9kdWxlIGluIGVuYWJsZWQgbW9kZSxcbiAgICAgICAgLy9vciBjb3VsZCBoYXZlIGJlZW4gcHJldmlvdXNseSBtYXJrZWQgYXMgZW5hYmxlZC4gSG93ZXZlcixcbiAgICAgICAgLy90aGUgZGVwZW5kZW5jaWVzIGFyZSBub3Qga25vd24gdW50aWwgaW5pdCBpcyBjYWxsZWQuIFNvXG4gICAgICAgIC8vaWYgZW5hYmxlZCBwcmV2aW91c2x5LCBub3cgdHJpZ2dlciBkZXBlbmRlbmNpZXMgYXMgZW5hYmxlZC5cbiAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlZCB8fCB0aGlzLmVuYWJsZWQpIHtcbiAgICAgICAgICAvL0VuYWJsZSB0aGlzIG1vZHVsZSBhbmQgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgIC8vV2lsbCBjYWxsIHRoaXMuY2hlY2soKVxuICAgICAgICAgIHRoaXMuZW5hYmxlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICBkZWZpbmVEZXA6IGZ1bmN0aW9uIChpLCBkZXBFeHBvcnRzKSB7XG4gICAgICAgIC8vQmVjYXVzZSBvZiBjeWNsZXMsIGRlZmluZWQgY2FsbGJhY2sgZm9yIGEgZ2l2ZW5cbiAgICAgICAgLy9leHBvcnQgY2FuIGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZS5cbiAgICAgICAgaWYgKCF0aGlzLmRlcE1hdGNoZWRbaV0pIHtcbiAgICAgICAgICB0aGlzLmRlcE1hdGNoZWRbaV0gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZGVwQ291bnQgLT0gMTtcbiAgICAgICAgICB0aGlzLmRlcEV4cG9ydHNbaV0gPSBkZXBFeHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICBmZXRjaDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5mZXRjaGVkKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmV0Y2hlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICBjb250ZXh0LnN0YXJ0VGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgbWFwID0gdGhpcy5tYXA7XG4gICAgICAgIFxuICAgICAgICAvL0lmIHRoZSBtYW5hZ2VyIGlzIGZvciBhIHBsdWdpbiBtYW5hZ2VkIHJlc291cmNlLFxuICAgICAgICAvL2FzayB0aGUgcGx1Z2luIHRvIGxvYWQgaXQgbm93LlxuICAgICAgICBpZiAodGhpcy5zaGltKSB7XG4gICAgICAgICAgY29udGV4dC5tYWtlUmVxdWlyZSh0aGlzLm1hcCwge1xuICAgICAgICAgICAgZW5hYmxlQnVpbGRDYWxsYmFjazogdHJ1ZVxuICAgICAgICAgIH0pKHRoaXMuc2hpbS5kZXBzIHx8IFtdLCBiaW5kKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXAucHJlZml4ID8gdGhpcy5jYWxsUGx1Z2luKCkgOiB0aGlzLmxvYWQoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9SZWd1bGFyIGRlcGVuZGVuY3kuXG4gICAgICAgICAgcmV0dXJuIG1hcC5wcmVmaXggPyB0aGlzLmNhbGxQbHVnaW4oKSA6IHRoaXMubG9hZCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1cmwgPSB0aGlzLm1hcC51cmw7XG4gICAgICAgIFxuICAgICAgICAvL1JlZ3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgICAgaWYgKCF1cmxGZXRjaGVkW3VybF0pIHtcbiAgICAgICAgICB1cmxGZXRjaGVkW3VybF0gPSB0cnVlO1xuICAgICAgICAgIGNvbnRleHQubG9hZCh0aGlzLm1hcC5pZCwgdXJsKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFxuICAgICAgLyoqXG4gICAgICAgKiBDaGVja3MgaWYgdGhlIG1vZHVsZSBpcyByZWFkeSB0byBkZWZpbmUgaXRzZWxmLCBhbmQgaWYgc28sXG4gICAgICAgKiBkZWZpbmUgaXQuXG4gICAgICAgKi9cbiAgICAgIGNoZWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkIHx8IHRoaXMuZW5hYmxpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHZhciBlcnIsIGNqc01vZHVsZSxcbiAgICAgICAgICBpZCA9IHRoaXMubWFwLmlkLFxuICAgICAgICAgIGRlcEV4cG9ydHMgPSB0aGlzLmRlcEV4cG9ydHMsXG4gICAgICAgICAgZXhwb3J0cyA9IHRoaXMuZXhwb3J0cyxcbiAgICAgICAgICBmYWN0b3J5ID0gdGhpcy5mYWN0b3J5O1xuICAgICAgICBcbiAgICAgICAgaWYgKCF0aGlzLmluaXRlZCkge1xuICAgICAgICAgIC8vIE9ubHkgZmV0Y2ggaWYgbm90IGFscmVhZHkgaW4gdGhlIGRlZlF1ZXVlLlxuICAgICAgICAgIGlmICghaGFzUHJvcChjb250ZXh0LmRlZlF1ZXVlTWFwLCBpZCkpIHtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2goKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5lcnJvcikge1xuICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCB0aGlzLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5kZWZpbmluZykge1xuICAgICAgICAgIC8vVGhlIGZhY3RvcnkgY291bGQgdHJpZ2dlciBhbm90aGVyIHJlcXVpcmUgY2FsbFxuICAgICAgICAgIC8vdGhhdCB3b3VsZCByZXN1bHQgaW4gY2hlY2tpbmcgdGhpcyBtb2R1bGUgdG9cbiAgICAgICAgICAvL2RlZmluZSBpdHNlbGYgYWdhaW4uIElmIGFscmVhZHkgaW4gdGhlIHByb2Nlc3NcbiAgICAgICAgICAvL29mIGRvaW5nIHRoYXQsIHNraXAgdGhpcyB3b3JrLlxuICAgICAgICAgIHRoaXMuZGVmaW5pbmcgPSB0cnVlO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmICh0aGlzLmRlcENvdW50IDwgMSAmJiAhdGhpcy5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihmYWN0b3J5KSkge1xuICAgICAgICAgICAgICAvL0lmIHRoZXJlIGlzIGFuIGVycm9yIGxpc3RlbmVyLCBmYXZvciBwYXNzaW5nXG4gICAgICAgICAgICAgIC8vdG8gdGhhdCBpbnN0ZWFkIG9mIHRocm93aW5nIGFuIGVycm9yLiBIb3dldmVyLFxuICAgICAgICAgICAgICAvL29ubHkgZG8gaXQgZm9yIGRlZmluZSgpJ2QgIG1vZHVsZXMuIHJlcXVpcmVcbiAgICAgICAgICAgICAgLy9lcnJiYWNrcyBzaG91bGQgbm90IGJlIGNhbGxlZCBmb3IgZmFpbHVyZXMgaW5cbiAgICAgICAgICAgICAgLy90aGVpciBjYWxsYmFja3MgKCM2OTkpLiBIb3dldmVyIGlmIGEgZ2xvYmFsXG4gICAgICAgICAgICAgIC8vb25FcnJvciBpcyBzZXQsIHVzZSB0aGF0LlxuICAgICAgICAgICAgICBpZiAoKHRoaXMuZXZlbnRzLmVycm9yICYmIHRoaXMubWFwLmlzRGVmaW5lKSB8fFxuICAgICAgICAgICAgICAgIHJlcS5vbkVycm9yICE9PSBkZWZhdWx0T25FcnJvcikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBleHBvcnRzID0gY29udGV4dC5leGVjQ2IoaWQsIGZhY3RvcnksIGRlcEV4cG9ydHMsIGV4cG9ydHMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgIGVyciA9IGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBjb250ZXh0LmV4ZWNDYihpZCwgZmFjdG9yeSwgZGVwRXhwb3J0cywgZXhwb3J0cyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vIEZhdm9yIHJldHVybiB2YWx1ZSBvdmVyIGV4cG9ydHMuIElmIG5vZGUvY2pzIGluIHBsYXksXG4gICAgICAgICAgICAgIC8vIHRoZW4gd2lsbCBub3QgaGF2ZSBhIHJldHVybiB2YWx1ZSBhbnl3YXkuIEZhdm9yXG4gICAgICAgICAgICAgIC8vIG1vZHVsZS5leHBvcnRzIGFzc2lnbm1lbnQgb3ZlciBleHBvcnRzIG9iamVjdC5cbiAgICAgICAgICAgICAgaWYgKHRoaXMubWFwLmlzRGVmaW5lICYmIGV4cG9ydHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNqc01vZHVsZSA9IHRoaXMubW9kdWxlO1xuICAgICAgICAgICAgICAgIGlmIChjanNNb2R1bGUpIHtcbiAgICAgICAgICAgICAgICAgIGV4cG9ydHMgPSBjanNNb2R1bGUuZXhwb3J0cztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudXNpbmdFeHBvcnRzKSB7XG4gICAgICAgICAgICAgICAgICAvL2V4cG9ydHMgYWxyZWFkeSBzZXQgdGhlIGRlZmluZWQgdmFsdWUuXG4gICAgICAgICAgICAgICAgICBleHBvcnRzID0gdGhpcy5leHBvcnRzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGVyci5yZXF1aXJlTWFwID0gdGhpcy5tYXA7XG4gICAgICAgICAgICAgICAgZXJyLnJlcXVpcmVNb2R1bGVzID0gdGhpcy5tYXAuaXNEZWZpbmUgPyBbdGhpcy5tYXAuaWRdIDogbnVsbDtcbiAgICAgICAgICAgICAgICBlcnIucmVxdWlyZVR5cGUgPSB0aGlzLm1hcC5pc0RlZmluZSA/ICdkZWZpbmUnIDogJ3JlcXVpcmUnO1xuICAgICAgICAgICAgICAgIHJldHVybiBvbkVycm9yKCh0aGlzLmVycm9yID0gZXJyKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvL0p1c3QgYSBsaXRlcmFsIHZhbHVlXG4gICAgICAgICAgICAgIGV4cG9ydHMgPSBmYWN0b3J5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmV4cG9ydHMgPSBleHBvcnRzO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5tYXAuaXNEZWZpbmUgJiYgIXRoaXMuaWdub3JlKSB7XG4gICAgICAgICAgICAgIGRlZmluZWRbaWRdID0gZXhwb3J0cztcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmIChyZXEub25SZXNvdXJjZUxvYWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzTG9hZE1hcHMgPSBbXTtcbiAgICAgICAgICAgICAgICBlYWNoKHRoaXMuZGVwTWFwcywgZnVuY3Rpb24gKGRlcE1hcCkge1xuICAgICAgICAgICAgICAgICAgcmVzTG9hZE1hcHMucHVzaChkZXBNYXAubm9ybWFsaXplZE1hcCB8fCBkZXBNYXApO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlcS5vblJlc291cmNlTG9hZChjb250ZXh0LCB0aGlzLm1hcCwgcmVzTG9hZE1hcHMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vQ2xlYW4gdXBcbiAgICAgICAgICAgIGNsZWFuUmVnaXN0cnkoaWQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmRlZmluZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvL0ZpbmlzaGVkIHRoZSBkZWZpbmUgc3RhZ2UuIEFsbG93IGNhbGxpbmcgY2hlY2sgYWdhaW5cbiAgICAgICAgICAvL3RvIGFsbG93IGRlZmluZSBub3RpZmljYXRpb25zIGJlbG93IGluIHRoZSBjYXNlIG9mIGFcbiAgICAgICAgICAvL2N5Y2xlLlxuICAgICAgICAgIHRoaXMuZGVmaW5pbmcgPSBmYWxzZTtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAodGhpcy5kZWZpbmVkICYmICF0aGlzLmRlZmluZUVtaXR0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZGVmaW5lRW1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2RlZmluZWQnLCB0aGlzLmV4cG9ydHMpO1xuICAgICAgICAgICAgdGhpcy5kZWZpbmVFbWl0Q29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFxuICAgICAgY2FsbFBsdWdpbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWFwID0gdGhpcy5tYXAsXG4gICAgICAgICAgaWQgPSBtYXAuaWQsXG4gICAgICAgICAgLy9NYXAgYWxyZWFkeSBub3JtYWxpemVkIHRoZSBwcmVmaXguXG4gICAgICAgICAgcGx1Z2luTWFwID0gbWFrZU1vZHVsZU1hcChtYXAucHJlZml4KTtcbiAgICAgICAgXG4gICAgICAgIC8vTWFyayB0aGlzIGFzIGEgZGVwZW5kZW5jeSBmb3IgdGhpcyBwbHVnaW4sIHNvIGl0XG4gICAgICAgIC8vY2FuIGJlIHRyYWNlZCBmb3IgY3ljbGVzLlxuICAgICAgICB0aGlzLmRlcE1hcHMucHVzaChwbHVnaW5NYXApO1xuICAgICAgICBcbiAgICAgICAgb24ocGx1Z2luTWFwLCAnZGVmaW5lZCcsIGJpbmQodGhpcywgZnVuY3Rpb24gKHBsdWdpbikge1xuICAgICAgICAgIHZhciBsb2FkLCBub3JtYWxpemVkTWFwLCBub3JtYWxpemVkTW9kLFxuICAgICAgICAgICAgYnVuZGxlSWQgPSBnZXRPd24oYnVuZGxlc01hcCwgdGhpcy5tYXAuaWQpLFxuICAgICAgICAgICAgbmFtZSA9IHRoaXMubWFwLm5hbWUsXG4gICAgICAgICAgICBwYXJlbnROYW1lID0gdGhpcy5tYXAucGFyZW50TWFwID8gdGhpcy5tYXAucGFyZW50TWFwLm5hbWUgOiBudWxsLFxuICAgICAgICAgICAgbG9jYWxSZXF1aXJlID0gY29udGV4dC5tYWtlUmVxdWlyZShtYXAucGFyZW50TWFwLCB7XG4gICAgICAgICAgICAgIGVuYWJsZUJ1aWxkQ2FsbGJhY2s6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vSWYgY3VycmVudCBtYXAgaXMgbm90IG5vcm1hbGl6ZWQsIHdhaXQgZm9yIHRoYXRcbiAgICAgICAgICAvL25vcm1hbGl6ZWQgbmFtZSB0byBsb2FkIGluc3RlYWQgb2YgY29udGludWluZy5cbiAgICAgICAgICBpZiAodGhpcy5tYXAudW5ub3JtYWxpemVkKSB7XG4gICAgICAgICAgICAvL05vcm1hbGl6ZSB0aGUgSUQgaWYgdGhlIHBsdWdpbiBhbGxvd3MgaXQuXG4gICAgICAgICAgICBpZiAocGx1Z2luLm5vcm1hbGl6ZSkge1xuICAgICAgICAgICAgICBuYW1lID0gcGx1Z2luLm5vcm1hbGl6ZShuYW1lLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBub3JtYWxpemUobmFtZSwgcGFyZW50TmFtZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgIH0pIHx8ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3ByZWZpeCBhbmQgbmFtZSBzaG91bGQgYWxyZWFkeSBiZSBub3JtYWxpemVkLCBubyBuZWVkXG4gICAgICAgICAgICAvL2ZvciBhcHBseWluZyBtYXAgY29uZmlnIGFnYWluIGVpdGhlci5cbiAgICAgICAgICAgIG5vcm1hbGl6ZWRNYXAgPSBtYWtlTW9kdWxlTWFwKG1hcC5wcmVmaXggKyAnIScgKyBuYW1lLFxuICAgICAgICAgICAgICB0aGlzLm1hcC5wYXJlbnRNYXAsXG4gICAgICAgICAgICAgIHRydWUpO1xuICAgICAgICAgICAgb24obm9ybWFsaXplZE1hcCxcbiAgICAgICAgICAgICAgJ2RlZmluZWQnLCBiaW5kKHRoaXMsIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLm5vcm1hbGl6ZWRNYXAgPSBub3JtYWxpemVkTWFwO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdChbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsdWU7IH0sIG51bGwsIHtcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICBpZ25vcmU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBub3JtYWxpemVkTW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBub3JtYWxpemVkTWFwLmlkKTtcbiAgICAgICAgICAgIGlmIChub3JtYWxpemVkTW9kKSB7XG4gICAgICAgICAgICAgIC8vTWFyayB0aGlzIGFzIGEgZGVwZW5kZW5jeSBmb3IgdGhpcyBwbHVnaW4sIHNvIGl0XG4gICAgICAgICAgICAgIC8vY2FuIGJlIHRyYWNlZCBmb3IgY3ljbGVzLlxuICAgICAgICAgICAgICB0aGlzLmRlcE1hcHMucHVzaChub3JtYWxpemVkTWFwKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmICh0aGlzLmV2ZW50cy5lcnJvcikge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRNb2Qub24oJ2Vycm9yJywgYmluZCh0aGlzLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbm9ybWFsaXplZE1vZC5lbmFibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICAvL0lmIGEgcGF0aHMgY29uZmlnLCB0aGVuIGp1c3QgbG9hZCB0aGF0IGZpbGUgaW5zdGVhZCB0b1xuICAgICAgICAgIC8vcmVzb2x2ZSB0aGUgcGx1Z2luLCBhcyBpdCBpcyBidWlsdCBpbnRvIHRoYXQgcGF0aHMgbGF5ZXIuXG4gICAgICAgICAgaWYgKGJ1bmRsZUlkKSB7XG4gICAgICAgICAgICB0aGlzLm1hcC51cmwgPSBjb250ZXh0Lm5hbWVUb1VybChidW5kbGVJZCk7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgbG9hZCA9IGJpbmQodGhpcywgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmluaXQoW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbHVlOyB9LCBudWxsLCB7XG4gICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIGxvYWQuZXJyb3IgPSBiaW5kKHRoaXMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBlcnI7XG4gICAgICAgICAgICBlcnIucmVxdWlyZU1vZHVsZXMgPSBbaWRdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1JlbW92ZSB0ZW1wIHVubm9ybWFsaXplZCBtb2R1bGVzIGZvciB0aGlzIG1vZHVsZSxcbiAgICAgICAgICAgIC8vc2luY2UgdGhleSB3aWxsIG5ldmVyIGJlIHJlc29sdmVkIG90aGVyd2lzZSBub3cuXG4gICAgICAgICAgICBlYWNoUHJvcChyZWdpc3RyeSwgZnVuY3Rpb24gKG1vZCkge1xuICAgICAgICAgICAgICBpZiAobW9kLm1hcC5pZC5pbmRleE9mKGlkICsgJ191bm5vcm1hbGl6ZWQnKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNsZWFuUmVnaXN0cnkobW9kLm1hcC5pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvbkVycm9yKGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy9BbGxvdyBwbHVnaW5zIHRvIGxvYWQgb3RoZXIgY29kZSB3aXRob3V0IGhhdmluZyB0byBrbm93IHRoZVxuICAgICAgICAgIC8vY29udGV4dCBvciBob3cgdG8gJ2NvbXBsZXRlJyB0aGUgbG9hZC5cbiAgICAgICAgICBsb2FkLmZyb21UZXh0ID0gYmluZCh0aGlzLCBmdW5jdGlvbiAodGV4dCwgdGV4dEFsdCkge1xuICAgICAgICAgICAgLypqc2xpbnQgZXZpbDogdHJ1ZSAqL1xuICAgICAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBtYXAubmFtZSxcbiAgICAgICAgICAgICAgbW9kdWxlTWFwID0gbWFrZU1vZHVsZU1hcChtb2R1bGVOYW1lKSxcbiAgICAgICAgICAgICAgaGFzSW50ZXJhY3RpdmUgPSB1c2VJbnRlcmFjdGl2ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9BcyBvZiAyLjEuMCwgc3VwcG9ydCBqdXN0IHBhc3NpbmcgdGhlIHRleHQsIHRvIHJlaW5mb3JjZVxuICAgICAgICAgICAgLy9mcm9tVGV4dCBvbmx5IGJlaW5nIGNhbGxlZCBvbmNlIHBlciByZXNvdXJjZS4gU3RpbGxcbiAgICAgICAgICAgIC8vc3VwcG9ydCBvbGQgc3R5bGUgb2YgcGFzc2luZyBtb2R1bGVOYW1lIGJ1dCBkaXNjYXJkXG4gICAgICAgICAgICAvL3RoYXQgbW9kdWxlTmFtZSBpbiBmYXZvciBvZiB0aGUgaW50ZXJuYWwgcmVmLlxuICAgICAgICAgICAgaWYgKHRleHRBbHQpIHtcbiAgICAgICAgICAgICAgdGV4dCA9IHRleHRBbHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vVHVybiBvZmYgaW50ZXJhY3RpdmUgc2NyaXB0IG1hdGNoaW5nIGZvciBJRSBmb3IgYW55IGRlZmluZVxuICAgICAgICAgICAgLy9jYWxscyBpbiB0aGUgdGV4dCwgdGhlbiB0dXJuIGl0IGJhY2sgb24gYXQgdGhlIGVuZC5cbiAgICAgICAgICAgIGlmIChoYXNJbnRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgICB1c2VJbnRlcmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1ByaW1lIHRoZSBzeXN0ZW0gYnkgY3JlYXRpbmcgYSBtb2R1bGUgaW5zdGFuY2UgZm9yXG4gICAgICAgICAgICAvL2l0LlxuICAgICAgICAgICAgZ2V0TW9kdWxlKG1vZHVsZU1hcCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vVHJhbnNmZXIgYW55IGNvbmZpZyB0byB0aGlzIG90aGVyIG1vZHVsZS5cbiAgICAgICAgICAgIGlmIChoYXNQcm9wKGNvbmZpZy5jb25maWcsIGlkKSkge1xuICAgICAgICAgICAgICBjb25maWcuY29uZmlnW21vZHVsZU5hbWVdID0gY29uZmlnLmNvbmZpZ1tpZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJlcS5leGVjKHRleHQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gb25FcnJvcihtYWtlRXJyb3IoJ2Zyb210ZXh0ZXZhbCcsXG4gICAgICAgICAgICAgICAgJ2Zyb21UZXh0IGV2YWwgZm9yICcgKyBpZCArXG4gICAgICAgICAgICAgICAgJyBmYWlsZWQ6ICcgKyBlLFxuICAgICAgICAgICAgICAgIGUsXG4gICAgICAgICAgICAgICAgW2lkXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaGFzSW50ZXJhY3RpdmUpIHtcbiAgICAgICAgICAgICAgdXNlSW50ZXJhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL01hcmsgdGhpcyBhcyBhIGRlcGVuZGVuY3kgZm9yIHRoZSBwbHVnaW5cbiAgICAgICAgICAgIC8vcmVzb3VyY2VcbiAgICAgICAgICAgIHRoaXMuZGVwTWFwcy5wdXNoKG1vZHVsZU1hcCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vU3VwcG9ydCBhbm9ueW1vdXMgbW9kdWxlcy5cbiAgICAgICAgICAgIGNvbnRleHQuY29tcGxldGVMb2FkKG1vZHVsZU5hbWUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL0JpbmQgdGhlIHZhbHVlIG9mIHRoYXQgbW9kdWxlIHRvIHRoZSB2YWx1ZSBmb3IgdGhpc1xuICAgICAgICAgICAgLy9yZXNvdXJjZSBJRC5cbiAgICAgICAgICAgIGxvY2FsUmVxdWlyZShbbW9kdWxlTmFtZV0sIGxvYWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vVXNlIHBhcmVudE5hbWUgaGVyZSBzaW5jZSB0aGUgcGx1Z2luJ3MgbmFtZSBpcyBub3QgcmVsaWFibGUsXG4gICAgICAgICAgLy9jb3VsZCBiZSBzb21lIHdlaXJkIHN0cmluZyB3aXRoIG5vIHBhdGggdGhhdCBhY3R1YWxseSB3YW50cyB0b1xuICAgICAgICAgIC8vcmVmZXJlbmNlIHRoZSBwYXJlbnROYW1lJ3MgcGF0aC5cbiAgICAgICAgICBwbHVnaW4ubG9hZChtYXAubmFtZSwgbG9jYWxSZXF1aXJlLCBsb2FkLCBjb25maWcpO1xuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICBjb250ZXh0LmVuYWJsZShwbHVnaW5NYXAsIHRoaXMpO1xuICAgICAgICB0aGlzLnBsdWdpbk1hcHNbcGx1Z2luTWFwLmlkXSA9IHBsdWdpbk1hcDtcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIGVuYWJsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBlbmFibGVkUmVnaXN0cnlbdGhpcy5tYXAuaWRdID0gdGhpcztcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIC8vU2V0IGZsYWcgbWVudGlvbmluZyB0aGF0IHRoZSBtb2R1bGUgaXMgZW5hYmxpbmcsXG4gICAgICAgIC8vc28gdGhhdCBpbW1lZGlhdGUgY2FsbHMgdG8gdGhlIGRlZmluZWQgY2FsbGJhY2tzXG4gICAgICAgIC8vZm9yIGRlcGVuZGVuY2llcyBkbyBub3QgdHJpZ2dlciBpbmFkdmVydGVudCBsb2FkXG4gICAgICAgIC8vd2l0aCB0aGUgZGVwQ291bnQgc3RpbGwgYmVpbmcgemVyby5cbiAgICAgICAgdGhpcy5lbmFibGluZyA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICAvL0VuYWJsZSBlYWNoIGRlcGVuZGVuY3lcbiAgICAgICAgZWFjaCh0aGlzLmRlcE1hcHMsIGJpbmQodGhpcywgZnVuY3Rpb24gKGRlcE1hcCwgaSkge1xuICAgICAgICAgIHZhciBpZCwgbW9kLCBoYW5kbGVyO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmICh0eXBlb2YgZGVwTWFwID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy9EZXBlbmRlbmN5IG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBhIGRlcE1hcFxuICAgICAgICAgICAgLy9hbmQgd2lyZWQgdXAgdG8gdGhpcyBtb2R1bGUuXG4gICAgICAgICAgICBkZXBNYXAgPSBtYWtlTW9kdWxlTWFwKGRlcE1hcCxcbiAgICAgICAgICAgICAgKHRoaXMubWFwLmlzRGVmaW5lID8gdGhpcy5tYXAgOiB0aGlzLm1hcC5wYXJlbnRNYXApLFxuICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgIXRoaXMuc2tpcE1hcCk7XG4gICAgICAgICAgICB0aGlzLmRlcE1hcHNbaV0gPSBkZXBNYXA7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGhhbmRsZXIgPSBnZXRPd24oaGFuZGxlcnMsIGRlcE1hcC5pZCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGVwRXhwb3J0c1tpXSA9IGhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5kZXBDb3VudCArPSAxO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvbihkZXBNYXAsICdkZWZpbmVkJywgYmluZCh0aGlzLCBmdW5jdGlvbiAoZGVwRXhwb3J0cykge1xuICAgICAgICAgICAgICBpZiAodGhpcy51bmRlZmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuZGVmaW5lRGVwKGksIGRlcEV4cG9ydHMpO1xuICAgICAgICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmVycmJhY2spIHtcbiAgICAgICAgICAgICAgb24oZGVwTWFwLCAnZXJyb3InLCBiaW5kKHRoaXMsIHRoaXMuZXJyYmFjaykpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmV2ZW50cy5lcnJvcikge1xuICAgICAgICAgICAgICAvLyBObyBkaXJlY3QgZXJyYmFjayBvbiB0aGlzIG1vZHVsZSwgYnV0IHNvbWV0aGluZ1xuICAgICAgICAgICAgICAvLyBlbHNlIGlzIGxpc3RlbmluZyBmb3IgZXJyb3JzLCBzbyBiZSBzdXJlIHRvXG4gICAgICAgICAgICAgIC8vIHByb3BhZ2F0ZSB0aGUgZXJyb3IgY29ycmVjdGx5LlxuICAgICAgICAgICAgICBvbihkZXBNYXAsICdlcnJvcicsIGJpbmQodGhpcywgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaWQgPSBkZXBNYXAuaWQ7XG4gICAgICAgICAgbW9kID0gcmVnaXN0cnlbaWRdO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vU2tpcCBzcGVjaWFsIG1vZHVsZXMgbGlrZSAncmVxdWlyZScsICdleHBvcnRzJywgJ21vZHVsZSdcbiAgICAgICAgICAvL0Fsc28sIGRvbid0IGNhbGwgZW5hYmxlIGlmIGl0IGlzIGFscmVhZHkgZW5hYmxlZCxcbiAgICAgICAgICAvL2ltcG9ydGFudCBpbiBjaXJjdWxhciBkZXBlbmRlbmN5IGNhc2VzLlxuICAgICAgICAgIGlmICghaGFzUHJvcChoYW5kbGVycywgaWQpICYmIG1vZCAmJiAhbW9kLmVuYWJsZWQpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZW5hYmxlKGRlcE1hcCwgdGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIFxuICAgICAgICAvL0VuYWJsZSBlYWNoIHBsdWdpbiB0aGF0IGlzIHVzZWQgaW5cbiAgICAgICAgLy9hIGRlcGVuZGVuY3lcbiAgICAgICAgZWFjaFByb3AodGhpcy5wbHVnaW5NYXBzLCBiaW5kKHRoaXMsIGZ1bmN0aW9uIChwbHVnaW5NYXApIHtcbiAgICAgICAgICB2YXIgbW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBwbHVnaW5NYXAuaWQpO1xuICAgICAgICAgIGlmIChtb2QgJiYgIW1vZC5lbmFibGVkKSB7XG4gICAgICAgICAgICBjb250ZXh0LmVuYWJsZShwbHVnaW5NYXAsIHRoaXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5lbmFibGluZyA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgfSxcbiAgICAgIFxuICAgICAgb246IGZ1bmN0aW9uIChuYW1lLCBjYikge1xuICAgICAgICB2YXIgY2JzID0gdGhpcy5ldmVudHNbbmFtZV07XG4gICAgICAgIGlmICghY2JzKSB7XG4gICAgICAgICAgY2JzID0gdGhpcy5ldmVudHNbbmFtZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBjYnMucHVzaChjYik7XG4gICAgICB9LFxuICAgICAgXG4gICAgICBlbWl0OiBmdW5jdGlvbiAobmFtZSwgZXZ0KSB7XG4gICAgICAgIGVhY2godGhpcy5ldmVudHNbbmFtZV0sIGZ1bmN0aW9uIChjYikge1xuICAgICAgICAgIGNiKGV2dCk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobmFtZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIC8vTm93IHRoYXQgdGhlIGVycm9yIGhhbmRsZXIgd2FzIHRyaWdnZXJlZCwgcmVtb3ZlXG4gICAgICAgICAgLy90aGUgbGlzdGVuZXJzLCBzaW5jZSB0aGlzIGJyb2tlbiBNb2R1bGUgaW5zdGFuY2VcbiAgICAgICAgICAvL2NhbiBzdGF5IGFyb3VuZCBmb3IgYSB3aGlsZSBpbiB0aGUgcmVnaXN0cnkuXG4gICAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzW25hbWVdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBmdW5jdGlvbiBjYWxsR2V0TW9kdWxlKGFyZ3MpIHtcbiAgICAgIC8vU2tpcCBtb2R1bGVzIGFscmVhZHkgZGVmaW5lZC5cbiAgICAgIGlmICghaGFzUHJvcChkZWZpbmVkLCBhcmdzWzBdKSkge1xuICAgICAgICBnZXRNb2R1bGUobWFrZU1vZHVsZU1hcChhcmdzWzBdLCBudWxsLCB0cnVlKSkuaW5pdChhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIobm9kZSwgZnVuYywgbmFtZSwgaWVOYW1lKSB7XG4gICAgICAvL0Zhdm9yIGRldGFjaEV2ZW50IGJlY2F1c2Ugb2YgSUU5XG4gICAgICAvL2lzc3VlLCBzZWUgYXR0YWNoRXZlbnQvYWRkRXZlbnRMaXN0ZW5lciBjb21tZW50IGVsc2V3aGVyZVxuICAgICAgLy9pbiB0aGlzIGZpbGUuXG4gICAgICBpZiAobm9kZS5kZXRhY2hFdmVudCAmJiAhaXNPcGVyYSkge1xuICAgICAgICAvL1Byb2JhYmx5IElFLiBJZiBub3QgaXQgd2lsbCB0aHJvdyBhbiBlcnJvciwgd2hpY2ggd2lsbCBiZVxuICAgICAgICAvL3VzZWZ1bCB0byBrbm93LlxuICAgICAgICBpZiAoaWVOYW1lKSB7XG4gICAgICAgICAgbm9kZS5kZXRhY2hFdmVudChpZU5hbWUsIGZ1bmMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZnVuYywgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBHaXZlbiBhbiBldmVudCBmcm9tIGEgc2NyaXB0IG5vZGUsIGdldCB0aGUgcmVxdWlyZWpzIGluZm8gZnJvbSBpdCxcbiAgICAgKiBhbmQgdGhlbiByZW1vdmVzIHRoZSBldmVudCBsaXN0ZW5lcnMgb24gdGhlIG5vZGUuXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZ0XG4gICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRTY3JpcHREYXRhKGV2dCkge1xuICAgICAgLy9Vc2luZyBjdXJyZW50VGFyZ2V0IGluc3RlYWQgb2YgdGFyZ2V0IGZvciBGaXJlZm94IDIuMCdzIHNha2UuIE5vdFxuICAgICAgLy9hbGwgb2xkIGJyb3dzZXJzIHdpbGwgYmUgc3VwcG9ydGVkLCBidXQgdGhpcyBvbmUgd2FzIGVhc3kgZW5vdWdoXG4gICAgICAvL3RvIHN1cHBvcnQgYW5kIHN0aWxsIG1ha2VzIHNlbnNlLlxuICAgICAgdmFyIG5vZGUgPSBldnQuY3VycmVudFRhcmdldCB8fCBldnQuc3JjRWxlbWVudDtcbiAgICAgIFxuICAgICAgLy9SZW1vdmUgdGhlIGxpc3RlbmVycyBvbmNlIGhlcmUuXG4gICAgICByZW1vdmVMaXN0ZW5lcihub2RlLCBjb250ZXh0Lm9uU2NyaXB0TG9hZCwgJ2xvYWQnLCAnb25yZWFkeXN0YXRlY2hhbmdlJyk7XG4gICAgICByZW1vdmVMaXN0ZW5lcihub2RlLCBjb250ZXh0Lm9uU2NyaXB0RXJyb3IsICdlcnJvcicpO1xuICAgICAgXG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlOiBub2RlLFxuICAgICAgICBpZDogbm9kZSAmJiBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXF1aXJlbW9kdWxlJylcbiAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGludGFrZURlZmluZXMoKSB7XG4gICAgICB2YXIgYXJncztcbiAgICAgIFxuICAgICAgLy9BbnkgZGVmaW5lZCBtb2R1bGVzIGluIHRoZSBnbG9iYWwgcXVldWUsIGludGFrZSB0aGVtIG5vdy5cbiAgICAgIHRha2VHbG9iYWxRdWV1ZSgpO1xuICAgICAgXG4gICAgICAvL01ha2Ugc3VyZSBhbnkgcmVtYWluaW5nIGRlZlF1ZXVlIGl0ZW1zIGdldCBwcm9wZXJseSBwcm9jZXNzZWQuXG4gICAgICB3aGlsZSAoZGVmUXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGFyZ3MgPSBkZWZRdWV1ZS5zaGlmdCgpO1xuICAgICAgICBpZiAoYXJnc1swXSA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBvbkVycm9yKG1ha2VFcnJvcignbWlzbWF0Y2gnLCAnTWlzbWF0Y2hlZCBhbm9ueW1vdXMgZGVmaW5lKCkgbW9kdWxlOiAnICtcbiAgICAgICAgICAgIGFyZ3NbYXJncy5sZW5ndGggLSAxXSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vYXJncyBhcmUgaWQsIGRlcHMsIGZhY3RvcnkuIFNob3VsZCBiZSBub3JtYWxpemVkIGJ5IHRoZVxuICAgICAgICAgIC8vZGVmaW5lKCkgZnVuY3Rpb24uXG4gICAgICAgICAgY2FsbEdldE1vZHVsZShhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29udGV4dC5kZWZRdWV1ZU1hcCA9IHt9O1xuICAgIH1cbiAgICBcbiAgICBjb250ZXh0ID0ge1xuICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICBjb250ZXh0TmFtZTogY29udGV4dE5hbWUsXG4gICAgICByZWdpc3RyeTogcmVnaXN0cnksXG4gICAgICBkZWZpbmVkOiBkZWZpbmVkLFxuICAgICAgdXJsRmV0Y2hlZDogdXJsRmV0Y2hlZCxcbiAgICAgIGRlZlF1ZXVlOiBkZWZRdWV1ZSxcbiAgICAgIGRlZlF1ZXVlTWFwOiB7fSxcbiAgICAgIE1vZHVsZTogTW9kdWxlLFxuICAgICAgbWFrZU1vZHVsZU1hcDogbWFrZU1vZHVsZU1hcCxcbiAgICAgIG5leHRUaWNrOiByZXEubmV4dFRpY2ssXG4gICAgICBvbkVycm9yOiBvbkVycm9yLFxuICAgICAgXG4gICAgICAvKipcbiAgICAgICAqIFNldCBhIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBjb250ZXh0LlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGNmZyBjb25maWcgb2JqZWN0IHRvIGludGVncmF0ZS5cbiAgICAgICAqL1xuICAgICAgY29uZmlndXJlOiBmdW5jdGlvbiAoY2ZnKSB7XG4gICAgICAgIC8vTWFrZSBzdXJlIHRoZSBiYXNlVXJsIGVuZHMgaW4gYSBzbGFzaC5cbiAgICAgICAgaWYgKGNmZy5iYXNlVXJsKSB7XG4gICAgICAgICAgaWYgKGNmZy5iYXNlVXJsLmNoYXJBdChjZmcuYmFzZVVybC5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgICAgICAgICBjZmcuYmFzZVVybCArPSAnLyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBDb252ZXJ0IG9sZCBzdHlsZSB1cmxBcmdzIHN0cmluZyB0byBhIGZ1bmN0aW9uLlxuICAgICAgICBpZiAodHlwZW9mIGNmZy51cmxBcmdzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHZhciB1cmxBcmdzID0gY2ZnLnVybEFyZ3M7XG4gICAgICAgICAgY2ZnLnVybEFyZ3MgPSBmdW5jdGlvbihpZCwgdXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHVybEFyZ3M7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9TYXZlIG9mZiB0aGUgcGF0aHMgc2luY2UgdGhleSByZXF1aXJlIHNwZWNpYWwgcHJvY2Vzc2luZyxcbiAgICAgICAgLy90aGV5IGFyZSBhZGRpdGl2ZS5cbiAgICAgICAgdmFyIHNoaW0gPSBjb25maWcuc2hpbSxcbiAgICAgICAgICBvYmpzID0ge1xuICAgICAgICAgICAgcGF0aHM6IHRydWUsXG4gICAgICAgICAgICBidW5kbGVzOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlnOiB0cnVlLFxuICAgICAgICAgICAgbWFwOiB0cnVlXG4gICAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGVhY2hQcm9wKGNmZywgZnVuY3Rpb24gKHZhbHVlLCBwcm9wKSB7XG4gICAgICAgICAgaWYgKG9ianNbcHJvcF0pIHtcbiAgICAgICAgICAgIGlmICghY29uZmlnW3Byb3BdKSB7XG4gICAgICAgICAgICAgIGNvbmZpZ1twcm9wXSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWl4aW4oY29uZmlnW3Byb3BdLCB2YWx1ZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZ1twcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvL1JldmVyc2UgbWFwIHRoZSBidW5kbGVzXG4gICAgICAgIGlmIChjZmcuYnVuZGxlcykge1xuICAgICAgICAgIGVhY2hQcm9wKGNmZy5idW5kbGVzLCBmdW5jdGlvbiAodmFsdWUsIHByb3ApIHtcbiAgICAgICAgICAgIGVhY2godmFsdWUsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgIGlmICh2ICE9PSBwcm9wKSB7XG4gICAgICAgICAgICAgICAgYnVuZGxlc01hcFt2XSA9IHByb3A7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL01lcmdlIHNoaW1cbiAgICAgICAgaWYgKGNmZy5zaGltKSB7XG4gICAgICAgICAgZWFjaFByb3AoY2ZnLnNoaW0sIGZ1bmN0aW9uICh2YWx1ZSwgaWQpIHtcbiAgICAgICAgICAgIC8vTm9ybWFsaXplIHRoZSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHtcbiAgICAgICAgICAgICAgICBkZXBzOiB2YWx1ZVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh2YWx1ZS5leHBvcnRzIHx8IHZhbHVlLmluaXQpICYmICF2YWx1ZS5leHBvcnRzRm4pIHtcbiAgICAgICAgICAgICAgdmFsdWUuZXhwb3J0c0ZuID0gY29udGV4dC5tYWtlU2hpbUV4cG9ydHModmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hpbVtpZF0gPSB2YWx1ZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb25maWcuc2hpbSA9IHNoaW07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vQWRqdXN0IHBhY2thZ2VzIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgaWYgKGNmZy5wYWNrYWdlcykge1xuICAgICAgICAgIGVhY2goY2ZnLnBhY2thZ2VzLCBmdW5jdGlvbiAocGtnT2JqKSB7XG4gICAgICAgICAgICB2YXIgbG9jYXRpb24sIG5hbWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBrZ09iaiA9IHR5cGVvZiBwa2dPYmogPT09ICdzdHJpbmcnID8ge25hbWU6IHBrZ09ian0gOiBwa2dPYmo7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG5hbWUgPSBwa2dPYmoubmFtZTtcbiAgICAgICAgICAgIGxvY2F0aW9uID0gcGtnT2JqLmxvY2F0aW9uO1xuICAgICAgICAgICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICAgICAgICAgIGNvbmZpZy5wYXRoc1tuYW1lXSA9IHBrZ09iai5sb2NhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9TYXZlIHBvaW50ZXIgdG8gbWFpbiBtb2R1bGUgSUQgZm9yIHBrZyBuYW1lLlxuICAgICAgICAgICAgLy9SZW1vdmUgbGVhZGluZyBkb3QgaW4gbWFpbiwgc28gbWFpbiBwYXRocyBhcmUgbm9ybWFsaXplZCxcbiAgICAgICAgICAgIC8vYW5kIHJlbW92ZSBhbnkgdHJhaWxpbmcgLmpzLCBzaW5jZSBkaWZmZXJlbnQgcGFja2FnZVxuICAgICAgICAgICAgLy9lbnZzIGhhdmUgZGlmZmVyZW50IGNvbnZlbnRpb25zOiBzb21lIHVzZSBhIG1vZHVsZSBuYW1lLFxuICAgICAgICAgICAgLy9zb21lIHVzZSBhIGZpbGUgbmFtZS5cbiAgICAgICAgICAgIGNvbmZpZy5wa2dzW25hbWVdID0gcGtnT2JqLm5hbWUgKyAnLycgKyAocGtnT2JqLm1haW4gfHwgJ21haW4nKVxuICAgICAgICAgICAgICAucmVwbGFjZShjdXJyRGlyUmVnRXhwLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoanNTdWZmaXhSZWdFeHAsICcnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9JZiB0aGVyZSBhcmUgYW55IFwid2FpdGluZyB0byBleGVjdXRlXCIgbW9kdWxlcyBpbiB0aGUgcmVnaXN0cnksXG4gICAgICAgIC8vdXBkYXRlIHRoZSBtYXBzIGZvciB0aGVtLCBzaW5jZSB0aGVpciBpbmZvLCBsaWtlIFVSTHMgdG8gbG9hZCxcbiAgICAgICAgLy9tYXkgaGF2ZSBjaGFuZ2VkLlxuICAgICAgICBlYWNoUHJvcChyZWdpc3RyeSwgZnVuY3Rpb24gKG1vZCwgaWQpIHtcbiAgICAgICAgICAvL0lmIG1vZHVsZSBhbHJlYWR5IGhhcyBpbml0IGNhbGxlZCwgc2luY2UgaXQgaXMgdG9vXG4gICAgICAgICAgLy9sYXRlIHRvIG1vZGlmeSB0aGVtLCBhbmQgaWdub3JlIHVubm9ybWFsaXplZCBvbmVzXG4gICAgICAgICAgLy9zaW5jZSB0aGV5IGFyZSB0cmFuc2llbnQuXG4gICAgICAgICAgaWYgKCFtb2QuaW5pdGVkICYmICFtb2QubWFwLnVubm9ybWFsaXplZCkge1xuICAgICAgICAgICAgbW9kLm1hcCA9IG1ha2VNb2R1bGVNYXAoaWQsIG51bGwsIHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvL0lmIGEgZGVwcyBhcnJheSBvciBhIGNvbmZpZyBjYWxsYmFjayBpcyBzcGVjaWZpZWQsIHRoZW4gY2FsbFxuICAgICAgICAvL3JlcXVpcmUgd2l0aCB0aG9zZSBhcmdzLiBUaGlzIGlzIHVzZWZ1bCB3aGVuIHJlcXVpcmUgaXMgZGVmaW5lZCBhcyBhXG4gICAgICAgIC8vY29uZmlnIG9iamVjdCBiZWZvcmUgcmVxdWlyZS5qcyBpcyBsb2FkZWQuXG4gICAgICAgIGlmIChjZmcuZGVwcyB8fCBjZmcuY2FsbGJhY2spIHtcbiAgICAgICAgICBjb250ZXh0LnJlcXVpcmUoY2ZnLmRlcHMgfHwgW10sIGNmZy5jYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcbiAgICAgIG1ha2VTaGltRXhwb3J0czogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGZ1bmN0aW9uIGZuKCkge1xuICAgICAgICAgIHZhciByZXQ7XG4gICAgICAgICAgaWYgKHZhbHVlLmluaXQpIHtcbiAgICAgICAgICAgIHJldCA9IHZhbHVlLmluaXQuYXBwbHkoZ2xvYmFsLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmV0IHx8ICh2YWx1ZS5leHBvcnRzICYmIGdldEdsb2JhbCh2YWx1ZS5leHBvcnRzKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZuO1xuICAgICAgfSxcbiAgICAgIFxuICAgICAgbWFrZVJlcXVpcmU6IGZ1bmN0aW9uIChyZWxNYXAsIG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBsb2NhbFJlcXVpcmUoZGVwcywgY2FsbGJhY2ssIGVycmJhY2spIHtcbiAgICAgICAgICB2YXIgaWQsIG1hcCwgcmVxdWlyZU1vZDtcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVCdWlsZENhbGxiYWNrICYmIGNhbGxiYWNrICYmIGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5fX3JlcXVpcmVKc0J1aWxkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaWYgKHR5cGVvZiBkZXBzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgIC8vSW52YWxpZCBjYWxsXG4gICAgICAgICAgICAgIHJldHVybiBvbkVycm9yKG1ha2VFcnJvcigncmVxdWlyZWFyZ3MnLCAnSW52YWxpZCByZXF1aXJlIGNhbGwnKSwgZXJyYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vSWYgcmVxdWlyZXxleHBvcnRzfG1vZHVsZSBhcmUgcmVxdWVzdGVkLCBnZXQgdGhlXG4gICAgICAgICAgICAvL3ZhbHVlIGZvciB0aGVtIGZyb20gdGhlIHNwZWNpYWwgaGFuZGxlcnMuIENhdmVhdDpcbiAgICAgICAgICAgIC8vdGhpcyBvbmx5IHdvcmtzIHdoaWxlIG1vZHVsZSBpcyBiZWluZyBkZWZpbmVkLlxuICAgICAgICAgICAgaWYgKHJlbE1hcCAmJiBoYXNQcm9wKGhhbmRsZXJzLCBkZXBzKSkge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcnNbZGVwc10ocmVnaXN0cnlbcmVsTWFwLmlkXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vU3luY2hyb25vdXMgYWNjZXNzIHRvIG9uZSBtb2R1bGUuIElmIHJlcXVpcmUuZ2V0IGlzXG4gICAgICAgICAgICAvL2F2YWlsYWJsZSAoYXMgaW4gdGhlIE5vZGUgYWRhcHRlciksIHByZWZlciB0aGF0LlxuICAgICAgICAgICAgaWYgKHJlcS5nZXQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJlcS5nZXQoY29udGV4dCwgZGVwcywgcmVsTWFwLCBsb2NhbFJlcXVpcmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL05vcm1hbGl6ZSBtb2R1bGUgbmFtZSwgaWYgaXQgY29udGFpbnMgLiBvciAuLlxuICAgICAgICAgICAgbWFwID0gbWFrZU1vZHVsZU1hcChkZXBzLCByZWxNYXAsIGZhbHNlLCB0cnVlKTtcbiAgICAgICAgICAgIGlkID0gbWFwLmlkO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWhhc1Byb3AoZGVmaW5lZCwgaWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvbkVycm9yKG1ha2VFcnJvcignbm90bG9hZGVkJywgJ01vZHVsZSBuYW1lIFwiJyArXG4gICAgICAgICAgICAgICAgaWQgK1xuICAgICAgICAgICAgICAgICdcIiBoYXMgbm90IGJlZW4gbG9hZGVkIHlldCBmb3IgY29udGV4dDogJyArXG4gICAgICAgICAgICAgICAgY29udGV4dE5hbWUgK1xuICAgICAgICAgICAgICAgIChyZWxNYXAgPyAnJyA6ICcuIFVzZSByZXF1aXJlKFtdKScpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVmaW5lZFtpZF07XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8vR3JhYiBkZWZpbmVzIHdhaXRpbmcgaW4gdGhlIGdsb2JhbCBxdWV1ZS5cbiAgICAgICAgICBpbnRha2VEZWZpbmVzKCk7XG4gICAgICAgICAgXG4gICAgICAgICAgLy9NYXJrIGFsbCB0aGUgZGVwZW5kZW5jaWVzIGFzIG5lZWRpbmcgdG8gYmUgbG9hZGVkLlxuICAgICAgICAgIGNvbnRleHQubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy9Tb21lIGRlZmluZXMgY291bGQgaGF2ZSBiZWVuIGFkZGVkIHNpbmNlIHRoZVxuICAgICAgICAgICAgLy9yZXF1aXJlIGNhbGwsIGNvbGxlY3QgdGhlbS5cbiAgICAgICAgICAgIGludGFrZURlZmluZXMoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVxdWlyZU1vZCA9IGdldE1vZHVsZShtYWtlTW9kdWxlTWFwKG51bGwsIHJlbE1hcCkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL1N0b3JlIGlmIG1hcCBjb25maWcgc2hvdWxkIGJlIGFwcGxpZWQgdG8gdGhpcyByZXF1aXJlXG4gICAgICAgICAgICAvL2NhbGwgZm9yIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgIHJlcXVpcmVNb2Quc2tpcE1hcCA9IG9wdGlvbnMuc2tpcE1hcDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVxdWlyZU1vZC5pbml0KGRlcHMsIGNhbGxiYWNrLCBlcnJiYWNrLCB7XG4gICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjaGVja0xvYWRlZCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIHJldHVybiBsb2NhbFJlcXVpcmU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIG1peGluKGxvY2FsUmVxdWlyZSwge1xuICAgICAgICAgIGlzQnJvd3NlcjogaXNCcm93c2VyLFxuICAgICAgICAgIFxuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIENvbnZlcnRzIGEgbW9kdWxlIG5hbWUgKyAuZXh0ZW5zaW9uIGludG8gYW4gVVJMIHBhdGguXG4gICAgICAgICAgICogKlJlcXVpcmVzKiB0aGUgdXNlIG9mIGEgbW9kdWxlIG5hbWUuIEl0IGRvZXMgbm90IHN1cHBvcnQgdXNpbmdcbiAgICAgICAgICAgKiBwbGFpbiBVUkxzIGxpa2UgbmFtZVRvVXJsLlxuICAgICAgICAgICAqL1xuICAgICAgICAgIHRvVXJsOiBmdW5jdGlvbiAobW9kdWxlTmFtZVBsdXNFeHQpIHtcbiAgICAgICAgICAgIHZhciBleHQsXG4gICAgICAgICAgICAgIGluZGV4ID0gbW9kdWxlTmFtZVBsdXNFeHQubGFzdEluZGV4T2YoJy4nKSxcbiAgICAgICAgICAgICAgc2VnbWVudCA9IG1vZHVsZU5hbWVQbHVzRXh0LnNwbGl0KCcvJylbMF0sXG4gICAgICAgICAgICAgIGlzUmVsYXRpdmUgPSBzZWdtZW50ID09PSAnLicgfHwgc2VnbWVudCA9PT0gJy4uJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9IYXZlIGEgZmlsZSBleHRlbnNpb24gYWxpYXMsIGFuZCBpdCBpcyBub3QgdGhlXG4gICAgICAgICAgICAvL2RvdHMgZnJvbSBhIHJlbGF0aXZlIHBhdGguXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xICYmICghaXNSZWxhdGl2ZSB8fCBpbmRleCA+IDEpKSB7XG4gICAgICAgICAgICAgIGV4dCA9IG1vZHVsZU5hbWVQbHVzRXh0LnN1YnN0cmluZyhpbmRleCwgbW9kdWxlTmFtZVBsdXNFeHQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgbW9kdWxlTmFtZVBsdXNFeHQgPSBtb2R1bGVOYW1lUGx1c0V4dC5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dC5uYW1lVG9Vcmwobm9ybWFsaXplKG1vZHVsZU5hbWVQbHVzRXh0LFxuICAgICAgICAgICAgICByZWxNYXAgJiYgcmVsTWFwLmlkLCB0cnVlKSwgZXh0LCAgdHJ1ZSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcbiAgICAgICAgICBkZWZpbmVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBoYXNQcm9wKGRlZmluZWQsIG1ha2VNb2R1bGVNYXAoaWQsIHJlbE1hcCwgZmFsc2UsIHRydWUpLmlkKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIFxuICAgICAgICAgIHNwZWNpZmllZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBpZCA9IG1ha2VNb2R1bGVNYXAoaWQsIHJlbE1hcCwgZmFsc2UsIHRydWUpLmlkO1xuICAgICAgICAgICAgcmV0dXJuIGhhc1Byb3AoZGVmaW5lZCwgaWQpIHx8IGhhc1Byb3AocmVnaXN0cnksIGlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy9Pbmx5IGFsbG93IHVuZGVmIG9uIHRvcCBsZXZlbCByZXF1aXJlIGNhbGxzXG4gICAgICAgIGlmICghcmVsTWFwKSB7XG4gICAgICAgICAgbG9jYWxSZXF1aXJlLnVuZGVmID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAvL0JpbmQgYW55IHdhaXRpbmcgZGVmaW5lKCkgY2FsbHMgdG8gdGhpcyBjb250ZXh0LFxuICAgICAgICAgICAgLy9maXggZm9yICM0MDhcbiAgICAgICAgICAgIHRha2VHbG9iYWxRdWV1ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbWFwID0gbWFrZU1vZHVsZU1hcChpZCwgcmVsTWFwLCB0cnVlKSxcbiAgICAgICAgICAgICAgbW9kID0gZ2V0T3duKHJlZ2lzdHJ5LCBpZCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1vZC51bmRlZmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlbW92ZVNjcmlwdChpZCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRlbGV0ZSBkZWZpbmVkW2lkXTtcbiAgICAgICAgICAgIGRlbGV0ZSB1cmxGZXRjaGVkW21hcC51cmxdO1xuICAgICAgICAgICAgZGVsZXRlIHVuZGVmRXZlbnRzW2lkXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9DbGVhbiBxdWV1ZWQgZGVmaW5lcyB0b28uIEdvIGJhY2t3YXJkc1xuICAgICAgICAgICAgLy9pbiBhcnJheSBzbyB0aGF0IHRoZSBzcGxpY2VzIGRvIG5vdFxuICAgICAgICAgICAgLy9tZXNzIHVwIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAgICBlYWNoUmV2ZXJzZShkZWZRdWV1ZSwgZnVuY3Rpb24oYXJncywgaSkge1xuICAgICAgICAgICAgICBpZiAoYXJnc1swXSA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICBkZWZRdWV1ZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVsZXRlIGNvbnRleHQuZGVmUXVldWVNYXBbaWRdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobW9kKSB7XG4gICAgICAgICAgICAgIC8vSG9sZCBvbiB0byBsaXN0ZW5lcnMgaW4gY2FzZSB0aGVcbiAgICAgICAgICAgICAgLy9tb2R1bGUgd2lsbCBiZSBhdHRlbXB0ZWQgdG8gYmUgcmVsb2FkZWRcbiAgICAgICAgICAgICAgLy91c2luZyBhIGRpZmZlcmVudCBjb25maWcuXG4gICAgICAgICAgICAgIGlmIChtb2QuZXZlbnRzLmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB1bmRlZkV2ZW50c1tpZF0gPSBtb2QuZXZlbnRzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBjbGVhblJlZ2lzdHJ5KGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbG9jYWxSZXF1aXJlO1xuICAgICAgfSxcbiAgICAgIFxuICAgICAgLyoqXG4gICAgICAgKiBDYWxsZWQgdG8gZW5hYmxlIGEgbW9kdWxlIGlmIGl0IGlzIHN0aWxsIGluIHRoZSByZWdpc3RyeVxuICAgICAgICogYXdhaXRpbmcgZW5hYmxlbWVudC4gQSBzZWNvbmQgYXJnLCBwYXJlbnQsIHRoZSBwYXJlbnQgbW9kdWxlLFxuICAgICAgICogaXMgcGFzc2VkIGluIGZvciBjb250ZXh0LCB3aGVuIHRoaXMgbWV0aG9kIGlzIG92ZXJyaWRkZW4gYnlcbiAgICAgICAqIHRoZSBvcHRpbWl6ZXIuIE5vdCBzaG93biBoZXJlIHRvIGtlZXAgY29kZSBjb21wYWN0LlxuICAgICAgICovXG4gICAgICBlbmFibGU6IGZ1bmN0aW9uIChkZXBNYXApIHtcbiAgICAgICAgdmFyIG1vZCA9IGdldE93bihyZWdpc3RyeSwgZGVwTWFwLmlkKTtcbiAgICAgICAgaWYgKG1vZCkge1xuICAgICAgICAgIGdldE1vZHVsZShkZXBNYXApLmVuYWJsZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXG4gICAgICAvKipcbiAgICAgICAqIEludGVybmFsIG1ldGhvZCB1c2VkIGJ5IGVudmlyb25tZW50IGFkYXB0ZXJzIHRvIGNvbXBsZXRlIGEgbG9hZCBldmVudC5cbiAgICAgICAqIEEgbG9hZCBldmVudCBjb3VsZCBiZSBhIHNjcmlwdCBsb2FkIG9yIGp1c3QgYSBsb2FkIHBhc3MgZnJvbSBhIHN5bmNocm9ub3VzXG4gICAgICAgKiBsb2FkIGNhbGwuXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kdWxlTmFtZSB0aGUgbmFtZSBvZiB0aGUgbW9kdWxlIHRvIHBvdGVudGlhbGx5IGNvbXBsZXRlLlxuICAgICAgICovXG4gICAgICBjb21wbGV0ZUxvYWQ6IGZ1bmN0aW9uIChtb2R1bGVOYW1lKSB7XG4gICAgICAgIHZhciBmb3VuZCwgYXJncywgbW9kLFxuICAgICAgICAgIHNoaW0gPSBnZXRPd24oY29uZmlnLnNoaW0sIG1vZHVsZU5hbWUpIHx8IHt9LFxuICAgICAgICAgIHNoRXhwb3J0cyA9IHNoaW0uZXhwb3J0cztcbiAgICAgICAgXG4gICAgICAgIHRha2VHbG9iYWxRdWV1ZSgpO1xuICAgICAgICBcbiAgICAgICAgd2hpbGUgKGRlZlF1ZXVlLmxlbmd0aCkge1xuICAgICAgICAgIGFyZ3MgPSBkZWZRdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgIGlmIChhcmdzWzBdID09PSBudWxsKSB7XG4gICAgICAgICAgICBhcmdzWzBdID0gbW9kdWxlTmFtZTtcbiAgICAgICAgICAgIC8vSWYgYWxyZWFkeSBmb3VuZCBhbiBhbm9ueW1vdXMgbW9kdWxlIGFuZCBib3VuZCBpdFxuICAgICAgICAgICAgLy90byB0aGlzIG5hbWUsIHRoZW4gdGhpcyBpcyBzb21lIG90aGVyIGFub24gbW9kdWxlXG4gICAgICAgICAgICAvL3dhaXRpbmcgZm9yIGl0cyBjb21wbGV0ZUxvYWQgdG8gZmlyZS5cbiAgICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IG1vZHVsZU5hbWUpIHtcbiAgICAgICAgICAgIC8vRm91bmQgbWF0Y2hpbmcgZGVmaW5lIGNhbGwgZm9yIHRoaXMgc2NyaXB0IVxuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBjYWxsR2V0TW9kdWxlKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQuZGVmUXVldWVNYXAgPSB7fTtcbiAgICAgICAgXG4gICAgICAgIC8vRG8gdGhpcyBhZnRlciB0aGUgY3ljbGUgb2YgY2FsbEdldE1vZHVsZSBpbiBjYXNlIHRoZSByZXN1bHRcbiAgICAgICAgLy9vZiB0aG9zZSBjYWxscy9pbml0IGNhbGxzIGNoYW5nZXMgdGhlIHJlZ2lzdHJ5LlxuICAgICAgICBtb2QgPSBnZXRPd24ocmVnaXN0cnksIG1vZHVsZU5hbWUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFmb3VuZCAmJiAhaGFzUHJvcChkZWZpbmVkLCBtb2R1bGVOYW1lKSAmJiBtb2QgJiYgIW1vZC5pbml0ZWQpIHtcbiAgICAgICAgICBpZiAoY29uZmlnLmVuZm9yY2VEZWZpbmUgJiYgKCFzaEV4cG9ydHMgfHwgIWdldEdsb2JhbChzaEV4cG9ydHMpKSkge1xuICAgICAgICAgICAgaWYgKGhhc1BhdGhGYWxsYmFjayhtb2R1bGVOYW1lKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gb25FcnJvcihtYWtlRXJyb3IoJ25vZGVmaW5lJyxcbiAgICAgICAgICAgICAgICAnTm8gZGVmaW5lIGNhbGwgZm9yICcgKyBtb2R1bGVOYW1lLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgW21vZHVsZU5hbWVdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vQSBzY3JpcHQgdGhhdCBkb2VzIG5vdCBjYWxsIGRlZmluZSgpLCBzbyBqdXN0IHNpbXVsYXRlXG4gICAgICAgICAgICAvL3RoZSBjYWxsIGZvciBpdC5cbiAgICAgICAgICAgIGNhbGxHZXRNb2R1bGUoW21vZHVsZU5hbWUsIChzaGltLmRlcHMgfHwgW10pLCBzaGltLmV4cG9ydHNGbl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY2hlY2tMb2FkZWQoKTtcbiAgICAgIH0sXG4gICAgICBcbiAgICAgIC8qKlxuICAgICAgICogQ29udmVydHMgYSBtb2R1bGUgbmFtZSB0byBhIGZpbGUgcGF0aC4gU3VwcG9ydHMgY2FzZXMgd2hlcmVcbiAgICAgICAqIG1vZHVsZU5hbWUgbWF5IGFjdHVhbGx5IGJlIGp1c3QgYW4gVVJMLlxuICAgICAgICogTm90ZSB0aGF0IGl0ICoqZG9lcyBub3QqKiBjYWxsIG5vcm1hbGl6ZSBvbiB0aGUgbW9kdWxlTmFtZSxcbiAgICAgICAqIGl0IGlzIGFzc3VtZWQgdG8gaGF2ZSBhbHJlYWR5IGJlZW4gbm9ybWFsaXplZC4gVGhpcyBpcyBhblxuICAgICAgICogaW50ZXJuYWwgQVBJLCBub3QgYSBwdWJsaWMgb25lLiBVc2UgdG9VcmwgZm9yIHRoZSBwdWJsaWMgQVBJLlxuICAgICAgICovXG4gICAgICBuYW1lVG9Vcmw6IGZ1bmN0aW9uIChtb2R1bGVOYW1lLCBleHQsIHNraXBFeHQpIHtcbiAgICAgICAgdmFyIHBhdGhzLCBzeW1zLCBpLCBwYXJlbnRNb2R1bGUsIHVybCxcbiAgICAgICAgICBwYXJlbnRQYXRoLCBidW5kbGVJZCxcbiAgICAgICAgICBwa2dNYWluID0gZ2V0T3duKGNvbmZpZy5wa2dzLCBtb2R1bGVOYW1lKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChwa2dNYWluKSB7XG4gICAgICAgICAgbW9kdWxlTmFtZSA9IHBrZ01haW47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGJ1bmRsZUlkID0gZ2V0T3duKGJ1bmRsZXNNYXAsIG1vZHVsZU5hbWUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGJ1bmRsZUlkKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQubmFtZVRvVXJsKGJ1bmRsZUlkLCBleHQsIHNraXBFeHQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL0lmIGEgY29sb24gaXMgaW4gdGhlIFVSTCwgaXQgaW5kaWNhdGVzIGEgcHJvdG9jb2wgaXMgdXNlZCBhbmQgaXQgaXMganVzdFxuICAgICAgICAvL2FuIFVSTCB0byBhIGZpbGUsIG9yIGlmIGl0IHN0YXJ0cyB3aXRoIGEgc2xhc2gsIGNvbnRhaW5zIGEgcXVlcnkgYXJnIChpLmUuID8pXG4gICAgICAgIC8vb3IgZW5kcyB3aXRoIC5qcywgdGhlbiBhc3N1bWUgdGhlIHVzZXIgbWVhbnQgdG8gdXNlIGFuIHVybCBhbmQgbm90IGEgbW9kdWxlIGlkLlxuICAgICAgICAvL1RoZSBzbGFzaCBpcyBpbXBvcnRhbnQgZm9yIHByb3RvY29sLWxlc3MgVVJMcyBhcyB3ZWxsIGFzIGZ1bGwgcGF0aHMuXG4gICAgICAgIGlmIChyZXEuanNFeHRSZWdFeHAudGVzdChtb2R1bGVOYW1lKSkge1xuICAgICAgICAgIC8vSnVzdCBhIHBsYWluIHBhdGgsIG5vdCBtb2R1bGUgbmFtZSBsb29rdXAsIHNvIGp1c3QgcmV0dXJuIGl0LlxuICAgICAgICAgIC8vQWRkIGV4dGVuc2lvbiBpZiBpdCBpcyBpbmNsdWRlZC4gVGhpcyBpcyBhIGJpdCB3b25reSwgb25seSBub24tLmpzIHRoaW5ncyBwYXNzXG4gICAgICAgICAgLy9hbiBleHRlbnNpb24sIHRoaXMgbWV0aG9kIHByb2JhYmx5IG5lZWRzIHRvIGJlIHJld29ya2VkLlxuICAgICAgICAgIHVybCA9IG1vZHVsZU5hbWUgKyAoZXh0IHx8ICcnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL0EgbW9kdWxlIHRoYXQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIGEgcGF0aC5cbiAgICAgICAgICBwYXRocyA9IGNvbmZpZy5wYXRocztcbiAgICAgICAgICBcbiAgICAgICAgICBzeW1zID0gbW9kdWxlTmFtZS5zcGxpdCgnLycpO1xuICAgICAgICAgIC8vRm9yIGVhY2ggbW9kdWxlIG5hbWUgc2VnbWVudCwgc2VlIGlmIHRoZXJlIGlzIGEgcGF0aFxuICAgICAgICAgIC8vcmVnaXN0ZXJlZCBmb3IgaXQuIFN0YXJ0IHdpdGggbW9zdCBzcGVjaWZpYyBuYW1lXG4gICAgICAgICAgLy9hbmQgd29yayB1cCBmcm9tIGl0LlxuICAgICAgICAgIGZvciAoaSA9IHN5bXMubGVuZ3RoOyBpID4gMDsgaSAtPSAxKSB7XG4gICAgICAgICAgICBwYXJlbnRNb2R1bGUgPSBzeW1zLnNsaWNlKDAsIGkpLmpvaW4oJy8nKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcGFyZW50UGF0aCA9IGdldE93bihwYXRocywgcGFyZW50TW9kdWxlKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRQYXRoKSB7XG4gICAgICAgICAgICAgIC8vSWYgYW4gYXJyYXksIGl0IG1lYW5zIHRoZXJlIGFyZSBhIGZldyBjaG9pY2VzLFxuICAgICAgICAgICAgICAvL0Nob29zZSB0aGUgb25lIHRoYXQgaXMgZGVzaXJlZFxuICAgICAgICAgICAgICBpZiAoaXNBcnJheShwYXJlbnRQYXRoKSkge1xuICAgICAgICAgICAgICAgIHBhcmVudFBhdGggPSBwYXJlbnRQYXRoWzBdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN5bXMuc3BsaWNlKDAsIGksIHBhcmVudFBhdGgpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgLy9Kb2luIHRoZSBwYXRoIHBhcnRzIHRvZ2V0aGVyLCB0aGVuIGZpZ3VyZSBvdXQgaWYgYmFzZVVybCBpcyBuZWVkZWQuXG4gICAgICAgICAgdXJsID0gc3ltcy5qb2luKCcvJyk7XG4gICAgICAgICAgdXJsICs9IChleHQgfHwgKC9eZGF0YVxcOnxeYmxvYlxcOnxcXD8vLnRlc3QodXJsKSB8fCBza2lwRXh0ID8gJycgOiAnLmpzJykpO1xuICAgICAgICAgIHVybCA9ICh1cmwuY2hhckF0KDApID09PSAnLycgfHwgdXJsLm1hdGNoKC9eW1xcd1xcK1xcLlxcLV0rOi8pID8gJycgOiBjb25maWcuYmFzZVVybCkgKyB1cmw7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBjb25maWcudXJsQXJncyAmJiAhL15ibG9iXFw6Ly50ZXN0KHVybCkgP1xuICAgICAgICAgIHVybCArIGNvbmZpZy51cmxBcmdzKG1vZHVsZU5hbWUsIHVybCkgOiB1cmw7XG4gICAgICB9LFxuICAgICAgXG4gICAgICAvL0RlbGVnYXRlcyB0byByZXEubG9hZC4gQnJva2VuIG91dCBhcyBhIHNlcGFyYXRlIGZ1bmN0aW9uIHRvXG4gICAgICAvL2FsbG93IG92ZXJyaWRpbmcgaW4gdGhlIG9wdGltaXplci5cbiAgICAgIGxvYWQ6IGZ1bmN0aW9uIChpZCwgdXJsKSB7XG4gICAgICAgIHJlcS5sb2FkKGNvbnRleHQsIGlkLCB1cmwpO1xuICAgICAgfSxcbiAgICAgIFxuICAgICAgLyoqXG4gICAgICAgKiBFeGVjdXRlcyBhIG1vZHVsZSBjYWxsYmFjayBmdW5jdGlvbi4gQnJva2VuIG91dCBhcyBhIHNlcGFyYXRlIGZ1bmN0aW9uXG4gICAgICAgKiBzb2xlbHkgdG8gYWxsb3cgdGhlIGJ1aWxkIHN5c3RlbSB0byBzZXF1ZW5jZSB0aGUgZmlsZXMgaW4gdGhlIGJ1aWx0XG4gICAgICAgKiBsYXllciBpbiB0aGUgcmlnaHQgc2VxdWVuY2UuXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgZXhlY0NiOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGFyZ3MsIGV4cG9ydHMpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KGV4cG9ydHMsIGFyZ3MpO1xuICAgICAgfSxcbiAgICAgIFxuICAgICAgLyoqXG4gICAgICAgKiBjYWxsYmFjayBmb3Igc2NyaXB0IGxvYWRzLCB1c2VkIHRvIGNoZWNrIHN0YXR1cyBvZiBsb2FkaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2dCB0aGUgZXZlbnQgZnJvbSB0aGUgYnJvd3NlciBmb3IgdGhlIHNjcmlwdFxuICAgICAgICogdGhhdCB3YXMgbG9hZGVkLlxuICAgICAgICovXG4gICAgICBvblNjcmlwdExvYWQ6IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgLy9Vc2luZyBjdXJyZW50VGFyZ2V0IGluc3RlYWQgb2YgdGFyZ2V0IGZvciBGaXJlZm94IDIuMCdzIHNha2UuIE5vdFxuICAgICAgICAvL2FsbCBvbGQgYnJvd3NlcnMgd2lsbCBiZSBzdXBwb3J0ZWQsIGJ1dCB0aGlzIG9uZSB3YXMgZWFzeSBlbm91Z2hcbiAgICAgICAgLy90byBzdXBwb3J0IGFuZCBzdGlsbCBtYWtlcyBzZW5zZS5cbiAgICAgICAgaWYgKGV2dC50eXBlID09PSAnbG9hZCcgfHxcbiAgICAgICAgICAocmVhZHlSZWdFeHAudGVzdCgoZXZ0LmN1cnJlbnRUYXJnZXQgfHwgZXZ0LnNyY0VsZW1lbnQpLnJlYWR5U3RhdGUpKSkge1xuICAgICAgICAgIC8vUmVzZXQgaW50ZXJhY3RpdmUgc2NyaXB0IHNvIGEgc2NyaXB0IG5vZGUgaXMgbm90IGhlbGQgb250byBmb3JcbiAgICAgICAgICAvL3RvIGxvbmcuXG4gICAgICAgICAgaW50ZXJhY3RpdmVTY3JpcHQgPSBudWxsO1xuICAgICAgICAgIFxuICAgICAgICAgIC8vUHVsbCBvdXQgdGhlIG5hbWUgb2YgdGhlIG1vZHVsZSBhbmQgdGhlIGNvbnRleHQuXG4gICAgICAgICAgdmFyIGRhdGEgPSBnZXRTY3JpcHREYXRhKGV2dCk7XG4gICAgICAgICAgY29udGV4dC5jb21wbGV0ZUxvYWQoZGF0YS5pZCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcbiAgICAgIC8qKlxuICAgICAgICogQ2FsbGJhY2sgZm9yIHNjcmlwdCBlcnJvcnMuXG4gICAgICAgKi9cbiAgICAgIG9uU2NyaXB0RXJyb3I6IGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBnZXRTY3JpcHREYXRhKGV2dCk7XG4gICAgICAgIGlmICghaGFzUGF0aEZhbGxiYWNrKGRhdGEuaWQpKSB7XG4gICAgICAgICAgdmFyIHBhcmVudHMgPSBbXTtcbiAgICAgICAgICBlYWNoUHJvcChyZWdpc3RyeSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKCdfQHInKSAhPT0gMCkge1xuICAgICAgICAgICAgICBlYWNoKHZhbHVlLmRlcE1hcHMsIGZ1bmN0aW9uKGRlcE1hcCkge1xuICAgICAgICAgICAgICAgIGlmIChkZXBNYXAuaWQgPT09IGRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgIHBhcmVudHMucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gb25FcnJvcihtYWtlRXJyb3IoJ3NjcmlwdGVycm9yJywgJ1NjcmlwdCBlcnJvciBmb3IgXCInICsgZGF0YS5pZCArXG4gICAgICAgICAgICAocGFyZW50cy5sZW5ndGggP1xuICAgICAgICAgICAgICAnXCIsIG5lZWRlZCBieTogJyArIHBhcmVudHMuam9pbignLCAnKSA6XG4gICAgICAgICAgICAgICdcIicpLCBldnQsIFtkYXRhLmlkXSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBjb250ZXh0LnJlcXVpcmUgPSBjb250ZXh0Lm1ha2VSZXF1aXJlKCk7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBNYWluIGVudHJ5IHBvaW50LlxuICAgKlxuICAgKiBJZiB0aGUgb25seSBhcmd1bWVudCB0byByZXF1aXJlIGlzIGEgc3RyaW5nLCB0aGVuIHRoZSBtb2R1bGUgdGhhdFxuICAgKiBpcyByZXByZXNlbnRlZCBieSB0aGF0IHN0cmluZyBpcyBmZXRjaGVkIGZvciB0aGUgYXBwcm9wcmlhdGUgY29udGV4dC5cbiAgICpcbiAgICogSWYgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGFuIGFycmF5LCB0aGVuIGl0IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiBhcnJheVxuICAgKiBvZiBkZXBlbmRlbmN5IHN0cmluZyBuYW1lcyB0byBmZXRjaC4gQW4gb3B0aW9uYWwgZnVuY3Rpb24gY2FsbGJhY2sgY2FuXG4gICAqIGJlIHNwZWNpZmllZCB0byBleGVjdXRlIHdoZW4gYWxsIG9mIHRob3NlIGRlcGVuZGVuY2llcyBhcmUgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBNYWtlIGEgbG9jYWwgcmVxIHZhcmlhYmxlIHRvIGhlbHAgQ2FqYSBjb21wbGlhbmNlIChpdCBhc3N1bWVzIHRoaW5nc1xuICAgKiBvbiBhIHJlcXVpcmUgdGhhdCBhcmUgbm90IHN0YW5kYXJkaXplZCksIGFuZCB0byBnaXZlIGEgc2hvcnRcbiAgICogbmFtZSBmb3IgbWluaWZpY2F0aW9uL2xvY2FsIHNjb3BlIHVzZS5cbiAgICovXG4gIHJlcSA9IHJlcXVpcmVqcyA9IGZ1bmN0aW9uIChkZXBzLCBjYWxsYmFjaywgZXJyYmFjaywgb3B0aW9uYWwpIHtcbiAgICBcbiAgICAvL0ZpbmQgdGhlIHJpZ2h0IGNvbnRleHQsIHVzZSBkZWZhdWx0XG4gICAgdmFyIGNvbnRleHQsIGNvbmZpZyxcbiAgICAgIGNvbnRleHROYW1lID0gZGVmQ29udGV4dE5hbWU7XG4gICAgXG4gICAgLy8gRGV0ZXJtaW5lIGlmIGhhdmUgY29uZmlnIG9iamVjdCBpbiB0aGUgY2FsbC5cbiAgICBpZiAoIWlzQXJyYXkoZGVwcykgJiYgdHlwZW9mIGRlcHMgIT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBkZXBzIGlzIGEgY29uZmlnIG9iamVjdFxuICAgICAgY29uZmlnID0gZGVwcztcbiAgICAgIGlmIChpc0FycmF5KGNhbGxiYWNrKSkge1xuICAgICAgICAvLyBBZGp1c3QgYXJncyBpZiB0aGVyZSBhcmUgZGVwZW5kZW5jaWVzXG4gICAgICAgIGRlcHMgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSBlcnJiYWNrO1xuICAgICAgICBlcnJiYWNrID0gb3B0aW9uYWw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXBzID0gW107XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmIChjb25maWcgJiYgY29uZmlnLmNvbnRleHQpIHtcbiAgICAgIGNvbnRleHROYW1lID0gY29uZmlnLmNvbnRleHQ7XG4gICAgfVxuICAgIFxuICAgIGNvbnRleHQgPSBnZXRPd24oY29udGV4dHMsIGNvbnRleHROYW1lKTtcbiAgICBpZiAoIWNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQgPSBjb250ZXh0c1tjb250ZXh0TmFtZV0gPSByZXEucy5uZXdDb250ZXh0KGNvbnRleHROYW1lKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgY29udGV4dC5jb25maWd1cmUoY29uZmlnKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGNvbnRleHQucmVxdWlyZShkZXBzLCBjYWxsYmFjaywgZXJyYmFjayk7XG4gIH07XG4gIFxuICAvKipcbiAgICogU3VwcG9ydCByZXF1aXJlLmNvbmZpZygpIHRvIG1ha2UgaXQgZWFzaWVyIHRvIGNvb3BlcmF0ZSB3aXRoIG90aGVyXG4gICAqIEFNRCBsb2FkZXJzIG9uIGdsb2JhbGx5IGFncmVlZCBuYW1lcy5cbiAgICovXG4gIHJlcS5jb25maWcgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgcmV0dXJuIHJlcShjb25maWcpO1xuICB9O1xuICBcbiAgLyoqXG4gICAqIEV4ZWN1dGUgc29tZXRoaW5nIGFmdGVyIHRoZSBjdXJyZW50IHRpY2tcbiAgICogb2YgdGhlIGV2ZW50IGxvb3AuIE92ZXJyaWRlIGZvciBvdGhlciBlbnZzXG4gICAqIHRoYXQgaGF2ZSBhIGJldHRlciBzb2x1dGlvbiB0aGFuIHNldFRpbWVvdXQuXG4gICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiBmdW5jdGlvbiB0byBleGVjdXRlIGxhdGVyLlxuICAgKi9cbiAgcmVxLm5leHRUaWNrID0gdHlwZW9mIHNldFRpbWVvdXQgIT09ICd1bmRlZmluZWQnID8gZnVuY3Rpb24gKGZuKSB7XG4gICAgc2V0VGltZW91dChmbiwgNCk7XG4gIH0gOiBmdW5jdGlvbiAoZm4pIHsgZm4oKTsgfTtcbiAgXG4gIC8qKlxuICAgKiBFeHBvcnQgcmVxdWlyZSBhcyBhIGdsb2JhbCwgYnV0IG9ubHkgaWYgaXQgZG9lcyBub3QgYWxyZWFkeSBleGlzdC5cbiAgICovXG4gIGlmICghcmVxdWlyZSkge1xuICAgIHJlcXVpcmUgPSByZXE7XG4gIH1cbiAgXG4gIHJlcS52ZXJzaW9uID0gdmVyc2lvbjtcbiAgXG4gIC8vVXNlZCB0byBmaWx0ZXIgb3V0IGRlcGVuZGVuY2llcyB0aGF0IGFyZSBhbHJlYWR5IHBhdGhzLlxuICByZXEuanNFeHRSZWdFeHAgPSAvXlxcL3w6fFxcP3xcXC5qcyQvO1xuICByZXEuaXNCcm93c2VyID0gaXNCcm93c2VyO1xuICBzID0gcmVxLnMgPSB7XG4gICAgY29udGV4dHM6IGNvbnRleHRzLFxuICAgIG5ld0NvbnRleHQ6IG5ld0NvbnRleHRcbiAgfTtcbiAgXG4gIC8vQ3JlYXRlIGRlZmF1bHQgY29udGV4dC5cbiAgcmVxKHt9KTtcbiAgXG4gIC8vRXhwb3J0cyBzb21lIGNvbnRleHQtc2Vuc2l0aXZlIG1ldGhvZHMgb24gZ2xvYmFsIHJlcXVpcmUuXG4gIGVhY2goW1xuICAgICd0b1VybCcsXG4gICAgJ3VuZGVmJyxcbiAgICAnZGVmaW5lZCcsXG4gICAgJ3NwZWNpZmllZCdcbiAgXSwgZnVuY3Rpb24gKHByb3ApIHtcbiAgICAvL1JlZmVyZW5jZSBmcm9tIGNvbnRleHRzIGluc3RlYWQgb2YgZWFybHkgYmluZGluZyB0byBkZWZhdWx0IGNvbnRleHQsXG4gICAgLy9zbyB0aGF0IGR1cmluZyBidWlsZHMsIHRoZSBsYXRlc3QgaW5zdGFuY2Ugb2YgdGhlIGRlZmF1bHQgY29udGV4dFxuICAgIC8vd2l0aCBpdHMgY29uZmlnIGdldHMgdXNlZC5cbiAgICByZXFbcHJvcF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY3R4ID0gY29udGV4dHNbZGVmQ29udGV4dE5hbWVdO1xuICAgICAgcmV0dXJuIGN0eC5yZXF1aXJlW3Byb3BdLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcbiAgXG4gIGlmIChpc0Jyb3dzZXIpIHtcbiAgICBoZWFkID0gcy5oZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICAvL0lmIEJBU0UgdGFnIGlzIGluIHBsYXksIHVzaW5nIGFwcGVuZENoaWxkIGlzIGEgcHJvYmxlbSBmb3IgSUU2LlxuICAgIC8vV2hlbiB0aGF0IGJyb3dzZXIgZGllcywgdGhpcyBjYW4gYmUgcmVtb3ZlZC4gRGV0YWlscyBpbiB0aGlzIGpRdWVyeSBidWc6XG4gICAgLy9odHRwOi8vZGV2LmpxdWVyeS5jb20vdGlja2V0LzI3MDlcbiAgICBiYXNlRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdiYXNlJylbMF07XG4gICAgaWYgKGJhc2VFbGVtZW50KSB7XG4gICAgICBoZWFkID0gcy5oZWFkID0gYmFzZUVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICB9XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBBbnkgZXJyb3JzIHRoYXQgcmVxdWlyZSBleHBsaWNpdGx5IGdlbmVyYXRlcyB3aWxsIGJlIHBhc3NlZCB0byB0aGlzXG4gICAqIGZ1bmN0aW9uLiBJbnRlcmNlcHQvb3ZlcnJpZGUgaXQgaWYgeW91IHdhbnQgY3VzdG9tIGVycm9yIGhhbmRsaW5nLlxuICAgKiBAcGFyYW0ge0Vycm9yfSBlcnIgdGhlIGVycm9yIG9iamVjdC5cbiAgICovXG4gIHJlcS5vbkVycm9yID0gZGVmYXVsdE9uRXJyb3I7XG4gIFxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgbm9kZSBmb3IgdGhlIGxvYWQgY29tbWFuZC4gT25seSB1c2VkIGluIGJyb3dzZXIgZW52cy5cbiAgICovXG4gIHJlcS5jcmVhdGVOb2RlID0gZnVuY3Rpb24gKGNvbmZpZywgbW9kdWxlTmFtZSwgdXJsKSB7XG4gICAgdmFyIG5vZGUgPSBjb25maWcueGh0bWwgP1xuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJywgJ2h0bWw6c2NyaXB0JykgOlxuICAgICAgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgbm9kZS50eXBlID0gY29uZmlnLnNjcmlwdFR5cGUgfHwgJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgbm9kZS5jaGFyc2V0ID0gJ3V0Zi04JztcbiAgICBub2RlLmFzeW5jID0gdHJ1ZTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBEb2VzIHRoZSByZXF1ZXN0IHRvIGxvYWQgYSBtb2R1bGUgZm9yIHRoZSBicm93c2VyIGNhc2UuXG4gICAqIE1ha2UgdGhpcyBhIHNlcGFyYXRlIGZ1bmN0aW9uIHRvIGFsbG93IG90aGVyIGVudmlyb25tZW50c1xuICAgKiB0byBvdmVycmlkZSBpdC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHQgdGhlIHJlcXVpcmUgY29udGV4dCB0byBmaW5kIHN0YXRlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbW9kdWxlTmFtZSB0aGUgbmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gdXJsIHRoZSBVUkwgdG8gdGhlIG1vZHVsZS5cbiAgICovXG4gIHJlcS5sb2FkID0gZnVuY3Rpb24gKGNvbnRleHQsIG1vZHVsZU5hbWUsIHVybCkge1xuICAgIHZhciBjb25maWcgPSAoY29udGV4dCAmJiBjb250ZXh0LmNvbmZpZykgfHwge30sXG4gICAgICBub2RlO1xuICAgIGlmIChpc0Jyb3dzZXIpIHtcbiAgICAgIC8vSW4gdGhlIGJyb3dzZXIgc28gdXNlIGEgc2NyaXB0IHRhZ1xuICAgICAgbm9kZSA9IHJlcS5jcmVhdGVOb2RlKGNvbmZpZywgbW9kdWxlTmFtZSwgdXJsKTtcbiAgICAgIFxuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtcmVxdWlyZWNvbnRleHQnLCBjb250ZXh0LmNvbnRleHROYW1lKTtcbiAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdkYXRhLXJlcXVpcmVtb2R1bGUnLCBtb2R1bGVOYW1lKTtcbiAgICAgIFxuICAgICAgLy9TZXQgdXAgbG9hZCBsaXN0ZW5lci4gVGVzdCBhdHRhY2hFdmVudCBmaXJzdCBiZWNhdXNlIElFOSBoYXNcbiAgICAgIC8vYSBzdWJ0bGUgaXNzdWUgaW4gaXRzIGFkZEV2ZW50TGlzdGVuZXIgYW5kIHNjcmlwdCBvbmxvYWQgZmlyaW5nc1xuICAgICAgLy90aGF0IGRvIG5vdCBtYXRjaCB0aGUgYmVoYXZpb3Igb2YgYWxsIG90aGVyIGJyb3dzZXJzIHdpdGhcbiAgICAgIC8vYWRkRXZlbnRMaXN0ZW5lciBzdXBwb3J0LCB3aGljaCBmaXJlIHRoZSBvbmxvYWQgZXZlbnQgZm9yIGFcbiAgICAgIC8vc2NyaXB0IHJpZ2h0IGFmdGVyIHRoZSBzY3JpcHQgZXhlY3V0aW9uLiBTZWU6XG4gICAgICAvL2h0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrL2RldGFpbHMvNjQ4MDU3L3NjcmlwdC1vbmxvYWQtZXZlbnQtaXMtbm90LWZpcmVkLWltbWVkaWF0ZWx5LWFmdGVyLXNjcmlwdC1leGVjdXRpb25cbiAgICAgIC8vVU5GT1JUVU5BVEVMWSBPcGVyYSBpbXBsZW1lbnRzIGF0dGFjaEV2ZW50IGJ1dCBkb2VzIG5vdCBmb2xsb3cgdGhlIHNjcmlwdFxuICAgICAgLy9zY3JpcHQgZXhlY3V0aW9uIG1vZGUuXG4gICAgICBpZiAobm9kZS5hdHRhY2hFdmVudCAmJlxuICAgICAgICAvL0NoZWNrIGlmIG5vZGUuYXR0YWNoRXZlbnQgaXMgYXJ0aWZpY2lhbGx5IGFkZGVkIGJ5IGN1c3RvbSBzY3JpcHQgb3JcbiAgICAgICAgLy9uYXRpdmVseSBzdXBwb3J0ZWQgYnkgYnJvd3NlclxuICAgICAgICAvL3JlYWQgaHR0cHM6Ly9naXRodWIuY29tL3JlcXVpcmVqcy9yZXF1aXJlanMvaXNzdWVzLzE4N1xuICAgICAgICAvL2lmIHdlIGNhbiBOT1QgZmluZCBbbmF0aXZlIGNvZGVdIHRoZW4gaXQgbXVzdCBOT1QgbmF0aXZlbHkgc3VwcG9ydGVkLlxuICAgICAgICAvL2luIElFOCwgbm9kZS5hdHRhY2hFdmVudCBkb2VzIG5vdCBoYXZlIHRvU3RyaW5nKClcbiAgICAgICAgLy9Ob3RlIHRoZSB0ZXN0IGZvciBcIltuYXRpdmUgY29kZVwiIHdpdGggbm8gY2xvc2luZyBicmFjZSwgc2VlOlxuICAgICAgICAvL2h0dHBzOi8vZ2l0aHViLmNvbS9yZXF1aXJlanMvcmVxdWlyZWpzL2lzc3Vlcy8yNzNcbiAgICAgICAgIShub2RlLmF0dGFjaEV2ZW50LnRvU3RyaW5nICYmIG5vZGUuYXR0YWNoRXZlbnQudG9TdHJpbmcoKS5pbmRleE9mKCdbbmF0aXZlIGNvZGUnKSA8IDApICYmXG4gICAgICAgICFpc09wZXJhKSB7XG4gICAgICAgIC8vUHJvYmFibHkgSUUuIElFIChhdCBsZWFzdCA2LTgpIGRvIG5vdCBmaXJlXG4gICAgICAgIC8vc2NyaXB0IG9ubG9hZCByaWdodCBhZnRlciBleGVjdXRpbmcgdGhlIHNjcmlwdCwgc29cbiAgICAgICAgLy93ZSBjYW5ub3QgdGllIHRoZSBhbm9ueW1vdXMgZGVmaW5lIGNhbGwgdG8gYSBuYW1lLlxuICAgICAgICAvL0hvd2V2ZXIsIElFIHJlcG9ydHMgdGhlIHNjcmlwdCBhcyBiZWluZyBpbiAnaW50ZXJhY3RpdmUnXG4gICAgICAgIC8vcmVhZHlTdGF0ZSBhdCB0aGUgdGltZSBvZiB0aGUgZGVmaW5lIGNhbGwuXG4gICAgICAgIHVzZUludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIG5vZGUuYXR0YWNoRXZlbnQoJ29ucmVhZHlzdGF0ZWNoYW5nZScsIGNvbnRleHQub25TY3JpcHRMb2FkKTtcbiAgICAgICAgLy9JdCB3b3VsZCBiZSBncmVhdCB0byBhZGQgYW4gZXJyb3IgaGFuZGxlciBoZXJlIHRvIGNhdGNoXG4gICAgICAgIC8vNDA0cyBpbiBJRTkrLiBIb3dldmVyLCBvbnJlYWR5c3RhdGVjaGFuZ2Ugd2lsbCBmaXJlIGJlZm9yZVxuICAgICAgICAvL3RoZSBlcnJvciBoYW5kbGVyLCBzbyB0aGF0IGRvZXMgbm90IGhlbHAuIElmIGFkZEV2ZW50TGlzdGVuZXJcbiAgICAgICAgLy9pcyB1c2VkLCB0aGVuIElFIHdpbGwgZmlyZSBlcnJvciBiZWZvcmUgbG9hZCwgYnV0IHdlIGNhbm5vdFxuICAgICAgICAvL3VzZSB0aGF0IHBhdGh3YXkgZ2l2ZW4gdGhlIGNvbm5lY3QubWljcm9zb2Z0LmNvbSBpc3N1ZVxuICAgICAgICAvL21lbnRpb25lZCBhYm92ZSBhYm91dCBub3QgZG9pbmcgdGhlICdzY3JpcHQgZXhlY3V0ZSxcbiAgICAgICAgLy90aGVuIGZpcmUgdGhlIHNjcmlwdCBsb2FkIGV2ZW50IGxpc3RlbmVyIGJlZm9yZSBleGVjdXRlXG4gICAgICAgIC8vbmV4dCBzY3JpcHQnIHRoYXQgb3RoZXIgYnJvd3NlcnMgZG8uXG4gICAgICAgIC8vQmVzdCBob3BlOiBJRTEwIGZpeGVzIHRoZSBpc3N1ZXMsXG4gICAgICAgIC8vYW5kIHRoZW4gZGVzdHJveXMgYWxsIGluc3RhbGxzIG9mIElFIDYtOS5cbiAgICAgICAgLy9ub2RlLmF0dGFjaEV2ZW50KCdvbmVycm9yJywgY29udGV4dC5vblNjcmlwdEVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGNvbnRleHQub25TY3JpcHRMb2FkLCBmYWxzZSk7XG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBjb250ZXh0Lm9uU2NyaXB0RXJyb3IsIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIG5vZGUuc3JjID0gdXJsO1xuICAgICAgXG4gICAgICAvL0NhbGxpbmcgb25Ob2RlQ3JlYXRlZCBhZnRlciBhbGwgcHJvcGVydGllcyBvbiB0aGUgbm9kZSBoYXZlIGJlZW5cbiAgICAgIC8vc2V0LCBidXQgYmVmb3JlIGl0IGlzIHBsYWNlZCBpbiB0aGUgRE9NLlxuICAgICAgaWYgKGNvbmZpZy5vbk5vZGVDcmVhdGVkKSB7XG4gICAgICAgIGNvbmZpZy5vbk5vZGVDcmVhdGVkKG5vZGUsIGNvbmZpZywgbW9kdWxlTmFtZSwgdXJsKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy9Gb3Igc29tZSBjYWNoZSBjYXNlcyBpbiBJRSA2LTgsIHRoZSBzY3JpcHQgZXhlY3V0ZXMgYmVmb3JlIHRoZSBlbmRcbiAgICAgIC8vb2YgdGhlIGFwcGVuZENoaWxkIGV4ZWN1dGlvbiwgc28gdG8gdGllIGFuIGFub255bW91cyBkZWZpbmVcbiAgICAgIC8vY2FsbCB0byB0aGUgbW9kdWxlIG5hbWUgKHdoaWNoIGlzIHN0b3JlZCBvbiB0aGUgbm9kZSksIGhvbGQgb25cbiAgICAgIC8vdG8gYSByZWZlcmVuY2UgdG8gdGhpcyBub2RlLCBidXQgY2xlYXIgYWZ0ZXIgdGhlIERPTSBpbnNlcnRpb24uXG4gICAgICBjdXJyZW50bHlBZGRpbmdTY3JpcHQgPSBub2RlO1xuICAgICAgaWYgKGJhc2VFbGVtZW50KSB7XG4gICAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKG5vZGUsIGJhc2VFbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhlYWQuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICB9XG4gICAgICBjdXJyZW50bHlBZGRpbmdTY3JpcHQgPSBudWxsO1xuICAgICAgXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9IGVsc2UgaWYgKGlzV2ViV29ya2VyKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvL0luIGEgd2ViIHdvcmtlciwgdXNlIGltcG9ydFNjcmlwdHMuIFRoaXMgaXMgbm90IGEgdmVyeVxuICAgICAgICAvL2VmZmljaWVudCB1c2Ugb2YgaW1wb3J0U2NyaXB0cywgaW1wb3J0U2NyaXB0cyB3aWxsIGJsb2NrIHVudGlsXG4gICAgICAgIC8vaXRzIHNjcmlwdCBpcyBkb3dubG9hZGVkIGFuZCBldmFsdWF0ZWQuIEhvd2V2ZXIsIGlmIHdlYiB3b3JrZXJzXG4gICAgICAgIC8vYXJlIGluIHBsYXksIHRoZSBleHBlY3RhdGlvbiBpcyB0aGF0IGEgYnVpbGQgaGFzIGJlZW4gZG9uZSBzb1xuICAgICAgICAvL3RoYXQgb25seSBvbmUgc2NyaXB0IG5lZWRzIHRvIGJlIGxvYWRlZCBhbnl3YXkuIFRoaXMgbWF5IG5lZWRcbiAgICAgICAgLy90byBiZSByZWV2YWx1YXRlZCBpZiBvdGhlciB1c2UgY2FzZXMgYmVjb21lIGNvbW1vbi5cbiAgICAgICAgXG4gICAgICAgIC8vIFBvc3QgYSB0YXNrIHRvIHRoZSBldmVudCBsb29wIHRvIHdvcmsgYXJvdW5kIGEgYnVnIGluIFdlYktpdFxuICAgICAgICAvLyB3aGVyZSB0aGUgd29ya2VyIGdldHMgZ2FyYmFnZS1jb2xsZWN0ZWQgYWZ0ZXIgY2FsbGluZ1xuICAgICAgICAvLyBpbXBvcnRTY3JpcHRzKCk6IGh0dHBzOi8vd2Via2l0Lm9yZy9iLzE1MzMxN1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge30sIDApO1xuICAgICAgICBpbXBvcnRTY3JpcHRzKHVybCk7XG4gICAgICAgIFxuICAgICAgICAvL0FjY291bnQgZm9yIGFub255bW91cyBtb2R1bGVzXG4gICAgICAgIGNvbnRleHQuY29tcGxldGVMb2FkKG1vZHVsZU5hbWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb250ZXh0Lm9uRXJyb3IobWFrZUVycm9yKCdpbXBvcnRzY3JpcHRzJyxcbiAgICAgICAgICAnaW1wb3J0U2NyaXB0cyBmYWlsZWQgZm9yICcgK1xuICAgICAgICAgIG1vZHVsZU5hbWUgKyAnIGF0ICcgKyB1cmwsXG4gICAgICAgICAgZSxcbiAgICAgICAgICBbbW9kdWxlTmFtZV0pKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFxuICBmdW5jdGlvbiBnZXRJbnRlcmFjdGl2ZVNjcmlwdCgpIHtcbiAgICBpZiAoaW50ZXJhY3RpdmVTY3JpcHQgJiYgaW50ZXJhY3RpdmVTY3JpcHQucmVhZHlTdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJykge1xuICAgICAgcmV0dXJuIGludGVyYWN0aXZlU2NyaXB0O1xuICAgIH1cbiAgICBcbiAgICBlYWNoUmV2ZXJzZShzY3JpcHRzKCksIGZ1bmN0aW9uIChzY3JpcHQpIHtcbiAgICAgIGlmIChzY3JpcHQucmVhZHlTdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJykge1xuICAgICAgICByZXR1cm4gKGludGVyYWN0aXZlU2NyaXB0ID0gc2NyaXB0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaW50ZXJhY3RpdmVTY3JpcHQ7XG4gIH1cbiAgXG4gIC8vTG9vayBmb3IgYSBkYXRhLW1haW4gc2NyaXB0IGF0dHJpYnV0ZSwgd2hpY2ggY291bGQgYWxzbyBhZGp1c3QgdGhlIGJhc2VVcmwuXG4gIGlmIChpc0Jyb3dzZXIgJiYgIWNmZy5za2lwRGF0YU1haW4pIHtcbiAgICAvL0ZpZ3VyZSBvdXQgYmFzZVVybC4gR2V0IGl0IGZyb20gdGhlIHNjcmlwdCB0YWcgd2l0aCByZXF1aXJlLmpzIGluIGl0LlxuICAgIGVhY2hSZXZlcnNlKHNjcmlwdHMoKSwgZnVuY3Rpb24gKHNjcmlwdCkge1xuICAgICAgLy9TZXQgdGhlICdoZWFkJyB3aGVyZSB3ZSBjYW4gYXBwZW5kIGNoaWxkcmVuIGJ5XG4gICAgICAvL3VzaW5nIHRoZSBzY3JpcHQncyBwYXJlbnQuXG4gICAgICBpZiAoIWhlYWQpIHtcbiAgICAgICAgaGVhZCA9IHNjcmlwdC5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvL0xvb2sgZm9yIGEgZGF0YS1tYWluIGF0dHJpYnV0ZSB0byBzZXQgbWFpbiBzY3JpcHQgZm9yIHRoZSBwYWdlXG4gICAgICAvL3RvIGxvYWQuIElmIGl0IGlzIHRoZXJlLCB0aGUgcGF0aCB0byBkYXRhIG1haW4gYmVjb21lcyB0aGVcbiAgICAgIC8vYmFzZVVybCwgaWYgaXQgaXMgbm90IGFscmVhZHkgc2V0LlxuICAgICAgZGF0YU1haW4gPSBzY3JpcHQuZ2V0QXR0cmlidXRlKCdkYXRhLW1haW4nKTtcbiAgICAgIGlmIChkYXRhTWFpbikge1xuICAgICAgICAvL1ByZXNlcnZlIGRhdGFNYWluIGluIGNhc2UgaXQgaXMgYSBwYXRoIChpLmUuIGNvbnRhaW5zICc/JylcbiAgICAgICAgbWFpblNjcmlwdCA9IGRhdGFNYWluO1xuICAgICAgICBcbiAgICAgICAgLy9TZXQgZmluYWwgYmFzZVVybCBpZiB0aGVyZSBpcyBub3QgYWxyZWFkeSBhbiBleHBsaWNpdCBvbmUsXG4gICAgICAgIC8vYnV0IG9ubHkgZG8gc28gaWYgdGhlIGRhdGEtbWFpbiB2YWx1ZSBpcyBub3QgYSBsb2FkZXIgcGx1Z2luXG4gICAgICAgIC8vbW9kdWxlIElELlxuICAgICAgICBpZiAoIWNmZy5iYXNlVXJsICYmIG1haW5TY3JpcHQuaW5kZXhPZignIScpID09PSAtMSkge1xuICAgICAgICAgIC8vUHVsbCBvZmYgdGhlIGRpcmVjdG9yeSBvZiBkYXRhLW1haW4gZm9yIHVzZSBhcyB0aGVcbiAgICAgICAgICAvL2Jhc2VVcmwuXG4gICAgICAgICAgc3JjID0gbWFpblNjcmlwdC5zcGxpdCgnLycpO1xuICAgICAgICAgIG1haW5TY3JpcHQgPSBzcmMucG9wKCk7XG4gICAgICAgICAgc3ViUGF0aCA9IHNyYy5sZW5ndGggPyBzcmMuam9pbignLycpICArICcvJyA6ICcuLyc7XG4gICAgICAgICAgXG4gICAgICAgICAgY2ZnLmJhc2VVcmwgPSBzdWJQYXRoO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL1N0cmlwIG9mZiBhbnkgdHJhaWxpbmcgLmpzIHNpbmNlIG1haW5TY3JpcHQgaXMgbm93XG4gICAgICAgIC8vbGlrZSBhIG1vZHVsZSBuYW1lLlxuICAgICAgICBtYWluU2NyaXB0ID0gbWFpblNjcmlwdC5yZXBsYWNlKGpzU3VmZml4UmVnRXhwLCAnJyk7XG4gICAgICAgIFxuICAgICAgICAvL0lmIG1haW5TY3JpcHQgaXMgc3RpbGwgYSBwYXRoLCBmYWxsIGJhY2sgdG8gZGF0YU1haW5cbiAgICAgICAgaWYgKHJlcS5qc0V4dFJlZ0V4cC50ZXN0KG1haW5TY3JpcHQpKSB7XG4gICAgICAgICAgbWFpblNjcmlwdCA9IGRhdGFNYWluO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL1B1dCB0aGUgZGF0YS1tYWluIHNjcmlwdCBpbiB0aGUgZmlsZXMgdG8gbG9hZC5cbiAgICAgICAgY2ZnLmRlcHMgPSBjZmcuZGVwcyA/IGNmZy5kZXBzLmNvbmNhdChtYWluU2NyaXB0KSA6IFttYWluU2NyaXB0XTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIFxuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRoYXQgaGFuZGxlcyBkZWZpbml0aW9ucyBvZiBtb2R1bGVzLiBEaWZmZXJzIGZyb21cbiAgICogcmVxdWlyZSgpIGluIHRoYXQgYSBzdHJpbmcgZm9yIHRoZSBtb2R1bGUgc2hvdWxkIGJlIHRoZSBmaXJzdCBhcmd1bWVudCxcbiAgICogYW5kIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIGRlcGVuZGVuY2llcyBhcmUgbG9hZGVkIHNob3VsZFxuICAgKiByZXR1cm4gYSB2YWx1ZSB0byBkZWZpbmUgdGhlIG1vZHVsZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBmaXJzdCBhcmd1bWVudCdzXG4gICAqIG5hbWUuXG4gICAqL1xuICBkZWZpbmUgPSBmdW5jdGlvbiAobmFtZSwgZGVwcywgY2FsbGJhY2spIHtcbiAgICB2YXIgbm9kZSwgY29udGV4dDtcbiAgICBcbiAgICAvL0FsbG93IGZvciBhbm9ueW1vdXMgbW9kdWxlc1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIC8vQWRqdXN0IGFyZ3MgYXBwcm9wcmlhdGVseVxuICAgICAgY2FsbGJhY2sgPSBkZXBzO1xuICAgICAgZGVwcyA9IG5hbWU7XG4gICAgICBuYW1lID0gbnVsbDtcbiAgICB9XG4gICAgXG4gICAgLy9UaGlzIG1vZHVsZSBtYXkgbm90IGhhdmUgZGVwZW5kZW5jaWVzXG4gICAgaWYgKCFpc0FycmF5KGRlcHMpKSB7XG4gICAgICBjYWxsYmFjayA9IGRlcHM7XG4gICAgICBkZXBzID0gbnVsbDtcbiAgICB9XG4gICAgXG4gICAgLy9JZiBubyBuYW1lLCBhbmQgY2FsbGJhY2sgaXMgYSBmdW5jdGlvbiwgdGhlbiBmaWd1cmUgb3V0IGlmIGl0IGFcbiAgICAvL0NvbW1vbkpTIHRoaW5nIHdpdGggZGVwZW5kZW5jaWVzLlxuICAgIGlmICghZGVwcyAmJiBpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgZGVwcyA9IFtdO1xuICAgICAgLy9SZW1vdmUgY29tbWVudHMgZnJvbSB0aGUgY2FsbGJhY2sgc3RyaW5nLFxuICAgICAgLy9sb29rIGZvciByZXF1aXJlIGNhbGxzLCBhbmQgcHVsbCB0aGVtIGludG8gdGhlIGRlcGVuZGVuY2llcyxcbiAgICAgIC8vYnV0IG9ubHkgaWYgdGhlcmUgYXJlIGZ1bmN0aW9uIGFyZ3MuXG4gICAgICBpZiAoY2FsbGJhY2subGVuZ3RoKSB7XG4gICAgICAgIGNhbGxiYWNrXG4gICAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgICAucmVwbGFjZShjb21tZW50UmVnRXhwLCBjb21tZW50UmVwbGFjZSlcbiAgICAgICAgICAucmVwbGFjZShjanNSZXF1aXJlUmVnRXhwLCBmdW5jdGlvbiAobWF0Y2gsIGRlcCkge1xuICAgICAgICAgICAgZGVwcy5wdXNoKGRlcCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvL01heSBiZSBhIENvbW1vbkpTIHRoaW5nIGV2ZW4gd2l0aG91dCByZXF1aXJlIGNhbGxzLCBidXQgc3RpbGxcbiAgICAgICAgLy9jb3VsZCB1c2UgZXhwb3J0cywgYW5kIG1vZHVsZS4gQXZvaWQgZG9pbmcgZXhwb3J0cyBhbmQgbW9kdWxlXG4gICAgICAgIC8vd29yayB0aG91Z2ggaWYgaXQganVzdCBuZWVkcyByZXF1aXJlLlxuICAgICAgICAvL1JFUVVJUkVTIHRoZSBmdW5jdGlvbiB0byBleHBlY3QgdGhlIENvbW1vbkpTIHZhcmlhYmxlcyBpbiB0aGVcbiAgICAgICAgLy9vcmRlciBsaXN0ZWQgYmVsb3cuXG4gICAgICAgIGRlcHMgPSAoY2FsbGJhY2subGVuZ3RoID09PSAxID8gWydyZXF1aXJlJ10gOiBbJ3JlcXVpcmUnLCAnZXhwb3J0cycsICdtb2R1bGUnXSkuY29uY2F0KGRlcHMpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvL0lmIGluIElFIDYtOCBhbmQgaGl0IGFuIGFub255bW91cyBkZWZpbmUoKSBjYWxsLCBkbyB0aGUgaW50ZXJhY3RpdmVcbiAgICAvL3dvcmsuXG4gICAgaWYgKHVzZUludGVyYWN0aXZlKSB7XG4gICAgICBub2RlID0gY3VycmVudGx5QWRkaW5nU2NyaXB0IHx8IGdldEludGVyYWN0aXZlU2NyaXB0KCk7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICBuYW1lID0gbm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcmVxdWlyZW1vZHVsZScpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQgPSBjb250ZXh0c1tub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1yZXF1aXJlY29udGV4dCcpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy9BbHdheXMgc2F2ZSBvZmYgZXZhbHVhdGluZyB0aGUgZGVmIGNhbGwgdW50aWwgdGhlIHNjcmlwdCBvbmxvYWQgaGFuZGxlci5cbiAgICAvL1RoaXMgYWxsb3dzIG11bHRpcGxlIG1vZHVsZXMgdG8gYmUgaW4gYSBmaWxlIHdpdGhvdXQgcHJlbWF0dXJlbHlcbiAgICAvL3RyYWNpbmcgZGVwZW5kZW5jaWVzLCBhbmQgYWxsb3dzIGZvciBhbm9ueW1vdXMgbW9kdWxlIHN1cHBvcnQsXG4gICAgLy93aGVyZSB0aGUgbW9kdWxlIG5hbWUgaXMgbm90IGtub3duIHVudGlsIHRoZSBzY3JpcHQgb25sb2FkIGV2ZW50XG4gICAgLy9vY2N1cnMuIElmIG5vIGNvbnRleHQsIHVzZSB0aGUgZ2xvYmFsIHF1ZXVlLCBhbmQgZ2V0IGl0IHByb2Nlc3NlZFxuICAgIC8vaW4gdGhlIG9uc2NyaXB0IGxvYWQgY2FsbGJhY2suXG4gICAgaWYgKGNvbnRleHQpIHtcbiAgICAgIGNvbnRleHQuZGVmUXVldWUucHVzaChbbmFtZSwgZGVwcywgY2FsbGJhY2tdKTtcbiAgICAgIGNvbnRleHQuZGVmUXVldWVNYXBbbmFtZV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbG9iYWxEZWZRdWV1ZS5wdXNoKFtuYW1lLCBkZXBzLCBjYWxsYmFja10pO1xuICAgIH1cbiAgfTtcbiAgXG4gIGRlZmluZS5hbWQgPSB7XG4gICAgalF1ZXJ5OiB0cnVlXG4gIH07XG4gIFxuICAvKipcbiAgICogRXhlY3V0ZXMgdGhlIHRleHQuIE5vcm1hbGx5IGp1c3QgdXNlcyBldmFsLCBidXQgY2FuIGJlIG1vZGlmaWVkXG4gICAqIHRvIHVzZSBhIGJldHRlciwgZW52aXJvbm1lbnQtc3BlY2lmaWMgY2FsbC4gT25seSB1c2VkIGZvciB0cmFuc3BpbGluZ1xuICAgKiBsb2FkZXIgcGx1Z2lucywgbm90IGZvciBwbGFpbiBKUyBtb2R1bGVzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dCB0aGUgdGV4dCB0byBleGVjdXRlL2V2YWx1YXRlLlxuICAgKi9cbiAgcmVxLmV4ZWMgPSBmdW5jdGlvbiAodGV4dCkge1xuICAgIC8qanNsaW50IGV2aWw6IHRydWUgKi9cbiAgICByZXR1cm4gZXZhbCh0ZXh0KTtcbiAgfTtcbiAgXG4gIC8vU2V0IHVwIHdpdGggY29uZmlnIGluZm8uXG4gIHJlcShjZmcpO1xufSh0aGlzLCAodHlwZW9mIHNldFRpbWVvdXQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogc2V0VGltZW91dCkpKTsiXX0=