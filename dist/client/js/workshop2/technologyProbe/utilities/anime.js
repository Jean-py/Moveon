'use strict';

/*
 * Anime v1.0.0
 * http://anime-js.com
 * Javascript animation engine
 * Copyright (c) 2016 Julian Garnier
 * http://juliangarnier.com
 * Released under the MIT license
 */

var anime = function () {

  // Defaults

  var defaultSettings = {
    duration: 1000,
    delay: 0,
    loop: false,
    autoplay: true,
    direction: 'normal',
    easing: 'easeOutElastic',
    elasticity: 400,
    round: false,
    begin: undefined,
    update: undefined,
    complete: undefined
  };

  var validTransforms = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY'];

  // Utils

  var is = function () {
    return {
      array: function array(a) {
        return Array.isArray(a);
      },
      object: function object(a) {
        return Object.prototype.toString.call(a).indexOf('Object') > -1;
      },
      html: function html(a) {
        return a instanceof NodeList || a instanceof HTMLCollection;
      },
      node: function node(a) {
        return a.nodeType;
      },
      svg: function svg(a) {
        return a instanceof SVGElement;
      },
      number: function number(a) {
        return !isNaN(parseInt(a));
      },
      string: function string(a) {
        return typeof a === 'string';
      },
      func: function func(a) {
        return typeof a === 'function';
      },
      undef: function undef(a) {
        return typeof a === 'undefined';
      },
      null: function _null(a) {
        return typeof a === 'null';
      },
      hex: function hex(a) {
        return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)
        );
      },
      rgb: function rgb(a) {
        return (/^rgb/.test(a)
        );
      },
      rgba: function rgba(a) {
        return (/^rgba/.test(a)
        );
      },
      hsl: function hsl(a) {
        return (/^hsl/.test(a)
        );
      },
      color: function color(a) {
        return is.hex(a) || is.rgb(a) || is.rgba(a) || is.hsl(a);
      }
    };
  }();

  // Easings functions adapted from http://jqueryui.com/

  var easings = function () {
    var eases = {};
    var names = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];
    var functions = {
      Sine: function Sine(t) {
        return 1 - Math.cos(t * Math.PI / 2);
      },
      Circ: function Circ(t) {
        return 1 - Math.sqrt(1 - t * t);
      },
      Elastic: function Elastic(t, m) {
        if (t === 0 || t === 1) return t;
        var p = 1 - Math.min(m, 998) / 1000,
            st = t / 1,
            st1 = st - 1,
            s = p / (2 * Math.PI) * Math.asin(1);
        return -(Math.pow(2, 10 * st1) * Math.sin((st1 - s) * (2 * Math.PI) / p));
      },
      Back: function Back(t) {
        return t * t * (3 * t - 2);
      },
      Bounce: function Bounce(t) {
        var pow2,
            bounce = 4;
        while (t < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2);
      }
    };
    names.forEach(function (name, i) {
      functions[name] = function (t) {
        return Math.pow(t, i + 2);
      };
    });
    Object.keys(functions).forEach(function (name) {
      var easeIn = functions[name];
      eases['easeIn' + name] = easeIn;
      eases['easeOut' + name] = function (t, m) {
        return 1 - easeIn(1 - t, m);
      };
      eases['easeInOut' + name] = function (t, m) {
        return t < 0.5 ? easeIn(t * 2, m) / 2 : 1 - easeIn(t * -2 + 2, m) / 2;
      };
    });
    eases.linear = function (t) {
      return t;
    };
    return eases;
  }();

  // Strings

  var numberToString = function numberToString(val) {
    return is.string(val) ? val : val + '';
  };

  var stringToHyphens = function stringToHyphens(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  };

  var selectString = function selectString(str) {
    if (is.color(str)) return false;
    try {
      var nodes = document.querySelectorAll(str);
      return nodes;
    } catch (e) {
      return false;
    }
  };

  // Numbers

  var random = function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Arrays

  var flattenArray = function flattenArray(arr) {
    return arr.reduce(function (a, b) {
      return a.concat(is.array(b) ? flattenArray(b) : b);
    }, []);
  };

  var toArray = function toArray(o) {
    if (is.array(o)) return o;
    if (is.string(o)) o = selectString(o) || o;
    if (is.html(o)) return [].slice.call(o);
    return [o];
  };

  var arrayContains = function arrayContains(arr, val) {
    return arr.some(function (a) {
      return a === val;
    });
  };

  var groupArrayByProps = function groupArrayByProps(arr, propsArr) {
    var groups = {};
    arr.forEach(function (o) {
      var group = JSON.stringify(propsArr.map(function (p) {
        return o[p];
      }));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  };

  var removeArrayDuplicates = function removeArrayDuplicates(arr) {
    return arr.filter(function (item, pos, self) {
      return self.indexOf(item) === pos;
    });
  };

  // Objects

  var cloneObject = function cloneObject(o) {
    var newObject = {};
    for (var p in o) {
      newObject[p] = o[p];
    }return newObject;
  };

  var mergeObjects = function mergeObjects(o1, o2) {
    for (var p in o2) {
      o1[p] = !is.undef(o1[p]) ? o1[p] : o2[p];
    }return o1;
  };

  // Colors

  var hexToRgb = function hexToRgb(hex) {
    var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    var hex = hex.replace(rgx, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var r = parseInt(rgb[1], 16);
    var g = parseInt(rgb[2], 16);
    var b = parseInt(rgb[3], 16);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  };

  var hslToRgb = function hslToRgb(hsl) {
    var hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hsl);
    var h = parseInt(hsl[1]) / 360;
    var s = parseInt(hsl[2]) / 100;
    var l = parseInt(hsl[3]) / 100;
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    var r, g, b;
    if (s == 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return 'rgb(' + r * 255 + ',' + g * 255 + ',' + b * 255 + ')';
  };

  var colorToRgb = function colorToRgb(val) {
    if (is.rgb(val) || is.rgba(val)) return val;
    if (is.hex(val)) return hexToRgb(val);
    if (is.hsl(val)) return hslToRgb(val);
  };

  // Units

  var getUnit = function getUnit(val) {
    return (/([\+\-]?[0-9|auto\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg)?/.exec(val)[2]
    );
  };

  var addDefaultTransformUnit = function addDefaultTransformUnit(prop, val, intialVal) {
    if (getUnit(val)) return val;
    if (prop.indexOf('translate') > -1) return getUnit(intialVal) ? val + getUnit(intialVal) : val + 'px';
    if (prop.indexOf('rotate') > -1 || prop.indexOf('skew') > -1) return val + 'deg';
    return val;
  };

  // Values

  var getAnimationType = function getAnimationType(el, prop) {
    if ((is.node(el) || is.svg(el)) && arrayContains(validTransforms, prop)) return 'transform';
    if ((is.node(el) || is.svg(el)) && prop !== 'transform' && getCSSValue(el, prop)) return 'css';
    if ((is.node(el) || is.svg(el)) && (el.getAttribute(prop) || el[prop])) return 'attribute';
    if (!is.null(el[prop]) && !is.undef(el[prop])) return 'object';
  };

  var getCSSValue = function getCSSValue(el, prop) {
    return getComputedStyle(el).getPropertyValue(stringToHyphens(prop));
  };

  var getTransformValue = function getTransformValue(el, prop) {
    var defaultVal = prop.indexOf('scale') > -1 ? 1 : 0;
    var str = el.style.transform;
    if (!str) return defaultVal;
    var rgx = /(\w+)\((.+?)\)/g;
    var match = [];
    var props = [];
    var values = [];
    while (match = rgx.exec(str)) {
      props.push(match[1]);
      values.push(match[2]);
    }
    var val = values.filter(function (f, i) {
      return props[i] === prop;
    });
    return val.length ? val[0] : defaultVal;
  };

  var getInitialTargetValue = function getInitialTargetValue(target, prop) {
    switch (getAnimationType(target, prop)) {
      case 'transform':
        return getTransformValue(target, prop);
      case 'css':
        return getCSSValue(target, prop);
      case 'attribute':
        return target.getAttribute(prop);
    }
    return target[prop] || 0;
  };

  var getValidValue = function getValidValue(values, val, originalCSS) {
    if (is.color(val)) return colorToRgb(val);
    if (getUnit(val)) return val;
    var unit = getUnit(values.to) ? getUnit(values.to) : getUnit(values.from);
    if (!unit && originalCSS) unit = getUnit(originalCSS);
    return unit ? val + unit : val;
  };

  var decomposeValue = function decomposeValue(val) {
    var rgx = /-?\d*\.?\d+/g;
    return {
      original: val,
      numbers: numberToString(val).match(rgx) ? numberToString(val).match(rgx).map(Number) : [0],
      strings: numberToString(val).split(rgx)
    };
  };

  var recomposeValue = function recomposeValue(numbers, strings, initialStrings) {
    return strings.reduce(function (a, b, i) {
      var b = b ? b : initialStrings[i - 1];
      return a + numbers[i - 1] + b;
    });
  };

  // Animatables

  var getAnimatables = function getAnimatables(targets) {
    var targets = targets ? flattenArray(is.array(targets) ? targets.map(toArray) : toArray(targets)) : [];
    return targets.map(function (t, i) {
      return { target: t, id: i };
    });
  };

  // Properties

  var getProperties = function getProperties(params, settings) {
    var props = [];
    for (var p in params) {
      if (!defaultSettings.hasOwnProperty(p) && p !== 'targets') {
        var prop = is.object(params[p]) ? cloneObject(params[p]) : { value: params[p] };
        prop.name = p;
        props.push(mergeObjects(prop, settings));
      }
    }
    return props;
  };

  var getPropertiesValues = function getPropertiesValues(target, prop, value, i) {
    var values = toArray(is.func(value) ? value(target, i) : value);
    return {
      from: values.length > 1 ? values[0] : getInitialTargetValue(target, prop),
      to: values.length > 1 ? values[1] : values[0]
    };
  };

  var getTweenValues = function getTweenValues(prop, values, type, target) {
    var valid = {};
    if (type === 'transform') {
      valid.from = prop + '(' + addDefaultTransformUnit(prop, values.from, values.to) + ')';
      valid.to = prop + '(' + addDefaultTransformUnit(prop, values.to) + ')';
    } else {
      var originalCSS = type === 'css' ? getCSSValue(target, prop) : undefined;
      valid.from = getValidValue(values, values.from, originalCSS);
      valid.to = getValidValue(values, values.to, originalCSS);
    }
    return { from: decomposeValue(valid.from), to: decomposeValue(valid.to) };
  };

  var getTweensProps = function getTweensProps(animatables, props) {
    var tweensProps = [];
    animatables.forEach(function (animatable, i) {
      var target = animatable.target;
      return props.forEach(function (prop) {
        var animType = getAnimationType(target, prop.name);
        if (animType) {
          var values = getPropertiesValues(target, prop.name, prop.value, i);
          var tween = cloneObject(prop);
          tween.animatables = animatable;
          tween.type = animType;
          tween.from = getTweenValues(prop.name, values, tween.type, target).from;
          tween.to = getTweenValues(prop.name, values, tween.type, target).to;
          tween.round = is.color(values.from) || tween.round ? 1 : 0;
          tween.delay = (is.func(tween.delay) ? tween.delay(target, i, animatables.length) : tween.delay) / animation.speed;
          tween.duration = (is.func(tween.duration) ? tween.duration(target, i, animatables.length) : tween.duration) / animation.speed;
          tweensProps.push(tween);
        }
      });
    });
    return tweensProps;
  };

  // Tweens

  var getTweens = function getTweens(animatables, props) {
    var tweensProps = getTweensProps(animatables, props);
    var splittedProps = groupArrayByProps(tweensProps, ['name', 'from', 'to', 'delay', 'duration']);
    return splittedProps.map(function (tweenProps) {
      var tween = cloneObject(tweenProps[0]);
      tween.animatables = tweenProps.map(function (p) {
        return p.animatables;
      });
      tween.totalDuration = tween.delay + tween.duration;
      return tween;
    });
  };

  var reverseTweens = function reverseTweens(anim, delays) {
    anim.tweens.forEach(function (tween) {
      var toVal = tween.to;
      var fromVal = tween.from;
      var delayVal = anim.duration - (tween.delay + tween.duration);
      tween.from = toVal;
      tween.to = fromVal;
      if (delays) tween.delay = delayVal;
    });
    anim.reversed = anim.reversed ? false : true;
  };

  // will-change

  var getWillChange = function getWillChange(anim) {
    var props = [];
    var els = [];
    anim.tweens.forEach(function (tween) {
      if (tween.type === 'css' || tween.type === 'transform') {
        props.push(tween.type === 'css' ? stringToHyphens(tween.name) : 'transform');
        tween.animatables.forEach(function (animatable) {
          els.push(animatable.target);
        });
      }
    });
    return {
      properties: removeArrayDuplicates(props).join(', '),
      elements: removeArrayDuplicates(els)
    };
  };

  var setWillChange = function setWillChange(anim) {
    var willChange = getWillChange(anim);
    willChange.elements.forEach(function (element) {
      element.style.willChange = willChange.properties;
    });
  };

  var removeWillChange = function removeWillChange(anim) {
    var willChange = getWillChange(anim);
    willChange.elements.forEach(function (element) {
      element.style.removeProperty('will-change');
    });
  };

  /* Svg path */

  var getPathProps = function getPathProps(path) {
    var el = is.string(path) ? selectString(path)[0] : path;
    return {
      path: el,
      value: el.getTotalLength()
    };
  };

  var snapProgressToPath = function snapProgressToPath(tween, progress) {
    var pathEl = tween.path;
    var pathProgress = tween.value * progress;
    var point = function point(offset) {
      var o = offset || 0;
      var p = progress > 1 ? tween.value + o : pathProgress + o;
      return pathEl.getPointAtLength(p);
    };
    var p = point();
    var p0 = point(-1);
    var p1 = point(+1);
    switch (tween.name) {
      case 'translateX':
        return p.x;
      case 'translateY':
        return p.y;
      case 'rotate':
        return Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
    }
  };

  // Progress

  var getTweenProgress = function getTweenProgress(tween, time) {
    var elapsed = Math.min(Math.max(time - tween.delay, 0), tween.duration);
    var percent = elapsed / tween.duration;
    var progress = tween.to.numbers.map(function (number, p) {
      var start = tween.from.numbers[p];
      var eased = easings[tween.easing](percent, tween.elasticity);
      var val = tween.path ? snapProgressToPath(tween, eased) : start + eased * (number - start);
      val = tween.round ? Math.round(val * tween.round) / tween.round : val;
      return val;
    });
    return recomposeValue(progress, tween.to.strings, tween.from.strings);
  };

  var setAnimationProgress = function setAnimationProgress(anim, time) {
    var transforms = undefined;
    anim.time = Math.min(time, anim.duration);
    anim.progress = anim.time / anim.duration * 100;
    anim.tweens.forEach(function (tween) {
      tween.currentValue = getTweenProgress(tween, time);
      var progress = tween.currentValue;
      tween.animatables.forEach(function (animatable) {
        var id = animatable.id;
        switch (tween.type) {
          case 'css':
            animatable.target.style[tween.name] = progress;break;
          case 'attribute':
            animatable.target.setAttribute(tween.name, progress);break;
          case 'object':
            animatable.target[tween.name] = progress;break;
          case 'transform':
            if (!transforms) transforms = {};
            if (!transforms[id]) transforms[id] = [];
            transforms[id].push(progress);
            break;
        }
      });
    });
    if (transforms) for (var t in transforms) {
      anim.animatables[t].target.style.transform = transforms[t].join(' ');
    }if (anim.settings.update) anim.settings.update(anim);
  };

  // Animation

  var createAnimation = function createAnimation(params) {
    var anim = {};
    anim.animatables = getAnimatables(params.targets);
    anim.settings = mergeObjects(params, defaultSettings);
    anim.properties = getProperties(params, anim.settings);
    anim.tweens = getTweens(anim.animatables, anim.properties);
    anim.duration = anim.tweens.length ? Math.max.apply(Math, anim.tweens.map(function (tween) {
      return tween.totalDuration;
    })) : params.duration / animation.speed;
    anim.time = 0;
    anim.progress = 0;
    anim.running = false;
    anim.ended = false;
    return anim;
  };

  // Public

  var animations = [];

  var animation = function animation(params) {

    var anim = createAnimation(params);
    var time = {};

    time.tick = function () {
      if (anim.running) {
        anim.ended = false;
        time.now = +new Date();
        time.current = time.last + time.now - time.start;
        setAnimationProgress(anim, time.current);
        var s = anim.settings;
        if (s.begin && time.current >= s.delay) {
          s.begin(anim);s.begin = undefined;
        };
        if (time.current >= anim.duration) {
          if (s.loop) {
            time.start = +new Date();
            if (s.direction === 'alternate') reverseTweens(anim, true);
            if (is.number(s.loop)) s.loop--;
            time.raf = requestAnimationFrame(time.tick);
          } else {
            anim.ended = true;
            if (s.complete) s.complete(anim);
            anim.pause();
          }
          time.last = 0;
        } else {
          time.raf = requestAnimationFrame(time.tick);
        }
      }
    };

    anim.seek = function (progress) {
      var time = progress / 100 * anim.duration;
      setAnimationProgress(anim, time);
    };

    anim.pause = function () {
      anim.running = false;
      cancelAnimationFrame(time.raf);
      removeWillChange(anim);
      var i = animations.indexOf(anim);
      if (i > -1) animations.splice(i, 1);
    };

    anim.play = function (params) {
      if (params) anim = mergeObjects(createAnimation(mergeObjects(params, anim.settings)), anim);
      anim.pause();
      anim.running = true;
      time.start = +new Date();
      time.last = anim.ended ? 0 : anim.time;
      var s = anim.settings;
      if (s.direction === 'reverse') reverseTweens(anim);
      if (s.direction === 'alternate' && !s.loop) s.loop = 1;
      setWillChange(anim);
      animations.push(anim);
      time.raf = requestAnimationFrame(time.tick);
    };

    anim.restart = function () {
      if (anim.reversed) reverseTweens(anim);
      anim.pause();
      anim.seek(0);
      anim.play();
    };

    if (anim.settings.autoplay) anim.play();

    return anim;
  };

  // Remove on one or multiple targets from all active animations.

  var remove = function remove(elements) {
    var targets = flattenArray(is.array(elements) ? elements.map(toArray) : toArray(elements));
    for (var i = animations.length - 1; i >= 0; i--) {
      var animation = animations[i];
      for (var t = animation.tweens.length - 1; t >= 0; t--) {
        var tween = animation.tweens[t];
        for (var a = tween.animatables.length - 1; a >= 0; a--) {
          if (arrayContains(targets, tween.animatables[a].target)) {
            tween.animatables.splice(a, 1);
            if (!tween.animatables.length) animation.tweens.splice(t, 1);
            if (!animation.tweens.length) animation.pause();
          }
        }
      }
    }
  };

  animation.speed = 1;
  animation.list = animations;
  animation.remove = remove;
  animation.easings = easings;
  animation.getValue = getInitialTargetValue;
  animation.path = getPathProps;
  animation.random = random;

  return animation;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1lLmpzIl0sIm5hbWVzIjpbImFuaW1lIiwiZGVmYXVsdFNldHRpbmdzIiwiZHVyYXRpb24iLCJkZWxheSIsImxvb3AiLCJhdXRvcGxheSIsImRpcmVjdGlvbiIsImVhc2luZyIsImVsYXN0aWNpdHkiLCJyb3VuZCIsImJlZ2luIiwidW5kZWZpbmVkIiwidXBkYXRlIiwiY29tcGxldGUiLCJ2YWxpZFRyYW5zZm9ybXMiLCJpcyIsImFycmF5IiwiYSIsIkFycmF5IiwiaXNBcnJheSIsIm9iamVjdCIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImluZGV4T2YiLCJodG1sIiwiTm9kZUxpc3QiLCJIVE1MQ29sbGVjdGlvbiIsIm5vZGUiLCJub2RlVHlwZSIsInN2ZyIsIlNWR0VsZW1lbnQiLCJudW1iZXIiLCJpc05hTiIsInBhcnNlSW50Iiwic3RyaW5nIiwiZnVuYyIsInVuZGVmIiwibnVsbCIsImhleCIsInRlc3QiLCJyZ2IiLCJyZ2JhIiwiaHNsIiwiY29sb3IiLCJlYXNpbmdzIiwiZWFzZXMiLCJuYW1lcyIsImZ1bmN0aW9ucyIsIlNpbmUiLCJ0IiwiTWF0aCIsImNvcyIsIlBJIiwiQ2lyYyIsInNxcnQiLCJFbGFzdGljIiwibSIsInAiLCJtaW4iLCJzdCIsInN0MSIsInMiLCJhc2luIiwicG93Iiwic2luIiwiQmFjayIsIkJvdW5jZSIsInBvdzIiLCJib3VuY2UiLCJmb3JFYWNoIiwibmFtZSIsImkiLCJrZXlzIiwiZWFzZUluIiwibGluZWFyIiwibnVtYmVyVG9TdHJpbmciLCJ2YWwiLCJzdHJpbmdUb0h5cGhlbnMiLCJzdHIiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJzZWxlY3RTdHJpbmciLCJub2RlcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImUiLCJyYW5kb20iLCJtYXgiLCJmbG9vciIsImZsYXR0ZW5BcnJheSIsImFyciIsInJlZHVjZSIsImIiLCJjb25jYXQiLCJ0b0FycmF5IiwibyIsInNsaWNlIiwiYXJyYXlDb250YWlucyIsInNvbWUiLCJncm91cEFycmF5QnlQcm9wcyIsInByb3BzQXJyIiwiZ3JvdXBzIiwiZ3JvdXAiLCJKU09OIiwic3RyaW5naWZ5IiwibWFwIiwicHVzaCIsInJlbW92ZUFycmF5RHVwbGljYXRlcyIsImZpbHRlciIsIml0ZW0iLCJwb3MiLCJzZWxmIiwiY2xvbmVPYmplY3QiLCJuZXdPYmplY3QiLCJtZXJnZU9iamVjdHMiLCJvMSIsIm8yIiwiaGV4VG9SZ2IiLCJyZ3giLCJyIiwiZyIsImV4ZWMiLCJoc2xUb1JnYiIsImgiLCJsIiwiaHVlMnJnYiIsInEiLCJjb2xvclRvUmdiIiwiZ2V0VW5pdCIsImFkZERlZmF1bHRUcmFuc2Zvcm1Vbml0IiwicHJvcCIsImludGlhbFZhbCIsImdldEFuaW1hdGlvblR5cGUiLCJlbCIsImdldENTU1ZhbHVlIiwiZ2V0QXR0cmlidXRlIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImdldFByb3BlcnR5VmFsdWUiLCJnZXRUcmFuc2Zvcm1WYWx1ZSIsImRlZmF1bHRWYWwiLCJzdHlsZSIsInRyYW5zZm9ybSIsIm1hdGNoIiwicHJvcHMiLCJ2YWx1ZXMiLCJmIiwibGVuZ3RoIiwiZ2V0SW5pdGlhbFRhcmdldFZhbHVlIiwidGFyZ2V0IiwiZ2V0VmFsaWRWYWx1ZSIsIm9yaWdpbmFsQ1NTIiwidW5pdCIsInRvIiwiZnJvbSIsImRlY29tcG9zZVZhbHVlIiwib3JpZ2luYWwiLCJudW1iZXJzIiwiTnVtYmVyIiwic3RyaW5ncyIsInNwbGl0IiwicmVjb21wb3NlVmFsdWUiLCJpbml0aWFsU3RyaW5ncyIsImdldEFuaW1hdGFibGVzIiwidGFyZ2V0cyIsImlkIiwiZ2V0UHJvcGVydGllcyIsInBhcmFtcyIsInNldHRpbmdzIiwiaGFzT3duUHJvcGVydHkiLCJ2YWx1ZSIsImdldFByb3BlcnRpZXNWYWx1ZXMiLCJnZXRUd2VlblZhbHVlcyIsInR5cGUiLCJ2YWxpZCIsImdldFR3ZWVuc1Byb3BzIiwiYW5pbWF0YWJsZXMiLCJ0d2VlbnNQcm9wcyIsImFuaW1hdGFibGUiLCJhbmltVHlwZSIsInR3ZWVuIiwiYW5pbWF0aW9uIiwic3BlZWQiLCJnZXRUd2VlbnMiLCJzcGxpdHRlZFByb3BzIiwidHdlZW5Qcm9wcyIsInRvdGFsRHVyYXRpb24iLCJyZXZlcnNlVHdlZW5zIiwiYW5pbSIsImRlbGF5cyIsInR3ZWVucyIsInRvVmFsIiwiZnJvbVZhbCIsImRlbGF5VmFsIiwicmV2ZXJzZWQiLCJnZXRXaWxsQ2hhbmdlIiwiZWxzIiwicHJvcGVydGllcyIsImpvaW4iLCJlbGVtZW50cyIsInNldFdpbGxDaGFuZ2UiLCJ3aWxsQ2hhbmdlIiwiZWxlbWVudCIsInJlbW92ZVdpbGxDaGFuZ2UiLCJyZW1vdmVQcm9wZXJ0eSIsImdldFBhdGhQcm9wcyIsInBhdGgiLCJnZXRUb3RhbExlbmd0aCIsInNuYXBQcm9ncmVzc1RvUGF0aCIsInByb2dyZXNzIiwicGF0aEVsIiwicGF0aFByb2dyZXNzIiwicG9pbnQiLCJvZmZzZXQiLCJnZXRQb2ludEF0TGVuZ3RoIiwicDAiLCJwMSIsIngiLCJ5IiwiYXRhbjIiLCJnZXRUd2VlblByb2dyZXNzIiwidGltZSIsImVsYXBzZWQiLCJwZXJjZW50Iiwic3RhcnQiLCJlYXNlZCIsInNldEFuaW1hdGlvblByb2dyZXNzIiwidHJhbnNmb3JtcyIsImN1cnJlbnRWYWx1ZSIsInNldEF0dHJpYnV0ZSIsImNyZWF0ZUFuaW1hdGlvbiIsImFwcGx5IiwicnVubmluZyIsImVuZGVkIiwiYW5pbWF0aW9ucyIsInRpY2siLCJub3ciLCJEYXRlIiwiY3VycmVudCIsImxhc3QiLCJyYWYiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJwYXVzZSIsInNlZWsiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsInNwbGljZSIsInBsYXkiLCJyZXN0YXJ0IiwicmVtb3ZlIiwibGlzdCIsImdldFZhbHVlIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7QUFTQSxJQUFJQSxRQUFTLFlBQVc7O0FBRXRCOztBQUVBLE1BQUlDLGtCQUFrQjtBQUNwQkMs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QnVELE1BQWpCLENBQXdCbk0sQ0FBeEIsRUFBMkIsQ0FBM0I7QUFDL0IsZ0JBQUksQ0FBQ21JLFVBQVVTLE1BQVYsQ0FBaUIzQyxNQUF0QixFQUE4QmtDLFVBQVU2RCxLQUFWO0FBQy9CO0FBQ0Y7QUFDRjtBQUNGO0FBQ0YsR0FmRDs7QUFpQkE3RCxZQUFVQyxLQUFWLEdBQWtCLENBQWxCO0FBQ0FELFlBQVVvRSxJQUFWLEdBQWlCZixVQUFqQjtBQUNBckQsWUFBVW1FLE1BQVYsR0FBbUJBLE1BQW5CO0FBQ0FuRSxZQUFVeEksT0FBVixHQUFvQkEsT0FBcEI7QUFDQXdJLFlBQVVxRSxRQUFWLEdBQXFCdEcscUJBQXJCO0FBQ0FpQyxZQUFVeUIsSUFBVixHQUFpQkQsWUFBakI7QUFDQXhCLFlBQVU5RixNQUFWLEdBQW1CQSxNQUFuQjs7QUFFQSxTQUFPOEYsU0FBUDtBQUVELENBdmtCVyxFQUFaIiwiZmlsZSI6ImFuaW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIEFuaW1lIHYxLjAuMFxuICogaHR0cDovL2FuaW1lLWpzLmNvbVxuICogSmF2YXNjcmlwdCBhbmltYXRpb24gZW5naW5lXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYgSnVsaWFuIEdhcm5pZXJcbiAqIGh0dHA6Ly9qdWxpYW5nYXJuaWVyLmNvbVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cblxudmFyIGFuaW1lID0gKGZ1bmN0aW9uKCkge1xuICBcbiAgLy8gRGVmYXVsdHNcbiAgXG4gIHZhciBkZWZhdWx0U2V0dGluZ3MgPSB7XG4gICAgZHVyYXRpb246IDEwMDAsXG4gICAgZGVsYXk6IDAsXG4gICAgbG9vcDogZmFsc2UsXG4gICAgYXV0b3BsYXk6IHRydWUsXG4gICAgZGlyZWN0aW9uOiAnbm9ybWFsJyxcbiAgICBlYXNpbmc6ICdlYXNlT3V0RWxhc3RpYycsXG4gICAgZWxhc3RpY2l0eTogNDAwLFxuICAgIHJvdW5kOiBmYWxzZSxcbiAgICBiZWdpbjogdW5kZWZpbmVkLFxuICAgIHVwZGF0ZTogdW5kZWZpbmVkLFxuICAgIGNvbXBsZXRlOiB1bmRlZmluZWRcbiAgfVxuICBcbiAgdmFyIHZhbGlkVHJhbnNmb3JtcyA9IFsndHJhbnNsYXRlWCcsICd0cmFuc2xhdGVZJywgJ3RyYW5zbGF0ZVonLCAncm90YXRlJywgJ3JvdGF0ZVgnLCAncm90YXRlWScsICdyb3RhdGVaJywgJ3NjYWxlJywgJ3NjYWxlWCcsICdzY2FsZVknLCAnc2NhbGVaJywgJ3NrZXdYJywgJ3NrZXdZJ107XG4gIFxuICAvLyBVdGlsc1xuICBcbiAgdmFyIGlzID0gKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBhcnJheTogIGZ1bmN0aW9uKGEpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgfSxcbiAgICAgIG9iamVjdDogZnVuY3Rpb24oYSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpLmluZGV4T2YoJ09iamVjdCcpID4gLTEgfSxcbiAgICAgIGh0bWw6ICAgZnVuY3Rpb24oYSkgeyByZXR1cm4gKGEgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fCBhIGluc3RhbmNlb2YgSFRNTENvbGxlY3Rpb24pIH0sXG4gICAgICBub2RlOiAgIGZ1bmN0aW9uKGEpIHsgcmV0dXJuIGEubm9kZVR5cGUgfSxcbiAgICAgIHN2ZzogICAgZnVuY3Rpb24oYSkgeyByZXR1cm4gYSBpbnN0YW5jZW9mIFNWR0VsZW1lbnQgfSxcbiAgICAgIG51bWJlcjogZnVuY3Rpb24oYSkgeyByZXR1cm4gIWlzTmFOKHBhcnNlSW50KGEpKSB9LFxuICAgICAgc3RyaW5nOiBmdW5jdGlvbihhKSB7IHJldHVybiB0eXBlb2YgYSA9PT0gJ3N0cmluZycgfSxcbiAgICAgIGZ1bmM6ICAgZnVuY3Rpb24oYSkgeyByZXR1cm4gdHlwZW9mIGEgPT09ICdmdW5jdGlvbicgfSxcbiAgICAgIHVuZGVmOiAgZnVuY3Rpb24oYSkgeyByZXR1cm4gdHlwZW9mIGEgPT09ICd1bmRlZmluZWQnIH0sXG4gICAgICBudWxsOiAgIGZ1bmN0aW9uKGEpIHsgcmV0dXJuIHR5cGVvZiBhID09PSAnbnVsbCcgfSxcbiAgICAgIGhleDogICAgZnVuY3Rpb24oYSkgeyByZXR1cm4gLyheI1swLTlBLUZdezZ9JCl8KF4jWzAtOUEtRl17M30kKS9pLnRlc3QoYSkgfSxcbiAgICAgIHJnYjogICAgZnVuY3Rpb24oYSkgeyByZXR1cm4gL15yZ2IvLnRlc3QoYSkgfSxcbiAgICAgIHJnYmE6ICAgZnVuY3Rpb24oYSkgeyByZXR1cm4gL15yZ2JhLy50ZXN0KGEpIH0sXG4gICAgICBoc2w6ICAgIGZ1bmN0aW9uKGEpIHsgcmV0dXJuIC9eaHNsLy50ZXN0KGEpIH0sXG4gICAgICBjb2xvcjogIGZ1bmN0aW9uKGEpIHsgcmV0dXJuIChpcy5oZXgoYSkgfHwgaXMucmdiKGEpIHx8IGlzLnJnYmEoYSkgfHwgaXMuaHNsKGEpKX1cbiAgICB9XG4gIH0pKCk7XG4gIFxuICAvLyBFYXNpbmdzIGZ1bmN0aW9ucyBhZGFwdGVkIGZyb20gaHR0cDovL2pxdWVyeXVpLmNvbS9cbiAgXG4gIHZhciBlYXNpbmdzID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBlYXNlcyA9IHt9O1xuICAgIHZhciBuYW1lcyA9IFsnUXVhZCcsICdDdWJpYycsICdRdWFydCcsICdRdWludCcsICdFeHBvJ107XG4gICAgdmFyIGZ1bmN0aW9ucyA9IHtcbiAgICAgIFNpbmU6IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIDEgLSBNYXRoLmNvcyggdCAqIE1hdGguUEkgLyAyICk7IH0sXG4gICAgICBDaXJjOiBmdW5jdGlvbih0KSB7IHJldHVybiAxIC0gTWF0aC5zcXJ0KCAxIC0gdCAqIHQgKTsgfSxcbiAgICAgIEVsYXN0aWM6IGZ1bmN0aW9uKHQsIG0pIHtcbiAgICAgICAgaWYoIHQgPT09IDAgfHwgdCA9PT0gMSApIHJldHVybiB0O1xuICAgICAgICB2YXIgcCA9ICgxIC0gTWF0aC5taW4obSwgOTk4KSAvIDEwMDApLCBzdCA9IHQgLyAxLCBzdDEgPSBzdCAtIDEsIHMgPSBwIC8gKCAyICogTWF0aC5QSSApICogTWF0aC5hc2luKCAxICk7XG4gICAgICAgIHJldHVybiAtKCBNYXRoLnBvdyggMiwgMTAgKiBzdDEgKSAqIE1hdGguc2luKCAoIHN0MSAtIHMgKSAqICggMiAqIE1hdGguUEkgKSAvIHAgKSApO1xuICAgICAgfSxcbiAgICAgIEJhY2s6IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQgKiB0ICogKCAzICogdCAtIDIgKTsgfSxcbiAgICAgIEJvdW5jZTogZnVuY3Rpb24odCkge1xuICAgICAgICB2YXIgcG93MiwgYm91bmNlID0gNDtcbiAgICAgICAgd2hpbGUgKCB0IDwgKCAoIHBvdzIgPSBNYXRoLnBvdyggMiwgLS1ib3VuY2UgKSApIC0gMSApIC8gMTEgKSB7fVxuICAgICAgICByZXR1cm4gMSAvIE1hdGgucG93KCA0LCAzIC0gYm91bmNlICkgLSA3LjU2MjUgKiBNYXRoLnBvdyggKCBwb3cyICogMyAtIDIgKSAvIDIyIC0gdCwgMiApO1xuICAgICAgfVxuICAgIH1cbiAgICBuYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUsIGkpIHtcbiAgICAgIGZ1bmN0aW9uc1tuYW1lXSA9IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KCB0LCBpICsgMiApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIE9iamVjdC5rZXlzKGZ1bmN0aW9ucykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZWFzZUluID0gZnVuY3Rpb25zW25hbWVdO1xuICAgICAgZWFzZXNbJ2Vhc2VJbicgKyBuYW1lXSA9IGVhc2VJbjtcbiAgICAgIGVhc2VzWydlYXNlT3V0JyArIG5hbWVdID0gZnVuY3Rpb24odCwgbSkgeyByZXR1cm4gMSAtIGVhc2VJbigxIC0gdCwgbSk7IH07XG4gICAgICBlYXNlc1snZWFzZUluT3V0JyArIG5hbWVdID0gZnVuY3Rpb24odCwgbSkgeyByZXR1cm4gdCA8IDAuNSA/IGVhc2VJbih0ICogMiwgbSkgLyAyIDogMSAtIGVhc2VJbih0ICogLTIgKyAyLCBtKSAvIDI7IH07XG4gICAgfSk7XG4gICAgZWFzZXMubGluZWFyID0gZnVuY3Rpb24odCkgeyByZXR1cm4gdDsgfTtcbiAgICByZXR1cm4gZWFzZXM7XG4gIH0pKCk7XG4gIFxuICAvLyBTdHJpbmdzXG4gIFxuICB2YXIgbnVtYmVyVG9TdHJpbmcgPSBmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gKGlzLnN0cmluZyh2YWwpKSA/IHZhbCA6IHZhbCArICcnO1xuICB9XG4gIFxuICB2YXIgc3RyaW5nVG9IeXBoZW5zID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIFxuICB2YXIgc2VsZWN0U3RyaW5nID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKGlzLmNvbG9yKHN0cikpIHJldHVybiBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgdmFyIG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzdHIpO1xuICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBcbiAgLy8gTnVtYmVyc1xuICBcbiAgdmFyIHJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG4gIH1cbiAgXG4gIC8vIEFycmF5c1xuICBcbiAgdmFyIGZsYXR0ZW5BcnJheSA9IGZ1bmN0aW9uKGFycikge1xuICAgIHJldHVybiBhcnIucmVkdWNlKGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLmNvbmNhdChpcy5hcnJheShiKSA/IGZsYXR0ZW5BcnJheShiKSA6IGIpO1xuICAgIH0sIFtdKTtcbiAgfVxuICBcbiAgdmFyIHRvQXJyYXkgPSBmdW5jdGlvbihvKSB7XG4gICAgaWYgKGlzLmFycmF5KG8pKSByZXR1cm4gbztcbiAgICBpZiAoaXMuc3RyaW5nKG8pKSBvID0gc2VsZWN0U3RyaW5nKG8pIHx8IG87XG4gICAgaWYgKGlzLmh0bWwobykpIHJldHVybiBbXS5zbGljZS5jYWxsKG8pO1xuICAgIHJldHVybiBbb107XG4gIH1cbiAgXG4gIHZhciBhcnJheUNvbnRhaW5zID0gZnVuY3Rpb24oYXJyLCB2YWwpIHtcbiAgICByZXR1cm4gYXJyLnNvbWUoZnVuY3Rpb24oYSkgeyByZXR1cm4gYSA9PT0gdmFsOyB9KTtcbiAgfVxuICBcbiAgdmFyIGdyb3VwQXJyYXlCeVByb3BzID0gZnVuY3Rpb24oYXJyLCBwcm9wc0Fycikge1xuICAgIHZhciBncm91cHMgPSB7fTtcbiAgICBhcnIuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZ3JvdXAgPSBKU09OLnN0cmluZ2lmeShwcm9wc0Fyci5tYXAoZnVuY3Rpb24ocCkgeyByZXR1cm4gb1twXTsgfSkpO1xuICAgICAgZ3JvdXBzW2dyb3VwXSA9IGdyb3Vwc1tncm91cF0gfHwgW107XG4gICAgICBncm91cHNbZ3JvdXBdLnB1c2gobyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGdyb3VwcykubWFwKGZ1bmN0aW9uKGdyb3VwKSB7XG4gICAgICByZXR1cm4gZ3JvdXBzW2dyb3VwXTtcbiAgICB9KTtcbiAgfVxuICBcbiAgdmFyIHJlbW92ZUFycmF5RHVwbGljYXRlcyA9IGZ1bmN0aW9uKGFycikge1xuICAgIHJldHVybiBhcnIuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0sIHBvcywgc2VsZikge1xuICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZihpdGVtKSA9PT0gcG9zO1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBPYmplY3RzXG4gIFxuICB2YXIgY2xvbmVPYmplY3QgPSBmdW5jdGlvbihvKSB7XG4gICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gbykgbmV3T2JqZWN0W3BdID0gb1twXTtcbiAgICByZXR1cm4gbmV3T2JqZWN0O1xuICB9XG4gIFxuICB2YXIgbWVyZ2VPYmplY3RzID0gZnVuY3Rpb24obzEsIG8yKSB7XG4gICAgZm9yICh2YXIgcCBpbiBvMikgbzFbcF0gPSAhaXMudW5kZWYobzFbcF0pID8gbzFbcF0gOiBvMltwXTtcbiAgICByZXR1cm4gbzE7XG4gIH1cbiAgXG4gIC8vIENvbG9yc1xuICBcbiAgdmFyIGhleFRvUmdiID0gZnVuY3Rpb24oaGV4KSB7XG4gICAgdmFyIHJneCA9IC9eIz8oW2EtZlxcZF0pKFthLWZcXGRdKShbYS1mXFxkXSkkL2k7XG4gICAgdmFyIGhleCA9IGhleC5yZXBsYWNlKHJneCwgZnVuY3Rpb24obSwgciwgZywgYikgeyByZXR1cm4gciArIHIgKyBnICsgZyArIGIgKyBiOyB9KTtcbiAgICB2YXIgcmdiID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XG4gICAgdmFyIHIgPSBwYXJzZUludChyZ2JbMV0sIDE2KTtcbiAgICB2YXIgZyA9IHBhcnNlSW50KHJnYlsyXSwgMTYpO1xuICAgIHZhciBiID0gcGFyc2VJbnQocmdiWzNdLCAxNik7XG4gICAgcmV0dXJuICdyZ2IoJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICcpJztcbiAgfVxuICBcbiAgdmFyIGhzbFRvUmdiID0gZnVuY3Rpb24oaHNsKSB7XG4gICAgdmFyIGhzbCA9IC9oc2xcXCgoXFxkKyksXFxzKihbXFxkLl0rKSUsXFxzKihbXFxkLl0rKSVcXCkvZy5leGVjKGhzbCk7XG4gICAgdmFyIGggPSBwYXJzZUludChoc2xbMV0pIC8gMzYwO1xuICAgIHZhciBzID0gcGFyc2VJbnQoaHNsWzJdKSAvIDEwMDtcbiAgICB2YXIgbCA9IHBhcnNlSW50KGhzbFszXSkgLyAxMDA7XG4gICAgdmFyIGh1ZTJyZ2IgPSBmdW5jdGlvbihwLCBxLCB0KSB7XG4gICAgICBpZiAodCA8IDApIHQgKz0gMTtcbiAgICAgIGlmICh0ID4gMSkgdCAtPSAxO1xuICAgICAgaWYgKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuICAgICAgaWYgKHQgPCAxLzIpIHJldHVybiBxO1xuICAgICAgaWYgKHQgPCAyLzMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyLzMgLSB0KSAqIDY7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gICAgdmFyIHIsIGcsIGI7XG4gICAgaWYgKHMgPT0gMCkge1xuICAgICAgciA9IGcgPSBiID0gbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuICAgICAgdmFyIHAgPSAyICogbCAtIHE7XG4gICAgICByID0gaHVlMnJnYihwLCBxLCBoICsgMS8zKTtcbiAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xuICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XG4gICAgfVxuICAgIHJldHVybiAncmdiKCcgKyByICogMjU1ICsgJywnICsgZyAqIDI1NSArICcsJyArIGIgKiAyNTUgKyAnKSc7XG4gIH1cbiAgXG4gIHZhciBjb2xvclRvUmdiID0gZnVuY3Rpb24odmFsKSB7XG4gICAgaWYgKGlzLnJnYih2YWwpIHx8IGlzLnJnYmEodmFsKSkgcmV0dXJuIHZhbDtcbiAgICBpZiAoaXMuaGV4KHZhbCkpIHJldHVybiBoZXhUb1JnYih2YWwpO1xuICAgIGlmIChpcy5oc2wodmFsKSkgcmV0dXJuIGhzbFRvUmdiKHZhbCk7XG4gIH1cbiAgXG4gIC8vIFVuaXRzXG4gIFxuICB2YXIgZ2V0VW5pdCA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiAvKFtcXCtcXC1dP1swLTl8YXV0b1xcLl0rKSglfHB4fHB0fGVtfHJlbXxpbnxjbXxtbXxleHxwY3x2d3x2aHxkZWcpPy8uZXhlYyh2YWwpWzJdO1xuICB9XG4gIFxuICB2YXIgYWRkRGVmYXVsdFRyYW5zZm9ybVVuaXQgPSBmdW5jdGlvbihwcm9wLCB2YWwsIGludGlhbFZhbCkge1xuICAgIGlmIChnZXRVbml0KHZhbCkpIHJldHVybiB2YWw7XG4gICAgaWYgKHByb3AuaW5kZXhPZigndHJhbnNsYXRlJykgPiAtMSkgcmV0dXJuIGdldFVuaXQoaW50aWFsVmFsKSA/IHZhbCArIGdldFVuaXQoaW50aWFsVmFsKSA6IHZhbCArICdweCc7XG4gICAgaWYgKHByb3AuaW5kZXhPZigncm90YXRlJykgPiAtMSB8fCBwcm9wLmluZGV4T2YoJ3NrZXcnKSA+IC0xKSByZXR1cm4gdmFsICsgJ2RlZyc7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICBcbiAgLy8gVmFsdWVzXG4gIFxuICB2YXIgZ2V0QW5pbWF0aW9uVHlwZSA9IGZ1bmN0aW9uKGVsLCBwcm9wKSB7XG4gICAgaWYgKChpcy5ub2RlKGVsKSB8fCBpcy5zdmcoZWwpKSAmJiBhcnJheUNvbnRhaW5zKHZhbGlkVHJhbnNmb3JtcywgcHJvcCkpIHJldHVybiAndHJhbnNmb3JtJztcbiAgICBpZiAoKGlzLm5vZGUoZWwpIHx8IGlzLnN2ZyhlbCkpICYmIChwcm9wICE9PSAndHJhbnNmb3JtJyAmJiBnZXRDU1NWYWx1ZShlbCwgcHJvcCkpKSByZXR1cm4gJ2Nzcyc7XG4gICAgaWYgKChpcy5ub2RlKGVsKSB8fCBpcy5zdmcoZWwpKSAmJiAoZWwuZ2V0QXR0cmlidXRlKHByb3ApIHx8IGVsW3Byb3BdKSkgcmV0dXJuICdhdHRyaWJ1dGUnO1xuICAgIGlmICghaXMubnVsbChlbFtwcm9wXSkgJiYgIWlzLnVuZGVmKGVsW3Byb3BdKSkgcmV0dXJuICdvYmplY3QnO1xuICB9XG4gIFxuICB2YXIgZ2V0Q1NTVmFsdWUgPSBmdW5jdGlvbihlbCwgcHJvcCkge1xuICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKHN0cmluZ1RvSHlwaGVucyhwcm9wKSk7XG4gIH1cbiAgXG4gIHZhciBnZXRUcmFuc2Zvcm1WYWx1ZSA9IGZ1bmN0aW9uKGVsLCBwcm9wKSB7XG4gICAgdmFyIGRlZmF1bHRWYWwgPSBwcm9wLmluZGV4T2YoJ3NjYWxlJykgPiAtMSA/IDEgOiAwO1xuICAgIHZhciBzdHIgPSBlbC5zdHlsZS50cmFuc2Zvcm07XG4gICAgaWYgKCFzdHIpIHJldHVybiBkZWZhdWx0VmFsO1xuICAgIHZhciByZ3ggPSAvKFxcdyspXFwoKC4rPylcXCkvZztcbiAgICB2YXIgbWF0Y2ggPSBbXTtcbiAgICB2YXIgcHJvcHMgPSBbXTtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgd2hpbGUgKG1hdGNoID0gcmd4LmV4ZWMoc3RyKSkge1xuICAgICAgcHJvcHMucHVzaChtYXRjaFsxXSk7XG4gICAgICB2YWx1ZXMucHVzaChtYXRjaFsyXSk7XG4gICAgfVxuICAgIHZhciB2YWwgPSB2YWx1ZXMuZmlsdGVyKGZ1bmN0aW9uKGYsIGkpIHsgcmV0dXJuIHByb3BzW2ldID09PSBwcm9wOyB9KTtcbiAgICByZXR1cm4gdmFsLmxlbmd0aCA/IHZhbFswXSA6IGRlZmF1bHRWYWw7XG4gIH1cbiAgXG4gIHZhciBnZXRJbml0aWFsVGFyZ2V0VmFsdWUgPSBmdW5jdGlvbih0YXJnZXQsIHByb3ApIHtcbiAgICBzd2l0Y2ggKGdldEFuaW1hdGlvblR5cGUodGFyZ2V0LCBwcm9wKSkge1xuICAgICAgY2FzZSAndHJhbnNmb3JtJzogcmV0dXJuIGdldFRyYW5zZm9ybVZhbHVlKHRhcmdldCwgcHJvcCk7XG4gICAgICBjYXNlICdjc3MnOiByZXR1cm4gZ2V0Q1NTVmFsdWUodGFyZ2V0LCBwcm9wKTtcbiAgICAgIGNhc2UgJ2F0dHJpYnV0ZSc6IHJldHVybiB0YXJnZXQuZ2V0QXR0cmlidXRlKHByb3ApO1xuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0W3Byb3BdIHx8IDA7XG4gIH1cbiAgXG4gIHZhciBnZXRWYWxpZFZhbHVlID0gZnVuY3Rpb24odmFsdWVzLCB2YWwsIG9yaWdpbmFsQ1NTKSB7XG4gICAgaWYgKGlzLmNvbG9yKHZhbCkpIHJldHVybiBjb2xvclRvUmdiKHZhbCk7XG4gICAgaWYgKGdldFVuaXQodmFsKSkgcmV0dXJuIHZhbDtcbiAgICB2YXIgdW5pdCA9IGdldFVuaXQodmFsdWVzLnRvKSA/IGdldFVuaXQodmFsdWVzLnRvKSA6IGdldFVuaXQodmFsdWVzLmZyb20pO1xuICAgIGlmICghdW5pdCAmJiBvcmlnaW5hbENTUykgdW5pdCA9IGdldFVuaXQob3JpZ2luYWxDU1MpO1xuICAgIHJldHVybiB1bml0ID8gdmFsICsgdW5pdCA6IHZhbDtcbiAgfVxuICBcbiAgdmFyIGRlY29tcG9zZVZhbHVlID0gZnVuY3Rpb24odmFsKSB7XG4gICAgdmFyIHJneCA9IC8tP1xcZCpcXC4/XFxkKy9nO1xuICAgIHJldHVybiB7XG4gICAgICBvcmlnaW5hbDogdmFsLFxuICAgICAgbnVtYmVyczogbnVtYmVyVG9TdHJpbmcodmFsKS5tYXRjaChyZ3gpID8gbnVtYmVyVG9TdHJpbmcodmFsKS5tYXRjaChyZ3gpLm1hcChOdW1iZXIpIDogWzBdLFxuICAgICAgc3RyaW5nczogbnVtYmVyVG9TdHJpbmcodmFsKS5zcGxpdChyZ3gpXG4gICAgfVxuICB9XG4gIFxuICB2YXIgcmVjb21wb3NlVmFsdWUgPSBmdW5jdGlvbihudW1iZXJzLCBzdHJpbmdzLCBpbml0aWFsU3RyaW5ncykge1xuICAgIHJldHVybiBzdHJpbmdzLnJlZHVjZShmdW5jdGlvbihhLCBiLCBpKSB7XG4gICAgICB2YXIgYiA9IChiID8gYiA6IGluaXRpYWxTdHJpbmdzW2kgLSAxXSk7XG4gICAgICByZXR1cm4gYSArIG51bWJlcnNbaSAtIDFdICsgYjtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gQW5pbWF0YWJsZXNcbiAgXG4gIHZhciBnZXRBbmltYXRhYmxlcyA9IGZ1bmN0aW9uKHRhcmdldHMpIHtcbiAgICB2YXIgdGFyZ2V0cyA9IHRhcmdldHMgPyAoZmxhdHRlbkFycmF5KGlzLmFycmF5KHRhcmdldHMpID8gdGFyZ2V0cy5tYXAodG9BcnJheSkgOiB0b0FycmF5KHRhcmdldHMpKSkgOiBbXTtcbiAgICByZXR1cm4gdGFyZ2V0cy5tYXAoZnVuY3Rpb24odCwgaSkge1xuICAgICAgcmV0dXJuIHsgdGFyZ2V0OiB0LCBpZDogaSB9O1xuICAgIH0pO1xuICB9XG4gIFxuICAvLyBQcm9wZXJ0aWVzXG4gIFxuICB2YXIgZ2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uKHBhcmFtcywgc2V0dGluZ3MpIHtcbiAgICB2YXIgcHJvcHMgPSBbXTtcbiAgICBmb3IgKHZhciBwIGluIHBhcmFtcykge1xuICAgICAgaWYgKCFkZWZhdWx0U2V0dGluZ3MuaGFzT3duUHJvcGVydHkocCkgJiYgcCAhPT0gJ3RhcmdldHMnKSB7XG4gICAgICAgIHZhciBwcm9wID0gaXMub2JqZWN0KHBhcmFtc1twXSkgPyBjbG9uZU9iamVjdChwYXJhbXNbcF0pIDoge3ZhbHVlOiBwYXJhbXNbcF19O1xuICAgICAgICBwcm9wLm5hbWUgPSBwO1xuICAgICAgICBwcm9wcy5wdXNoKG1lcmdlT2JqZWN0cyhwcm9wLCBzZXR0aW5ncykpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cbiAgXG4gIHZhciBnZXRQcm9wZXJ0aWVzVmFsdWVzID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wLCB2YWx1ZSwgaSkge1xuICAgIHZhciB2YWx1ZXMgPSB0b0FycmF5KCBpcy5mdW5jKHZhbHVlKSA/IHZhbHVlKHRhcmdldCwgaSkgOiB2YWx1ZSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZyb206ICh2YWx1ZXMubGVuZ3RoID4gMSkgPyB2YWx1ZXNbMF0gOiBnZXRJbml0aWFsVGFyZ2V0VmFsdWUodGFyZ2V0LCBwcm9wKSxcbiAgICAgIHRvOiAodmFsdWVzLmxlbmd0aCA+IDEpID8gdmFsdWVzWzFdIDogdmFsdWVzWzBdXG4gICAgfVxuICB9XG4gIFxuICB2YXIgZ2V0VHdlZW5WYWx1ZXMgPSBmdW5jdGlvbihwcm9wLCB2YWx1ZXMsIHR5cGUsIHRhcmdldCkge1xuICAgIHZhciB2YWxpZCA9IHt9O1xuICAgIGlmICh0eXBlID09PSAndHJhbnNmb3JtJykge1xuICAgICAgdmFsaWQuZnJvbSA9IHByb3AgKyAnKCcgKyBhZGREZWZhdWx0VHJhbnNmb3JtVW5pdChwcm9wLCB2YWx1ZXMuZnJvbSwgdmFsdWVzLnRvKSArICcpJztcbiAgICAgIHZhbGlkLnRvID0gcHJvcCArICcoJyArIGFkZERlZmF1bHRUcmFuc2Zvcm1Vbml0KHByb3AsIHZhbHVlcy50bykgKyAnKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBvcmlnaW5hbENTUyA9ICh0eXBlID09PSAnY3NzJykgPyBnZXRDU1NWYWx1ZSh0YXJnZXQsIHByb3ApIDogdW5kZWZpbmVkO1xuICAgICAgdmFsaWQuZnJvbSA9IGdldFZhbGlkVmFsdWUodmFsdWVzLCB2YWx1ZXMuZnJvbSwgb3JpZ2luYWxDU1MpO1xuICAgICAgdmFsaWQudG8gPSBnZXRWYWxpZFZhbHVlKHZhbHVlcywgdmFsdWVzLnRvLCBvcmlnaW5hbENTUyk7XG4gICAgfVxuICAgIHJldHVybiB7IGZyb206IGRlY29tcG9zZVZhbHVlKHZhbGlkLmZyb20pLCB0bzogZGVjb21wb3NlVmFsdWUodmFsaWQudG8pIH07XG4gIH1cbiAgXG4gIHZhciBnZXRUd2VlbnNQcm9wcyA9IGZ1bmN0aW9uKGFuaW1hdGFibGVzLCBwcm9wcykge1xuICAgIHZhciB0d2VlbnNQcm9wcyA9IFtdO1xuICAgIGFuaW1hdGFibGVzLmZvckVhY2goZnVuY3Rpb24oYW5pbWF0YWJsZSwgaSkge1xuICAgICAgdmFyIHRhcmdldCA9IGFuaW1hdGFibGUudGFyZ2V0O1xuICAgICAgcmV0dXJuIHByb3BzLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICB2YXIgYW5pbVR5cGUgPSBnZXRBbmltYXRpb25UeXBlKHRhcmdldCwgcHJvcC5uYW1lKTtcbiAgICAgICAgaWYgKGFuaW1UeXBlKSB7XG4gICAgICAgICAgdmFyIHZhbHVlcyA9IGdldFByb3BlcnRpZXNWYWx1ZXModGFyZ2V0LCBwcm9wLm5hbWUsIHByb3AudmFsdWUsIGkpO1xuICAgICAgICAgIHZhciB0d2VlbiA9IGNsb25lT2JqZWN0KHByb3ApO1xuICAgICAgICAgIHR3ZWVuLmFuaW1hdGFibGVzID0gYW5pbWF0YWJsZTtcbiAgICAgICAgICB0d2Vlbi50eXBlID0gYW5pbVR5cGU7XG4gICAgICAgICAgdHdlZW4uZnJvbSA9IGdldFR3ZWVuVmFsdWVzKHByb3AubmFtZSwgdmFsdWVzLCB0d2Vlbi50eXBlLCB0YXJnZXQpLmZyb207XG4gICAgICAgICAgdHdlZW4udG8gPSBnZXRUd2VlblZhbHVlcyhwcm9wLm5hbWUsIHZhbHVlcywgdHdlZW4udHlwZSwgdGFyZ2V0KS50bztcbiAgICAgICAgICB0d2Vlbi5yb3VuZCA9IChpcy5jb2xvcih2YWx1ZXMuZnJvbSkgfHwgdHdlZW4ucm91bmQpID8gMSA6IDA7XG4gICAgICAgICAgdHdlZW4uZGVsYXkgPSAoaXMuZnVuYyh0d2Vlbi5kZWxheSkgPyB0d2Vlbi5kZWxheSh0YXJnZXQsIGksIGFuaW1hdGFibGVzLmxlbmd0aCkgOiB0d2Vlbi5kZWxheSkgLyBhbmltYXRpb24uc3BlZWQ7XG4gICAgICAgICAgdHdlZW4uZHVyYXRpb24gPSAoaXMuZnVuYyh0d2Vlbi5kdXJhdGlvbikgPyB0d2Vlbi5kdXJhdGlvbih0YXJnZXQsIGksIGFuaW1hdGFibGVzLmxlbmd0aCkgOiB0d2Vlbi5kdXJhdGlvbikgLyBhbmltYXRpb24uc3BlZWQ7XG4gICAgICAgICAgdHdlZW5zUHJvcHMucHVzaCh0d2Vlbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiB0d2VlbnNQcm9wcztcbiAgfVxuICBcbiAgLy8gVHdlZW5zXG4gIFxuICB2YXIgZ2V0VHdlZW5zID0gZnVuY3Rpb24oYW5pbWF0YWJsZXMsIHByb3BzKSB7XG4gICAgdmFyIHR3ZWVuc1Byb3BzID0gZ2V0VHdlZW5zUHJvcHMoYW5pbWF0YWJsZXMsIHByb3BzKTtcbiAgICB2YXIgc3BsaXR0ZWRQcm9wcyA9IGdyb3VwQXJyYXlCeVByb3BzKHR3ZWVuc1Byb3BzLCBbJ25hbWUnLCAnZnJvbScsICd0bycsICdkZWxheScsICdkdXJhdGlvbiddKTtcbiAgICByZXR1cm4gc3BsaXR0ZWRQcm9wcy5tYXAoZnVuY3Rpb24odHdlZW5Qcm9wcykge1xuICAgICAgdmFyIHR3ZWVuID0gY2xvbmVPYmplY3QodHdlZW5Qcm9wc1swXSk7XG4gICAgICB0d2Vlbi5hbmltYXRhYmxlcyA9IHR3ZWVuUHJvcHMubWFwKGZ1bmN0aW9uKHApIHsgcmV0dXJuIHAuYW5pbWF0YWJsZXMgfSk7XG4gICAgICB0d2Vlbi50b3RhbER1cmF0aW9uID0gdHdlZW4uZGVsYXkgKyB0d2Vlbi5kdXJhdGlvbjtcbiAgICAgIHJldHVybiB0d2VlbjtcbiAgICB9KTtcbiAgfVxuICBcbiAgdmFyIHJldmVyc2VUd2VlbnMgPSBmdW5jdGlvbihhbmltLCBkZWxheXMpIHtcbiAgICBhbmltLnR3ZWVucy5mb3JFYWNoKGZ1bmN0aW9uKHR3ZWVuKSB7XG4gICAgICB2YXIgdG9WYWwgPSB0d2Vlbi50bztcbiAgICAgIHZhciBmcm9tVmFsID0gdHdlZW4uZnJvbTtcbiAgICAgIHZhciBkZWxheVZhbCA9IGFuaW0uZHVyYXRpb24gLSAodHdlZW4uZGVsYXkgKyB0d2Vlbi5kdXJhdGlvbik7XG4gICAgICB0d2Vlbi5mcm9tID0gdG9WYWw7XG4gICAgICB0d2Vlbi50byA9IGZyb21WYWw7XG4gICAgICBpZiAoZGVsYXlzKSB0d2Vlbi5kZWxheSA9IGRlbGF5VmFsO1xuICAgIH0pO1xuICAgIGFuaW0ucmV2ZXJzZWQgPSBhbmltLnJldmVyc2VkID8gZmFsc2UgOiB0cnVlO1xuICB9XG4gIFxuICAvLyB3aWxsLWNoYW5nZVxuICBcbiAgdmFyIGdldFdpbGxDaGFuZ2UgPSBmdW5jdGlvbihhbmltKSB7XG4gICAgdmFyIHByb3BzID0gW107XG4gICAgdmFyIGVscyA9IFtdO1xuICAgIGFuaW0udHdlZW5zLmZvckVhY2goZnVuY3Rpb24odHdlZW4pIHtcbiAgICAgIGlmICh0d2Vlbi50eXBlID09PSAnY3NzJyB8fCB0d2Vlbi50eXBlID09PSAndHJhbnNmb3JtJyApIHtcbiAgICAgICAgcHJvcHMucHVzaCh0d2Vlbi50eXBlID09PSAnY3NzJyA/IHN0cmluZ1RvSHlwaGVucyh0d2Vlbi5uYW1lKSA6ICd0cmFuc2Zvcm0nKTtcbiAgICAgICAgdHdlZW4uYW5pbWF0YWJsZXMuZm9yRWFjaChmdW5jdGlvbihhbmltYXRhYmxlKSB7IGVscy5wdXNoKGFuaW1hdGFibGUudGFyZ2V0KTsgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3BlcnRpZXM6IHJlbW92ZUFycmF5RHVwbGljYXRlcyhwcm9wcykuam9pbignLCAnKSxcbiAgICAgIGVsZW1lbnRzOiByZW1vdmVBcnJheUR1cGxpY2F0ZXMoZWxzKVxuICAgIH1cbiAgfVxuICBcbiAgdmFyIHNldFdpbGxDaGFuZ2UgPSBmdW5jdGlvbihhbmltKSB7XG4gICAgdmFyIHdpbGxDaGFuZ2UgPSBnZXRXaWxsQ2hhbmdlKGFuaW0pO1xuICAgIHdpbGxDaGFuZ2UuZWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICBlbGVtZW50LnN0eWxlLndpbGxDaGFuZ2UgPSB3aWxsQ2hhbmdlLnByb3BlcnRpZXM7XG4gICAgfSk7XG4gIH1cbiAgXG4gIHZhciByZW1vdmVXaWxsQ2hhbmdlID0gZnVuY3Rpb24oYW5pbSkge1xuICAgIHZhciB3aWxsQ2hhbmdlID0gZ2V0V2lsbENoYW5nZShhbmltKTtcbiAgICB3aWxsQ2hhbmdlLmVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgZWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnd2lsbC1jaGFuZ2UnKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLyogU3ZnIHBhdGggKi9cbiAgXG4gIHZhciBnZXRQYXRoUHJvcHMgPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgdmFyIGVsID0gaXMuc3RyaW5nKHBhdGgpID8gc2VsZWN0U3RyaW5nKHBhdGgpWzBdIDogcGF0aDtcbiAgICByZXR1cm4ge1xuICAgICAgcGF0aDogZWwsXG4gICAgICB2YWx1ZTogZWwuZ2V0VG90YWxMZW5ndGgoKVxuICAgIH1cbiAgfVxuICBcbiAgdmFyIHNuYXBQcm9ncmVzc1RvUGF0aCA9IGZ1bmN0aW9uKHR3ZWVuLCBwcm9ncmVzcykge1xuICAgIHZhciBwYXRoRWwgPSB0d2Vlbi5wYXRoO1xuICAgIHZhciBwYXRoUHJvZ3Jlc3MgPSB0d2Vlbi52YWx1ZSAqIHByb2dyZXNzO1xuICAgIHZhciBwb2ludCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgdmFyIG8gPSBvZmZzZXQgfHwgMDtcbiAgICAgIHZhciBwID0gcHJvZ3Jlc3MgPiAxID8gdHdlZW4udmFsdWUgKyBvIDogcGF0aFByb2dyZXNzICsgbztcbiAgICAgIHJldHVybiBwYXRoRWwuZ2V0UG9pbnRBdExlbmd0aChwKTtcbiAgICB9XG4gICAgdmFyIHAgPSBwb2ludCgpO1xuICAgIHZhciBwMCA9IHBvaW50KC0xKTtcbiAgICB2YXIgcDEgPSBwb2ludCgrMSk7XG4gICAgc3dpdGNoICh0d2Vlbi5uYW1lKSB7XG4gICAgICBjYXNlICd0cmFuc2xhdGVYJzogcmV0dXJuIHAueDtcbiAgICAgIGNhc2UgJ3RyYW5zbGF0ZVknOiByZXR1cm4gcC55O1xuICAgICAgY2FzZSAncm90YXRlJzogcmV0dXJuIE1hdGguYXRhbjIocDEueSAtIHAwLnksIHAxLnggLSBwMC54KSAqIDE4MCAvIE1hdGguUEk7XG4gICAgfVxuICB9XG4gIFxuICAvLyBQcm9ncmVzc1xuICBcbiAgdmFyIGdldFR3ZWVuUHJvZ3Jlc3MgPSBmdW5jdGlvbih0d2VlbiwgdGltZSkge1xuICAgIHZhciBlbGFwc2VkID0gTWF0aC5taW4oTWF0aC5tYXgodGltZSAtIHR3ZWVuLmRlbGF5LCAwKSwgdHdlZW4uZHVyYXRpb24pO1xuICAgIHZhciBwZXJjZW50ID0gZWxhcHNlZCAvIHR3ZWVuLmR1cmF0aW9uO1xuICAgIHZhciBwcm9ncmVzcyA9IHR3ZWVuLnRvLm51bWJlcnMubWFwKGZ1bmN0aW9uKG51bWJlciwgcCkge1xuICAgICAgdmFyIHN0YXJ0ID0gdHdlZW4uZnJvbS5udW1iZXJzW3BdO1xuICAgICAgdmFyIGVhc2VkID0gZWFzaW5nc1t0d2Vlbi5lYXNpbmddKHBlcmNlbnQsIHR3ZWVuLmVsYXN0aWNpdHkpO1xuICAgICAgdmFyIHZhbCA9IHR3ZWVuLnBhdGggPyBzbmFwUHJvZ3Jlc3NUb1BhdGgodHdlZW4sIGVhc2VkKSA6IHN0YXJ0ICsgZWFzZWQgKiAobnVtYmVyIC0gc3RhcnQpO1xuICAgICAgdmFsID0gdHdlZW4ucm91bmQgPyBNYXRoLnJvdW5kKHZhbCAqIHR3ZWVuLnJvdW5kKSAvIHR3ZWVuLnJvdW5kIDogdmFsO1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVjb21wb3NlVmFsdWUocHJvZ3Jlc3MsIHR3ZWVuLnRvLnN0cmluZ3MsIHR3ZWVuLmZyb20uc3RyaW5ncyk7XG4gIH1cbiAgXG4gIHZhciBzZXRBbmltYXRpb25Qcm9ncmVzcyA9IGZ1bmN0aW9uKGFuaW0sIHRpbWUpIHtcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHVuZGVmaW5lZDtcbiAgICBhbmltLnRpbWUgPSBNYXRoLm1pbih0aW1lLCBhbmltLmR1cmF0aW9uKTtcbiAgICBhbmltLnByb2dyZXNzID0gKGFuaW0udGltZSAvIGFuaW0uZHVyYXRpb24pICogMTAwO1xuICAgIGFuaW0udHdlZW5zLmZvckVhY2goZnVuY3Rpb24odHdlZW4pIHtcbiAgICAgIHR3ZWVuLmN1cnJlbnRWYWx1ZSA9IGdldFR3ZWVuUHJvZ3Jlc3ModHdlZW4sIHRpbWUpO1xuICAgICAgdmFyIHByb2dyZXNzID0gdHdlZW4uY3VycmVudFZhbHVlO1xuICAgICAgdHdlZW4uYW5pbWF0YWJsZXMuZm9yRWFjaChmdW5jdGlvbihhbmltYXRhYmxlKSB7XG4gICAgICAgIHZhciBpZCA9IGFuaW1hdGFibGUuaWQ7XG4gICAgICAgIHN3aXRjaCAodHdlZW4udHlwZSkge1xuICAgICAgICAgIGNhc2UgJ2Nzcyc6IGFuaW1hdGFibGUudGFyZ2V0LnN0eWxlW3R3ZWVuLm5hbWVdID0gcHJvZ3Jlc3M7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2F0dHJpYnV0ZSc6IGFuaW1hdGFibGUudGFyZ2V0LnNldEF0dHJpYnV0ZSh0d2Vlbi5uYW1lLCBwcm9ncmVzcyk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ29iamVjdCc6IGFuaW1hdGFibGUudGFyZ2V0W3R3ZWVuLm5hbWVdID0gcHJvZ3Jlc3M7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3RyYW5zZm9ybSc6XG4gICAgICAgICAgICBpZiAoIXRyYW5zZm9ybXMpIHRyYW5zZm9ybXMgPSB7fTtcbiAgICAgICAgICAgIGlmICghdHJhbnNmb3Jtc1tpZF0pIHRyYW5zZm9ybXNbaWRdID0gW107XG4gICAgICAgICAgICB0cmFuc2Zvcm1zW2lkXS5wdXNoKHByb2dyZXNzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAodHJhbnNmb3JtcykgZm9yICh2YXIgdCBpbiB0cmFuc2Zvcm1zKSBhbmltLmFuaW1hdGFibGVzW3RdLnRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1zW3RdLmpvaW4oJyAnKTtcbiAgICBpZiAoYW5pbS5zZXR0aW5ncy51cGRhdGUpIGFuaW0uc2V0dGluZ3MudXBkYXRlKGFuaW0pO1xuICB9XG4gIFxuICAvLyBBbmltYXRpb25cbiAgXG4gIHZhciBjcmVhdGVBbmltYXRpb24gPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICB2YXIgYW5pbSA9IHt9O1xuICAgIGFuaW0uYW5pbWF0YWJsZXMgPSBnZXRBbmltYXRhYmxlcyhwYXJhbXMudGFyZ2V0cyk7XG4gICAgYW5pbS5zZXR0aW5ncyA9IG1lcmdlT2JqZWN0cyhwYXJhbXMsIGRlZmF1bHRTZXR0aW5ncyk7XG4gICAgYW5pbS5wcm9wZXJ0aWVzID0gZ2V0UHJvcGVydGllcyhwYXJhbXMsIGFuaW0uc2V0dGluZ3MpO1xuICAgIGFuaW0udHdlZW5zID0gZ2V0VHdlZW5zKGFuaW0uYW5pbWF0YWJsZXMsIGFuaW0ucHJvcGVydGllcyk7XG4gICAgYW5pbS5kdXJhdGlvbiA9IGFuaW0udHdlZW5zLmxlbmd0aCA/IE1hdGgubWF4LmFwcGx5KE1hdGgsIGFuaW0udHdlZW5zLm1hcChmdW5jdGlvbih0d2Vlbil7IHJldHVybiB0d2Vlbi50b3RhbER1cmF0aW9uOyB9KSkgOiBwYXJhbXMuZHVyYXRpb24gLyBhbmltYXRpb24uc3BlZWQ7XG4gICAgYW5pbS50aW1lID0gMDtcbiAgICBhbmltLnByb2dyZXNzID0gMDtcbiAgICBhbmltLnJ1bm5pbmcgPSBmYWxzZTtcbiAgICBhbmltLmVuZGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIGFuaW07XG4gIH1cbiAgXG4gIC8vIFB1YmxpY1xuICBcbiAgdmFyIGFuaW1hdGlvbnMgPSBbXTtcbiAgXG4gIHZhciBhbmltYXRpb24gPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICBcbiAgICB2YXIgYW5pbSA9IGNyZWF0ZUFuaW1hdGlvbihwYXJhbXMpO1xuICAgIHZhciB0aW1lID0ge307XG4gICAgXG4gICAgdGltZS50aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoYW5pbS5ydW5uaW5nKSB7XG4gICAgICAgIGFuaW0uZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgdGltZS5ub3cgPSArbmV3IERhdGUoKTtcbiAgICAgICAgdGltZS5jdXJyZW50ID0gdGltZS5sYXN0ICsgdGltZS5ub3cgLSB0aW1lLnN0YXJ0O1xuICAgICAgICBzZXRBbmltYXRpb25Qcm9ncmVzcyhhbmltLCB0aW1lLmN1cnJlbnQpO1xuICAgICAgICB2YXIgcyA9IGFuaW0uc2V0dGluZ3M7XG4gICAgICAgIGlmIChzLmJlZ2luICYmIHRpbWUuY3VycmVudCA+PSBzLmRlbGF5KSB7IHMuYmVnaW4oYW5pbSk7IHMuYmVnaW4gPSB1bmRlZmluZWQ7IH07XG4gICAgICAgIGlmICh0aW1lLmN1cnJlbnQgPj0gYW5pbS5kdXJhdGlvbikge1xuICAgICAgICAgIGlmIChzLmxvb3ApIHtcbiAgICAgICAgICAgIHRpbWUuc3RhcnQgPSArbmV3IERhdGUoKTtcbiAgICAgICAgICAgIGlmIChzLmRpcmVjdGlvbiA9PT0gJ2FsdGVybmF0ZScpIHJldmVyc2VUd2VlbnMoYW5pbSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoaXMubnVtYmVyKHMubG9vcCkpIHMubG9vcC0tO1xuICAgICAgICAgICAgdGltZS5yYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZS50aWNrKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5pbS5lbmRlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAocy5jb21wbGV0ZSkgcy5jb21wbGV0ZShhbmltKTtcbiAgICAgICAgICAgIGFuaW0ucGF1c2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGltZS5sYXN0ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aW1lLnJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lLnRpY2spO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGFuaW0uc2VlayA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICB2YXIgdGltZSA9IChwcm9ncmVzcyAvIDEwMCkgKiBhbmltLmR1cmF0aW9uO1xuICAgICAgc2V0QW5pbWF0aW9uUHJvZ3Jlc3MoYW5pbSwgdGltZSk7XG4gICAgfVxuICAgIFxuICAgIGFuaW0ucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIGFuaW0ucnVubmluZyA9IGZhbHNlO1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZS5yYWYpO1xuICAgICAgcmVtb3ZlV2lsbENoYW5nZShhbmltKTtcbiAgICAgIHZhciBpID0gYW5pbWF0aW9ucy5pbmRleE9mKGFuaW0pO1xuICAgICAgaWYgKGkgPiAtMSkgYW5pbWF0aW9ucy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICAgIFxuICAgIGFuaW0ucGxheSA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgaWYgKHBhcmFtcykgYW5pbSA9IG1lcmdlT2JqZWN0cyhjcmVhdGVBbmltYXRpb24obWVyZ2VPYmplY3RzKHBhcmFtcywgYW5pbS5zZXR0aW5ncykpLCBhbmltKTtcbiAgICAgIGFuaW0ucGF1c2UoKTtcbiAgICAgIGFuaW0ucnVubmluZyA9IHRydWU7XG4gICAgICB0aW1lLnN0YXJ0ID0gK25ldyBEYXRlKCk7XG4gICAgICB0aW1lLmxhc3QgPSBhbmltLmVuZGVkID8gMCA6IGFuaW0udGltZTtcbiAgICAgIHZhciBzID0gYW5pbS5zZXR0aW5ncztcbiAgICAgIGlmIChzLmRpcmVjdGlvbiA9PT0gJ3JldmVyc2UnKSByZXZlcnNlVHdlZW5zKGFuaW0pO1xuICAgICAgaWYgKHMuZGlyZWN0aW9uID09PSAnYWx0ZXJuYXRlJyAmJiAhcy5sb29wKSBzLmxvb3AgPSAxO1xuICAgICAgc2V0V2lsbENoYW5nZShhbmltKTtcbiAgICAgIGFuaW1hdGlvbnMucHVzaChhbmltKTtcbiAgICAgIHRpbWUucmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWUudGljayk7XG4gICAgfVxuICAgIFxuICAgIGFuaW0ucmVzdGFydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGFuaW0ucmV2ZXJzZWQpIHJldmVyc2VUd2VlbnMoYW5pbSk7XG4gICAgICBhbmltLnBhdXNlKCk7XG4gICAgICBhbmltLnNlZWsoMCk7XG4gICAgICBhbmltLnBsYXkoKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGFuaW0uc2V0dGluZ3MuYXV0b3BsYXkpIGFuaW0ucGxheSgpO1xuICAgIFxuICAgIHJldHVybiBhbmltO1xuICAgIFxuICB9XG4gIFxuICAvLyBSZW1vdmUgb24gb25lIG9yIG11bHRpcGxlIHRhcmdldHMgZnJvbSBhbGwgYWN0aXZlIGFuaW1hdGlvbnMuXG4gIFxuICB2YXIgcmVtb3ZlID0gZnVuY3Rpb24oZWxlbWVudHMpIHtcbiAgICB2YXIgdGFyZ2V0cyA9IGZsYXR0ZW5BcnJheShpcy5hcnJheShlbGVtZW50cykgPyBlbGVtZW50cy5tYXAodG9BcnJheSkgOiB0b0FycmF5KGVsZW1lbnRzKSk7XG4gICAgZm9yICh2YXIgaSA9IGFuaW1hdGlvbnMubGVuZ3RoLTE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB2YXIgYW5pbWF0aW9uID0gYW5pbWF0aW9uc1tpXTtcbiAgICAgIGZvciAodmFyIHQgPSBhbmltYXRpb24udHdlZW5zLmxlbmd0aC0xOyB0ID49IDA7IHQtLSkge1xuICAgICAgICB2YXIgdHdlZW4gPSBhbmltYXRpb24udHdlZW5zW3RdO1xuICAgICAgICBmb3IgKHZhciBhID0gdHdlZW4uYW5pbWF0YWJsZXMubGVuZ3RoLTE7IGEgPj0gMDsgYS0tKSB7XG4gICAgICAgICAgaWYgKGFycmF5Q29udGFpbnModGFyZ2V0cywgdHdlZW4uYW5pbWF0YWJsZXNbYV0udGFyZ2V0KSkge1xuICAgICAgICAgICAgdHdlZW4uYW5pbWF0YWJsZXMuc3BsaWNlKGEsIDEpO1xuICAgICAgICAgICAgaWYgKCF0d2Vlbi5hbmltYXRhYmxlcy5sZW5ndGgpIGFuaW1hdGlvbi50d2VlbnMuc3BsaWNlKHQsIDEpO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb24udHdlZW5zLmxlbmd0aCkgYW5pbWF0aW9uLnBhdXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIFxuICBhbmltYXRpb24uc3BlZWQgPSAxO1xuICBhbmltYXRpb24ubGlzdCA9IGFuaW1hdGlvbnM7XG4gIGFuaW1hdGlvbi5yZW1vdmUgPSByZW1vdmU7XG4gIGFuaW1hdGlvbi5lYXNpbmdzID0gZWFzaW5ncztcbiAgYW5pbWF0aW9uLmdldFZhbHVlID0gZ2V0SW5pdGlhbFRhcmdldFZhbHVlO1xuICBhbmltYXRpb24ucGF0aCA9IGdldFBhdGhQcm9wcztcbiAgYW5pbWF0aW9uLnJhbmRvbSA9IHJhbmRvbTtcbiAgXG4gIHJldHVybiBhbmltYXRpb247XG4gIFxufSkoKTsiXX0=