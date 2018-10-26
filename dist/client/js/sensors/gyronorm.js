'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
    }

    /*-------------------------------------------------------*/
    /* PUBLIC FUNCTIONS */

    /*
    *
    * Constructor function
    *
    */

  };var GyroNorm = function GyroNorm(options) {};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImd5cm9ub3JtLmpzIl0sIm5hbWVzIjpbInJvb3QiLCJmYWN0b3J5IiwiZSIsIkd5cm9Ob3JtIiwiZGVmaW5lIiwiYW1kIiwibW9kdWxlIiwiZXhwb3J0cyIsIkdBTUUiLCJXT1JMRCIsIkRFVklDRV9PUklFTlRBVElPTiIsIkFDQ0VMRVJBVElPTiIsIkFDQ0VMRVJBVElPTl9JTkNMVURJTkdfR1JBVklUWSIsIlJPVEFUSU9OX1JBVEUiLCJfaW50ZXJ2YWwiLCJfaXNDYWxpYnJhdGluZyIsIl9jYWxpYnJhdGlvblZhbHVlIiwiX2dyYXZpdHlDb2VmZmljaWVudCIsIl9pc1J1bm5pbmciLCJfaXNSZWFkeSIsIl9kbyIsIl9kbSIsIl9mcmVxdWVuY3kiLCJfZ3Jhdml0eU5vcm1hbGl6ZWQiLCJfb3JpZW50YXRpb25CYXNlIiwiX2RlY2ltYWxDb3VudCIsIl9sb2dnZXIiLCJfc2NyZWVuQWRqdXN0ZWQiLCJfdmFsdWVzIiwiZG8iLCJhbHBoYSIsImJldGEiLCJnYW1tYSIsImFic29sdXRlIiwiZG0iLCJ4IiwieSIsInoiLCJneCIsImd5IiwiZ3oiLCJvcHRpb25zIiwicHJvdG90eXBlIiwiaW5pdCIsImZyZXF1ZW5jeSIsImdyYXZpdHlOb3JtYWxpemVkIiwib3JpZW50YXRpb25CYXNlIiwiZGVjaW1hbENvdW50IiwicGFyc2VJbnQiLCJsb2dnZXIiLCJzY3JlZW5BZGp1c3RlZCIsImRldmljZU9yaWVudGF0aW9uUHJvbWlzZSIsIkZVTExUSUxUIiwiZ2V0RGV2aWNlT3JpZW50YXRpb24iLCJ0aGVuIiwiY29udHJvbGxlciIsImRldmljZU1vdGlvblByb21pc2UiLCJnZXREZXZpY2VNb3Rpb24iLCJnZXRTY3JlZW5BZGp1c3RlZEFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkiLCJQcm9taXNlIiwiYWxsIiwiZW5kIiwic3RvcCIsImVyciIsImxvZyIsInN0YXJ0IiwiY2FsbGJhY2siLCJtZXNzYWdlIiwiY29kZSIsInNldEludGVydmFsIiwic25hcFNob3QiLCJjbGVhckludGVydmFsIiwibm9ybWFsaXplR3Jhdml0eSIsImZsYWciLCJzZXRIZWFkRGlyZWN0aW9uIiwiZ2V0Rml4ZWRGcmFtZUV1bGVyIiwic3RhcnRMb2dnaW5nIiwic3RvcExvZ2dpbmciLCJpc0F2YWlsYWJsZSIsIl9ldmVudFR5cGUiLCJkb1NuYXBTaG90IiwiZ2V0U2NyZWVuQWRqdXN0ZWRFdWxlciIsImFjY1NuYXBTaG90IiwiZ2V0U2NyZWVuQWRqdXN0ZWRBY2NlbGVyYXRpb24iLCJhY2NHcmFTbmFwU2hvdCIsInJvdFJhdGVTbmFwU2hvdCIsImdldFNjcmVlbkFkanVzdGVkUm90YXRpb25SYXRlIiwiZGV2aWNlT3JpZW50YXRpb25BdmFpbGFibGUiLCJhY2NlbGVyYXRpb25BdmFpbGFibGUiLCJhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5QXZhaWxhYmxlIiwicm90YXRpb25SYXRlQXZhaWxhYmxlIiwiaXNSdW5uaW5nIiwicm5kIiwibnVtYmVyIiwiTWF0aCIsInJvdW5kIiwicG93IiwiY2FsaWJyYXRlIiwiX2NhbGlicmF0aW9uVmFsdWVzIiwiQXJyYXkiLCJhbHBoYVRvU2VuZCIsImFicyIsImlzQWJzb2x1dGUiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7Ozs7Ozs7O0FBU0MsV0FBU0EsSUFBVCxFQUFlQyxPQUFmLEVBQXdCO0FBQ3ZCLE1BQUlDLElBQUk7QUFDTkMsY0FBVUY7QUFESixHQUFSO0FBR0EsTUFBSSxPQUFPRyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDQSxPQUFPQyxHQUEzQyxFQUFnRDtBQUM5Q0QsV0FBTyxZQUFXO0FBQ2hCLGFBQU9GLENBQVA7QUFDRCxLQUZEO0FBR0QsR0FKRCxNQUlPLElBQUksUUFBT0ksTUFBUCx5Q0FBT0EsTUFBUCxPQUFrQixRQUFsQixJQUE4QkEsT0FBT0MsT0FBekMsRUFBa0Q7QUFDdkRELFdBQU9DLE9BQVAsR0FBaUJMLENBQWpCO0FBQ0QsR0FGTSxNQUVBO0FBQ0xGLFNBQUtHLFFBQUwsR0FBZ0JELEVBQUVDLFFBQWxCO0FBQ0Q7QUFDRixDQWJBLGFBYU8sWUFBVztBQUNqQjtBQUNBLE1BQUlLLE9BQWtDLE1BQXRDO0FBQ0EsTUFBSUMsUUFBa0MsT0FBdEM7QUFDQSxNQUFJQyxxQkFBa0MsbUJBQXRDO0FBQ0EsTUFBSUMsZUFBa0MsY0FBdEM7QUFDQSxNQUFJQyxpQ0FBa0MsNkJBQXRDO0FBQ0EsTUFBSUMsZ0JBQWtDLGNBQXRDOztBQUVBO0FBQ0E7O0FBRUEsTUFBSUMsWUFBc0IsSUFBMUIsQ0FaaUIsQ0FZcUI7QUFDdEMsTUFBSUMsaUJBQXNCLEtBQTFCLENBYmlCLENBYXFCO0FBQ3RDLE1BQUlDLG9CQUFzQixDQUExQixDQWRpQixDQWNxQjtBQUN0QyxNQUFJQyxzQkFBc0IsQ0FBMUIsQ0FmaUIsQ0FlcUI7QUFDdEMsTUFBSUMsYUFBc0IsS0FBMUIsQ0FoQmlCLENBZ0JxQjtBQUN0QyxNQUFJQyxXQUFzQixLQUExQixDQWpCaUIsQ0FpQnFCOztBQUV0QyxNQUFJQyxNQUFzQixJQUExQixDQW5CaUIsQ0FtQnFCO0FBQ3RDLE1BQUlDLE1BQXNCLElBQTFCLENBcEJpQixDQW9CcUI7O0FBRXRDO0FBQ0EsTUFBSUMsYUFBc0IsRUFBMUIsQ0F2QmlCLENBdUJxQjtBQUN0QyxNQUFJQyxxQkFBc0IsSUFBMUIsQ0F4QmlCLENBd0JxQjtBQUN0QyxNQUFJQyxtQkFBc0JoQixJQUExQixDQXpCaUIsQ0F5QnFCO0FBQ3RDLE1BQUlpQixnQkFBc0IsQ0FBMUIsQ0ExQmlCLENBMEJxQjtBQUN0QyxNQUFJQyxVQUFzQixJQUExQixDQTNCaUIsQ0EyQnFCO0FBQ3RDLE1BQUlDLGtCQUFzQixLQUExQixDQTVCaUIsQ0E0QnFCOztBQUV0QyxNQUFJQyxVQUFVO0FBQ1pDLFFBQUk7QUFDRkMsYUFBTyxDQURMO0FBRUZDLFlBQU0sQ0FGSjtBQUdGQyxhQUFPLENBSEw7QUFJRkMsZ0JBQVU7QUFKUixLQURRO0FBT1pDLFFBQUk7QUFDRkMsU0FBRyxDQUREO0FBRUZDLFNBQUcsQ0FGRDtBQUdGQyxTQUFHLENBSEQ7QUFJRkMsVUFBSSxDQUpGO0FBS0ZDLFVBQUksQ0FMRjtBQU1GQyxVQUFJLENBTkY7QUFPRlYsYUFBTyxDQVBMO0FBUUZDLFlBQU0sQ0FSSjtBQVNGQyxhQUFPO0FBVEw7O0FBYU47QUFDQTs7QUFFQTs7Ozs7O0FBdkJjLEdBQWQsQ0E2QkEsSUFBSTdCLFdBQVcsU0FBWEEsUUFBVyxDQUFTc0MsT0FBVCxFQUFrQixDQUFFLENBQW5DOztBQUVBO0FBQ0F0QyxXQUFTSyxJQUFULEdBQTRDQSxJQUE1QztBQUNBTCxXQUFTTSxLQUFULEdBQTRDQSxLQUE1QztBQUNBTixXQUFTTyxrQkFBVCxHQUE0Q0Esa0JBQTVDO0FBQ0FQLFdBQVNRLFlBQVQsR0FBNENBLFlBQTVDO0FBQ0FSLFdBQVNTLDhCQUFULEdBQTRDQSw4QkFBNUM7QUFDQVQsV0FBU1UsYUFBVCxHQUE0Q0EsYUFBNUM7O0FBRUE7Ozs7Ozs7Ozs7Ozs7O0FBY0FWLFdBQVN1QyxTQUFULENBQW1CQyxJQUFuQixHQUEwQixVQUFTRixPQUFULEVBQWtCO0FBQzFDO0FBQ0EsUUFBSUEsV0FBV0EsUUFBUUcsU0FBdkIsRUFBa0N0QixhQUFhbUIsUUFBUUcsU0FBckI7QUFDbEMsUUFBSUgsV0FBV0EsUUFBUUksaUJBQXZCLEVBQTBDdEIscUJBQXFCa0IsUUFBUUksaUJBQTdCO0FBQzFDLFFBQUlKLFdBQVdBLFFBQVFLLGVBQXZCLEVBQXdDdEIsbUJBQW1CaUIsUUFBUUssZUFBM0I7QUFDeEMsUUFBSUwsV0FBVyxPQUFPQSxRQUFRTSxZQUFmLEtBQWdDLFFBQTNDLElBQXVETixRQUFRTSxZQUFSLElBQXdCLENBQW5GLEVBQXNGdEIsZ0JBQWdCdUIsU0FBU1AsUUFBUU0sWUFBakIsQ0FBaEI7QUFDdEYsUUFBSU4sV0FBV0EsUUFBUVEsTUFBdkIsRUFBK0J2QixVQUFVZSxRQUFRUSxNQUFsQjtBQUMvQixRQUFJUixXQUFXQSxRQUFRUyxjQUF2QixFQUF1Q3ZCLGtCQUFrQmMsUUFBUVMsY0FBMUI7O0FBRXZDLFFBQUlDLDJCQUEyQixJQUFJQyxTQUFTQyxvQkFBYixDQUFrQyxFQUFFLFFBQVE3QixnQkFBVixFQUFsQyxFQUFnRThCLElBQWhFLENBQXFFLFVBQVNDLFVBQVQsRUFBcUI7QUFDdkhuQyxZQUFNbUMsVUFBTjtBQUNELEtBRjhCLENBQS9COztBQUlBLFFBQUlDLHNCQUFzQixJQUFJSixTQUFTSyxlQUFiLEdBQStCSCxJQUEvQixDQUFvQyxVQUFTQyxVQUFULEVBQXFCO0FBQ2pGbEMsWUFBTWtDLFVBQU47QUFDQTtBQUNBdEMsNEJBQXVCSSxJQUFJcUMsNkNBQUosR0FBb0RyQixDQUFwRCxHQUF3RCxDQUF6RCxHQUE4RCxDQUFDLENBQS9ELEdBQW1FLENBQXpGO0FBQ0QsS0FKeUIsQ0FBMUI7O0FBTUEsV0FBT3NCLFFBQVFDLEdBQVIsQ0FBWSxDQUFDVCx3QkFBRCxFQUEyQkssbUJBQTNCLENBQVosRUFBNkRGLElBQTdELENBQWtFLFlBQVc7QUFDbEZuQyxpQkFBVyxJQUFYO0FBQ0QsS0FGTSxDQUFQO0FBR0QsR0F0QkQ7O0FBd0JBOzs7OztBQUtBaEIsV0FBU3VDLFNBQVQsQ0FBbUJtQixHQUFuQixHQUF5QixZQUFXO0FBQ2xDLFFBQUk7QUFDRjFDLGlCQUFXLEtBQVg7QUFDQSxXQUFLMkMsSUFBTDtBQUNBekMsVUFBSXlDLElBQUo7QUFDQTFDLFVBQUkwQyxJQUFKO0FBQ0QsS0FMRCxDQUtFLE9BQU1DLEdBQU4sRUFBVTtBQUNWQyxVQUFJRCxHQUFKO0FBQ0Q7QUFDRixHQVREOztBQVdBOzs7Ozs7O0FBT0E1RCxXQUFTdUMsU0FBVCxDQUFtQnVCLEtBQW5CLEdBQTJCLFVBQVNDLFFBQVQsRUFBbUI7QUFDNUMsUUFBSSxDQUFDL0MsUUFBTCxFQUFlO0FBQ2I2QyxVQUFJLEVBQUVHLFNBQVMsb0VBQVgsRUFBaUZDLE1BQU0sQ0FBdkYsRUFBSjtBQUNBO0FBQ0Q7O0FBRUR0RCxnQkFBWXVELFlBQVksWUFBVztBQUNqQ0gsZUFBU0ksVUFBVDtBQUNELEtBRlcsRUFFVGhELFVBRlMsQ0FBWjtBQUdBSixpQkFBYSxJQUFiO0FBQ0QsR0FWRDs7QUFZQTs7Ozs7QUFLQWYsV0FBU3VDLFNBQVQsQ0FBbUJvQixJQUFuQixHQUEwQixZQUFXO0FBQ25DLFFBQUloRCxTQUFKLEVBQWU7QUFDYnlELG9CQUFjekQsU0FBZDtBQUNBSSxtQkFBYSxLQUFiO0FBQ0Q7QUFDRixHQUxEOztBQU9BOzs7Ozs7O0FBT0FmLFdBQVN1QyxTQUFULENBQW1COEIsZ0JBQW5CLEdBQXNDLFVBQVNDLElBQVQsRUFBZTtBQUNuRGxELHlCQUFzQmtELElBQUQsR0FBUyxJQUFULEdBQWdCLEtBQXJDO0FBQ0QsR0FGRDs7QUFLQTs7Ozs7Ozs7QUFRQXRFLFdBQVN1QyxTQUFULENBQW1CZ0MsZ0JBQW5CLEdBQXNDLFlBQVc7QUFDL0MsUUFBSS9DLG1CQUFtQkgscUJBQXFCZixLQUE1QyxFQUFtRDtBQUNqRCxhQUFPLEtBQVA7QUFDRDs7QUFFRE8sd0JBQW9CSSxJQUFJdUQsa0JBQUosR0FBeUI3QyxLQUE3QztBQUNBLFdBQU8sSUFBUDtBQUNELEdBUEQ7O0FBU0E7Ozs7O0FBS0EzQixXQUFTdUMsU0FBVCxDQUFtQmtDLFlBQW5CLEdBQWtDLFVBQVMzQixNQUFULEVBQWlCO0FBQ2pELFFBQUlBLE1BQUosRUFBWTtBQUNWdkIsZ0JBQVV1QixNQUFWO0FBQ0Q7QUFDRixHQUpEOztBQU1BOzs7OztBQUtBOUMsV0FBU3VDLFNBQVQsQ0FBbUJtQyxXQUFuQixHQUFpQyxZQUFXO0FBQzFDbkQsY0FBVSxJQUFWO0FBQ0QsR0FGRDs7QUFJQTs7Ozs7Ozs7O0FBU0F2QixXQUFTdUMsU0FBVCxDQUFtQm9DLFdBQW5CLEdBQWlDLFVBQVNDLFVBQVQsRUFBcUI7O0FBRXBELFFBQUlDLGFBQWE1RCxJQUFJNkQsc0JBQUosRUFBakI7QUFDQSxRQUFJQyxjQUFjN0QsSUFBSThELDZCQUFKLEVBQWxCO0FBQ0EsUUFBSUMsaUJBQWlCL0QsSUFBSXFDLDZDQUFKLEVBQXJCO0FBQ0EsUUFBSTJCLGtCQUFrQmhFLElBQUlpRSw2QkFBSixFQUF0Qjs7QUFFQSxZQUFRUCxVQUFSO0FBQ0UsV0FBS3JFLGtCQUFMO0FBQ0UsZUFBU3NFLFdBQVdsRCxLQUFYLElBQW9Ca0QsV0FBV2xELEtBQVgsS0FBcUIsSUFBMUMsSUFBb0RrRCxXQUFXakQsSUFBWCxJQUFtQmlELFdBQVdqRCxJQUFYLEtBQW9CLElBQTNGLElBQXFHaUQsV0FBV2hELEtBQVgsSUFBb0JnRCxXQUFXaEQsS0FBWCxLQUFxQixJQUF0SjtBQUNBOztBQUVGLFdBQUtyQixZQUFMO0FBQ0UsZUFBUXVFLGVBQWVBLFlBQVkvQyxDQUEzQixJQUFnQytDLFlBQVk5QyxDQUE1QyxJQUFpRDhDLFlBQVk3QyxDQUFyRTtBQUNBOztBQUVGLFdBQUt6Qiw4QkFBTDtBQUNFLGVBQVF3RSxrQkFBa0JBLGVBQWVqRCxDQUFqQyxJQUFzQ2lELGVBQWVoRCxDQUFyRCxJQUEwRGdELGVBQWUvQyxDQUFqRjtBQUNBOztBQUVGLFdBQUt4QixhQUFMO0FBQ0UsZUFBUXdFLG1CQUFtQkEsZ0JBQWdCdkQsS0FBbkMsSUFBNEN1RCxnQkFBZ0J0RCxJQUE1RCxJQUFvRXNELGdCQUFnQnJELEtBQTVGO0FBQ0E7O0FBRUY7QUFDRSxlQUFPO0FBQ0x1RCxzQ0FBOEJQLFdBQVdsRCxLQUFYLElBQW9Ca0QsV0FBV2xELEtBQVgsS0FBcUIsSUFBMUMsSUFBb0RrRCxXQUFXakQsSUFBWCxJQUFtQmlELFdBQVdqRCxJQUFYLEtBQW9CLElBQTNGLElBQXFHaUQsV0FBV2hELEtBQVgsSUFBb0JnRCxXQUFXaEQsS0FBWCxLQUFxQixJQUR0SztBQUVMd0QsaUNBQXdCTixlQUFlQSxZQUFZL0MsQ0FBM0IsSUFBZ0MrQyxZQUFZOUMsQ0FBNUMsSUFBaUQ4QyxZQUFZN0MsQ0FGaEY7QUFHTG9ELGlEQUF3Q0wsa0JBQWtCQSxlQUFlakQsQ0FBakMsSUFBc0NpRCxlQUFlaEQsQ0FBckQsSUFBMERnRCxlQUFlL0MsQ0FINUc7QUFJTHFELGlDQUF3QkwsbUJBQW1CQSxnQkFBZ0J2RCxLQUFuQyxJQUE0Q3VELGdCQUFnQnRELElBQTVELElBQW9Fc0QsZ0JBQWdCckQ7QUFKdkcsU0FBUDtBQU1BO0FBeEJKO0FBMEJELEdBakNEOztBQW1DQTs7Ozs7QUFLQTdCLFdBQVN1QyxTQUFULENBQW1CaUQsU0FBbkIsR0FBK0IsWUFBVztBQUN4QyxXQUFPekUsVUFBUDtBQUNELEdBRkQ7O0FBSUE7QUFDQTs7QUFFQTs7Ozs7OztBQU9BLFdBQVMwRSxHQUFULENBQWFDLE1BQWIsRUFBcUI7QUFDbkIsV0FBT0MsS0FBS0MsS0FBTCxDQUFXRixTQUFTQyxLQUFLRSxHQUFMLENBQVMsRUFBVCxFQUFhdkUsYUFBYixDQUFwQixJQUFtRHFFLEtBQUtFLEdBQUwsQ0FBUyxFQUFULEVBQWF2RSxhQUFiLENBQTFEO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsV0FBU3dFLFNBQVQsR0FBcUI7QUFDbkJsRixxQkFBaUIsSUFBakI7QUFDQW1GLHlCQUFxQixJQUFJQyxLQUFKLEVBQXJCO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsV0FBUzdCLFFBQVQsR0FBb0I7QUFDbEIsUUFBSVUsYUFBYSxFQUFqQjs7QUFFQSxRQUFJckQsZUFBSixFQUFxQjtBQUNuQnFELG1CQUFhNUQsSUFBSTZELHNCQUFKLEVBQWI7QUFDRCxLQUZELE1BRU87QUFDTEQsbUJBQWE1RCxJQUFJdUQsa0JBQUosRUFBYjtBQUNEOztBQUVELFFBQUlPLGNBQWM3RCxJQUFJOEQsNkJBQUosRUFBbEI7QUFDQSxRQUFJQyxpQkFBaUIvRCxJQUFJcUMsNkNBQUosRUFBckI7QUFDQSxRQUFJMkIsa0JBQWtCaEUsSUFBSWlFLDZCQUFKLEVBQXRCOztBQUVBLFFBQUljLGNBQWMsQ0FBbEI7O0FBRUEsUUFBSTVFLHFCQUFxQmhCLElBQXpCLEVBQStCO0FBQzdCNEYsb0JBQWNwQixXQUFXbEQsS0FBWCxHQUFtQmQsaUJBQWpDO0FBQ0FvRixvQkFBZUEsY0FBYyxDQUFmLEdBQXFCLE1BQU1OLEtBQUtPLEdBQUwsQ0FBU0QsV0FBVCxDQUEzQixHQUFvREEsV0FBbEU7QUFDRCxLQUhELE1BR087QUFDTEEsb0JBQWNwQixXQUFXbEQsS0FBekI7QUFDRDs7QUFFRCxRQUFJd0MsV0FBVztBQUNiekMsVUFBSTtBQUNGQyxlQUFPOEQsSUFBSVEsV0FBSixDQURMO0FBRUZyRSxjQUFNNkQsSUFBSVosV0FBV2pELElBQWYsQ0FGSjtBQUdGQyxlQUFPNEQsSUFBSVosV0FBV2hELEtBQWYsQ0FITDtBQUlGQyxrQkFBVWIsSUFBSWtGLFVBQUo7QUFKUixPQURTO0FBT2JwRSxVQUFJO0FBQ0ZDLFdBQUd5RCxJQUFJVixZQUFZL0MsQ0FBaEIsQ0FERDtBQUVGQyxXQUFHd0QsSUFBSVYsWUFBWTlDLENBQWhCLENBRkQ7QUFHRkMsV0FBR3VELElBQUlWLFlBQVk3QyxDQUFoQixDQUhEO0FBSUZDLFlBQUlzRCxJQUFJUixlQUFlakQsQ0FBbkIsQ0FKRjtBQUtGSSxZQUFJcUQsSUFBSVIsZUFBZWhELENBQW5CLENBTEY7QUFNRkksWUFBSW9ELElBQUlSLGVBQWUvQyxDQUFuQixDQU5GO0FBT0ZQLGVBQU84RCxJQUFJUCxnQkFBZ0J2RCxLQUFwQixDQVBMO0FBUUZDLGNBQU02RCxJQUFJUCxnQkFBZ0J0RCxJQUFwQixDQVJKO0FBU0ZDLGVBQU80RCxJQUFJUCxnQkFBZ0JyRCxLQUFwQjtBQVRMO0FBUFMsS0FBZjs7QUFvQkE7QUFDQSxRQUFJVCxrQkFBSixFQUF3QjtBQUN0QitDLGVBQVNwQyxFQUFULENBQVlJLEVBQVosSUFBa0JyQixtQkFBbEI7QUFDQXFELGVBQVNwQyxFQUFULENBQVlLLEVBQVosSUFBa0J0QixtQkFBbEI7QUFDQXFELGVBQVNwQyxFQUFULENBQVlNLEVBQVosSUFBa0J2QixtQkFBbEI7QUFDRDs7QUFFRCxXQUFPcUQsUUFBUDtBQUNEOztBQUdEOzs7OztBQUtBLFdBQVNOLEdBQVQsQ0FBYUQsR0FBYixFQUFrQjtBQUNoQixRQUFJckMsT0FBSixFQUFhO0FBQ1gsVUFBSSxPQUFPcUMsR0FBUCxJQUFlLFFBQW5CLEVBQTZCO0FBQzNCQSxjQUFNLEVBQUVJLFNBQVNKLEdBQVgsRUFBZ0JLLE1BQU0sQ0FBdEIsRUFBTjtBQUNEO0FBQ0QxQyxjQUFRcUMsR0FBUjtBQUNEO0FBQ0Y7O0FBRUQsU0FBTzVELFFBQVA7QUFDRCxDQTlXQSxDQUFEIiwiZmlsZSI6Imd5cm9ub3JtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIEphdmFTY3JpcHQgcHJvamVjdCBmb3IgYWNjZXNzaW5nIGFuZCBub3JtYWxpemluZyB0aGUgYWNjZWxlcm9tZXRlciBhbmQgZ3lyb3Njb3BlIGRhdGEgb24gbW9iaWxlIGRldmljZXNcbipcbiogQGF1dGhvciBEb3J1ayBFa2VyIDxkb3J1a0Bkb3J1a2VrZXIuY29tPlxuKiBAY29weXJpZ2h0IERvcnVrIEVrZXIgPGh0dHA6Ly9kb3J1a2VrZXIuY29tPlxuKiBAdmVyc2lvbiAyLjAuNlxuKiBAbGljZW5zZSBNSVQgTGljZW5zZSB8IGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiovXG5cbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gIHZhciBlID0ge1xuICAgIEd5cm9Ob3JtOiBmYWN0b3J5KCksXG4gIH07XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZTtcbiAgfSBlbHNlIHtcbiAgICByb290Lkd5cm9Ob3JtID0gZS5HeXJvTm9ybTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgLyogQ29uc3RhbnRzICovXG4gIHZhciBHQU1FICAgICAgICAgICAgICAgICAgICAgICAgICAgID0gJ2dhbWUnO1xuICB2YXIgV09STEQgICAgICAgICAgICAgICAgICAgICAgICAgICA9ICd3b3JsZCc7XG4gIHZhciBERVZJQ0VfT1JJRU5UQVRJT04gICAgICAgICAgICAgID0gJ2RldmljZW9yaWVudGF0aW9uJztcbiAgdmFyIEFDQ0VMRVJBVElPTiAgICAgICAgICAgICAgICAgICAgPSAnYWNjZWxlcmF0aW9uJztcbiAgdmFyIEFDQ0VMRVJBVElPTl9JTkNMVURJTkdfR1JBVklUWSAgPSAnYWNjZWxlcmF0aW9uaW5sdWRpbmdncmF2aXR5JztcbiAgdmFyIFJPVEFUSU9OX1JBVEUgICAgICAgICAgICAgICAgICAgPSAncm90YXRpb25yYXRlJztcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAvKiBQUklWQVRFIFZBUklBQkxFUyAqL1xuXG4gIHZhciBfaW50ZXJ2YWwgICAgICAgICAgID0gbnVsbDsgICAgICAgLy8gVGltZXIgdG8gcmV0dXJuIHZhbHVlc1xuICB2YXIgX2lzQ2FsaWJyYXRpbmcgICAgICA9IGZhbHNlOyAgICAgIC8vIEZsYWcgaWYgY2FsaWJyYXRpbmdcbiAgdmFyIF9jYWxpYnJhdGlvblZhbHVlICAgPSAwOyAgICAgICAgICAvLyBBbHBoYSBvZmZzZXQgdmFsdWVcbiAgdmFyIF9ncmF2aXR5Q29lZmZpY2llbnQgPSAwOyAgICAgICAgICAvLyBDb2VmZmljaWVudCB0byBub3JtYWx6ZSBncmF2aXR5IHJlbGF0ZWQgdmFsdWVzXG4gIHZhciBfaXNSdW5uaW5nICAgICAgICAgID0gZmFsc2U7ICAgICAgLy8gQm9vbGVhbiB2YWx1ZSBpZiBHeXJvTm9ybSBpcyB0cmFja2luZ1xuICB2YXIgX2lzUmVhZHkgICAgICAgICAgICA9IGZhbHNlOyAgICAgIC8vIEJvb2xlYW4gdmFsdWUgaWYgR3lyb05vcm0gaXMgaXMgaW5pdGlhbGl6ZWRcblxuICB2YXIgX2RvICAgICAgICAgICAgICAgICA9IG51bGw7ICAgICAgIC8vIE9iamVjdCB0byBzdG9yZSB0aGUgZGV2aWNlIG9yaWVudGF0aW9uIHZhbHVlc1xuICB2YXIgX2RtICAgICAgICAgICAgICAgICA9IG51bGw7ICAgICAgIC8vIE9iamVjdCB0byBzdG9yZSB0aGUgZGV2aWNlIG1vdGlvbiB2YWx1ZXNcblxuICAvKiBPUFRJT05TICovXG4gIHZhciBfZnJlcXVlbmN5ICAgICAgICAgID0gNTA7ICAgICAgICAgLy8gRnJlcXVlbmN5IGZvciB0aGUgcmV0dXJuIGRhdGEgaW4gbWlsbGlzZWNvbmRzXG4gIHZhciBfZ3Jhdml0eU5vcm1hbGl6ZWQgID0gdHJ1ZTsgICAgICAgLy8gRmxhZyBpZiB0byBub3JtYWxpemUgZ3Jhdml0eSB2YWx1ZXNcbiAgdmFyIF9vcmllbnRhdGlvbkJhc2UgICAgPSBHQU1FOyAgICAgICAvLyBDYW4gYmUgR3lyb05vcm0uR0FNRSBvciBHeXJvTm9ybS5XT1JMRC4gR3lyb05vcm0uR0FNRSByZXR1cm5zIG9yaWVudGF0aW9uIHZhbHVlcyB3aXRoIHJlc3BlY3QgdG8gdGhlIGhlYWQgZGlyZWN0aW9uIG9mIHRoZSBkZXZpY2UuIEd5cm9Ob3JtLldPUkxEIHJldHVybnMgdGhlIG9yaWVudGF0aW9uIHZhbHVlcyB3aXRoIHJlc3BlY3QgdG8gdGhlIGFjdHVhbCBub3J0aCBkaXJlY3Rpb24gb2YgdGhlIHdvcmxkLlxuICB2YXIgX2RlY2ltYWxDb3VudCAgICAgICA9IDI7ICAgICAgICAgIC8vIE51bWJlciBvZiBkaWdpdHMgYWZ0ZXIgdGhlIGRlY2ltYWxzIHBvaW50IGZvciB0aGUgcmV0dXJuIHZhbHVlc1xuICB2YXIgX2xvZ2dlciAgICAgICAgICAgICA9IG51bGw7ICAgICAgIC8vIEZ1bmN0aW9uIHRvIGNhbGxiYWNrIG9uIGVycm9yLiBUaGVyZSBpcyBubyBkZWZhdWx0IHZhbHVlLiBJdCBjYW4gb25seSBiZSBzZXQgYnkgdGhlIHVzZXIgb24gZ24uaW5pdCgpXG4gIHZhciBfc2NyZWVuQWRqdXN0ZWQgICAgID0gZmFsc2U7ICAgICAgLy8gSWYgc2V0IHRvIHRydWUgaXQgd2lsbCByZXR1cm4gc2NyZWVuIGFkanVzdGVkIHZhbHVlcy4gKGUuZy4gT24gYSBob3Jpem9udGFsIG9yaWVudGF0aW9uIG9mIGEgbW9iaWxlIGRldmljZSwgdGhlIGhlYWQgd291bGQgYmUgb25lIG9mIHRoZSBzaWRlcywgaW5zdGVhZCBvZiAgdGhlIGFjdHVhbCBoZWFkIG9mIHRoZSBkZXZpY2UuKVxuXG4gIHZhciBfdmFsdWVzID0ge1xuICAgIGRvOiB7XG4gICAgICBhbHBoYTogMCxcbiAgICAgIGJldGE6IDAsXG4gICAgICBnYW1tYTogMCxcbiAgICAgIGFic29sdXRlOiBmYWxzZVxuICAgIH0sXG4gICAgZG06IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgejogMCxcbiAgICAgIGd4OiAwLFxuICAgICAgZ3k6IDAsXG4gICAgICBnejogMCxcbiAgICAgIGFscGhhOiAwLFxuICAgICAgYmV0YTogMCxcbiAgICAgIGdhbW1hOiAwXG4gICAgfVxuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgLyogUFVCTElDIEZVTkNUSU9OUyAqL1xuXG4gIC8qXG4gICpcbiAgKiBDb25zdHJ1Y3RvciBmdW5jdGlvblxuICAqXG4gICovXG5cbiAgdmFyIEd5cm9Ob3JtID0gZnVuY3Rpb24ob3B0aW9ucykge31cblxuICAvKiBDb25zdGFudHMgKi9cbiAgR3lyb05vcm0uR0FNRSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPSBHQU1FO1xuICBHeXJvTm9ybS5XT1JMRCAgICAgICAgICAgICAgICAgICAgICAgICAgICA9IFdPUkxEO1xuICBHeXJvTm9ybS5ERVZJQ0VfT1JJRU5UQVRJT04gICAgICAgICAgICAgICA9IERFVklDRV9PUklFTlRBVElPTjtcbiAgR3lyb05vcm0uQUNDRUxFUkFUSU9OICAgICAgICAgICAgICAgICAgICAgPSBBQ0NFTEVSQVRJT047XG4gIEd5cm9Ob3JtLkFDQ0VMRVJBVElPTl9JTkNMVURJTkdfR1JBVklUWSAgID0gQUNDRUxFUkFUSU9OX0lOQ0xVRElOR19HUkFWSVRZO1xuICBHeXJvTm9ybS5ST1RBVElPTl9SQVRFICAgICAgICAgICAgICAgICAgICA9IFJPVEFUSU9OX1JBVEU7XG5cbiAgLypcbiAgKlxuICAqIEluaXRpYWxpemUgR3lyb05vcm0gaW5zdGFuY2UgZnVuY3Rpb25cbiAgKlxuICAqIEBwYXJhbSBvYmplY3Qgb3B0aW9ucyAtIHZhbHVlcyBhcmUgYXMgZm9sbG93cy4gSWYgc2V0IGluIHRoZSBpbml0IGZ1bmN0aW9uIHRoZXkgb3ZlcndyaXRlIHRoZSBkZWZhdWx0IG9wdGlvbiB2YWx1ZXNcbiAgKiBAcGFyYW0gaW50IG9wdGlvbnMuZnJlcXVlbmN5XG4gICogQHBhcmFtIGJvb2xlYW4gb3B0aW9ucy5ncmF2aXR5Tm9ybWFsaXplZFxuICAqIEBwYXJhbSBib29sZWFuIG9wdGlvbnMub3JpZW50YXRpb25CYXNlXG4gICogQHBhcmFtIGJvb2xlYW4gb3B0aW9ucy5kZWNpbWFsQ291bnRcbiAgKiBAcGFyYW0gZnVuY3Rpb24gb3B0aW9ucy5sb2dnZXJcbiAgKiBAcGFyYW0gZnVuY3Rpb24gb3B0aW9ucy5zY3JlZW5BZGp1c3RlZFxuICAqXG4gICovXG5cbiAgR3lyb05vcm0ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgLy8gQXNzaWduIG9wdGlvbnMgdGhhdCBhcmUgcGFzc2VkIHdpdGggdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5mcmVxdWVuY3kpIF9mcmVxdWVuY3kgPSBvcHRpb25zLmZyZXF1ZW5jeTtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdyYXZpdHlOb3JtYWxpemVkKSBfZ3Jhdml0eU5vcm1hbGl6ZWQgPSBvcHRpb25zLmdyYXZpdHlOb3JtYWxpemVkO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMub3JpZW50YXRpb25CYXNlKSBfb3JpZW50YXRpb25CYXNlID0gb3B0aW9ucy5vcmllbnRhdGlvbkJhc2U7XG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuZGVjaW1hbENvdW50ID09PSAnbnVtYmVyJyAmJiBvcHRpb25zLmRlY2ltYWxDb3VudCA+PSAwKSBfZGVjaW1hbENvdW50ID0gcGFyc2VJbnQob3B0aW9ucy5kZWNpbWFsQ291bnQpO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubG9nZ2VyKSBfbG9nZ2VyID0gb3B0aW9ucy5sb2dnZXI7XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zY3JlZW5BZGp1c3RlZCkgX3NjcmVlbkFkanVzdGVkID0gb3B0aW9ucy5zY3JlZW5BZGp1c3RlZDtcblxuICAgIHZhciBkZXZpY2VPcmllbnRhdGlvblByb21pc2UgPSBuZXcgRlVMTFRJTFQuZ2V0RGV2aWNlT3JpZW50YXRpb24oeyAndHlwZSc6IF9vcmllbnRhdGlvbkJhc2UgfSkudGhlbihmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gICAgICBfZG8gPSBjb250cm9sbGVyO1xuICAgIH0pO1xuXG4gICAgdmFyIGRldmljZU1vdGlvblByb21pc2UgPSBuZXcgRlVMTFRJTFQuZ2V0RGV2aWNlTW90aW9uKCkudGhlbihmdW5jdGlvbihjb250cm9sbGVyKSB7XG4gICAgICBfZG0gPSBjb250cm9sbGVyO1xuICAgICAgLy8gU2V0IGdyYXZpdHkgY29lZmZpY2llbnRcbiAgICAgIF9ncmF2aXR5Q29lZmZpY2llbnQgPSAoX2RtLmdldFNjcmVlbkFkanVzdGVkQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSgpLnogPiAwKSA/IC0xIDogMTtcbiAgICB9KTtcblxuICAgIHJldHVybiBQcm9taXNlLmFsbChbZGV2aWNlT3JpZW50YXRpb25Qcm9taXNlLCBkZXZpY2VNb3Rpb25Qcm9taXNlXSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIF9pc1JlYWR5ID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qXG4gICpcbiAgKiBTdG9wcyBhbGwgdGhlIHRyYWNraW5nIGFuZCBsaXN0ZW5pbmcgb24gdGhlIHdpbmRvdyBvYmplY3RzXG4gICpcbiAgKi9cbiAgR3lyb05vcm0ucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRyeSB7XG4gICAgICBfaXNSZWFkeSA9IGZhbHNlO1xuICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICBfZG0uc3RvcCgpO1xuICAgICAgX2RvLnN0b3AoKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICBsb2coZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAqXG4gICogU3RhcnRzIHRyYWNraW5nIHRoZSB2YWx1ZXNcbiAgKlxuICAqIEBwYXJhbSBmdW5jdGlvbiBjYWxsYmFjayAtIENhbGxiYWNrIGZ1bmN0aW9uIHRvIHJlYWQgdGhlIHZhbHVlc1xuICAqXG4gICovXG4gIEd5cm9Ob3JtLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYgKCFfaXNSZWFkeSkge1xuICAgICAgbG9nKHsgbWVzc2FnZTogJ0d5cm9Ob3JtIGlzIG5vdCBpbml0aWFsaXplZCB5ZXQuIEZpcnN0IGNhbGwgdGhlIFwiaW5pdCgpXCIgZnVuY3Rpb24uJywgY29kZTogMSB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgIGNhbGxiYWNrKHNuYXBTaG90KCkpO1xuICAgIH0sIF9mcmVxdWVuY3kpO1xuICAgIF9pc1J1bm5pbmcgPSB0cnVlO1xuICB9XG5cbiAgLypcbiAgKlxuICAqIFN0b3BzIHRyYWNraW5nIHRoZSB2YWx1ZXNcbiAgKlxuICAqL1xuICBHeXJvTm9ybS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChfaW50ZXJ2YWwpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoX2ludGVydmFsKTtcbiAgICAgIF9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAqXG4gICogVG9nZ2xlcyBpZiB0byBub3JtYWxpemUgZ3Jhdml0eSByZWxhdGVkIHZhbHVlc1xuICAqXG4gICogQHBhcmFtIGJvb2xlYW4gZmxhZ1xuICAqXG4gICovXG4gIEd5cm9Ob3JtLnByb3RvdHlwZS5ub3JtYWxpemVHcmF2aXR5ID0gZnVuY3Rpb24oZmxhZykge1xuICAgIF9ncmF2aXR5Tm9ybWFsaXplZCA9IChmbGFnKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG5cbiAgLypcbiAgKlxuICAqIFNldHMgdGhlIGN1cnJlbnQgaGVhZCBkaXJlY3Rpb24gYXMgYWxwaGEgPSAwXG4gICogQ2FuIG9ubHkgYmUgdXNlZCBpZiBkZXZpY2Ugb3JpZW50YXRpb24gaXMgYmVpbmcgdHJhY2tlZCwgdmFsdWVzIGFyZSBub3Qgc2NyZWVuIGFkanVzdGVkLCB2YWx1ZSB0eXBlIGlzIEd5cm9Ob3JtLkVVTEVSIGFuZCBvcmllbnRhdGlvbiBiYXNlIGlzIEd5cm9Ob3JtLkdBTUVcbiAgKlxuICAqIEByZXR1cm46IElmIGhlYWQgZGlyZWN0aW9uIGlzIHNldCBzdWNjZXNzZnVsbHkgcmV0dXJucyB0cnVlLCBlbHNlIGZhbHNlXG4gICpcbiAgKi9cbiAgR3lyb05vcm0ucHJvdG90eXBlLnNldEhlYWREaXJlY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoX3NjcmVlbkFkanVzdGVkIHx8IF9vcmllbnRhdGlvbkJhc2UgPT09IFdPUkxEKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgX2NhbGlicmF0aW9uVmFsdWUgPSBfZG8uZ2V0Rml4ZWRGcmFtZUV1bGVyKCkuYWxwaGE7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKlxuICAqXG4gICogU2V0cyB0aGUgbG9nIGZ1bmN0aW9uXG4gICpcbiAgKi9cbiAgR3lyb05vcm0ucHJvdG90eXBlLnN0YXJ0TG9nZ2luZyA9IGZ1bmN0aW9uKGxvZ2dlcikge1xuICAgIGlmIChsb2dnZXIpIHtcbiAgICAgIF9sb2dnZXIgPSBsb2dnZXI7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgKlxuICAqIFNldHMgdGhlIGxvZyBmdW5jdGlvbiB0byBudWxsIHdoaWNoIHN0b3BzIHRoZSBsb2dnaW5nXG4gICpcbiAgKi9cbiAgR3lyb05vcm0ucHJvdG90eXBlLnN0b3BMb2dnaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgX2xvZ2dlciA9IG51bGw7XG4gIH1cblxuICAvKlxuICAqXG4gICogUmV0dXJucyBpZiBjZXJ0YWluIHR5cGUgb2YgZXZlbnQgaXMgYXZhaWxhYmxlIG9uIHRoZSBkZXZpY2VcbiAgKlxuICAqIEBwYXJhbSBzdHJpbmcgX2V2ZW50VHlwZSAtIHBvc3NpYmxlIHZhbHVlcyBhcmUgXCJkZXZpY2VvcmllbnRhdGlvblwiICwgXCJkZXZpY2Vtb3Rpb25cIiAsIFwiY29tcGFzc25lZWRzY2FsaWJyYXRpb25cIlxuICAqXG4gICogQHJldHVybiB0cnVlIGlmIGV2ZW50IGlzIGF2YWlsYWJsZSBmYWxzZSBpZiBub3RcbiAgKlxuICAqL1xuICBHeXJvTm9ybS5wcm90b3R5cGUuaXNBdmFpbGFibGUgPSBmdW5jdGlvbihfZXZlbnRUeXBlKSB7XG5cbiAgICB2YXIgZG9TbmFwU2hvdCA9IF9kby5nZXRTY3JlZW5BZGp1c3RlZEV1bGVyKCk7XG4gICAgdmFyIGFjY1NuYXBTaG90ID0gX2RtLmdldFNjcmVlbkFkanVzdGVkQWNjZWxlcmF0aW9uKCk7XG4gICAgdmFyIGFjY0dyYVNuYXBTaG90ID0gX2RtLmdldFNjcmVlbkFkanVzdGVkQWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSgpO1xuICAgIHZhciByb3RSYXRlU25hcFNob3QgPSBfZG0uZ2V0U2NyZWVuQWRqdXN0ZWRSb3RhdGlvblJhdGUoKTtcblxuICAgIHN3aXRjaCAoX2V2ZW50VHlwZSkge1xuICAgICAgY2FzZSBERVZJQ0VfT1JJRU5UQVRJT046XG4gICAgICAgIHJldHVybiAoKGRvU25hcFNob3QuYWxwaGEgJiYgZG9TbmFwU2hvdC5hbHBoYSAhPT0gbnVsbCkgJiYgKGRvU25hcFNob3QuYmV0YSAmJiBkb1NuYXBTaG90LmJldGEgIT09IG51bGwpICYmIChkb1NuYXBTaG90LmdhbW1hICYmIGRvU25hcFNob3QuZ2FtbWEgIT09IG51bGwpKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQUNDRUxFUkFUSU9OOlxuICAgICAgICByZXR1cm4gKGFjY1NuYXBTaG90ICYmIGFjY1NuYXBTaG90LnggJiYgYWNjU25hcFNob3QueSAmJiBhY2NTbmFwU2hvdC56KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgQUNDRUxFUkFUSU9OX0lOQ0xVRElOR19HUkFWSVRZOlxuICAgICAgICByZXR1cm4gKGFjY0dyYVNuYXBTaG90ICYmIGFjY0dyYVNuYXBTaG90LnggJiYgYWNjR3JhU25hcFNob3QueSAmJiBhY2NHcmFTbmFwU2hvdC56KTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgUk9UQVRJT05fUkFURTpcbiAgICAgICAgcmV0dXJuIChyb3RSYXRlU25hcFNob3QgJiYgcm90UmF0ZVNuYXBTaG90LmFscGhhICYmIHJvdFJhdGVTbmFwU2hvdC5iZXRhICYmIHJvdFJhdGVTbmFwU2hvdC5nYW1tYSk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGRldmljZU9yaWVudGF0aW9uQXZhaWxhYmxlOiAoKGRvU25hcFNob3QuYWxwaGEgJiYgZG9TbmFwU2hvdC5hbHBoYSAhPT0gbnVsbCkgJiYgKGRvU25hcFNob3QuYmV0YSAmJiBkb1NuYXBTaG90LmJldGEgIT09IG51bGwpICYmIChkb1NuYXBTaG90LmdhbW1hICYmIGRvU25hcFNob3QuZ2FtbWEgIT09IG51bGwpKSxcbiAgICAgICAgICBhY2NlbGVyYXRpb25BdmFpbGFibGU6IChhY2NTbmFwU2hvdCAmJiBhY2NTbmFwU2hvdC54ICYmIGFjY1NuYXBTaG90LnkgJiYgYWNjU25hcFNob3QueiksXG4gICAgICAgICAgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eUF2YWlsYWJsZTogKGFjY0dyYVNuYXBTaG90ICYmIGFjY0dyYVNuYXBTaG90LnggJiYgYWNjR3JhU25hcFNob3QueSAmJiBhY2NHcmFTbmFwU2hvdC56KSxcbiAgICAgICAgICByb3RhdGlvblJhdGVBdmFpbGFibGU6IChyb3RSYXRlU25hcFNob3QgJiYgcm90UmF0ZVNuYXBTaG90LmFscGhhICYmIHJvdFJhdGVTbmFwU2hvdC5iZXRhICYmIHJvdFJhdGVTbmFwU2hvdC5nYW1tYSlcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICAvKlxuICAqXG4gICogUmV0dXJucyBib29sZWFuIHZhbHVlIGlmIHRoZSBHeXJvTm9ybSBpcyBydW5uaW5nXG4gICpcbiAgKi9cbiAgR3lyb05vcm0ucHJvdG90eXBlLmlzUnVubmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfaXNSdW5uaW5nO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cbiAgLyogUFJJVkFURSBGVU5DVElPTlMgKi9cblxuICAvKlxuICAqXG4gICogVXRpbGl0eSBmdW5jdGlvbiB0byByb3VuZCB3aXRoIGRpZ2l0cyBhZnRlciB0aGUgZGVjaW1hbCBwb2ludFxuICAqXG4gICogQHBhcmFtIGZsb2F0IG51bWJlciAtIHRoZSBvcmlnaW5hbCBudW1iZXIgdG8gcm91bmRcbiAgKlxuICAqL1xuICBmdW5jdGlvbiBybmQobnVtYmVyKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobnVtYmVyICogTWF0aC5wb3coMTAsIF9kZWNpbWFsQ291bnQpKSAvIE1hdGgucG93KDEwLCBfZGVjaW1hbENvdW50KTtcbiAgfVxuXG4gIC8qXG4gICpcbiAgKiBTdGFydHMgY2FsaWJyYXRpb25cbiAgKlxuICAqL1xuICBmdW5jdGlvbiBjYWxpYnJhdGUoKSB7XG4gICAgX2lzQ2FsaWJyYXRpbmcgPSB0cnVlO1xuICAgIF9jYWxpYnJhdGlvblZhbHVlcyA9IG5ldyBBcnJheSgpO1xuICB9XG5cbiAgLypcbiAgKlxuICAqIFRha2VzIGEgc25hcHNob3Qgb2YgdGhlIGN1cnJlbnQgZGV2aWNlbyBvcmllbnRhaW9uIGFuZCBkZXZpY2UgbW90aW9uIHZhbHVlc1xuICAqXG4gICovXG4gIGZ1bmN0aW9uIHNuYXBTaG90KCkge1xuICAgIHZhciBkb1NuYXBTaG90ID0ge307XG5cbiAgICBpZiAoX3NjcmVlbkFkanVzdGVkKSB7XG4gICAgICBkb1NuYXBTaG90ID0gX2RvLmdldFNjcmVlbkFkanVzdGVkRXVsZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9TbmFwU2hvdCA9IF9kby5nZXRGaXhlZEZyYW1lRXVsZXIoKTtcbiAgICB9XG5cbiAgICB2YXIgYWNjU25hcFNob3QgPSBfZG0uZ2V0U2NyZWVuQWRqdXN0ZWRBY2NlbGVyYXRpb24oKTtcbiAgICB2YXIgYWNjR3JhU25hcFNob3QgPSBfZG0uZ2V0U2NyZWVuQWRqdXN0ZWRBY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5KCk7XG4gICAgdmFyIHJvdFJhdGVTbmFwU2hvdCA9IF9kbS5nZXRTY3JlZW5BZGp1c3RlZFJvdGF0aW9uUmF0ZSgpO1xuXG4gICAgdmFyIGFscGhhVG9TZW5kID0gMDtcblxuICAgIGlmIChfb3JpZW50YXRpb25CYXNlID09PSBHQU1FKSB7XG4gICAgICBhbHBoYVRvU2VuZCA9IGRvU25hcFNob3QuYWxwaGEgLSBfY2FsaWJyYXRpb25WYWx1ZTtcbiAgICAgIGFscGhhVG9TZW5kID0gKGFscGhhVG9TZW5kIDwgMCkgPyAoMzYwIC0gTWF0aC5hYnMoYWxwaGFUb1NlbmQpKSA6IGFscGhhVG9TZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbHBoYVRvU2VuZCA9IGRvU25hcFNob3QuYWxwaGE7XG4gICAgfVxuXG4gICAgdmFyIHNuYXBTaG90ID0ge1xuICAgICAgZG86IHtcbiAgICAgICAgYWxwaGE6IHJuZChhbHBoYVRvU2VuZCksXG4gICAgICAgIGJldGE6IHJuZChkb1NuYXBTaG90LmJldGEpLFxuICAgICAgICBnYW1tYTogcm5kKGRvU25hcFNob3QuZ2FtbWEpLFxuICAgICAgICBhYnNvbHV0ZTogX2RvLmlzQWJzb2x1dGUoKVxuICAgICAgfSxcbiAgICAgIGRtOiB7XG4gICAgICAgIHg6IHJuZChhY2NTbmFwU2hvdC54KSxcbiAgICAgICAgeTogcm5kKGFjY1NuYXBTaG90LnkpLFxuICAgICAgICB6OiBybmQoYWNjU25hcFNob3QueiksXG4gICAgICAgIGd4OiBybmQoYWNjR3JhU25hcFNob3QueCksXG4gICAgICAgIGd5OiBybmQoYWNjR3JhU25hcFNob3QueSksXG4gICAgICAgIGd6OiBybmQoYWNjR3JhU25hcFNob3QueiksXG4gICAgICAgIGFscGhhOiBybmQocm90UmF0ZVNuYXBTaG90LmFscGhhKSxcbiAgICAgICAgYmV0YTogcm5kKHJvdFJhdGVTbmFwU2hvdC5iZXRhKSxcbiAgICAgICAgZ2FtbWE6IHJuZChyb3RSYXRlU25hcFNob3QuZ2FtbWEpXG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIE5vcm1hbGl6ZSBncmF2aXR5XG4gICAgaWYgKF9ncmF2aXR5Tm9ybWFsaXplZCkge1xuICAgICAgc25hcFNob3QuZG0uZ3ggKj0gX2dyYXZpdHlDb2VmZmljaWVudDtcbiAgICAgIHNuYXBTaG90LmRtLmd5ICo9IF9ncmF2aXR5Q29lZmZpY2llbnQ7XG4gICAgICBzbmFwU2hvdC5kbS5neiAqPSBfZ3Jhdml0eUNvZWZmaWNpZW50O1xuICAgIH1cblxuICAgIHJldHVybiBzbmFwU2hvdDtcbiAgfVxuXG5cbiAgLypcbiAgKlxuICAqIFN0YXJ0cyBsaXN0ZW5pbmcgdG8gb3JpZW50YXRpb24gZXZlbnQgb24gdGhlIHdpbmRvdyBvYmplY3RcbiAgKlxuICAqL1xuICBmdW5jdGlvbiBsb2coZXJyKSB7XG4gICAgaWYgKF9sb2dnZXIpIHtcbiAgICAgIGlmICh0eXBlb2YoZXJyKSA9PSAnc3RyaW5nJykge1xuICAgICAgICBlcnIgPSB7IG1lc3NhZ2U6IGVyciwgY29kZTogMCB9XG4gICAgICB9XG4gICAgICBfbG9nZ2VyKGVycik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIEd5cm9Ob3JtO1xufSkpO1xuIl19