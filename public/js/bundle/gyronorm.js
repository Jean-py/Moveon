'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

/**
* JavaScript project for accessing and normalizing the accelerometer and gyroscope data on mobile devices
*
* @author Doruk Eker <doruk@dorukeker.com>
* @copyright Doruk Eker <http://dorukeker.com>
* @version 2.0.6
* @license MIT License | http://opensource.org/licenses/MIT
*/

(function (root, factory) {
  var e = {
    GyroNorm: factory()
  };
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return e;
    });
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    module.exports = e;
  } else {
    root.GyroNorm = e.GyroNorm;
  }
})(undefined, function () {
  /* Constants */
  var GAME = 'game';
  var WORLD = 'world';
  var DEVICE_ORIENTATION = 'deviceorientation';
  var ACCELERATION = 'acceleration';
  var ACCELERATION_INCLUDING_GRAVITY = 'accelerationinludinggravity';
  var ROTATION_RATE = 'rotationrate';

  /*-------------------------------------------------------*/
  /* PRIVATE VARIABLES */

  var _interval = null; // Timer to return values
  var _isCalibrating = false; // Flag if calibrating
  var _calibrationValue = 0; // Alpha offset value
  var _gravityCoefficient = 0; // Coefficient to normalze gravity related values
  var _isRunning = false; // Boolean value if GyroNorm is tracking
  var _isReady = false; // Boolean value if GyroNorm is is initialized

  var _do = null; // Object to store the device orientation values
  var _dm = null; // Object to store the device motion values

  /* OPTIONS */
  var _frequency = 50; // Frequency for the return data in milliseconds
  var _gravityNormalized = true; // Flag if to normalize gravity values
  var _orientationBase = GAME; // Can be GyroNorm.GAME or GyroNorm.WORLD. GyroNorm.GAME returns orientation values with respect to the head direction of the device. GyroNorm.WORLD returns the orientation values with respect to the actual north direction of the world.
  var _decimalCount = 2; // Number of digits after the decimals point for the return values
  var _logger = null; // Function to callback on error. There is no default value. It can only be set by the user on gn.init()
  var _screenAdjusted = false; // If set to true it will return screen adjusted values. (e.g. On a horizontal orientation of a mobile device, the head would be one of the sides, instead of  the actual head of the device.)

  var _values = {
    do: {
      alpha: 0,
      beta: 0,
      gamma: 0,
      absolute: false
    },
    dm: {
      x: 0,
      y: 0,
      z: 0,
      gx: 0,
      gy: 0,
      gz: 0,
      alpha: 0,
      beta: 0,
      gamma: 0

      /*-------------------------------------------------------*/
      /* PUBLIC FUNCTIONS */

      /*
      *
      * Constructor function
      *
      */

    } };var GyroNorm = function GyroNorm(options) {};

  /* Constants */
  GyroNorm.GAME = GAME;
  GyroNorm.WORLD = WORLD;
  GyroNorm.DEVICE_ORIENTATION = DEVICE_ORIENTATION;
  GyroNorm.ACCELERATION = ACCELERATION;
  GyroNorm.ACCELERATION_INCLUDING_GRAVITY = ACCELERATION_INCLUDING_GRAVITY;
  GyroNorm.ROTATION_RATE = ROTATION_RATE;

  /*
  *
  * Initialize GyroNorm instance function
  *
  * @param object options - values are as follows. If set in the init function they overwrite the default option values
  * @param int options.frequency
  * @param boolean options.gravityNormalized
  * @param boolean options.orientationBase
  * @param boolean options.decimalCount
  * @param function options.logger
  * @param function options.screenAdjusted
  *
  */

  GyroNorm.prototype.init = function (options) {
    // Assign options that are passed with the constructor function
    if (options && options.frequency) _frequency = options.frequency;
    if (options && options.gravityNormalized) _gravityNormalized = options.gravityNormalized;
    if (options && options.orientationBase) _orientationBase = options.orientationBase;
    if (options && typeof options.decimalCount === 'number' && options.decimalCount >= 0) _decimalCount = parseInt(options.decimalCount);
    if (options && options.logger) _logger = options.logger;
    if (options && options.screenAdjusted) _screenAdjusted = options.screenAdjusted;

    var deviceOrientationPromise = new FULLTILT.getDeviceOrientation({ 'type': _orientationBase }).then(function (controller) {
      _do = controller;
    });

    var deviceMotionPromise = new FULLTILT.getDeviceMotion().then(function (controller) {
      _dm = controller;
      // Set gravity coefficient
      _gravityCoefficient = _dm.getScreenAdjustedAccelerationIncludingGravity().z > 0 ? -1 : 1;
    });

    return Promise.all([deviceOrientationPromise, deviceMotionPromise]).then(function () {
      _isReady = true;
    });
  };

  /*
  *
  * Stops all the tracking and listening on the window objects
  *
  */
  GyroNorm.prototype.end = function () {
    try {
      _isReady = false;
      this.stop();
      _dm.stop();
      _do.stop();
    } catch (err) {
      log(err);
    }
  };

  /*
  *
  * Starts tracking the values
  *
  * @param function callback - Callback function to read the values
  *
  */
  GyroNorm.prototype.start = function (callback) {
    if (!_isReady) {
      log({ message: 'GyroNorm is not initialized yet. First call the "init()" function.', code: 1 });
      return;
    }

    _interval = setInterval(function () {
      callback(snapShot());
    }, _frequency);
    _isRunning = true;
  };

  /*
  *
  * Stops tracking the values
  *
  */
  GyroNorm.prototype.stop = function () {
    if (_interval) {
      clearInterval(_interval);
      _isRunning = false;
    }
  };

  /*
  *
  * Toggles if to normalize gravity related values
  *
  * @param boolean flag
  *
  */
  GyroNorm.prototype.normalizeGravity = function (flag) {
    _gravityNormalized = flag ? true : false;
  };

  /*
  *
  * Sets the current head direction as alpha = 0
  * Can only be used if device orientation is being tracked, values are not screen adjusted, value type is GyroNorm.EULER and orientation base is GyroNorm.GAME
  *
  * @return: If head direction is set successfully returns true, else false
  *
  */
  GyroNorm.prototype.setHeadDirection = function () {
    if (_screenAdjusted || _orientationBase === WORLD) {
      return false;
    }

    _calibrationValue = _do.getFixedFrameEuler().alpha;
    return true;
  };

  /*
  *
  * Sets the log function
  *
  */
  GyroNorm.prototype.startLogging = function (logger) {
    if (logger) {
      _logger = logger;
    }
  };

  /*
  *
  * Sets the log function to null which stops the logging
  *
  */
  GyroNorm.prototype.stopLogging = function () {
    _logger = null;
  };

  /*
  *
  * Returns if certain type of event is available on the device
  *
  * @param string _eventType - possible values are "deviceorientation" , "devicemotion" , "compassneedscalibration"
  *
  * @return true if event is available false if not
  *
  */
  GyroNorm.prototype.isAvailable = function (_eventType) {

    var doSnapShot = _do.getScreenAdjustedEuler();
    var accSnapShot = _dm.getScreenAdjustedAcceleration();
    var accGraSnapShot = _dm.getScreenAdjustedAccelerationIncludingGravity();
    var rotRateSnapShot = _dm.getScreenAdjustedRotationRate();

    switch (_eventType) {
      case DEVICE_ORIENTATION:
        return doSnapShot.alpha && doSnapShot.alpha !== null && doSnapShot.beta && doSnapShot.beta !== null && doSnapShot.gamma && doSnapShot.gamma !== null;
        break;

      case ACCELERATION:
        return accSnapShot && accSnapShot.x && accSnapShot.y && accSnapShot.z;
        break;

      case ACCELERATION_INCLUDING_GRAVITY:
        return accGraSnapShot && accGraSnapShot.x && accGraSnapShot.y && accGraSnapShot.z;
        break;

      case ROTATION_RATE:
        return rotRateSnapShot && rotRateSnapShot.alpha && rotRateSnapShot.beta && rotRateSnapShot.gamma;
        break;

      default:
        return {
          deviceOrientationAvailable: doSnapShot.alpha && doSnapShot.alpha !== null && doSnapShot.beta && doSnapShot.beta !== null && doSnapShot.gamma && doSnapShot.gamma !== null,
          accelerationAvailable: accSnapShot && accSnapShot.x && accSnapShot.y && accSnapShot.z,
          accelerationIncludingGravityAvailable: accGraSnapShot && accGraSnapShot.x && accGraSnapShot.y && accGraSnapShot.z,
          rotationRateAvailable: rotRateSnapShot && rotRateSnapShot.alpha && rotRateSnapShot.beta && rotRateSnapShot.gamma
        };
        break;
    }
  };

  /*
  *
  * Returns boolean value if the GyroNorm is running
  *
  */
  GyroNorm.prototype.isRunning = function () {
    return _isRunning;
  };

  /*-------------------------------------------------------*/
  /* PRIVATE FUNCTIONS */

  /*
  *
  * Utility function to round with digits after the decimal point
  *
  * @param float number - the original number to round
  *
  */
  function rnd(number) {
    return Math.round(number * Math.pow(10, _decimalCount)) / Math.pow(10, _decimalCount);
  }

  /*
  *
  * Starts calibration
  *
  */
  function calibrate() {
    _isCalibrating = true;
    _calibrationValues = new Array();
  }

  /*
  *
  * Takes a snapshot of the current deviceo orientaion and device motion values
  *
  */
  function snapShot() {
    var doSnapShot = {};

    if (_screenAdjusted) {
      doSnapShot = _do.getScreenAdjustedEuler();
    } else {
      doSnapShot = _do.getFixedFrameEuler();
    }

    var accSnapShot = _dm.getScreenAdjustedAcceleration();
    var accGraSnapShot = _dm.getScreenAdjustedAccelerationIncludingGravity();
    var rotRateSnapShot = _dm.getScreenAdjustedRotationRate();

    var alphaToSend = 0;

    if (_orientationBase === GAME) {
      alphaToSend = doSnapShot.alpha - _calibrationValue;
      alphaToSend = alphaToSend < 0 ? 360 - Math.abs(alphaToSend) : alphaToSend;
    } else {
      alphaToSend = doSnapShot.alpha;
    }

    var snapShot = {
      do: {
        alpha: rnd(alphaToSend),
        beta: rnd(doSnapShot.beta),
        gamma: rnd(doSnapShot.gamma),
        absolute: _do.isAbsolute()
      },
      dm: {
        x: rnd(accSnapShot.x),
        y: rnd(accSnapShot.y),
        z: rnd(accSnapShot.z),
        gx: rnd(accGraSnapShot.x),
        gy: rnd(accGraSnapShot.y),
        gz: rnd(accGraSnapShot.z),
        alpha: rnd(rotRateSnapShot.alpha),
        beta: rnd(rotRateSnapShot.beta),
        gamma: rnd(rotRateSnapShot.gamma)
      }
    };

    // Normalize gravity
    if (_gravityNormalized) {
      snapShot.dm.gx *= _gravityCoefficient;
      snapShot.dm.gy *= _gravityCoefficient;
      snapShot.dm.gz *= _gravityCoefficient;
    }

    return snapShot;
  }

  /*
  *
  * Starts listening to orientation event on the window object
  *
  */
  function log(err) {
    if (_logger) {
      if (typeof err == 'string') {
        err = { message: err, code: 0 };
      }
      _logger(err);
    }
  }

  return GyroNorm;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImd5cm9ub3JtLmpzIl0sIm5hbWVzIjpbInJvb3QiLCJmYWN0b3J5IiwiZSIsIkd5cm9Ob3JtIiwiZGVmaW5lIiwiYW1kIiwibW9kdWxlIiwiZXhwb3J0cyIsIkdBTUUiLCJXT1JMRCIsIkRFVklDRV9PUklFTlRBVElPTiIsIkFDQ0VMRVJBVElPTiIsIkFDQ0VMRVJBVElPTl9JTkNMVURJTkdfR1JBVklUWSIsIlJPVEFUSU9OX1JBVEUiLCJfaW50ZXJ2YWwiLCJfaXNDYWxpYnJhdGluZyIsIl9jYWxpYnJhdGlvblZhbHVlIiwiX2dyYXZpdHlDb2VmZmljaWVudCIsIl9pc1J1bm5pbmciLCJfaXNSZWFkeSIsIl9kbyIsIl9kbSIsIl9mcmVxdWVuY3kiLCJfZ3Jhdml0eU5vcm1hbGl6ZWQiLCJfb3JpZW50YXRpb25CYXNlIiwiX2RlY2ltYWxDb3VudCIsIl9sb2dnZXIiLCJfc2NyZWVuQWRqdXN0ZWQiLCJfdmFsdWVzIiwiZG8iLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsImFic29sdXRlIiwiZG0iLCJ4IiwieSIsInoiLCJneCIsImd5IiwiZ3oiLCJvcHRpb25zIiwicHJvdG90eXBlIiwiaW5pdCIsImZyZXF1ZW5jeSIsImdyYXZpdHlOb3JtYWxpemVkIiwib3JpZW50YXRpb25CYXNlIiwiZGVjaW1hbENvdW50IiwicGFyc2VJbnQiLCJsb2dnZXIiLCJzY3JlZW5BZGp1c3RlZCIsImRldmljZU9yaWVudGF0aW9uUHJvbWlzZSIsIkZVTExUSUxUIiwiZ2V0RGV2aWNlT3JpZW50YXRpb24iLCJ0aGVuIiwiY29udHJvbGxlciIsImRldmljZU1vdGlvblByb21pc2UiLCJnZXREZXZpY2VNb3Rpb24iLCJnZXRTY3JlZW5BZGp1c3RlZEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJQcm9taXNlIiwiYWxsIiwiZW5kIiwic3RvcCIsImVyciIsImxvZyIsInN0YXJ0IiwiY2FsbGJhY2siLCJtZXNzYWdlIiwiY29kZSIsInNldEludGVydmFsIiwic25hcFNob3QiLCJjbGVhckludGVydmFsIiwibm9ybWFsaXplR3Jhdml0eSIsImZsYWciLCJzZXRIZWFkRGlyZWN0aW9uIiwiZ2V0Rml4ZWRGcmFtZUV1bGVyIiwic3RhcnRMb2dnaW5nIiwic3RvcExvZ2dpbmciLCJpc0F2YWlsYWJsZSIsIl9ldmVudFR5cGUiLCJkb1NuYXBTaG90IiwiZ2V0U2NyZWVuQWRqdXN0ZWRFdWxlciIsImFjY1NuYXBTaG90IiwiZ2V0U2NyZWVuQWRqdXN0ZWRBY2NlbGVyYXRpb24iLCJhY2NHcmFTbmFwU2hvdCIsInJvdFJhdGVTbmFwU2hvdCIsImdldFNjcmVlbkFkanVzdGVkUm90YXRpb25SYXRlIiwiZGV2aWNlT3JpZW50YXRpb25BdmFpbGFibGUiLCJhY2NlbGVyYXRpb25BdmFpbGFibGUiLCJhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5QXZhaWxhYmxlIiwicm90YXRpb25SYXRlQXZhaWxhYmxlIiwiaXNSdW5uaW5nIiwicm5kIiwibnVtYmVyIiwiTWF0aCIsInJvdW5kIiwicG93IiwiY2FsaWJyYXRlIiwiX2NhbGlicmF0aW9uVmFsdWVzIiwiQXJyYXkiLCJhbHBoYVRvU2VuZCIsImFicyIsImlzQWJzb2x1dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7O0FBU0MsV0FBQSxBQUFTLE1BQVQsQUFBZSxTQUFTLEFBQ3ZCO01BQUk7Y0FBSixBQUFRLEFBQ0ksQUFFWjtBQUhRLEFBQ047TUFFRSxPQUFBLEFBQU8sV0FBUCxBQUFrQixjQUFjLE9BQXBDLEFBQTJDLEtBQUssQUFDOUM7V0FBTyxZQUFXLEFBQ2hCO2FBQUEsQUFBTyxBQUNSO0FBRkQsQUFHRDtBQUpELGFBSVcsUUFBQSxBQUFPLCtDQUFQLEFBQU8sYUFBUCxBQUFrQixZQUFZLE9BQWxDLEFBQXlDLFNBQVMsQUFDdkQ7V0FBQSxBQUFPLFVBQVAsQUFBaUIsQUFDbEI7QUFGTSxHQUFBLE1BRUEsQUFDTDtTQUFBLEFBQUssV0FBVyxFQUFoQixBQUFrQixBQUNuQjtBQUNGO0FBYkEsY0FhTztBQUVO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QU8sQUFDUjtBQUdEOztBQUtBOzs7OztXQUFBLEFBQVMsSUFBVCxBQUFhLEtBQUssQUFDaEI7UUFBQSxBQUFJLFNBQVMsQUFDWDtVQUFJLE9BQUEsQUFBTyxPQUFYLEFBQW1CLFVBQVUsQUFDM0I7Y0FBTSxFQUFFLFNBQUYsQUFBVyxLQUFLLE1BQXRCLEFBQU0sQUFBc0IsQUFDN0I7QUFDRDtjQUFBLEFBQVEsQUFDVDtBQUNGO0FBRUQ7O1NBQUEsQUFBTyxBQUNSO0FBOVdELEFBQUMiLCJmaWxlIjoiZ3lyb25vcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiogSmF2YVNjcmlwdCBwcm9qZWN0IGZvciBhY2Nlc3NpbmcgYW5kIG5vcm1hbGl6aW5nIHRoZSBhY2NlbGVyb21ldGVyIGFuZCBneXJvc2NvcGUgZGF0YSBvbiBtb2JpbGUgZGV2aWNlc1xuKlxuKiBAYXV0aG9yIERvcnVrIEVrZXIgPGRvcnVrQGRvcnVrZWtlci5jb20+XG4qIEBjb3B5cmlnaHQgRG9ydWsgRWtlciA8aHR0cDovL2RvcnVrZWtlci5jb20+XG4qIEB2ZXJzaW9uIDIuMC42XG4qIEBsaWNlbnNlIE1JVCBMaWNlbnNlIHwgaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuKi9cblxuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgdmFyIGUgPSB7XG4gICAgR3lyb05vcm06IGZhY3RvcnkoKSxcbiAgfTtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBlO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBlO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuR3lyb05vcm0gPSBlLkd5cm9Ob3JtO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAvKiBDb25zdGFudHMgKi9cbiAgdmFyIEdBTUUgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSAnZ2FtZSc7XG4gIHZhciBXT1JMRCAgICAgICAgICAgICAgICAgICAgICAgICAgID0gJ3dvcmxkJztcbiAgdmFyIERFVklDRV9PUklFTlRBVElPTiAgICAgICAgICAgICAgPSAnZGV2aWNlb3JpZW50YXRpb24nO1xuICB2YXIgQUNDRUxFUkFUSU9OICAgICAgICAgICAgICAgICAgICA9ICdhY2NlbGVyYXRpb24nO1xuICB2YXIgQUNDRUxFUkFUSU9OX0lOQ0xVRElOR19HUkFWSVRZICA9ICdhY2NlbGVyYXRpb25pbmx1ZGluZ2dyYXZpdHknO1xuICB2YXIgUk9UQVRJT05fUkFURSAgICAgICAgICAgICAgICAgICA9ICdyb3RhdGlvbnJhdGUnO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4gIC8qIFBSSVZBVEUgVkFSSUFCTEVTICovXG5cbiAgdmFyIF9pbnRlcnZhbCAgICAgICAgICAgPSBudWxsOyAgICAgICAvLyBUaW1lciB0byByZXR1cm4gdmFsdWVzXG4gIHZhciBfaXNDYWxpYnJhdGluZyAgICAgID0gZmFsc2U7ICAgICAgLy8gRmxhZyBpZiBjYWxpYnJhdGluZ1xuICB2YXIgX2NhbGlicmF0aW9uVmFsdWUgICA9IDA7ICAgICAgICAgIC8vIEFscGhhIG9mZnNldCB2YWx1ZVxuICB2YXIgX2dyYXZpdHlDb2VmZmljaWVudCA9IDA7ICAgICAgICAgIC8vIENvZWZmaWNpZW50IHRvIG5vcm1hbHplIGdyYXZpdHkgcmVsYXRlZCB2YWx1ZXNcbiAgdmFyIF9pc1J1bm5pbmcgICAgICAgICAgPSBmYWxzZTsgICAgICAvLyBCb29sZWFuIHZhbHVlIGlmIEd5cm9Ob3JtIGlzIHRyYWNraW5nXG4gIHZhciBfaXNSZWFkeSAgICAgICAgICAgID0gZmFsc2U7ICAgICAgLy8gQm9vbGVhbiB2YWx1ZSBpZiBHeXJvTm9ybSBpcyBpcyBpbml0aWFsaXplZFxuXG4gIHZhciBfZG8gICAgICAgICAgICAgICAgID0gbnVsbDsgICAgICAgLy8gT2JqZWN0IHRvIHN0b3JlIHRoZSBkZXZpY2Ugb3JpZW50YXRpb24gdmFsdWVzXG4gIHZhciBfZG0gICAgICAgICAgICAgICAgID0gbnVsbDsgICAgICAgLy8gT2JqZWN0IHRvIHN0b3JlIHRoZSBkZXZpY2UgbW90aW9uIHZhbHVlc1xuXG4gIC8qIE9QVElPTlMgKi9cbiAgdmFyIF9mcmVxdWVuY3kgICAgICAgICAgPSA1MDsgICAgICAgICAvLyBGcmVxdWVuY3kgZm9yIHRoZSByZXR1cm4gZGF0YSBpbiBtaWxsaXNlY29uZHNcbiAgdmFyIF9ncmF2aXR5Tm9ybWFsaXplZCAgPSB0cnVlOyAgICAgICAvLyBGbGFnIGlmIHRvIG5vcm1hbGl6ZSBncmF2aXR5IHZhbHVlc1xuICB2YXIgX29yaWVudGF0aW9uQmFzZSAgICA9IEdBTUU7ICAgICAgIC8vIENhbiBiZSBHeXJvTm9ybS5HQU1FIG9yIEd5cm9Ob3JtLldPUkxELiBHeXJvTm9ybS5HQU1FIHJldHVybnMgb3JpZW50YXRpb24gdmFsdWVzIHdpdGggcmVzcGVjdCB0byB0aGUgaGVhZCBkaXJlY3Rpb24gb2YgdGhlIGRldmljZS4gR3lyb05vcm0uV09STEQgcmV0dXJucyB0aGUgb3JpZW50YXRpb24gdmFsdWVzIHdpdGggcmVzcGVjdCB0byB0aGUgYWN0dWFsIG5vcnRoIGRpcmVjdGlvbiBvZiB0aGUgd29ybGQuXG4gIHZhciBfZGVjaW1hbENvdW50ICAgICAgID0gMjsgICAgICAgICAgLy8gTnVtYmVyIG9mIGRpZ2l0cyBhZnRlciB0aGUgZGVjaW1hbHMgcG9pbnQgZm9yIHRoZSByZXR1cm4gdmFsdWVzXG4gIHZhciBfbG9nZ2VyICAgICAgICAgICAgID0gbnVsbDsgICAgICAgLy8gRnVuY3Rpb24gdG8gY2FsbGJhY2sgb24gZXJyb3IuIFRoZXJlIGlzIG5vIGRlZmF1bHQgdmFsdWUuIEl0IGNhbiBvbmx5IGJlIHNldCBieSB0aGUgdXNlciBvbiBnbi5pbml0KClcbiAgdmFyIF9zY3JlZW5BZGp1c3RlZCAgICAgPSBmYWxzZTsgICAgICAvLyBJZiBzZXQgdG8gdHJ1ZSBpdCB3aWxsIHJldHVybiBzY3JlZW4gYWRqdXN0ZWQgdmFsdWVzLiAoZS5nLiBPbiBhIGhvcml6b250YWwgb3JpZW50YXRpb24gb2YgYSBtb2JpbGUgZGV2aWNlLCB0aGUgaGVhZCB3b3VsZCBiZSBvbmUgb2YgdGhlIHNpZGVzLCBpbnN0ZWFkIG9mICB0aGUgYWN0dWFsIGhlYWQgb2YgdGhlIGRldmljZS4pXG5cbiAgdmFyIF92YWx1ZXMgPSB7XG4gICAgZG86IHtcbiAgICAgIGFscGhhOiAwLFxuICAgICAgYmV0YTogMCxcbiAgICAgIGdhbW1hOiAwLFxuICAgICAgYWJzb2x1dGU6IGZhbHNlXG4gICAgfSxcbiAgICBkbToge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICB6OiAwLFxuICAgICAgZ3g6IDAsXG4gICAgICBneTogMCxcbiAgICAgIGd6OiAwLFxuICAgICAgYWxwaGE6IDAsXG4gICAgICBiZXRhOiAwLFxuICAgICAgZ2FtbWE6IDBcbiAgICB9XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAvKiBQVUJMSUMgRlVOQ1RJT05TICovXG5cbiAgLypcbiAgKlxuICAqIENvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gICpcbiAgKi9cblxuICB2YXIgR3lyb05vcm0gPSBmdW5jdGlvbihvcHRpb25zKSB7fVxuXG4gIC8qIENvbnN0YW50cyAqL1xuICBHeXJvTm9ybS5HQU1FICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IEdBTUU7XG4gIEd5cm9Ob3JtLldPUkxEICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gV09STEQ7XG4gIEd5cm9Ob3JtLkRFVklDRV9PUklFTlRBVElPTiAgICAgICAgICAgICAgID0gREVWSUNFX09SSUVOVEFUSU9OO1xuICBHeXJvTm9ybS5BQ0NFTEVSQVRJT04gICAgICAgICAgICAgICAgICAgICA9IEFDQ0VMRVJBVElPTjtcbiAgR3lyb05vcm0uQUNDRUxFUkFUSU9OX0lOQ0xVRElOR19HUkFWSVRZICAgPSBBQ0NFTEVSQVRJT05fSU5DTFVESU5HX0dSQVZJVFk7XG4gIEd5cm9Ob3JtLlJPVEFUSU9OX1JBVEUgICAgICAgICAgICAgICAgICAgID0gUk9UQVRJT05fUkFURTtcblxuICAvKlxuICAqXG4gICogSW5pdGlhbGl6ZSBHeXJvTm9ybSBpbnN0YW5jZSBmdW5jdGlvblxuICAqXG4gICogQHBhcmFtIG9iamVjdCBvcHRpb25zIC0gdmFsdWVzIGFyZSBhcyBmb2xsb3dzLiBJZiBzZXQgaW4gdGhlIGluaXQgZnVuY3Rpb24gdGhleSBvdmVyd3JpdGUgdGhlIGRlZmF1bHQgb3B0aW9uIHZhbHVlc1xuICAqIEBwYXJhbSBpbnQgb3B0aW9ucy5mcmVxdWVuY3lcbiAgKiBAcGFyYW0gYm9vbGVhbiBvcHRpb25zLmdyYXZpdHlOb3JtYWxpemVkXG4gICogQHBhcmFtIGJvb2xlYW4gb3B0aW9ucy5vcmllbnRhdGlvbkJhc2VcbiAgKiBAcGFyYW0gYm9vbGVhbiBvcHRpb25zLmRlY2ltYWxDb3VudFxuICAqIEBwYXJhbSBmdW5jdGlvbiBvcHRpb25zLmxvZ2dlclxuICAqIEBwYXJhbSBmdW5jdGlvbiBvcHRpb25zLnNjcmVlbkFkanVzdGVkXG4gICpcbiAgKi9cblxuICBHeXJvTm9ybS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAvLyBBc3NpZ24gb3B0aW9ucyB0aGF0IGFyZSBwYXNzZWQgd2l0aCB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb25cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmZyZXF1ZW5jeSkgX2ZyZXF1ZW5jeSA9IG9wdGlvbnMuZnJlcXVlbmN5O1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ3Jhdml0eU5vcm1hbGl6ZWQpIF9ncmF2aXR5Tm9ybWFsaXplZCA9IG9wdGlvbnMuZ3Jhdml0eU5vcm1hbGl6ZWQ7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5vcmllbnRhdGlvbkJhc2UpIF9vcmllbnRhdGlvbkJhc2UgPSBvcHRpb25zLm9yaWVudGF0aW9uQmFzZTtcbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5kZWNpbWFsQ291bnQgPT09ICdudW1iZXInICYmIG9wdGlvbnMuZGVjaW1hbENvdW50ID49IDApIF9kZWNpbWFsQ291bnQgPSBwYXJzZUludChvcHRpb25zLmRlY2ltYWxDb3VudCk7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sb2dnZXIpIF9sb2dnZXIgPSBvcHRpb25zLmxvZ2dlcjtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnNjcmVlbkFkanVzdGVkKSBfc2NyZWVuQWRqdXN0ZWQgPSBvcHRpb25zLnNjcmVlbkFkanVzdGVkO1xuXG4gICAgdmFyIGRldmljZU9yaWVudGF0aW9uUHJvbWlzZSA9IG5ldyBGVUxMVElMVC5nZXREZXZpY2VPcmllbnRhdGlvbih7ICd0eXBlJzogX29yaWVudGF0aW9uQmFzZSB9KS50aGVuKGZ1bmN0aW9uKGNvbnRyb2xsZXIpIHtcbiAgICAgIF9kbyA9IGNvbnRyb2xsZXI7XG4gICAgfSk7XG5cbiAgICB2YXIgZGV2aWNlTW90aW9uUHJvbWlzZSA9IG5ldyBGVUxMVElMVC5nZXREZXZpY2VNb3Rpb24oKS50aGVuKGZ1bmN0aW9uKGNvbnRyb2xsZXIpIHtcbiAgICAgIF9kbSA9IGNvbnRyb2xsZXI7XG4gICAgICAvLyBTZXQgZ3Jhdml0eSBjb2VmZmljaWVudFxuICAgICAgX2dyYXZpdHlDb2VmZmljaWVudCA9IChfZG0uZ2V0U2NyZWVuQWRqdXN0ZWRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KCkueiA+IDApID8gLTEgOiAxO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtkZXZpY2VPcmllbnRhdGlvblByb21pc2UsIGRldmljZU1vdGlvblByb21pc2VdKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgX2lzUmVhZHkgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgLypcbiAgKlxuICAqIFN0b3BzIGFsbCB0aGUgdHJhY2tpbmcgYW5kIGxpc3RlbmluZyBvbiB0aGUgd2luZG93IG9iamVjdHNcbiAgKlxuICAqL1xuICBHeXJvTm9ybS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIF9pc1JlYWR5ID0gZmFsc2U7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIF9kbS5zdG9wKCk7XG4gICAgICBfZG8uc3RvcCgpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgIGxvZyhlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICpcbiAgKiBTdGFydHMgdHJhY2tpbmcgdGhlIHZhbHVlc1xuICAqXG4gICogQHBhcmFtIGZ1bmN0aW9uIGNhbGxiYWNrIC0gQ2FsbGJhY2sgZnVuY3Rpb24gdG8gcmVhZCB0aGUgdmFsdWVzXG4gICpcbiAgKi9cbiAgR3lyb05vcm0ucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZiAoIV9pc1JlYWR5KSB7XG4gICAgICBsb2coeyBtZXNzYWdlOiAnR3lyb05vcm0gaXMgbm90IGluaXRpYWxpemVkIHlldC4gRmlyc3QgY2FsbCB0aGUgXCJpbml0KClcIiBmdW5jdGlvbi4nLCBjb2RlOiAxIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF9pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuICAgICAgY2FsbGJhY2soc25hcFNob3QoKSk7XG4gICAgfSwgX2ZyZXF1ZW5jeSk7XG4gICAgX2lzUnVubmluZyA9IHRydWU7XG4gIH1cblxuICAvKlxuICAqXG4gICogU3RvcHMgdHJhY2tpbmcgdGhlIHZhbHVlc1xuICAqXG4gICovXG4gIEd5cm9Ob3JtLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKF9pbnRlcnZhbCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChfaW50ZXJ2YWwpO1xuICAgICAgX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICpcbiAgKiBUb2dnbGVzIGlmIHRvIG5vcm1hbGl6ZSBncmF2aXR5IHJlbGF0ZWQgdmFsdWVzXG4gICpcbiAgKiBAcGFyYW0gYm9vbGVhbiBmbGFnXG4gICpcbiAgKi9cbiAgR3lyb05vcm0ucHJvdG90eXBlLm5vcm1hbGl6ZUdyYXZpdHkgPSBmdW5jdGlvbihmbGFnKSB7XG4gICAgX2dyYXZpdHlOb3JtYWxpemVkID0gKGZsYWcpID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG5cblxuICAvKlxuICAqXG4gICogU2V0cyB0aGUgY3VycmVudCBoZWFkIGRpcmVjdGlvbiBhcyBhbHBoYSA9IDBcbiAgKiBDYW4gb25seSBiZSB1c2VkIGlmIGRldmljZSBvcmllbnRhdGlvbiBpcyBiZWluZyB0cmFja2VkLCB2YWx1ZXMgYXJlIG5vdCBzY3JlZW4gYWRqdXN0ZWQsIHZhbHVlIHR5cGUgaXMgR3lyb05vcm0uRVVMRVIgYW5kIG9yaWVudGF0aW9uIGJhc2UgaXMgR3lyb05vcm0uR0FNRVxuICAqXG4gICogQHJldHVybjogSWYgaGVhZCBkaXJlY3Rpb24gaXMgc2V0IHN1Y2Nlc3NmdWxseSByZXR1cm5zIHRydWUsIGVsc2UgZmFsc2VcbiAgKlxuICAqL1xuICBHeXJvTm9ybS5wcm90b3R5cGUuc2V0SGVhZERpcmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChfc2NyZWVuQWRqdXN0ZWQgfHwgX29yaWVudGF0aW9uQmFzZSA9PT0gV09STEQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBfY2FsaWJyYXRpb25WYWx1ZSA9IF9kby5nZXRGaXhlZEZyYW1lRXVsZXIoKS5hbHBoYTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qXG4gICpcbiAgKiBTZXRzIHRoZSBsb2cgZnVuY3Rpb25cbiAgKlxuICAqL1xuICBHeXJvTm9ybS5wcm90b3R5cGUuc3RhcnRMb2dnaW5nID0gZnVuY3Rpb24obG9nZ2VyKSB7XG4gICAgaWYgKGxvZ2dlcikge1xuICAgICAgX2xvZ2dlciA9IGxvZ2dlcjtcbiAgICB9XG4gIH1cblxuICAvKlxuICAqXG4gICogU2V0cyB0aGUgbG9nIGZ1bmN0aW9uIHRvIG51bGwgd2hpY2ggc3RvcHMgdGhlIGxvZ2dpbmdcbiAgKlxuICAqL1xuICBHeXJvTm9ybS5wcm90b3R5cGUuc3RvcExvZ2dpbmcgPSBmdW5jdGlvbigpIHtcbiAgICBfbG9nZ2VyID0gbnVsbDtcbiAgfVxuXG4gIC8qXG4gICpcbiAgKiBSZXR1cm5zIGlmIGNlcnRhaW4gdHlwZSBvZiBldmVudCBpcyBhdmFpbGFibGUgb24gdGhlIGRldmljZVxuICAqXG4gICogQHBhcmFtIHN0cmluZyBfZXZlbnRUeXBlIC0gcG9zc2libGUgdmFsdWVzIGFyZSBcImRldmljZW9yaWVudGF0aW9uXCIgLCBcImRldmljZW1vdGlvblwiICwgXCJjb21wYXNzbmVlZHNjYWxpYnJhdGlvblwiXG4gICpcbiAgKiBAcmV0dXJuIHRydWUgaWYgZXZlbnQgaXMgYXZhaWxhYmxlIGZhbHNlIGlmIG5vdFxuICAqXG4gICovXG4gIEd5cm9Ob3JtLnByb3RvdHlwZS5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uKF9ldmVudFR5cGUpIHtcblxuICAgIHZhciBkb1NuYXBTaG90ID0gX2RvLmdldFNjcmVlbkFkanVzdGVkRXVsZXIoKTtcbiAgICB2YXIgYWNjU25hcFNob3QgPSBfZG0uZ2V0U2NyZWVuQWRqdXN0ZWRBY2NlbGVyYXRpb24oKTtcbiAgICB2YXIgYWNjR3JhU25hcFNob3QgPSBfZG0uZ2V0U2NyZWVuQWRqdXN0ZWRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KCk7XG4gICAgdmFyIHJvdFJhdGVTbmFwU2hvdCA9IF9kbS5nZXRTY3JlZW5BZGp1c3RlZFJvdGF0aW9uUmF0ZSgpO1xuXG4gICAgc3dpdGNoIChfZXZlbnRUeXBlKSB7XG4gICAgICBjYXNlIERFVklDRV9PUklFTlRBVElPTjpcbiAgICAgICAgcmV0dXJuICgoZG9TbmFwU2hvdC5hbHBoYSAmJiBkb1NuYXBTaG90LmFscGhhICE9PSBudWxsKSAmJiAoZG9TbmFwU2hvdC5iZXRhICYmIGRvU25hcFNob3QuYmV0YSAhPT0gbnVsbCkgJiYgKGRvU25hcFNob3QuZ2FtbWEgJiYgZG9TbmFwU2hvdC5nYW1tYSAhPT0gbnVsbCkpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBQ0NFTEVSQVRJT046XG4gICAgICAgIHJldHVybiAoYWNjU25hcFNob3QgJiYgYWNjU25hcFNob3QueCAmJiBhY2NTbmFwU2hvdC55ICYmIGFjY1NuYXBTaG90LnopO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBBQ0NFTEVSQVRJT05fSU5DTFVESU5HX0dSQVZJVFk6XG4gICAgICAgIHJldHVybiAoYWNjR3JhU25hcFNob3QgJiYgYWNjR3JhU25hcFNob3QueCAmJiBhY2NHcmFTbmFwU2hvdC55ICYmIGFjY0dyYVNuYXBTaG90LnopO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBST1RBVElPTl9SQVRFOlxuICAgICAgICByZXR1cm4gKHJvdFJhdGVTbmFwU2hvdCAmJiByb3RSYXRlU25hcFNob3QuYWxwaGEgJiYgcm90UmF0ZVNuYXBTaG90LmJldGEgJiYgcm90UmF0ZVNuYXBTaG90LmdhbW1hKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGV2aWNlT3JpZW50YXRpb25BdmFpbGFibGU6ICgoZG9TbmFwU2hvdC5hbHBoYSAmJiBkb1NuYXBTaG90LmFscGhhICE9PSBudWxsKSAmJiAoZG9TbmFwU2hvdC5iZXRhICYmIGRvU25hcFNob3QuYmV0YSAhPT0gbnVsbCkgJiYgKGRvU25hcFNob3QuZ2FtbWEgJiYgZG9TbmFwU2hvdC5nYW1tYSAhPT0gbnVsbCkpLFxuICAgICAgICAgIGFjY2VsZXJhdGlvbkF2YWlsYWJsZTogKGFjY1NuYXBTaG90ICYmIGFjY1NuYXBTaG90LnggJiYgYWNjU25hcFNob3QueSAmJiBhY2NTbmFwU2hvdC56KSxcbiAgICAgICAgICBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5QXZhaWxhYmxlOiAoYWNjR3JhU25hcFNob3QgJiYgYWNjR3JhU25hcFNob3QueCAmJiBhY2NHcmFTbmFwU2hvdC55ICYmIGFjY0dyYVNuYXBTaG90LnopLFxuICAgICAgICAgIHJvdGF0aW9uUmF0ZUF2YWlsYWJsZTogKHJvdFJhdGVTbmFwU2hvdCAmJiByb3RSYXRlU25hcFNob3QuYWxwaGEgJiYgcm90UmF0ZVNuYXBTaG90LmJldGEgJiYgcm90UmF0ZVNuYXBTaG90LmdhbW1hKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICpcbiAgKiBSZXR1cm5zIGJvb2xlYW4gdmFsdWUgaWYgdGhlIEd5cm9Ob3JtIGlzIHJ1bm5pbmdcbiAgKlxuICAqL1xuICBHeXJvTm9ybS5wcm90b3R5cGUuaXNSdW5uaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9pc1J1bm5pbmc7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAvKiBQUklWQVRFIEZVTkNUSU9OUyAqL1xuXG4gIC8qXG4gICpcbiAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIHJvdW5kIHdpdGggZGlnaXRzIGFmdGVyIHRoZSBkZWNpbWFsIHBvaW50XG4gICpcbiAgKiBAcGFyYW0gZmxvYXQgbnVtYmVyIC0gdGhlIG9yaWdpbmFsIG51bWJlciB0byByb3VuZFxuICAqXG4gICovXG4gIGZ1bmN0aW9uIHJuZChudW1iZXIpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChudW1iZXIgKiBNYXRoLnBvdygxMCwgX2RlY2ltYWxDb3VudCkpIC8gTWF0aC5wb3coMTAsIF9kZWNpbWFsQ291bnQpO1xuICB9XG5cbiAgLypcbiAgKlxuICAqIFN0YXJ0cyBjYWxpYnJhdGlvblxuICAqXG4gICovXG4gIGZ1bmN0aW9uIGNhbGlicmF0ZSgpIHtcbiAgICBfaXNDYWxpYnJhdGluZyA9IHRydWU7XG4gICAgX2NhbGlicmF0aW9uVmFsdWVzID0gbmV3IEFycmF5KCk7XG4gIH1cblxuICAvKlxuICAqXG4gICogVGFrZXMgYSBzbmFwc2hvdCBvZiB0aGUgY3VycmVudCBkZXZpY2VvIG9yaWVudGFpb24gYW5kIGRldmljZSBtb3Rpb24gdmFsdWVzXG4gICpcbiAgKi9cbiAgZnVuY3Rpb24gc25hcFNob3QoKSB7XG4gICAgdmFyIGRvU25hcFNob3QgPSB7fTtcblxuICAgIGlmIChfc2NyZWVuQWRqdXN0ZWQpIHtcbiAgICAgIGRvU25hcFNob3QgPSBfZG8uZ2V0U2NyZWVuQWRqdXN0ZWRFdWxlcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb1NuYXBTaG90ID0gX2RvLmdldEZpeGVkRnJhbWVFdWxlcigpO1xuICAgIH1cblxuICAgIHZhciBhY2NTbmFwU2hvdCA9IF9kbS5nZXRTY3JlZW5BZGp1c3RlZEFjY2VsZXJhdGlvbigpO1xuICAgIHZhciBhY2NHcmFTbmFwU2hvdCA9IF9kbS5nZXRTY3JlZW5BZGp1c3RlZEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkoKTtcbiAgICB2YXIgcm90UmF0ZVNuYXBTaG90ID0gX2RtLmdldFNjcmVlbkFkanVzdGVkUm90YXRpb25SYXRlKCk7XG5cbiAgICB2YXIgYWxwaGFUb1NlbmQgPSAwO1xuXG4gICAgaWYgKF9vcmllbnRhdGlvbkJhc2UgPT09IEdBTUUpIHtcbiAgICAgIGFscGhhVG9TZW5kID0gZG9TbmFwU2hvdC5hbHBoYSAtIF9jYWxpYnJhdGlvblZhbHVlO1xuICAgICAgYWxwaGFUb1NlbmQgPSAoYWxwaGFUb1NlbmQgPCAwKSA/ICgzNjAgLSBNYXRoLmFicyhhbHBoYVRvU2VuZCkpIDogYWxwaGFUb1NlbmQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFscGhhVG9TZW5kID0gZG9TbmFwU2hvdC5hbHBoYTtcbiAgICB9XG5cbiAgICB2YXIgc25hcFNob3QgPSB7XG4gICAgICBkbzoge1xuICAgICAgICBhbHBoYTogcm5kKGFscGhhVG9TZW5kKSxcbiAgICAgICAgYmV0YTogcm5kKGRvU25hcFNob3QuYmV0YSksXG4gICAgICAgIGdhbW1hOiBybmQoZG9TbmFwU2hvdC5nYW1tYSksXG4gICAgICAgIGFic29sdXRlOiBfZG8uaXNBYnNvbHV0ZSgpXG4gICAgICB9LFxuICAgICAgZG06IHtcbiAgICAgICAgeDogcm5kKGFjY1NuYXBTaG90LngpLFxuICAgICAgICB5OiBybmQoYWNjU25hcFNob3QueSksXG4gICAgICAgIHo6IHJuZChhY2NTbmFwU2hvdC56KSxcbiAgICAgICAgZ3g6IHJuZChhY2NHcmFTbmFwU2hvdC54KSxcbiAgICAgICAgZ3k6IHJuZChhY2NHcmFTbmFwU2hvdC55KSxcbiAgICAgICAgZ3o6IHJuZChhY2NHcmFTbmFwU2hvdC56KSxcbiAgICAgICAgYWxwaGE6IHJuZChyb3RSYXRlU25hcFNob3QuYWxwaGEpLFxuICAgICAgICBiZXRhOiBybmQocm90UmF0ZVNuYXBTaG90LmJldGEpLFxuICAgICAgICBnYW1tYTogcm5kKHJvdFJhdGVTbmFwU2hvdC5nYW1tYSlcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gTm9ybWFsaXplIGdyYXZpdHlcbiAgICBpZiAoX2dyYXZpdHlOb3JtYWxpemVkKSB7XG4gICAgICBzbmFwU2hvdC5kbS5neCAqPSBfZ3Jhdml0eUNvZWZmaWNpZW50O1xuICAgICAgc25hcFNob3QuZG0uZ3kgKj0gX2dyYXZpdHlDb2VmZmljaWVudDtcbiAgICAgIHNuYXBTaG90LmRtLmd6ICo9IF9ncmF2aXR5Q29lZmZpY2llbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNuYXBTaG90O1xuICB9XG5cblxuICAvKlxuICAqXG4gICogU3RhcnRzIGxpc3RlbmluZyB0byBvcmllbnRhdGlvbiBldmVudCBvbiB0aGUgd2luZG93IG9iamVjdFxuICAqXG4gICovXG4gIGZ1bmN0aW9uIGxvZyhlcnIpIHtcbiAgICBpZiAoX2xvZ2dlcikge1xuICAgICAgaWYgKHR5cGVvZihlcnIpID09ICdzdHJpbmcnKSB7XG4gICAgICAgIGVyciA9IHsgbWVzc2FnZTogZXJyLCBjb2RlOiAwIH1cbiAgICAgIH1cbiAgICAgIF9sb2dnZXIoZXJyKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gR3lyb05vcm07XG59KSk7XG4iXX0=