/**
 * jscolor - JavaScript Color Picker
 *
 * @link    http://jscolor.com
 * @license For open source use: GPLv3
 *          For commercial use: JSColor Commercial License
 * @author  Jan Odvarko
 * @version 2.0.5
 *
 * See usage examples at http://jscolor.com/examples/
 */

"use strict";

if (!window.jscolor) {
	window.jscolor = function () {

		var jsc = {

			register: function register() {
				jsc.attachDOMReadyEvent(jsc.init);
				jsc.attachEvent(document, 'mousedown', jsc.onDocumentMouseDown);
				jsc.attachEvent(document, 'touchstart', jsc.onDocumentTouchStart);
				jsc.attachEvent(window, 'resize', jsc.onWindowResize);
			},

			init: function init() {
				if (jsc.jscolor.lookupClass) {
					jsc.jscolor.installByClassName(jsc.jscolor.lookupClass);
				}
			},

			tryInstallOnElements: function tryInstallOnElements(elms, className) {
				var matchClass = new RegExp('(^|\\s)(' + className + ')(\\s*(\\{[^}]*\\})|\\s|$)', 'i');

				for (var i = 0; i < elms.length; i += 1) {
					if (elms[i].type !== undefined && elms[i].type.toLowerCase() == 'color') {
						if (jsc.isColorAttrSupported) {
							// skip inputs of type 'color' if supported by the browser
							continue;
						}
					}
					var m;
					if (!elms[i].jscolor && elms[i].className && (m = elms[i].className.match(matchClass))) {
						var targetElm = elms[i];
						var optsStr = null;

						var dataOptions = jsc.getDataAttr(targetElm, 'jscolor');
						if (dataOptions !== null) {
							optsStr = dataOptions;
						} else if (m[4]) {
							optsStr = m[4];
						}

						var opts = {};
						if (optsStr) {
							try {
								opts = new Function('return (' + optsStr + ')')();
							} catch (eParseError) {
								jsc.warn('Error parsing jscolor options: ' + eParseError + ':\n' + optsStr);
							}
						}
						targetElm.jscolor = new jsc.jscolor(targetElm, opts);
					}
				}
			},

			isColorAttrSupported: function () {
				var elm = document.createElement('input');
				if (elm.setAttribute) {
					elm.setAttribute('type', 'color');
					if (elm.type.toLowerCase() == 'color') {
						return true;
					}
				}
				return false;
			}(),

			isCanvasSupported: function () {
				var elm = document.createElement('canvas');
				return !!(elm.getContext && elm.getContext('2d'));
			}(),

			fetchElement: function fetchElement(mixed) {
				return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
			},

			isElementType: function isElementType(elm, type) {
				return elm.nodeName.toLowerCase() === type.toLowerCase();
			},

			getDataAttr: function getDataAttr(el, name) {
				var attrName = 'data-' + name;
				var attrValue = el.getAttribute(attrName);
				if (attrValue !== null) {
					return attrValue;
				}
				return null;
			},

			attachEvent: function attachEvent(el, evnt, func) {
				if (el.addEventListener) {
					el.addEventListener(evnt, func, false);
				} else if (el.attachEvent) {
					el.attachEvent('on' + evnt, func);
				}
			},

			detachEvent: function detachEvent(el, evnt, func) {
				if (el.removeEventListener) {
					el.removeEventListener(evnt, func, false);
				} else if (el.detachEvent) {
					el.detachEvent('on' + evnt, func);
				}
			},

			_attachedGroupEvents: {},

			attachGroupEvent: function attachGroupEvent(groupName, el, evnt, func) {
				if (!jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
					jsc._attachedGroupEvents[groupName] = [];
				}
				jsc._attachedGroupEvents[groupName].push([el, evnt, func]);
				jsc.attachEvent(el, evnt, func);
			},

			detachGroupEvents: function detachGroupEvents(groupName) {
				if (jsc._attachedGroupEvents.hasOwnProperty(groupName)) {
					for (var i = 0; i < jsc._attachedGroupEvents[groupName].length; i += 1) {
						var evt = jsc._attachedGroupEvents[groupName][i];
						jsc.detachEvent(evt[0], evt[1], evt[2]);
					}
					delete jsc._attachedGroupEvents[groupName];
				}
			},

			attachDOMReadyEvent: function attachDOMReadyEvent(func) {
				var fired = false;
				var fireOnce = function fireOnce() {
					if (!fired) {
						fired = true;
						func();
					}
				};

				if (document.readyState === 'complete') {
					setTimeout(fireOnce, 1); // async
					return;
				}

				if (document.addEventListener) {
					document.addEventListener('DOMContentLoaded', fireOnce, false);

					// Fallback
					window.addEventListener('load', fireOnce, false);
				} else if (document.attachEvent) {
					// IE
					document.attachEvent('onreadystatechange', function () {
						if (document.readyState === 'complete') {
							document.detachEvent('onreadystatechange', arguments.callee);
							fireOnce();
						}
					});

					// Fallback
					window.attachEvent('onload', fireOnce);

					// IE7/8
					if (document.documentElement.doScroll && window == window.top) {
						var tryScroll = function tryScroll() {
							if (!document.body) {
								return;
							}
							try {
								document.documentElement.doScroll('left');
								fireOnce();
							} catch (e) {
								setTimeout(tryScroll, 1);
							}
						};
						tryScroll();
					}
				}
			},

			warn: function warn(msg) {
				if (window.console && window.console.warn) {
					window.console.warn(msg);
				}
			},

			preventDefault: function preventDefault(e) {
				if (e.preventDefault) {
					e.preventDefault();
				}
				e.returnValue = false;
			},

			captureTarget: function captureTarget(target) {
				// IE
				if (target.setCapture) {
					jsc._capturedTarget = target;
					jsc._capturedTarget.setCapture();
				}
			},

			releaseTarget: function releaseTarget() {
				// IE
				if (jsc._capturedTarget) {
					jsc._capturedTarget.releaseCapture();
					jsc._capturedTarget = null;
				}
			},

			fireEvent: function fireEvent(el, evnt) {
				if (!el) {
					return;
				}
				if (document.createEvent) {
					var ev = document.createEvent('HTMLEvents');
					ev.initEvent(evnt, true, true);
					el.dispatchEvent(ev);
				} else if (document.createEventObject) {
					var ev = document.createEventObject();
					el.fireEvent('on' + evnt, ev);
				} else if (el['on' + evnt]) {
					// alternatively use the traditional event model
					el['on' + evnt]();
				}
			},

			classNameToList: function classNameToList(className) {
				return className.replace(/^\s+|\s+$/g, '').split(/\s+/);
			},

			// The className parameter (str) can only contain a single class name
			hasClass: function hasClass(elm, className) {
				if (!className) {
					return false;
				}
				return -1 != (' ' + elm.className.replace(/\s+/g, ' ') + ' ').indexOf(' ' + className + ' ');
			},

			// The className parameter (str) can contain multiple class names separated by whitespace
			setClass: function setClass(elm, className) {
				var classList = jsc.classNameToList(className);
				for (var i = 0; i < classList.length; i += 1) {
					if (!jsc.hasClass(elm, classList[i])) {
						elm.className += (elm.className ? ' ' : '') + classList[i];
					}
				}
			},

			// The className parameter (str) can contain multiple class names separated by whitespace
			unsetClass: function unsetClass(elm, className) {
				var classList = jsc.classNameToList(className);
				for (var i = 0; i < classList.length; i += 1) {
					var repl = new RegExp('^\\s*' + classList[i] + '\\s*|' + '\\s*' + classList[i] + '\\s*$|' + '\\s+' + classList[i] + '(\\s+)', 'g');
					elm.className = elm.className.replace(repl, '$1');
				}
			},

			getStyle: function getStyle(elm) {
				return window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle;
			},

			setStyle: function () {
				var helper = document.createElement('div');
				var getSupportedProp = function getSupportedProp(names) {
					for (var i = 0; i < names.length; i += 1) {
						if (names[i] in helper.style) {
							return names[i];
						}
					}
				};
				var props = {
					borderRadius: getSupportedProp(['borderRadius', 'MozBorderRadius', 'webkitBorderRadius']),
					boxShadow: getSupportedProp(['boxShadow', 'MozBoxShadow', 'webkitBoxShadow'])
				};
				return function (elm, prop, value) {
					switch (prop.toLowerCase()) {
						case 'opacity':
							var alphaOpacity = Math.round(parseFloat(value) * 100);
							elm.style.opacity = value;
							elm.style.filter = 'alpha(opacity=' + alphaOpacity + ')';
							break;
						default:
							elm.style[props[prop]] = value;
							break;
					}
				};
			}(),

			setBorderRadius: function setBorderRadius(elm, value) {
				jsc.setStyle(elm, 'borderRadius', value || '0');
			},

			setBoxShadow: function setBoxShadow(elm, value) {
				jsc.setStyle(elm, 'boxShadow', value || 'none');
			},

			getElementPos: function getElementPos(e, relativeToViewport) {
				var x = 0,
				    y = 0;
				var rect = e.getBoundingClientRect();
				x = rect.left;
				y = rect.top;
				if (!relativeToViewport) {
					var viewPos = jsc.getViewPos();
					x += viewPos[0];
					y += viewPos[1];
				}
				return [x, y];
			},

			getElementSize: function getElementSize(e) {
				return [e.offsetWidth, e.offsetHeight];
			},

			// get pointer's X/Y coordinates relative to viewport
			getAbsPointerPos: function getAbsPointerPos(e) {
				if (!e) {
					e = window.event;
				}
				var x = 0,
				    y = 0;
				if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
					// touch devices
					x = e.changedTouches[0].clientX;
					y = e.changedTouches[0].clientY;
				} else if (typeof e.clientX === 'number') {
					x = e.clientX;
					y = e.clientY;
				}
				return { x: x, y: y };
			},

			// get pointer's X/Y coordinates relative to target element
			getRelPointerPos: function getRelPointerPos(e) {
				if (!e) {
					e = window.event;
				}
				var target = e.target || e.srcElement;
				var targetRect = target.getBoundingClientRect();

				var x = 0,
				    y = 0;

				var clientX = 0,
				    clientY = 0;
				if (typeof e.changedTouches !== 'undefined' && e.changedTouches.length) {
					// touch devices
					clientX = e.changedTouches[0].clientX;
					clientY = e.changedTouches[0].clientY;
				} else if (typeof e.clientX === 'number') {
					clientX = e.clientX;
					clientY = e.clientY;
				}

				x = clientX - targetRect.left;
				y = clientY - targetRect.top;
				return { x: x, y: y };
			},

			getViewPos: function getViewPos() {
				var doc = document.documentElement;
				return [(window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0), (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)];
			},

			getViewSize: function getViewSize() {
				var doc = document.documentElement;
				return [window.innerWidth || doc.clientWidth, window.innerHeight || doc.clientHeight];
			},

			redrawPosition: function redrawPosition() {

				if (jsc.picker && jsc.picker.owner) {
					var thisObj = jsc.picker.owner;

					var tp, vp;

					if (thisObj.fixed) {
						// Fixed elements are positioned relative to viewport,
						// therefore we can ignore the scroll offset
						tp = jsc.getElementPos(thisObj.targetElement, true); // target pos
						vp = [0, 0]; // view pos
					} else {
						tp = jsc.getElementPos(thisObj.targetElement); // target pos
						vp = jsc.getViewPos(); // view pos
					}

					var ts = jsc.getElementSize(thisObj.targetElement); // target size
					var vs = jsc.getViewSize(); // view size
					var ps = jsc.getPickerOuterDims(thisObj); // picker size
					var a, b, c;
					switch (thisObj.position.toLowerCase()) {
						case 'left':
							a = 1;b = 0;c = -1;break;
						case 'right':
							a = 1;b = 0;c = 1;break;
						case 'top':
							a = 0;b = 1;c = -1;break;
						default:
							a = 0;b = 1;c = 1;break;
					}
					var l = (ts[b] + ps[b]) / 2;

					// compute picker position
					if (!thisObj.smartPosition) {
						var pp = [tp[a], tp[b] + ts[b] - l + l * c];
					} else {
						var pp = [-vp[a] + tp[a] + ps[a] > vs[a] ? -vp[a] + tp[a] + ts[a] / 2 > vs[a] / 2 && tp[a] + ts[a] - ps[a] >= 0 ? tp[a] + ts[a] - ps[a] : tp[a] : tp[a], -vp[b] + tp[b] + ts[b] + ps[b] - l + l * c > vs[b] ? -vp[b] + tp[b] + ts[b] / 2 > vs[b] / 2 && tp[b] + ts[b] - l - l * c >= 0 ? tp[b] + ts[b] - l - l * c : tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l + l * c >= 0 ? tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l - l * c];
					}

					var x = pp[a];
					var y = pp[b];
					var positionValue = thisObj.fixed ? 'fixed' : 'absolute';
					var contractShadow = (pp[0] + ps[0] > tp[0] || pp[0] < tp[0] + ts[0]) && pp[1] + ps[1] < tp[1] + ts[1];

					jsc._drawPosition(thisObj, x, y, positionValue, contractShadow);
				}
			},

			_drawPosition: function _drawPosition(thisObj, x, y, positionValue, contractShadow) {
				var vShadow = contractShadow ? 0 : thisObj.shadowBlur; // px

				jsc.picker.wrap.style.position = positionValue;
				jsc.picker.wrap.style.left = x + 'px';
				jsc.picker.wrap.style.top = y + 'px';

				jsc.setBoxShadow(jsc.picker.boxS, thisObj.shadow ? new jsc.BoxShadow(0, vShadow, thisObj.shadowBlur, 0, thisObj.shadowColor) : null);
			},

			getPickerDims: function getPickerDims(thisObj) {
				var displaySlider = !!jsc.getSliderComponent(thisObj);
				var dims = [2 * thisObj.insetWidth + 2 * thisObj.padding + thisObj.width + (displaySlider ? 2 * thisObj.insetWidth + jsc.getPadToSliderPadding(thisObj) + thisObj.sliderSize : 0), 2 * thisObj.insetWidth + 2 * thisObj.padding + thisObj.height + (thisObj.closable ? 2 * thisObj.insetWidth + thisObj.padding + thisObj.buttonHeight : 0)];
				return dims;
			},

			getPickerOuterDims: function getPickerOuterDims(thisObj) {
				var dims = jsc.getPickerDims(thisObj);
				return [dims[0] + 2 * thisObj.borderWidth, dims[1] + 2 * thisObj.borderWidth];
			},

			getPadToSliderPadding: function getPadToSliderPadding(thisObj) {
				return Math.max(thisObj.padding, 1.5 * (2 * thisObj.pointerBorderWidth + thisObj.pointerThickness));
			},

			getPadYComponent: function getPadYComponent(thisObj) {
				switch (thisObj.mode.charAt(1).toLowerCase()) {
					case 'v':
						return 'v';break;
				}
				return 's';
			},

			getSliderComponent: function getSliderComponent(thisObj) {
				if (thisObj.mode.length > 2) {
					switch (thisObj.mode.charAt(2).toLowerCase()) {
						case 's':
							return 's';break;
						case 'v':
							return 'v';break;
					}
				}
				return null;
			},

			onDocumentMouseDown: function onDocumentMouseDown(e) {
				if (!e) {
					e = window.event;
				}
				var target = e.target || e.srcElement;

				if (target._jscLinkedInstance) {
					if (target._jscLinkedInstance.showOnClick) {
						target._jscLinkedInstance.show();
					}
				} else if (target._jscControlName) {
					jsc.onControlPointerStart(e, target, target._jscControlName, 'mouse');
				} else {
					// Mouse is outside the picker controls -> hide the color picker!
					if (jsc.picker && jsc.picker.owner) {
						jsc.picker.owner.hide();
					}
				}
			},

			onDocumentTouchStart: function onDocumentTouchStart(e) {
				if (!e) {
					e = window.event;
				}
				var target = e.target || e.srcElement;

				if (target._jscLinkedInstance) {
					if (target._jscLinkedInstance.showOnClick) {
						target._jscLinkedInstance.show();
					}
				} else if (target._jscControlName) {
					jsc.onControlPointerStart(e, target, target._jscControlName, 'touch');
				} else {
					if (jsc.picker && jsc.picker.owner) {
						jsc.picker.owner.hide();
					}
				}
			},

			onWindowResize: function onWindowResize(e) {
				jsc.redrawPosition();
			},

			onParentScroll: function onParentScroll(e) {
				// hide the picker when one of the parent elements is scrolled
				if (jsc.picker && jsc.picker.owner) {
					jsc.picker.owner.hide();
				}
			},

			_pointerMoveEvent: {
				mouse: 'mousemove',
				touch: 'touchmove'
			},
			_pointerEndEvent: {
				mouse: 'mouseup',
				touch: 'touchend'
			},

			_pointerOrigin: null,
			_capturedTarget: null,

			onControlPointerStart: function onControlPointerStart(e, target, controlName, pointerType) {
				var thisObj = target._jscInstance;

				jsc.preventDefault(e);
				jsc.captureTarget(target);

				var registerDragEvents = function registerDragEvents(doc, offset) {
					jsc.attachGroupEvent('drag', doc, jsc._pointerMoveEvent[pointerType], jsc.onDocumentPointerMove(e, target, controlName, pointerType, offset));
					jsc.attachGroupEvent('drag', doc, jsc._pointerEndEvent[pointerType], jsc.onDocumentPointerEnd(e, target, controlName, pointerType));
				};

				registerDragEvents(document, [0, 0]);

				if (window.parent && window.frameElement) {
					var rect = window.frameElement.getBoundingClientRect();
					var ofs = [-rect.left, -rect.top];
					registerDragEvents(window.parent.window.document, ofs);
				}

				var abs = jsc.getAbsPointerPos(e);
				var rel = jsc.getRelPointerPos(e);
				jsc._pointerOrigin = {
					x: abs.x - rel.x,
					y: abs.y - rel.y
				};

				switch (controlName) {
					case 'pad':
						// if the slider is at the bottom, move it up
						switch (jsc.getSliderComponent(thisObj)) {
							case 's':
								if (thisObj.hsv[1] === 0) {
									thisObj.fromHSV(null, 100, null);
								};break;
							case 'v':
								if (thisObj.hsv[2] === 0) {
									thisObj.fromHSV(null, null, 100);
								};break;
						}
						jsc.setPad(thisObj, e, 0, 0);
						break;

					case 'sld':
						jsc.setSld(thisObj, e, 0);
						break;
				}

				jsc.dispatchFineChange(thisObj);
			},

			onDocumentPointerMove: function onDocumentPointerMove(e, target, controlName, pointerType, offset) {
				return function (e) {
					var thisObj = target._jscInstance;
					switch (controlName) {
						case 'pad':
							if (!e) {
								e = window.event;
							}
							jsc.setPad(thisObj, e, offset[0], offset[1]);
							jsc.dispatchFineChange(thisObj);
							break;

						case 'sld':
							if (!e) {
								e = window.event;
							}
							jsc.setSld(thisObj, e, offset[1]);
							jsc.dispatchFineChange(thisObj);
							break;
					}
				};
			},

			onDocumentPointerEnd: function onDocumentPointerEnd(e, target, controlName, pointerType) {
				return function (e) {
					var thisObj = target._jscInstance;
					jsc.detachGroupEvents('drag');
					jsc.releaseTarget();
					// Always dispatch changes after detaching outstanding mouse handlers,
					// in case some user interaction will occur in user's onchange callback
					// that would intrude with current mouse events
					jsc.dispatchChange(thisObj);
				};
			},

			dispatchChange: function dispatchChange(thisObj) {
				if (thisObj.valueElement) {
					if (jsc.isElementType(thisObj.valueElement, 'input')) {
						jsc.fireEvent(thisObj.valueElement, 'change');
					}
				}
			},

			dispatchFineChange: function dispatchFineChange(thisObj) {
				if (thisObj.onFineChange) {
					var callback;
					if (typeof thisObj.onFineChange === 'string') {
						callback = new Function(thisObj.onFineChange);
					} else {
						callback = thisObj.onFineChange;
					}
					callback.call(thisObj);
				}
			},

			setPad: function setPad(thisObj, e, ofsX, ofsY) {
				var pointerAbs = jsc.getAbsPointerPos(e);
				var x = ofsX + pointerAbs.x - jsc._pointerOrigin.x - thisObj.padding - thisObj.insetWidth;
				var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.insetWidth;

				var xVal = x * (360 / (thisObj.width - 1));
				var yVal = 100 - y * (100 / (thisObj.height - 1));

				switch (jsc.getPadYComponent(thisObj)) {
					case 's':
						thisObj.fromHSV(xVal, yVal, null, jsc.leaveSld);break;
					case 'v':
						thisObj.fromHSV(xVal, null, yVal, jsc.leaveSld);break;
				}
			},

			setSld: function setSld(thisObj, e, ofsY) {
				var pointerAbs = jsc.getAbsPointerPos(e);
				var y = ofsY + pointerAbs.y - jsc._pointerOrigin.y - thisObj.padding - thisObj.insetWidth;

				var yVal = 100 - y * (100 / (thisObj.height - 1));

				switch (jsc.getSliderComponent(thisObj)) {
					case 's':
						thisObj.fromHSV(null, yVal, null, jsc.leavePad);break;
					case 'v':
						thisObj.fromHSV(null, null, yVal, jsc.leavePad);break;
				}
			},

			_vmlNS: 'jsc_vml_',
			_vmlCSS: 'jsc_vml_css_',
			_vmlReady: false,

			initVML: function initVML() {
				if (!jsc._vmlReady) {
					// init VML namespace
					var doc = document;
					if (!doc.namespaces[jsc._vmlNS]) {
						doc.namespaces.add(jsc._vmlNS, 'urn:schemas-microsoft-com:vml');
					}
					if (!doc.styleSheets[jsc._vmlCSS]) {
						var tags = ['shape', 'shapetype', 'group', 'background', 'path', 'formulas', 'handles', 'fill', 'stroke', 'shadow', 'textbox', 'textpath', 'imagedata', 'line', 'polyline', 'curve', 'rect', 'roundrect', 'oval', 'arc', 'image'];
						var ss = doc.createStyleSheet();
						ss.owningElement.id = jsc._vmlCSS;
						for (var i = 0; i < tags.length; i += 1) {
							ss.addRule(jsc._vmlNS + '\\:' + tags[i], 'behavior:url(#default#VML);');
						}
					}
					jsc._vmlReady = true;
				}
			},

			createPalette: function createPalette() {

				var paletteObj = {
					elm: null,
					draw: null
				};

				if (jsc.isCanvasSupported) {
					// Canvas implementation for modern browsers

					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');

					var drawFunc = function drawFunc(width, height, type) {
						canvas.width = width;
						canvas.height = height;

						ctx.clearRect(0, 0, canvas.width, canvas.height);

						var hGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
						hGrad.addColorStop(0 / 6, '#F00');
						hGrad.addColorStop(1 / 6, '#FF0');
						hGrad.addColorStop(2 / 6, '#0F0');
						hGrad.addColorStop(3 / 6, '#0FF');
						hGrad.addColorStop(4 / 6, '#00F');
						hGrad.addColorStop(5 / 6, '#F0F');
						hGrad.addColorStop(6 / 6, '#F00');

						ctx.fillStyle = hGrad;
						ctx.fillRect(0, 0, canvas.width, canvas.height);

						var vGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
						switch (type.toLowerCase()) {
							case 's':
								vGrad.addColorStop(0, 'rgba(255,255,255,0)');
								vGrad.addColorStop(1, 'rgba(255,255,255,1)');
								break;
							case 'v':
								vGrad.addColorStop(0, 'rgba(0,0,0,0)');
								vGrad.addColorStop(1, 'rgba(0,0,0,1)');
								break;
						}
						ctx.fillStyle = vGrad;
						ctx.fillRect(0, 0, canvas.width, canvas.height);
					};

					paletteObj.elm = canvas;
					paletteObj.draw = drawFunc;
				} else {
					// VML fallback for IE 7 and 8

					jsc.initVML();

					var vmlContainer = document.createElement('div');
					vmlContainer.style.position = 'relative';
					vmlContainer.style.overflow = 'hidden';

					var hGrad = document.createElement(jsc._vmlNS + ':fill');
					hGrad.type = 'gradient';
					hGrad.method = 'linear';
					hGrad.angle = '90';
					hGrad.colors = '16.67% #F0F, 33.33% #00F, 50% #0FF, 66.67% #0F0, 83.33% #FF0';

					var hRect = document.createElement(jsc._vmlNS + ':rect');
					hRect.style.position = 'absolute';
					hRect.style.left = -1 + 'px';
					hRect.style.top = -1 + 'px';
					hRect.stroked = false;
					hRect.appendChild(hGrad);
					vmlContainer.appendChild(hRect);

					var vGrad = document.createElement(jsc._vmlNS + ':fill');
					vGrad.type = 'gradient';
					vGrad.method = 'linear';
					vGrad.angle = '180';
					vGrad.opacity = '0';

					var vRect = document.createElement(jsc._vmlNS + ':rect');
					vRect.style.position = 'absolute';
					vRect.style.left = -1 + 'px';
					vRect.style.top = -1 + 'px';
					vRect.stroked = false;
					vRect.appendChild(vGrad);
					vmlContainer.appendChild(vRect);

					var drawFunc = function drawFunc(width, height, type) {
						vmlContainer.style.width = width + 'px';
						vmlContainer.style.height = height + 'px';

						hRect.style.width = vRect.style.width = width + 1 + 'px';
						hRect.style.height = vRect.style.height = height + 1 + 'px';

						// Colors must be specified during every redraw, otherwise IE won't display
						// a full gradient during a subsequential redraw
						hGrad.color = '#F00';
						hGrad.color2 = '#F00';

						switch (type.toLowerCase()) {
							case 's':
								vGrad.color = vGrad.color2 = '#FFF';
								break;
							case 'v':
								vGrad.color = vGrad.color2 = '#000';
								break;
						}
					};

					paletteObj.elm = vmlContainer;
					paletteObj.draw = drawFunc;
				}

				return paletteObj;
			},

			createSliderGradient: function createSliderGradient() {

				var sliderObj = {
					elm: null,
					draw: null
				};

				if (jsc.isCanvasSupported) {
					// Canvas implementation for modern browsers

					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');

					var drawFunc = function drawFunc(width, height, color1, color2) {
						canvas.width = width;
						canvas.height = height;

						ctx.clearRect(0, 0, canvas.width, canvas.height);

						var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
						grad.addColorStop(0, color1);
						grad.addColorStop(1, color2);

						ctx.fillStyle = grad;
						ctx.fillRect(0, 0, canvas.width, canvas.height);
					};

					sliderObj.elm = canvas;
					sliderObj.draw = drawFunc;
				} else {
					// VML fallback for IE 7 and 8

					jsc.initVML();

					var vmlContainer = document.createElement('div');
					vmlContainer.style.position = 'relative';
					vmlContainer.style.overflow = 'hidden';

					var grad = document.createElement(jsc._vmlNS + ':fill');
					grad.type = 'gradient';
					grad.method = 'linear';
					grad.angle = '180';

					var rect = document.createElement(jsc._vmlNS + ':rect');
					rect.style.position = 'absolute';
					rect.style.left = -1 + 'px';
					rect.style.top = -1 + 'px';
					rect.stroked = false;
					rect.appendChild(grad);
					vmlContainer.appendChild(rect);

					var drawFunc = function drawFunc(width, height, color1, color2) {
						vmlContainer.style.width = width + 'px';
						vmlContainer.style.height = height + 'px';

						rect.style.width = width + 1 + 'px';
						rect.style.height = height + 1 + 'px';

						grad.color = color1;
						grad.color2 = color2;
					};

					sliderObj.elm = vmlContainer;
					sliderObj.draw = drawFunc;
				}

				return sliderObj;
			},

			leaveValue: 1 << 0,
			leaveStyle: 1 << 1,
			leavePad: 1 << 2,
			leaveSld: 1 << 3,

			BoxShadow: function () {
				var BoxShadow = function BoxShadow(hShadow, vShadow, blur, spread, color, inset) {
					this.hShadow = hShadow;
					this.vShadow = vShadow;
					this.blur = blur;
					this.spread = spread;
					this.color = color;
					this.inset = !!inset;
				};

				BoxShadow.prototype.toString = function () {
					var vals = [Math.round(this.hShadow) + 'px', Math.round(this.vShadow) + 'px', Math.round(this.blur) + 'px', Math.round(this.spread) + 'px', this.color];
					if (this.inset) {
						vals.push('inset');
					}
					return vals.join(' ');
				};

				return BoxShadow;
			}(),

			//
			// Usage:
			// var myColor = new jscolor(<targetElement> [, <options>])
			//

			jscolor: function jscolor(targetElement, options) {

				// General options
				//
				this.value = null; // initial HEX color. To change it later, use methods fromString(), fromHSV() and fromRGB()
				this.valueElement = targetElement; // element that will be used to display and input the color code
				this.styleElement = targetElement; // element that will preview the picked color using CSS backgroundColor
				this.required = true; // whether the associated text <input> can be left empty
				this.refine = true; // whether to refine the entered color code (e.g. uppercase it and remove whitespace)
				this.hash = false; // whether to prefix the HEX color code with # symbol
				this.uppercase = true; // whether to show the color code in upper case
				this.onFineChange = null; // called instantly every time the color changes (value can be either a function or a string with javascript code)
				this.activeClass = 'jscolor-active'; // class to be set to the target element when a picker window is open on it
				this.overwriteImportant = false; // whether to overwrite colors of styleElement using !important
				this.minS = 0; // min allowed saturation (0 - 100)
				this.maxS = 100; // max allowed saturation (0 - 100)
				this.minV = 0; // min allowed value (brightness) (0 - 100)
				this.maxV = 100; // max allowed value (brightness) (0 - 100)

				// Accessing the picked color
				//
				this.hsv = [0, 0, 100]; // read-only  [0-360, 0-100, 0-100]
				this.rgb = [255, 255, 255]; // read-only  [0-255, 0-255, 0-255]

				// Color Picker options
				//
				this.width = 181; // width of color palette (in px)
				this.height = 101; // height of color palette (in px)
				this.showOnClick = true; // whether to display the color picker when user clicks on its target element
				this.mode = 'HSV'; // HSV | HVS | HS | HV - layout of the color picker controls
				this.position = 'bottom'; // left | right | top | bottom - position relative to the target element
				this.smartPosition = true; // automatically change picker position when there is not enough space for it
				this.sliderSize = 16; // px
				this.crossSize = 8; // px
				this.closable = false; // whether to display the Close button
				this.closeText = 'Close';
				this.buttonColor = '#000000'; // CSS color
				this.buttonHeight = 18; // px
				this.padding = 12; // px
				this.backgroundColor = '#FFFFFF'; // CSS color
				this.borderWidth = 1; // px
				this.borderColor = '#BBBBBB'; // CSS color
				this.borderRadius = 8; // px
				this.insetWidth = 1; // px
				this.insetColor = '#BBBBBB'; // CSS color
				this.shadow = true; // whether to display shadow
				this.shadowBlur = 15; // px
				this.shadowColor = 'rgba(0,0,0,0.2)'; // CSS color
				this.pointerColor = '#4C4C4C'; // px
				this.pointerBorderColor = '#FFFFFF'; // px
				this.pointerBorderWidth = 1; // px
				this.pointerThickness = 2; // px
				this.zIndex = 1000;
				this.container = null; // where to append the color picker (BODY element by default)


				for (var opt in options) {
					if (options.hasOwnProperty(opt)) {
						this[opt] = options[opt];
					}
				}

				this.hide = function () {
					if (isPickerOwner()) {
						detachPicker();
					}
				};

				this.show = function () {
					drawPicker();
				};

				this.redraw = function () {
					if (isPickerOwner()) {
						drawPicker();
					}
				};

				this.importColor = function () {
					if (!this.valueElement) {
						this.exportColor();
					} else {
						if (jsc.isElementType(this.valueElement, 'input')) {
							if (!this.refine) {
								if (!this.fromString(this.valueElement.value, jsc.leaveValue)) {
									if (this.styleElement) {
										this.styleElement.style.backgroundImage = this.styleElement._jscOrigStyle.backgroundImage;
										this.styleElement.style.backgroundColor = this.styleElement._jscOrigStyle.backgroundColor;
										this.styleElement.style.color = this.styleElement._jscOrigStyle.color;
									}
									this.exportColor(jsc.leaveValue | jsc.leaveStyle);
								}
							} else if (!this.required && /^\s*$/.test(this.valueElement.value)) {
								this.valueElement.value = '';
								if (this.styleElement) {
									this.styleElement.style.backgroundImage = this.styleElement._jscOrigStyle.backgroundImage;
									this.styleElement.style.backgroundColor = this.styleElement._jscOrigStyle.backgroundColor;
									this.styleElement.style.color = this.styleElement._jscOrigStyle.color;
								}
								this.exportColor(jsc.leaveValue | jsc.leaveStyle);
							} else if (this.fromString(this.valueElement.value)) {
								// managed to import color successfully from the value -> OK, don't do anything
							} else {
								this.exportColor();
							}
						} else {
							// not an input element -> doesn't have any value
							this.exportColor();
						}
					}
				};

				this.exportColor = function (flags) {
					if (!(flags & jsc.leaveValue) && this.valueElement) {
						var value = this.toString();
						if (this.uppercase) {
							value = value.toUpperCase();
						}
						if (this.hash) {
							value = '#' + value;
						}

						if (jsc.isElementType(this.valueElement, 'input')) {
							this.valueElement.value = value;
						} else {
							this.valueElement.innerHTML = value;
						}
					}
					if (!(flags & jsc.leaveStyle)) {
						if (this.styleElement) {
							var bgColor = '#' + this.toString();
							var fgColor = this.isLight() ? '#000' : '#FFF';

							this.styleElement.style.backgroundImage = 'none';
							this.styleElement.style.backgroundColor = bgColor;
							this.styleElement.style.color = fgColor;

							if (this.overwriteImportant) {
								this.styleElement.setAttribute('style', 'background: ' + bgColor + ' !important; ' + 'color: ' + fgColor + ' !important;');
							}
						}
					}
					if (!(flags & jsc.leavePad) && isPickerOwner()) {
						redrawPad();
					}
					if (!(flags & jsc.leaveSld) && isPickerOwner()) {
						redrawSld();
					}
				};

				// h: 0-360
				// s: 0-100
				// v: 0-100
				//
				this.fromHSV = function (h, s, v, flags) {
					// null = don't change
					if (h !== null) {
						if (isNaN(h)) {
							return false;
						}
						h = Math.max(0, Math.min(360, h));
					}
					if (s !== null) {
						if (isNaN(s)) {
							return false;
						}
						s = Math.max(0, Math.min(100, this.maxS, s), this.minS);
					}
					if (v !== null) {
						if (isNaN(v)) {
							return false;
						}
						v = Math.max(0, Math.min(100, this.maxV, v), this.minV);
					}

					this.rgb = HSV_RGB(h === null ? this.hsv[0] : this.hsv[0] = h, s === null ? this.hsv[1] : this.hsv[1] = s, v === null ? this.hsv[2] : this.hsv[2] = v);

					this.exportColor(flags);
				};

				// r: 0-255
				// g: 0-255
				// b: 0-255
				//
				this.fromRGB = function (r, g, b, flags) {
					// null = don't change
					if (r !== null) {
						if (isNaN(r)) {
							return false;
						}
						r = Math.max(0, Math.min(255, r));
					}
					if (g !== null) {
						if (isNaN(g)) {
							return false;
						}
						g = Math.max(0, Math.min(255, g));
					}
					if (b !== null) {
						if (isNaN(b)) {
							return false;
						}
						b = Math.max(0, Math.min(255, b));
					}

					var hsv = RGB_HSV(r === null ? this.rgb[0] : r, g === null ? this.rgb[1] : g, b === null ? this.rgb[2] : b);
					if (hsv[0] !== null) {
						this.hsv[0] = Math.max(0, Math.min(360, hsv[0]));
					}
					if (hsv[2] !== 0) {
						this.hsv[1] = hsv[1] === null ? null : Math.max(0, this.minS, Math.min(100, this.maxS, hsv[1]));
					}
					this.hsv[2] = hsv[2] === null ? null : Math.max(0, this.minV, Math.min(100, this.maxV, hsv[2]));

					// update RGB according to final HSV, as some values might be trimmed
					var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
					this.rgb[0] = rgb[0];
					this.rgb[1] = rgb[1];
					this.rgb[2] = rgb[2];

					this.exportColor(flags);
				};

				this.fromString = function (str, flags) {
					var m;
					if (m = str.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i)) {
						// HEX notation
						//

						if (m[1].length === 6) {
							// 6-char notation
							this.fromRGB(parseInt(m[1].substr(0, 2), 16), parseInt(m[1].substr(2, 2), 16), parseInt(m[1].substr(4, 2), 16), flags);
						} else {
							// 3-char notation
							this.fromRGB(parseInt(m[1].charAt(0) + m[1].charAt(0), 16), parseInt(m[1].charAt(1) + m[1].charAt(1), 16), parseInt(m[1].charAt(2) + m[1].charAt(2), 16), flags);
						}
						return true;
					} else if (m = str.match(/^\W*rgba?\(([^)]*)\)\W*$/i)) {
						var params = m[1].split(',');
						var re = /^\s*(\d*)(\.\d+)?\s*$/;
						var mR, mG, mB;
						if (params.length >= 3 && (mR = params[0].match(re)) && (mG = params[1].match(re)) && (mB = params[2].match(re))) {
							var r = parseFloat((mR[1] || '0') + (mR[2] || ''));
							var g = parseFloat((mG[1] || '0') + (mG[2] || ''));
							var b = parseFloat((mB[1] || '0') + (mB[2] || ''));
							this.fromRGB(r, g, b, flags);
							return true;
						}
					}
					return false;
				};

				this.toString = function () {
					return (0x100 | Math.round(this.rgb[0])).toString(16).substr(1) + (0x100 | Math.round(this.rgb[1])).toString(16).substr(1) + (0x100 | Math.round(this.rgb[2])).toString(16).substr(1);
				};

				this.toHEXString = function () {
					return '#' + this.toString().toUpperCase();
				};

				this.toRGBString = function () {
					return 'rgb(' + Math.round(this.rgb[0]) + ',' + Math.round(this.rgb[1]) + ',' + Math.round(this.rgb[2]) + ')';
				};

				this.isLight = function () {
					return 0.213 * this.rgb[0] + 0.715 * this.rgb[1] + 0.072 * this.rgb[2] > 255 / 2;
				};

				this._processParentElementsInDOM = function () {
					if (this._linkedElementsProcessed) {
						return;
					}
					this._linkedElementsProcessed = true;

					var elm = this.targetElement;
					do {
						// If the target element or one of its parent nodes has fixed position,
						// then use fixed positioning instead
						//
						// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
						// that's why we need to check if the returned style object is non-empty
						var currStyle = jsc.getStyle(elm);
						if (currStyle && currStyle.position.toLowerCase() === 'fixed') {
							this.fixed = true;
						}

						if (elm !== this.targetElement) {
							// Ensure to attach onParentScroll only once to each parent element
							// (multiple targetElements can share the same parent nodes)
							//
							// Note: It's not just offsetParents that can be scrollable,
							// that's why we loop through all parent nodes
							if (!elm._jscEventsAttached) {
								jsc.attachEvent(elm, 'scroll', jsc.onParentScroll);
								elm._jscEventsAttached = true;
							}
						}
					} while ((elm = elm.parentNode) && !jsc.isElementType(elm, 'body'));
				};

				// r: 0-255
				// g: 0-255
				// b: 0-255
				//
				// returns: [ 0-360, 0-100, 0-100 ]
				//
				function RGB_HSV(r, g, b) {
					r /= 255;
					g /= 255;
					b /= 255;
					var n = Math.min(Math.min(r, g), b);
					var v = Math.max(Math.max(r, g), b);
					var m = v - n;
					if (m === 0) {
						return [null, 0, 100 * v];
					}
					var h = r === n ? 3 + (b - g) / m : g === n ? 5 + (r - b) / m : 1 + (g - r) / m;
					return [60 * (h === 6 ? 0 : h), 100 * (m / v), 100 * v];
				}

				// h: 0-360
				// s: 0-100
				// v: 0-100
				//
				// returns: [ 0-255, 0-255, 0-255 ]
				//
				function HSV_RGB(h, s, v) {
					var u = 255 * (v / 100);

					if (h === null) {
						return [u, u, u];
					}

					h /= 60;
					s /= 100;

					var i = Math.floor(h);
					var f = i % 2 ? h - i : 1 - (h - i);
					var m = u * (1 - s);
					var n = u * (1 - s * f);
					switch (i) {
						case 6:
						case 0:
							return [u, n, m];
						case 1:
							return [n, u, m];
						case 2:
							return [m, u, n];
						case 3:
							return [m, n, u];
						case 4:
							return [n, m, u];
						case 5:
							return [u, m, n];
					}
				}

				function detachPicker() {
					jsc.unsetClass(THIS.targetElement, THIS.activeClass);
					jsc.picker.wrap.parentNode.removeChild(jsc.picker.wrap);
					delete jsc.picker.owner;
				}

				function drawPicker() {

					// At this point, when drawing the picker, we know what the parent elements are
					// and we can do all related DOM operations, such as registering events on them
					// or checking their positioning
					THIS._processParentElementsInDOM();

					if (!jsc.picker) {
						jsc.picker = {
							owner: null,
							wrap: document.createElement('div'),
							box: document.createElement('div'),
							boxS: document.createElement('div'), // shadow area
							boxB: document.createElement('div'), // border
							pad: document.createElement('div'),
							padB: document.createElement('div'), // border
							padM: document.createElement('div'), // mouse/touch area
							padPal: jsc.createPalette(),
							cross: document.createElement('div'),
							crossBY: document.createElement('div'), // border Y
							crossBX: document.createElement('div'), // border X
							crossLY: document.createElement('div'), // line Y
							crossLX: document.createElement('div'), // line X
							sld: document.createElement('div'),
							sldB: document.createElement('div'), // border
							sldM: document.createElement('div'), // mouse/touch area
							sldGrad: jsc.createSliderGradient(),
							sldPtrS: document.createElement('div'), // slider pointer spacer
							sldPtrIB: document.createElement('div'), // slider pointer inner border
							sldPtrMB: document.createElement('div'), // slider pointer middle border
							sldPtrOB: document.createElement('div'), // slider pointer outer border
							btn: document.createElement('div'),
							btnT: document.createElement('span') // text
						};

						jsc.picker.pad.appendChild(jsc.picker.padPal.elm);
						jsc.picker.padB.appendChild(jsc.picker.pad);
						jsc.picker.cross.appendChild(jsc.picker.crossBY);
						jsc.picker.cross.appendChild(jsc.picker.crossBX);
						jsc.picker.cross.appendChild(jsc.picker.crossLY);
						jsc.picker.cross.appendChild(jsc.picker.crossLX);
						jsc.picker.padB.appendChild(jsc.picker.cross);
						jsc.picker.box.appendChild(jsc.picker.padB);
						jsc.picker.box.appendChild(jsc.picker.padM);

						jsc.picker.sld.appendChild(jsc.picker.sldGrad.elm);
						jsc.picker.sldB.appendChild(jsc.picker.sld);
						jsc.picker.sldB.appendChild(jsc.picker.sldPtrOB);
						jsc.picker.sldPtrOB.appendChild(jsc.picker.sldPtrMB);
						jsc.picker.sldPtrMB.appendChild(jsc.picker.sldPtrIB);
						jsc.picker.sldPtrIB.appendChild(jsc.picker.sldPtrS);
						jsc.picker.box.appendChild(jsc.picker.sldB);
						jsc.picker.box.appendChild(jsc.picker.sldM);

						jsc.picker.btn.appendChild(jsc.picker.btnT);
						jsc.picker.box.appendChild(jsc.picker.btn);

						jsc.picker.boxB.appendChild(jsc.picker.box);
						jsc.picker.wrap.appendChild(jsc.picker.boxS);
						jsc.picker.wrap.appendChild(jsc.picker.boxB);
					}

					var p = jsc.picker;

					var displaySlider = !!jsc.getSliderComponent(THIS);
					var dims = jsc.getPickerDims(THIS);
					var crossOuterSize = 2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize;
					var padToSliderPadding = jsc.getPadToSliderPadding(THIS);
					var borderRadius = Math.min(THIS.borderRadius, Math.round(THIS.padding * Math.PI)); // px
					var padCursor = 'crosshair';

					// wrap
					p.wrap.style.clear = 'both';
					p.wrap.style.width = dims[0] + 2 * THIS.borderWidth + 'px';
					p.wrap.style.height = dims[1] + 2 * THIS.borderWidth + 'px';
					p.wrap.style.zIndex = THIS.zIndex;

					// picker
					p.box.style.width = dims[0] + 'px';
					p.box.style.height = dims[1] + 'px';

					p.boxS.style.position = 'absolute';
					p.boxS.style.left = '0';
					p.boxS.style.top = '0';
					p.boxS.style.width = '100%';
					p.boxS.style.height = '100%';
					jsc.setBorderRadius(p.boxS, borderRadius + 'px');

					// picker border
					p.boxB.style.position = 'relative';
					p.boxB.style.border = THIS.borderWidth + 'px solid';
					p.boxB.style.borderColor = THIS.borderColor;
					p.boxB.style.background = THIS.backgroundColor;
					jsc.setBorderRadius(p.boxB, borderRadius + 'px');

					// IE hack:
					// If the element is transparent, IE will trigger the event on the elements under it,
					// e.g. on Canvas or on elements with border
					p.padM.style.background = p.sldM.style.background = '#FFF';
					jsc.setStyle(p.padM, 'opacity', '0');
					jsc.setStyle(p.sldM, 'opacity', '0');

					// pad
					p.pad.style.position = 'relative';
					p.pad.style.width = THIS.width + 'px';
					p.pad.style.height = THIS.height + 'px';

					// pad palettes (HSV and HVS)
					p.padPal.draw(THIS.width, THIS.height, jsc.getPadYComponent(THIS));

					// pad border
					p.padB.style.position = 'absolute';
					p.padB.style.left = THIS.padding + 'px';
					p.padB.style.top = THIS.padding + 'px';
					p.padB.style.border = THIS.insetWidth + 'px solid';
					p.padB.style.borderColor = THIS.insetColor;

					// pad mouse area
					p.padM._jscInstance = THIS;
					p.padM._jscControlName = 'pad';
					p.padM.style.position = 'absolute';
					p.padM.style.left = '0';
					p.padM.style.top = '0';
					p.padM.style.width = THIS.padding + 2 * THIS.insetWidth + THIS.width + padToSliderPadding / 2 + 'px';
					p.padM.style.height = dims[1] + 'px';
					p.padM.style.cursor = padCursor;

					// pad cross
					p.cross.style.position = 'absolute';
					p.cross.style.left = p.cross.style.top = '0';
					p.cross.style.width = p.cross.style.height = crossOuterSize + 'px';

					// pad cross border Y and X
					p.crossBY.style.position = p.crossBX.style.position = 'absolute';
					p.crossBY.style.background = p.crossBX.style.background = THIS.pointerBorderColor;
					p.crossBY.style.width = p.crossBX.style.height = 2 * THIS.pointerBorderWidth + THIS.pointerThickness + 'px';
					p.crossBY.style.height = p.crossBX.style.width = crossOuterSize + 'px';
					p.crossBY.style.left = p.crossBX.style.top = Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2) - THIS.pointerBorderWidth + 'px';
					p.crossBY.style.top = p.crossBX.style.left = '0';

					// pad cross line Y and X
					p.crossLY.style.position = p.crossLX.style.position = 'absolute';
					p.crossLY.style.background = p.crossLX.style.background = THIS.pointerColor;
					p.crossLY.style.height = p.crossLX.style.width = crossOuterSize - 2 * THIS.pointerBorderWidth + 'px';
					p.crossLY.style.width = p.crossLX.style.height = THIS.pointerThickness + 'px';
					p.crossLY.style.left = p.crossLX.style.top = Math.floor(crossOuterSize / 2) - Math.floor(THIS.pointerThickness / 2) + 'px';
					p.crossLY.style.top = p.crossLX.style.left = THIS.pointerBorderWidth + 'px';

					// slider
					p.sld.style.overflow = 'hidden';
					p.sld.style.width = THIS.sliderSize + 'px';
					p.sld.style.height = THIS.height + 'px';

					// slider gradient
					p.sldGrad.draw(THIS.sliderSize, THIS.height, '#000', '#000');

					// slider border
					p.sldB.style.display = displaySlider ? 'block' : 'none';
					p.sldB.style.position = 'absolute';
					p.sldB.style.right = THIS.padding + 'px';
					p.sldB.style.top = THIS.padding + 'px';
					p.sldB.style.border = THIS.insetWidth + 'px solid';
					p.sldB.style.borderColor = THIS.insetColor;

					// slider mouse area
					p.sldM._jscInstance = THIS;
					p.sldM._jscControlName = 'sld';
					p.sldM.style.display = displaySlider ? 'block' : 'none';
					p.sldM.style.position = 'absolute';
					p.sldM.style.right = '0';
					p.sldM.style.top = '0';
					p.sldM.style.width = THIS.sliderSize + padToSliderPadding / 2 + THIS.padding + 2 * THIS.insetWidth + 'px';
					p.sldM.style.height = dims[1] + 'px';
					p.sldM.style.cursor = 'default';

					// slider pointer inner and outer border
					p.sldPtrIB.style.border = p.sldPtrOB.style.border = THIS.pointerBorderWidth + 'px solid ' + THIS.pointerBorderColor;

					// slider pointer outer border
					p.sldPtrOB.style.position = 'absolute';
					p.sldPtrOB.style.left = -(2 * THIS.pointerBorderWidth + THIS.pointerThickness) + 'px';
					p.sldPtrOB.style.top = '0';

					// slider pointer middle border
					p.sldPtrMB.style.border = THIS.pointerThickness + 'px solid ' + THIS.pointerColor;

					// slider pointer spacer
					p.sldPtrS.style.width = THIS.sliderSize + 'px';
					p.sldPtrS.style.height = sliderPtrSpace + 'px';

					// the Close button
					function setBtnBorder() {
						var insetColors = THIS.insetColor.split(/\s+/);
						var outsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
						p.btn.style.borderColor = outsetColor;
					}
					p.btn.style.display = THIS.closable ? 'block' : 'none';
					p.btn.style.position = 'absolute';
					p.btn.style.left = THIS.padding + 'px';
					p.btn.style.bottom = THIS.padding + 'px';
					p.btn.style.padding = '0 15px';
					p.btn.style.height = THIS.buttonHeight + 'px';
					p.btn.style.border = THIS.insetWidth + 'px solid';
					setBtnBorder();
					p.btn.style.color = THIS.buttonColor;
					p.btn.style.font = '12px sans-serif';
					p.btn.style.textAlign = 'center';
					try {
						p.btn.style.cursor = 'pointer';
					} catch (eOldIE) {
						p.btn.style.cursor = 'hand';
					}
					p.btn.onmousedown = function () {
						THIS.hide();
					};
					p.btnT.style.lineHeight = THIS.buttonHeight + 'px';
					p.btnT.innerHTML = '';
					p.btnT.appendChild(document.createTextNode(THIS.closeText));

					// place pointers
					redrawPad();
					redrawSld();

					// If we are changing the owner without first closing the picker,
					// make sure to first deal with the old owner
					if (jsc.picker.owner && jsc.picker.owner !== THIS) {
						jsc.unsetClass(jsc.picker.owner.targetElement, THIS.activeClass);
					}

					// Set the new picker owner
					jsc.picker.owner = THIS;

					// The redrawPosition() method needs picker.owner to be set, that's why we call it here,
					// after setting the owner
					if (jsc.isElementType(container, 'body')) {
						jsc.redrawPosition();
					} else {
						jsc._drawPosition(THIS, 0, 0, 'relative', false);
					}

					if (p.wrap.parentNode != container) {
						container.appendChild(p.wrap);
					}

					jsc.setClass(THIS.targetElement, THIS.activeClass);
				}

				function redrawPad() {
					// redraw the pad pointer
					switch (jsc.getPadYComponent(THIS)) {
						case 's':
							var yComponent = 1;break;
						case 'v':
							var yComponent = 2;break;
					}
					var x = Math.round(THIS.hsv[0] / 360 * (THIS.width - 1));
					var y = Math.round((1 - THIS.hsv[yComponent] / 100) * (THIS.height - 1));
					var crossOuterSize = 2 * THIS.pointerBorderWidth + THIS.pointerThickness + 2 * THIS.crossSize;
					var ofs = -Math.floor(crossOuterSize / 2);
					jsc.picker.cross.style.left = x + ofs + 'px';
					jsc.picker.cross.style.top = y + ofs + 'px';

					// redraw the slider
					switch (jsc.getSliderComponent(THIS)) {
						case 's':
							var rgb1 = HSV_RGB(THIS.hsv[0], 100, THIS.hsv[2]);
							var rgb2 = HSV_RGB(THIS.hsv[0], 0, THIS.hsv[2]);
							var color1 = 'rgb(' + Math.round(rgb1[0]) + ',' + Math.round(rgb1[1]) + ',' + Math.round(rgb1[2]) + ')';
							var color2 = 'rgb(' + Math.round(rgb2[0]) + ',' + Math.round(rgb2[1]) + ',' + Math.round(rgb2[2]) + ')';
							jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
							break;
						case 'v':
							var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 100);
							var color1 = 'rgb(' + Math.round(rgb[0]) + ',' + Math.round(rgb[1]) + ',' + Math.round(rgb[2]) + ')';
							var color2 = '#000';
							jsc.picker.sldGrad.draw(THIS.sliderSize, THIS.height, color1, color2);
							break;
					}
				}

				function redrawSld() {
					var sldComponent = jsc.getSliderComponent(THIS);
					if (sldComponent) {
						// redraw the slider pointer
						switch (sldComponent) {
							case 's':
								var yComponent = 1;break;
							case 'v':
								var yComponent = 2;break;
						}
						var y = Math.round((1 - THIS.hsv[yComponent] / 100) * (THIS.height - 1));
						jsc.picker.sldPtrOB.style.top = y - (2 * THIS.pointerBorderWidth + THIS.pointerThickness) - Math.floor(sliderPtrSpace / 2) + 'px';
					}
				}

				function isPickerOwner() {
					return jsc.picker && jsc.picker.owner === THIS;
				}

				function blurValue() {
					THIS.importColor();
				}

				// Find the target element
				if (typeof targetElement === 'string') {
					var id = targetElement;
					var elm = document.getElementById(id);
					if (elm) {
						this.targetElement = elm;
					} else {
						jsc.warn('Could not find target element with ID \'' + id + '\'');
					}
				} else if (targetElement) {
					this.targetElement = targetElement;
				} else {
					jsc.warn('Invalid target element: \'' + targetElement + '\'');
				}

				if (this.targetElement._jscLinkedInstance) {
					jsc.warn('Cannot link jscolor twice to the same element. Skipping.');
					return;
				}
				this.targetElement._jscLinkedInstance = this;

				// Find the value element
				this.valueElement = jsc.fetchElement(this.valueElement);
				// Find the style element
				this.styleElement = jsc.fetchElement(this.styleElement);

				var THIS = this;
				var container = this.container ? jsc.fetchElement(this.container) : document.getElementsByTagName('body')[0];
				var sliderPtrSpace = 3; // px

				// For BUTTON elements it's important to stop them from sending the form when clicked
				// (e.g. in Safari)
				if (jsc.isElementType(this.targetElement, 'button')) {
					if (this.targetElement.onclick) {
						var origCallback = this.targetElement.onclick;
						this.targetElement.onclick = function (evt) {
							origCallback.call(this, evt);
							return false;
						};
					} else {
						this.targetElement.onclick = function () {
							return false;
						};
					}
				}

				/*
    var elm = this.targetElement;
    do {
    	// If the target element or one of its offsetParents has fixed position,
    	// then use fixed positioning instead
    	//
    	// Note: In Firefox, getComputedStyle returns null in a hidden iframe,
    	// that's why we need to check if the returned style object is non-empty
    	var currStyle = jsc.getStyle(elm);
    	if (currStyle && currStyle.position.toLowerCase() === 'fixed') {
    		this.fixed = true;
    	}
    			if (elm !== this.targetElement) {
    		// attach onParentScroll so that we can recompute the picker position
    		// when one of the offsetParents is scrolled
    		if (!elm._jscEventsAttached) {
    			jsc.attachEvent(elm, 'scroll', jsc.onParentScroll);
    			elm._jscEventsAttached = true;
    		}
    	}
    } while ((elm = elm.offsetParent) && !jsc.isElementType(elm, 'body'));
    */

				// valueElement
				if (this.valueElement) {
					if (jsc.isElementType(this.valueElement, 'input')) {
						var updateField = function updateField() {
							THIS.fromString(THIS.valueElement.value, jsc.leaveValue);
							jsc.dispatchFineChange(THIS);
						};
						jsc.attachEvent(this.valueElement, 'keyup', updateField);
						jsc.attachEvent(this.valueElement, 'input', updateField);
						jsc.attachEvent(this.valueElement, 'blur', blurValue);
						this.valueElement.setAttribute('autocomplete', 'off');
					}
				}

				// styleElement
				if (this.styleElement) {
					this.styleElement._jscOrigStyle = {
						backgroundImage: this.styleElement.style.backgroundImage,
						backgroundColor: this.styleElement.style.backgroundColor,
						color: this.styleElement.style.color
					};
				}

				if (this.value) {
					// Try to set the color from the .value option and if unsuccessful,
					// export the current color
					this.fromString(this.value) || this.exportColor();
				} else {
					this.importColor();
				}
			}

		};

		//================================
		// Public properties and methods
		//================================


		// By default, search for all elements with class="jscolor" and install a color picker on them.
		//
		// You can change what class name will be looked for by setting the property jscolor.lookupClass
		// anywhere in your HTML document. To completely disable the automatic lookup, set it to null.
		//
		jsc.jscolor.lookupClass = 'jscolor';

		jsc.jscolor.installByClassName = function (className) {
			var inputElms = document.getElementsByTagName('input');
			var buttonElms = document.getElementsByTagName('button');

			jsc.tryInstallOnElements(inputElms, className);
			jsc.tryInstallOnElements(buttonElms, className);
		};

		jsc.register();

		return jsc.jscolor;
	}();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzY29sb3IuanMiXSwibmFtZXMiOlsid2luZG93IiwianNjb2xvciIsImpzYyIsInJlZ2lzdGVyIiwiYXR0YWNoRE9NUmVhZHlFdmVudCIsImluaXQiLCJhdHRhY2hFdmVudCIsImRvY3VtZW50Iiwib25Eb2N1bWVudE1vdXNlRG93biIsIm9uRG9jdW1lbnRUb3VjaFN0YXJ0Iiwib25XaW5kb3dSZXNpemUiLCJsb29rdXBDbGFzcyIsImluc3RhbGxCeUNsYXNzTmFtZSIsInRyeUluc3RhbGxPbkVsZW1lbnRzIiwiZWxtcyIsImNsYXNzTmFtZSIsIm1hdGNoQ2xhc3MiLCJSZWdFeHAiLCJpIiwibGVuZ3RoIiwidHlwZSIsInVuZGVmaW5lZCIsInRvTG93ZXJDYXNlIiwiaXNDb2xvckF0dHJTdXBwb3J0ZWQiLCJtIiwibWF0Y2giLCJ0YXJnZXRFbG0iLCJvcHRzU3RyIiwiZGF0YU9wdGlvbnMiLCJnZXREYXRhQXR0ciIsIm9wdHMiLCJGdW5jdGlvbiIsImVQYXJzZUVycm9yIiwid2FybiIsImVsbSIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJpc0NhbnZhc1N1cHBvcnRlZCIsImdldENvbnRleHQiLCJmZXRjaEVsZW1lbnQiLCJtaXhlZCIsImdldEVsZW1lbnRCeUlkIiwiaXNFbGVtZW50VHlwZSIsIm5vZGVOYW1lIiwiZWwiLCJuYW1lIiwiYXR0ck5hbWUiLCJhdHRyVmFsdWUiLCJnZXRBdHRyaWJ1dGUiLCJldm50IiwiZnVuYyIsImFkZEV2ZW50TGlzdGVuZXIiLCJkZXRhY2hFdmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJfYXR0YWNoZWRHcm91cEV2ZW50cyIsImF0dGFjaEdyb3VwRXZlbnQiLCJncm91cE5hbWUiLCJoYXNPd25Qcm9wZXJ0eSIsInB1c2giLCJkZXRhY2hHcm91cEV2ZW50cyIsImV2dCIsImZpcmVkIiwiZmlyZU9uY2UiLCJyZWFkeVN0YXRlIiwic2V0VGltZW91dCIsImFyZ3VtZW50cyIsImNhbGxlZSIsImRvY3VtZW50RWxlbWVudCIsImRvU2Nyb2xsIiwidG9wIiwidHJ5U2Nyb2xsIiwiYm9keSIsImUiLCJtc2ciLCJjb25zb2xlIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsImNhcHR1cmVUYXJnZXQiLCJ0YXJnZXQiLCJzZXRDYXB0dXJlIiwiX2NhcHR1cmVkVGFyZ2V0IiwicmVsZWFzZVRhcmdldCIsInJlbGVhc2VDYXB0dXJlIiwiZmlyZUV2ZW50IiwiY3JlYXRlRXZlbnQiLCJldiIsImluaXRFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJjcmVhdGVFdmVudE9iamVjdCIsImNsYXNzTmFtZVRvTGlzdCIsInJlcGxhY2UiLCJzcGxpdCIsImhhc0NsYXNzIiwiaW5kZXhPZiIsInNldENsYXNzIiwiY2xhc3NMaXN0IiwidW5zZXRDbGFzcyIsInJlcGwiLCJnZXRTdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJjdXJyZW50U3R5bGUiLCJzZXRTdHlsZSIsImhlbHBlciIsImdldFN1cHBvcnRlZFByb3AiLCJuYW1lcyIsInN0eWxlIiwicHJvcHMiLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJwcm9wIiwidmFsdWUiLCJhbHBoYU9wYWNpdHkiLCJNYXRoIiwicm91bmQiLCJwYXJzZUZsb2F0Iiwib3BhY2l0eSIsImZpbHRlciIsInNldEJvcmRlclJhZGl1cyIsInNldEJveFNoYWRvdyIsImdldEVsZW1lbnRQb3MiLCJyZWxhdGl2ZVRvVmlld3BvcnQiLCJ4IiwieSIsInJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJsZWZ0Iiwidmlld1BvcyIsImdldFZpZXdQb3MiLCJnZXRFbGVtZW50U2l6ZSIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0IiwiZ2V0QWJzUG9pbnRlclBvcyIsImV2ZW50IiwiY2hhbmdlZFRvdWNoZXMiLCJjbGllbnRYIiwiY2xpZW50WSIsImdldFJlbFBvaW50ZXJQb3MiLCJzcmNFbGVtZW50IiwidGFyZ2V0UmVjdCIsImRvYyIsInBhZ2VYT2Zmc2V0Iiwic2Nyb2xsTGVmdCIsImNsaWVudExlZnQiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsImNsaWVudFRvcCIsImdldFZpZXdTaXplIiwiaW5uZXJXaWR0aCIsImNsaWVudFdpZHRoIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJyZWRyYXdQb3NpdGlvbiIsInBpY2tlciIsIm93bmVyIiwidGhpc09iaiIsInRwIiwidnAiLCJmaXhlZCIsInRhcmdldEVsZW1lbnQiLCJ0cyIsInZzIiwicHMiLCJnZXRQaWNrZXJPdXRlckRpbXMiLCJhIiwiYiIsImMiLCJwb3NpdGlvbiIsImwiLCJzbWFydFBvc2l0aW9uIiwicHAiLCJwb3NpdGlvblZhbHVlIiwiY29udHJhY3RTaGFkb3ciLCJfZHJhd1Bvc2l0aW9uIiwidlNoYWRvdyIsInNoYWRvd0JsdXIiLCJ3cmFwIiwiYm94UyIsInNoYWRvdyIsIkJveFNoYWRvdyIsInNoYWRvd0NvbG9yIiwiZ2V0UGlja2VyRGltcyIsImRpc3BsYXlTbGlkZXIiLCJnZXRTbGlkZXJDb21wb25lbnQiLCJkaW1zIiwiaW5zZXRXaWR0aCIsInBhZGRpbmciLCJ3aWR0aCIsImdldFBhZFRvU2xpZGVyUGFkZGluZyIsInNsaWRlclNpemUiLCJoZWlnaHQiLCJjbG9zYWJsZSIsImJ1dHRvbkhlaWdodCIsImJvcmRlcldpZHRoIiwibWF4IiwicG9pbnRlckJvcmRlcldpZHRoIiwicG9pbnRlclRoaWNrbmVzcyIsImdldFBhZFlDb21wb25lbnQiLCJtb2RlIiwiY2hhckF0IiwiX2pzY0xpbmtlZEluc3RhbmNlIiwic2hvd09uQ2xpY2siLCJzaG93IiwiX2pzY0NvbnRyb2xOYW1lIiwib25Db250cm9sUG9pbnRlclN0YXJ0IiwiaGlkZSIsIm9uUGFyZW50U2Nyb2xsIiwiX3BvaW50ZXJNb3ZlRXZlbnQiLCJtb3VzZSIsInRvdWNoIiwiX3BvaW50ZXJFbmRFdmVudCIsIl9wb2ludGVyT3JpZ2luIiwiY29udHJvbE5hbWUiLCJwb2ludGVyVHlwZSIsIl9qc2NJbnN0YW5jZSIsInJlZ2lzdGVyRHJhZ0V2ZW50cyIsIm9mZnNldCIsIm9uRG9jdW1lbnRQb2ludGVyTW92ZSIsIm9uRG9jdW1lbnRQb2ludGVyRW5kIiwicGFyZW50IiwiZnJhbWVFbGVtZW50Iiwib2ZzIiwiYWJzIiwicmVsIiwiaHN2IiwiZnJvbUhTViIsInNldFBhZCIsInNldFNsZCIsImRpc3BhdGNoRmluZUNoYW5nZSIsImRpc3BhdGNoQ2hhbmdlIiwidmFsdWVFbGVtZW50Iiwib25GaW5lQ2hhbmdlIiwiY2FsbGJhY2siLCJjYWxsIiwib2ZzWCIsIm9mc1kiLCJwb2ludGVyQWJzIiwieFZhbCIsInlWYWwiLCJsZWF2ZVNsZCIsImxlYXZlUGFkIiwiX3ZtbE5TIiwiX3ZtbENTUyIsIl92bWxSZWFkeSIsImluaXRWTUwiLCJuYW1lc3BhY2VzIiwiYWRkIiwic3R5bGVTaGVldHMiLCJ0YWdzIiwic3MiLCJjcmVhdGVTdHlsZVNoZWV0Iiwib3duaW5nRWxlbWVudCIsImlkIiwiYWRkUnVsZSIsImNyZWF0ZVBhbGV0dGUiLCJwYWxldHRlT2JqIiwiZHJhdyIsImNhbnZhcyIsImN0eCIsImRyYXdGdW5jIiwiY2xlYXJSZWN0IiwiaEdyYWQiLCJjcmVhdGVMaW5lYXJHcmFkaWVudCIsImFkZENvbG9yU3RvcCIsImZpbGxTdHlsZSIsImZpbGxSZWN0IiwidkdyYWQiLCJ2bWxDb250YWluZXIiLCJvdmVyZmxvdyIsIm1ldGhvZCIsImFuZ2xlIiwiY29sb3JzIiwiaFJlY3QiLCJzdHJva2VkIiwiYXBwZW5kQ2hpbGQiLCJ2UmVjdCIsImNvbG9yIiwiY29sb3IyIiwiY3JlYXRlU2xpZGVyR3JhZGllbnQiLCJzbGlkZXJPYmoiLCJjb2xvcjEiLCJncmFkIiwibGVhdmVWYWx1ZSIsImxlYXZlU3R5bGUiLCJoU2hhZG93IiwiYmx1ciIsInNwcmVhZCIsImluc2V0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJ2YWxzIiwiam9pbiIsIm9wdGlvbnMiLCJzdHlsZUVsZW1lbnQiLCJyZXF1aXJlZCIsInJlZmluZSIsImhhc2giLCJ1cHBlcmNhc2UiLCJhY3RpdmVDbGFzcyIsIm92ZXJ3cml0ZUltcG9ydGFudCIsIm1pblMiLCJtYXhTIiwibWluViIsIm1heFYiLCJyZ2IiLCJjcm9zc1NpemUiLCJjbG9zZVRleHQiLCJidXR0b25Db2xvciIsImJhY2tncm91bmRDb2xvciIsImJvcmRlckNvbG9yIiwiaW5zZXRDb2xvciIsInBvaW50ZXJDb2xvciIsInBvaW50ZXJCb3JkZXJDb2xvciIsInpJbmRleCIsImNvbnRhaW5lciIsIm9wdCIsImlzUGlja2VyT3duZXIiLCJkZXRhY2hQaWNrZXIiLCJkcmF3UGlja2VyIiwicmVkcmF3IiwiaW1wb3J0Q29sb3IiLCJleHBvcnRDb2xvciIsImZyb21TdHJpbmciLCJiYWNrZ3JvdW5kSW1hZ2UiLCJfanNjT3JpZ1N0eWxlIiwidGVzdCIsImZsYWdzIiwidG9VcHBlckNhc2UiLCJpbm5lckhUTUwiLCJiZ0NvbG9yIiwiZmdDb2xvciIsImlzTGlnaHQiLCJyZWRyYXdQYWQiLCJyZWRyYXdTbGQiLCJoIiwicyIsInYiLCJpc05hTiIsIm1pbiIsIkhTVl9SR0IiLCJmcm9tUkdCIiwiciIsImciLCJSR0JfSFNWIiwic3RyIiwicGFyc2VJbnQiLCJzdWJzdHIiLCJwYXJhbXMiLCJyZSIsIm1SIiwibUciLCJtQiIsInRvSEVYU3RyaW5nIiwidG9SR0JTdHJpbmciLCJfcHJvY2Vzc1BhcmVudEVsZW1lbnRzSW5ET00iLCJfbGlua2VkRWxlbWVudHNQcm9jZXNzZWQiLCJjdXJyU3R5bGUiLCJfanNjRXZlbnRzQXR0YWNoZWQiLCJwYXJlbnROb2RlIiwibiIsInUiLCJmbG9vciIsImYiLCJUSElTIiwicmVtb3ZlQ2hpbGQiLCJib3giLCJib3hCIiwicGFkIiwicGFkQiIsInBhZE0iLCJwYWRQYWwiLCJjcm9zcyIsImNyb3NzQlkiLCJjcm9zc0JYIiwiY3Jvc3NMWSIsImNyb3NzTFgiLCJzbGQiLCJzbGRCIiwic2xkTSIsInNsZEdyYWQiLCJzbGRQdHJTIiwic2xkUHRySUIiLCJzbGRQdHJNQiIsInNsZFB0ck9CIiwiYnRuIiwiYnRuVCIsInAiLCJjcm9zc091dGVyU2l6ZSIsInBhZFRvU2xpZGVyUGFkZGluZyIsIlBJIiwicGFkQ3Vyc29yIiwiY2xlYXIiLCJib3JkZXIiLCJiYWNrZ3JvdW5kIiwiY3Vyc29yIiwiZGlzcGxheSIsInJpZ2h0Iiwic2xpZGVyUHRyU3BhY2UiLCJzZXRCdG5Cb3JkZXIiLCJpbnNldENvbG9ycyIsIm91dHNldENvbG9yIiwiYm90dG9tIiwiZm9udCIsInRleHRBbGlnbiIsImVPbGRJRSIsIm9ubW91c2Vkb3duIiwibGluZUhlaWdodCIsImNyZWF0ZVRleHROb2RlIiwieUNvbXBvbmVudCIsInJnYjEiLCJyZ2IyIiwic2xkQ29tcG9uZW50IiwiYmx1clZhbHVlIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJvbmNsaWNrIiwib3JpZ0NhbGxiYWNrIiwidXBkYXRlRmllbGQiLCJpbnB1dEVsbXMiLCJidXR0b25FbG1zIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7O0FBYUE7O0FBR0EsSUFBSSxDQUFDQSxPQUFPQyxPQUFaLEVBQXFCO0FBQUVELFFBQU9DLE9BQVAsR0FBa0IsWUFBWTs7QUFHckQsTUFBSUMsTUFBTTs7QUFHVEMsYUFBVyxvQkFBWTtBQUN0QkQsUUFBSUUsbUJBQUosQ0FBd0JGLElBQUlHLElBQTVCO0FBQ0FILFFBQUlJLFdBQUosQ0FBZ0JDLFFBQWhCLEVBQTBCLFdBQTFCLEVBQXVDTCxJQUFJTSxtQkFBM0M7QUFDQU4sUUFBSUksV0FBSixDQUFnQkMsUUFBaEIsRUFBMEIsWUFBMUIsRUFBd0NMLElBQUlPLG9CQUE1QztBQUNBUCxRQUFJSSxXQUFKLENBQWdCTixNQUFoQixFQUF3QixRQUF4QixFQUFrQ0UsSUFBSVEsY0FBdEM7QUFDQSxJQVJROztBQVdUTCxTQUFPLGdCQUFZO0FBQ2xCLFFBQUlILElBQUlELE9BQUosQ0FBWVUsV0FBaEIsRUFBNkI7QUFDNUJULFNBQUlELE9BQUosQ0FBWVcsa0JBQVosQ0FBK0JWLElBQUlELE9BQUosQ0FBWVUsV0FBM0M7QUFDQTtBQUNELElB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LENBQWtCM0wsS0FBbEIsQ0FBd0J5TixlQURUO0FBRWpDZix1QkFBa0IsS0FBS2YsWUFBTCxDQUFrQjNMLEtBQWxCLENBQXdCME0sZUFGVDtBQUdqQ2hDLGFBQVEsS0FBS2lCLFlBQUwsQ0FBa0IzTCxLQUFsQixDQUF3QjBLO0FBSEMsTUFBbEM7QUFLQTs7QUFFRCxRQUFJLEtBQUtySyxLQUFULEVBQWdCO0FBQ2Y7QUFDQTtBQUNBLFVBQUttTixVQUFMLENBQWdCLEtBQUtuTixLQUFyQixLQUErQixLQUFLa04sV0FBTCxFQUEvQjtBQUNBLEtBSkQsTUFJTztBQUNOLFVBQUtELFdBQUw7QUFDQTtBQUNEOztBQTF3RFEsR0FBVjs7QUErd0RBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBN1QsTUFBSUQsT0FBSixDQUFZVSxXQUFaLEdBQTBCLFNBQTFCOztBQUdBVCxNQUFJRCxPQUFKLENBQVlXLGtCQUFaLEdBQWlDLFVBQVVHLFNBQVYsRUFBcUI7QUFDckQsT0FBSWlaLFlBQVl6WixTQUFTcVosb0JBQVQsQ0FBOEIsT0FBOUIsQ0FBaEI7QUFDQSxPQUFJSyxhQUFhMVosU0FBU3FaLG9CQUFULENBQThCLFFBQTlCLENBQWpCOztBQUVBMVosT0FBSVcsb0JBQUosQ0FBeUJtWixTQUF6QixFQUFvQ2paLFNBQXBDO0FBQ0FiLE9BQUlXLG9CQUFKLENBQXlCb1osVUFBekIsRUFBcUNsWixTQUFyQztBQUNBLEdBTkQ7O0FBU0FiLE1BQUlDLFFBQUo7O0FBR0EsU0FBT0QsSUFBSUQsT0FBWDtBQUdDLEVBOXlEdUMsRUFBakI7QUE4eURoQiIsImZpbGUiOiJqc2NvbG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGpzY29sb3IgLSBKYXZhU2NyaXB0IENvbG9yIFBpY2tlclxyXG4gKlxyXG4gKiBAbGluayAgICBodHRwOi8vanNjb2xvci5jb21cclxuICogQGxpY2Vuc2UgRm9yIG9wZW4gc291cmNlIHVzZTogR1BMdjNcclxuICogICAgICAgICAgRm9yIGNvbW1lcmNpYWwgdXNlOiBKU0NvbG9yIENvbW1lcmNpYWwgTGljZW5zZVxyXG4gKiBAYXV0aG9yICBKYW4gT2R2YXJrb1xyXG4gKiBAdmVyc2lvbiAyLjAuNVxyXG4gKlxyXG4gKiBTZWUgdXNhZ2UgZXhhbXBsZXMgYXQgaHR0cDovL2pzY29sb3IuY29tL2V4YW1wbGVzL1xyXG4gKi9cclxuXHJcblxyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcblxyXG5pZiAoIXdpbmRvdy5qc2NvbG9yKSB7IHdpbmRvdy5qc2NvbG9yID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG52YXIganNjID0ge1xyXG5cclxuXHJcblx0cmVnaXN0ZXIgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRqc2MuYXR0YWNoRE9NUmVhZHlFdmVudChqc2MuaW5pdCk7XHJcblx0XHRqc2MuYXR0YWNoRXZlbnQoZG9jdW1lbnQsICdtb3VzZWRvd24nLCBqc2Mub25Eb2N1bWVudE1vdXNlRG93bik7XHJcblx0XHRqc2MuYXR0YWNoRXZlbnQoZG9jdW1lbnQsICd0b3VjaHN0YXJ0JywganNjLm9uRG9jdW1lbnRUb3VjaFN0YXJ0KTtcclxuXHRcdGpzYy5hdHRhY2hFdmVudCh3aW5kb3csICdyZXNpemUnLCBqc2Mub25XaW5kb3dSZXNpemUpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRpbml0IDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKGpzYy5qc2NvbG9yLmxvb2t1cENsYXNzKSB7XHJcblx0XHRcdGpzYy5qc2NvbG9yLmluc3RhbGxCeUNsYXNzTmFtZShqc2MuanNjb2xvci5sb29rdXBDbGFzcyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdHRyeUluc3RhbGxPbkVsZW1lbnRzIDogZnVuY3Rpb24gKGVsbXMsIGNsYXNzTmFtZSkge1xyXG5cdFx0dmFyIG1hdGNoQ2xhc3MgPSBuZXcgUmVnRXhwKCcoXnxcXFxccykoJyArIGNsYXNzTmFtZSArICcpKFxcXFxzKihcXFxce1tefV0qXFxcXH0pfFxcXFxzfCQpJywgJ2knKTtcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGVsbXMubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0aWYgKGVsbXNbaV0udHlwZSAhPT0gdW5kZWZpbmVkICYmIGVsbXNbaV0udHlwZS50b0xvd2VyQ2FzZSgpID09ICdjb2xvcicpIHtcclxuXHRcdFx0XHRpZiAoanNjLmlzQ29sb3JBdHRyU3VwcG9ydGVkKSB7XHJcblx0XHRcdFx0XHQvLyBza2lwIGlucHV0cyBvZiB0eXBlICdjb2xvcicgaWYgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyXHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIG07XHJcblx0XHRcdGlmICghZWxtc1tpXS5qc2NvbG9yICYmIGVsbXNbaV0uY2xhc3NOYW1lICYmIChtID0gZWxtc1tpXS5jbGFzc05hbWUubWF0Y2gobWF0Y2hDbGFzcykpKSB7XHJcblx0XHRcdFx0dmFyIHRhcmdldEVsbSA9IGVsbXNbaV07XHJcblx0XHRcdFx0dmFyIG9wdHNTdHIgPSBudWxsO1xyXG5cclxuXHRcdFx0XHR2YXIgZGF0YU9wdGlvbnMgPSBqc2MuZ2V0RGF0YUF0dHIodGFyZ2V0RWxtLCAnanNjb2xvcicpO1xyXG5cdFx0XHRcdGlmIChkYXRhT3B0aW9ucyAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0b3B0c1N0ciA9IGRhdGFPcHRpb25zO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobVs0XSkge1xyXG5cdFx0XHRcdFx0b3B0c1N0ciA9IG1bNF07XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgb3B0cyA9IHt9O1xyXG5cdFx0XHRcdGlmIChvcHRzU3RyKSB7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRvcHRzID0gKG5ldyBGdW5jdGlvbiAoJ3JldHVybiAoJyArIG9wdHNTdHIgKyAnKScpKSgpO1xyXG5cdFx0XHRcdFx0fSBjYXRjaChlUGFyc2VFcnJvcikge1xyXG5cdFx0XHRcdFx0XHRqc2Mud2FybignRXJyb3IgcGFyc2luZyBqc2NvbG9yIG9wdGlvbnM6ICcgKyBlUGFyc2VFcnJvciArICc6XFxuJyArIG9wdHNTdHIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0YXJnZXRFbG0uanNjb2xvciA9IG5ldyBqc2MuanNjb2xvcih0YXJnZXRFbG0sIG9wdHMpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdGlzQ29sb3JBdHRyU3VwcG9ydGVkIDogKGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBlbG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG5cdFx0aWYgKGVsbS5zZXRBdHRyaWJ1dGUpIHtcclxuXHRcdFx0ZWxtLnNldEF0dHJpYnV0ZSgndHlwZScsICdjb2xvcicpO1xyXG5cdFx0XHRpZiAoZWxtLnR5cGUudG9Mb3dlckNhc2UoKSA9PSAnY29sb3InKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9KSgpLFxyXG5cclxuXHJcblx0aXNDYW52YXNTdXBwb3J0ZWQgOiAoZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGVsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdFx0cmV0dXJuICEhKGVsbS5nZXRDb250ZXh0ICYmIGVsbS5nZXRDb250ZXh0KCcyZCcpKTtcclxuXHR9KSgpLFxyXG5cclxuXHJcblx0ZmV0Y2hFbGVtZW50IDogZnVuY3Rpb24gKG1peGVkKSB7XHJcblx0XHRyZXR1cm4gdHlwZW9mIG1peGVkID09PSAnc3RyaW5nJyA/IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG1peGVkKSA6IG1peGVkO1xyXG5cdH0sXHJcblxyXG5cclxuXHRpc0VsZW1lbnRUeXBlIDogZnVuY3Rpb24gKGVsbSwgdHlwZSkge1xyXG5cdFx0cmV0dXJuIGVsbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0eXBlLnRvTG93ZXJDYXNlKCk7XHJcblx0fSxcclxuXHJcblxyXG5cdGdldERhdGFBdHRyIDogZnVuY3Rpb24gKGVsLCBuYW1lKSB7XHJcblx0XHR2YXIgYXR0ck5hbWUgPSAnZGF0YS0nICsgbmFtZTtcclxuXHRcdHZhciBhdHRyVmFsdWUgPSBlbC5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xyXG5cdFx0aWYgKGF0dHJWYWx1ZSAhPT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gYXR0clZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fSxcclxuXHJcblxyXG5cdGF0dGFjaEV2ZW50IDogZnVuY3Rpb24gKGVsLCBldm50LCBmdW5jKSB7XHJcblx0XHRpZiAoZWwuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGV2bnQsIGZ1bmMsIGZhbHNlKTtcclxuXHRcdH0gZWxzZSBpZiAoZWwuYXR0YWNoRXZlbnQpIHtcclxuXHRcdFx0ZWwuYXR0YWNoRXZlbnQoJ29uJyArIGV2bnQsIGZ1bmMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRkZXRhY2hFdmVudCA6IGZ1bmN0aW9uIChlbCwgZXZudCwgZnVuYykge1xyXG5cdFx0aWYgKGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcclxuXHRcdFx0ZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldm50LCBmdW5jLCBmYWxzZSk7XHJcblx0XHR9IGVsc2UgaWYgKGVsLmRldGFjaEV2ZW50KSB7XHJcblx0XHRcdGVsLmRldGFjaEV2ZW50KCdvbicgKyBldm50LCBmdW5jKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0X2F0dGFjaGVkR3JvdXBFdmVudHMgOiB7fSxcclxuXHJcblxyXG5cdGF0dGFjaEdyb3VwRXZlbnQgOiBmdW5jdGlvbiAoZ3JvdXBOYW1lLCBlbCwgZXZudCwgZnVuYykge1xyXG5cdFx0aWYgKCFqc2MuX2F0dGFjaGVkR3JvdXBFdmVudHMuaGFzT3duUHJvcGVydHkoZ3JvdXBOYW1lKSkge1xyXG5cdFx0XHRqc2MuX2F0dGFjaGVkR3JvdXBFdmVudHNbZ3JvdXBOYW1lXSA9IFtdO1xyXG5cdFx0fVxyXG5cdFx0anNjLl9hdHRhY2hlZEdyb3VwRXZlbnRzW2dyb3VwTmFtZV0ucHVzaChbZWwsIGV2bnQsIGZ1bmNdKTtcclxuXHRcdGpzYy5hdHRhY2hFdmVudChlbCwgZXZudCwgZnVuYyk7XHJcblx0fSxcclxuXHJcblxyXG5cdGRldGFjaEdyb3VwRXZlbnRzIDogZnVuY3Rpb24gKGdyb3VwTmFtZSkge1xyXG5cdFx0aWYgKGpzYy5fYXR0YWNoZWRHcm91cEV2ZW50cy5oYXNPd25Qcm9wZXJ0eShncm91cE5hbWUpKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwganNjLl9hdHRhY2hlZEdyb3VwRXZlbnRzW2dyb3VwTmFtZV0ubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0XHR2YXIgZXZ0ID0ganNjLl9hdHRhY2hlZEdyb3VwRXZlbnRzW2dyb3VwTmFtZV1baV07XHJcblx0XHRcdFx0anNjLmRldGFjaEV2ZW50KGV2dFswXSwgZXZ0WzFdLCBldnRbMl0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGRlbGV0ZSBqc2MuX2F0dGFjaGVkR3JvdXBFdmVudHNbZ3JvdXBOYW1lXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0YXR0YWNoRE9NUmVhZHlFdmVudCA6IGZ1bmN0aW9uIChmdW5jKSB7XHJcblx0XHR2YXIgZmlyZWQgPSBmYWxzZTtcclxuXHRcdHZhciBmaXJlT25jZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCFmaXJlZCkge1xyXG5cdFx0XHRcdGZpcmVkID0gdHJ1ZTtcclxuXHRcdFx0XHRmdW5jKCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuXHRcdFx0c2V0VGltZW91dChmaXJlT25jZSwgMSk7IC8vIGFzeW5jXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZmlyZU9uY2UsIGZhbHNlKTtcclxuXHJcblx0XHRcdC8vIEZhbGxiYWNrXHJcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZmlyZU9uY2UsIGZhbHNlKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKGRvY3VtZW50LmF0dGFjaEV2ZW50KSB7XHJcblx0XHRcdC8vIElFXHJcblx0XHRcdGRvY3VtZW50LmF0dGFjaEV2ZW50KCdvbnJlYWR5c3RhdGVjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcclxuXHRcdFx0XHRcdGRvY3VtZW50LmRldGFjaEV2ZW50KCdvbnJlYWR5c3RhdGVjaGFuZ2UnLCBhcmd1bWVudHMuY2FsbGVlKTtcclxuXHRcdFx0XHRcdGZpcmVPbmNlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0Ly8gRmFsbGJhY2tcclxuXHRcdFx0d2luZG93LmF0dGFjaEV2ZW50KCdvbmxvYWQnLCBmaXJlT25jZSk7XHJcblxyXG5cdFx0XHQvLyBJRTcvOFxyXG5cdFx0XHRpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICYmIHdpbmRvdyA9PSB3aW5kb3cudG9wKSB7XHJcblx0XHRcdFx0dmFyIHRyeVNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGlmICghZG9jdW1lbnQuYm9keSkgeyByZXR1cm47IH1cclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCgnbGVmdCcpO1xyXG5cdFx0XHRcdFx0XHRmaXJlT25jZSgpO1xyXG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KHRyeVNjcm9sbCwgMSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHR0cnlTY3JvbGwoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHR3YXJuIDogZnVuY3Rpb24gKG1zZykge1xyXG5cdFx0aWYgKHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLndhcm4pIHtcclxuXHRcdFx0d2luZG93LmNvbnNvbGUud2Fybihtc2cpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRwcmV2ZW50RGVmYXVsdCA6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgeyBlLnByZXZlbnREZWZhdWx0KCk7IH1cclxuXHRcdGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHJcblx0Y2FwdHVyZVRhcmdldCA6IGZ1bmN0aW9uICh0YXJnZXQpIHtcclxuXHRcdC8vIElFXHJcblx0XHRpZiAodGFyZ2V0LnNldENhcHR1cmUpIHtcclxuXHRcdFx0anNjLl9jYXB0dXJlZFRhcmdldCA9IHRhcmdldDtcclxuXHRcdFx0anNjLl9jYXB0dXJlZFRhcmdldC5zZXRDYXB0dXJlKCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdHJlbGVhc2VUYXJnZXQgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHQvLyBJRVxyXG5cdFx0aWYgKGpzYy5fY2FwdHVyZWRUYXJnZXQpIHtcclxuXHRcdFx0anNjLl9jYXB0dXJlZFRhcmdldC5yZWxlYXNlQ2FwdHVyZSgpO1xyXG5cdFx0XHRqc2MuX2NhcHR1cmVkVGFyZ2V0ID0gbnVsbDtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0ZmlyZUV2ZW50IDogZnVuY3Rpb24gKGVsLCBldm50KSB7XHJcblx0XHRpZiAoIWVsKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCkge1xyXG5cdFx0XHR2YXIgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnSFRNTEV2ZW50cycpO1xyXG5cdFx0XHRldi5pbml0RXZlbnQoZXZudCwgdHJ1ZSwgdHJ1ZSk7XHJcblx0XHRcdGVsLmRpc3BhdGNoRXZlbnQoZXYpO1xyXG5cdFx0fSBlbHNlIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCkge1xyXG5cdFx0XHR2YXIgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xyXG5cdFx0XHRlbC5maXJlRXZlbnQoJ29uJyArIGV2bnQsIGV2KTtcclxuXHRcdH0gZWxzZSBpZiAoZWxbJ29uJyArIGV2bnRdKSB7IC8vIGFsdGVybmF0aXZlbHkgdXNlIHRoZSB0cmFkaXRpb25hbCBldmVudCBtb2RlbFxyXG5cdFx0XHRlbFsnb24nICsgZXZudF0oKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Y2xhc3NOYW1lVG9MaXN0IDogZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xyXG5cdFx0cmV0dXJuIGNsYXNzTmFtZS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJykuc3BsaXQoL1xccysvKTtcclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gVGhlIGNsYXNzTmFtZSBwYXJhbWV0ZXIgKHN0cikgY2FuIG9ubHkgY29udGFpbiBhIHNpbmdsZSBjbGFzcyBuYW1lXHJcblx0aGFzQ2xhc3MgOiBmdW5jdGlvbiAoZWxtLCBjbGFzc05hbWUpIHtcclxuXHRcdGlmICghY2xhc3NOYW1lKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtMSAhPSAoJyAnICsgZWxtLmNsYXNzTmFtZS5yZXBsYWNlKC9cXHMrL2csICcgJykgKyAnICcpLmluZGV4T2YoJyAnICsgY2xhc3NOYW1lICsgJyAnKTtcclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gVGhlIGNsYXNzTmFtZSBwYXJhbWV0ZXIgKHN0cikgY2FuIGNvbnRhaW4gbXVsdGlwbGUgY2xhc3MgbmFtZXMgc2VwYXJhdGVkIGJ5IHdoaXRlc3BhY2VcclxuXHRzZXRDbGFzcyA6IGZ1bmN0aW9uIChlbG0sIGNsYXNzTmFtZSkge1xyXG5cdFx0dmFyIGNsYXNzTGlzdCA9IGpzYy5jbGFzc05hbWVUb0xpc3QoY2xhc3NOYW1lKTtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XHJcblx0XHRcdGlmICghanNjLmhhc0NsYXNzKGVsbSwgY2xhc3NMaXN0W2ldKSkge1xyXG5cdFx0XHRcdGVsbS5jbGFzc05hbWUgKz0gKGVsbS5jbGFzc05hbWUgPyAnICcgOiAnJykgKyBjbGFzc0xpc3RbaV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Ly8gVGhlIGNsYXNzTmFtZSBwYXJhbWV0ZXIgKHN0cikgY2FuIGNvbnRhaW4gbXVsdGlwbGUgY2xhc3MgbmFtZXMgc2VwYXJhdGVkIGJ5IHdoaXRlc3BhY2VcclxuXHR1bnNldENsYXNzIDogZnVuY3Rpb24gKGVsbSwgY2xhc3NOYW1lKSB7XHJcblx0XHR2YXIgY2xhc3NMaXN0ID0ganNjLmNsYXNzTmFtZVRvTGlzdChjbGFzc05hbWUpO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc0xpc3QubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0dmFyIHJlcGwgPSBuZXcgUmVnRXhwKFxyXG5cdFx0XHRcdCdeXFxcXHMqJyArIGNsYXNzTGlzdFtpXSArICdcXFxccyp8JyArXHJcblx0XHRcdFx0J1xcXFxzKicgKyBjbGFzc0xpc3RbaV0gKyAnXFxcXHMqJHwnICtcclxuXHRcdFx0XHQnXFxcXHMrJyArIGNsYXNzTGlzdFtpXSArICcoXFxcXHMrKScsXHJcblx0XHRcdFx0J2cnXHJcblx0XHRcdCk7XHJcblx0XHRcdGVsbS5jbGFzc05hbWUgPSBlbG0uY2xhc3NOYW1lLnJlcGxhY2UocmVwbCwgJyQxJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdGdldFN0eWxlIDogZnVuY3Rpb24gKGVsbSkge1xyXG5cdFx0cmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxtKSA6IGVsbS5jdXJyZW50U3R5bGU7XHJcblx0fSxcclxuXHJcblxyXG5cdHNldFN0eWxlIDogKGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBoZWxwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdHZhciBnZXRTdXBwb3J0ZWRQcm9wID0gZnVuY3Rpb24gKG5hbWVzKSB7XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpICs9IDEpIHtcclxuXHRcdFx0XHRpZiAobmFtZXNbaV0gaW4gaGVscGVyLnN0eWxlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gbmFtZXNbaV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0dmFyIHByb3BzID0ge1xyXG5cdFx0XHRib3JkZXJSYWRpdXM6IGdldFN1cHBvcnRlZFByb3AoWydib3JkZXJSYWRpdXMnLCAnTW96Qm9yZGVyUmFkaXVzJywgJ3dlYmtpdEJvcmRlclJhZGl1cyddKSxcclxuXHRcdFx0Ym94U2hhZG93OiBnZXRTdXBwb3J0ZWRQcm9wKFsnYm94U2hhZG93JywgJ01vekJveFNoYWRvdycsICd3ZWJraXRCb3hTaGFkb3cnXSlcclxuXHRcdH07XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKGVsbSwgcHJvcCwgdmFsdWUpIHtcclxuXHRcdFx0c3dpdGNoIChwcm9wLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0Y2FzZSAnb3BhY2l0eSc6XHJcblx0XHRcdFx0dmFyIGFscGhhT3BhY2l0eSA9IE1hdGgucm91bmQocGFyc2VGbG9hdCh2YWx1ZSkgKiAxMDApO1xyXG5cdFx0XHRcdGVsbS5zdHlsZS5vcGFjaXR5ID0gdmFsdWU7XHJcblx0XHRcdFx0ZWxtLnN0eWxlLmZpbHRlciA9ICdhbHBoYShvcGFjaXR5PScgKyBhbHBoYU9wYWNpdHkgKyAnKSc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0ZWxtLnN0eWxlW3Byb3BzW3Byb3BdXSA9IHZhbHVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH0pKCksXHJcblxyXG5cclxuXHRzZXRCb3JkZXJSYWRpdXMgOiBmdW5jdGlvbiAoZWxtLCB2YWx1ZSkge1xyXG5cdFx0anNjLnNldFN0eWxlKGVsbSwgJ2JvcmRlclJhZGl1cycsIHZhbHVlIHx8ICcwJyk7XHJcblx0fSxcclxuXHJcblxyXG5cdHNldEJveFNoYWRvdyA6IGZ1bmN0aW9uIChlbG0sIHZhbHVlKSB7XHJcblx0XHRqc2Muc2V0U3R5bGUoZWxtLCAnYm94U2hhZG93JywgdmFsdWUgfHwgJ25vbmUnKTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0RWxlbWVudFBvcyA6IGZ1bmN0aW9uIChlLCByZWxhdGl2ZVRvVmlld3BvcnQpIHtcclxuXHRcdHZhciB4PTAsIHk9MDtcclxuXHRcdHZhciByZWN0ID0gZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdHggPSByZWN0LmxlZnQ7XHJcblx0XHR5ID0gcmVjdC50b3A7XHJcblx0XHRpZiAoIXJlbGF0aXZlVG9WaWV3cG9ydCkge1xyXG5cdFx0XHR2YXIgdmlld1BvcyA9IGpzYy5nZXRWaWV3UG9zKCk7XHJcblx0XHRcdHggKz0gdmlld1Bvc1swXTtcclxuXHRcdFx0eSArPSB2aWV3UG9zWzFdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIFt4LCB5XTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0RWxlbWVudFNpemUgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0cmV0dXJuIFtlLm9mZnNldFdpZHRoLCBlLm9mZnNldEhlaWdodF07XHJcblx0fSxcclxuXHJcblxyXG5cdC8vIGdldCBwb2ludGVyJ3MgWC9ZIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHZpZXdwb3J0XHJcblx0Z2V0QWJzUG9pbnRlclBvcyA6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoIWUpIHsgZSA9IHdpbmRvdy5ldmVudDsgfVxyXG5cdFx0dmFyIHggPSAwLCB5ID0gMDtcclxuXHRcdGlmICh0eXBlb2YgZS5jaGFuZ2VkVG91Y2hlcyAhPT0gJ3VuZGVmaW5lZCcgJiYgZS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGgpIHtcclxuXHRcdFx0Ly8gdG91Y2ggZGV2aWNlc1xyXG5cdFx0XHR4ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYO1xyXG5cdFx0XHR5ID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgZS5jbGllbnRYID09PSAnbnVtYmVyJykge1xyXG5cdFx0XHR4ID0gZS5jbGllbnRYO1xyXG5cdFx0XHR5ID0gZS5jbGllbnRZO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHsgeDogeCwgeTogeSB9O1xyXG5cdH0sXHJcblxyXG5cclxuXHQvLyBnZXQgcG9pbnRlcidzIFgvWSBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0YXJnZXQgZWxlbWVudFxyXG5cdGdldFJlbFBvaW50ZXJQb3MgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0aWYgKCFlKSB7IGUgPSB3aW5kb3cuZXZlbnQ7IH1cclxuXHRcdHZhciB0YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XHJcblx0XHR2YXIgdGFyZ2V0UmVjdCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcblx0XHR2YXIgeCA9IDAsIHkgPSAwO1xyXG5cclxuXHRcdHZhciBjbGllbnRYID0gMCwgY2xpZW50WSA9IDA7XHJcblx0XHRpZiAodHlwZW9mIGUuY2hhbmdlZFRvdWNoZXMgIT09ICd1bmRlZmluZWQnICYmIGUuY2hhbmdlZFRvdWNoZXMubGVuZ3RoKSB7XHJcblx0XHRcdC8vIHRvdWNoIGRldmljZXNcclxuXHRcdFx0Y2xpZW50WCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WDtcclxuXHRcdFx0Y2xpZW50WSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WTtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGUuY2xpZW50WCA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0Y2xpZW50WCA9IGUuY2xpZW50WDtcclxuXHRcdFx0Y2xpZW50WSA9IGUuY2xpZW50WTtcclxuXHRcdH1cclxuXHJcblx0XHR4ID0gY2xpZW50WCAtIHRhcmdldFJlY3QubGVmdDtcclxuXHRcdHkgPSBjbGllbnRZIC0gdGFyZ2V0UmVjdC50b3A7XHJcblx0XHRyZXR1cm4geyB4OiB4LCB5OiB5IH07XHJcblx0fSxcclxuXHJcblxyXG5cdGdldFZpZXdQb3MgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0KHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCkgLSAoZG9jLmNsaWVudExlZnQgfHwgMCksXHJcblx0XHRcdCh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKVxyXG5cdFx0XTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0Vmlld1NpemUgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cdFx0cmV0dXJuIFtcclxuXHRcdFx0KHdpbmRvdy5pbm5lcldpZHRoIHx8IGRvYy5jbGllbnRXaWR0aCksXHJcblx0XHRcdCh3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jLmNsaWVudEhlaWdodCksXHJcblx0XHRdO1xyXG5cdH0sXHJcblxyXG5cclxuXHRyZWRyYXdQb3NpdGlvbiA6IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRpZiAoanNjLnBpY2tlciAmJiBqc2MucGlja2VyLm93bmVyKSB7XHJcblx0XHRcdHZhciB0aGlzT2JqID0ganNjLnBpY2tlci5vd25lcjtcclxuXHJcblx0XHRcdHZhciB0cCwgdnA7XHJcblxyXG5cdFx0XHRpZiAodGhpc09iai5maXhlZCkge1xyXG5cdFx0XHRcdC8vIEZpeGVkIGVsZW1lbnRzIGFyZSBwb3NpdGlvbmVkIHJlbGF0aXZlIHRvIHZpZXdwb3J0LFxyXG5cdFx0XHRcdC8vIHRoZXJlZm9yZSB3ZSBjYW4gaWdub3JlIHRoZSBzY3JvbGwgb2Zmc2V0XHJcblx0XHRcdFx0dHAgPSBqc2MuZ2V0RWxlbWVudFBvcyh0aGlzT2JqLnRhcmdldEVsZW1lbnQsIHRydWUpOyAvLyB0YXJnZXQgcG9zXHJcblx0XHRcdFx0dnAgPSBbMCwgMF07IC8vIHZpZXcgcG9zXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dHAgPSBqc2MuZ2V0RWxlbWVudFBvcyh0aGlzT2JqLnRhcmdldEVsZW1lbnQpOyAvLyB0YXJnZXQgcG9zXHJcblx0XHRcdFx0dnAgPSBqc2MuZ2V0Vmlld1BvcygpOyAvLyB2aWV3IHBvc1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgdHMgPSBqc2MuZ2V0RWxlbWVudFNpemUodGhpc09iai50YXJnZXRFbGVtZW50KTsgLy8gdGFyZ2V0IHNpemVcclxuXHRcdFx0dmFyIHZzID0ganNjLmdldFZpZXdTaXplKCk7IC8vIHZpZXcgc2l6ZVxyXG5cdFx0XHR2YXIgcHMgPSBqc2MuZ2V0UGlja2VyT3V0ZXJEaW1zKHRoaXNPYmopOyAvLyBwaWNrZXIgc2l6ZVxyXG5cdFx0XHR2YXIgYSwgYiwgYztcclxuXHRcdFx0c3dpdGNoICh0aGlzT2JqLnBvc2l0aW9uLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0XHRjYXNlICdsZWZ0JzogYT0xOyBiPTA7IGM9LTE7IGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3JpZ2h0JzphPTE7IGI9MDsgYz0xOyBicmVhaztcclxuXHRcdFx0XHRjYXNlICd0b3AnOiAgYT0wOyBiPTE7IGM9LTE7IGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6ICAgICBhPTA7IGI9MTsgYz0xOyBicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgbCA9ICh0c1tiXStwc1tiXSkvMjtcclxuXHJcblx0XHRcdC8vIGNvbXB1dGUgcGlja2VyIHBvc2l0aW9uXHJcblx0XHRcdGlmICghdGhpc09iai5zbWFydFBvc2l0aW9uKSB7XHJcblx0XHRcdFx0dmFyIHBwID0gW1xyXG5cdFx0XHRcdFx0dHBbYV0sXHJcblx0XHRcdFx0XHR0cFtiXSt0c1tiXS1sK2wqY1xyXG5cdFx0XHRcdF07XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHBwID0gW1xyXG5cdFx0XHRcdFx0LXZwW2FdK3RwW2FdK3BzW2FdID4gdnNbYV0gP1xyXG5cdFx0XHRcdFx0XHQoLXZwW2FdK3RwW2FdK3RzW2FdLzIgPiB2c1thXS8yICYmIHRwW2FdK3RzW2FdLXBzW2FdID49IDAgPyB0cFthXSt0c1thXS1wc1thXSA6IHRwW2FdKSA6XHJcblx0XHRcdFx0XHRcdHRwW2FdLFxyXG5cdFx0XHRcdFx0LXZwW2JdK3RwW2JdK3RzW2JdK3BzW2JdLWwrbCpjID4gdnNbYl0gP1xyXG5cdFx0XHRcdFx0XHQoLXZwW2JdK3RwW2JdK3RzW2JdLzIgPiB2c1tiXS8yICYmIHRwW2JdK3RzW2JdLWwtbCpjID49IDAgPyB0cFtiXSt0c1tiXS1sLWwqYyA6IHRwW2JdK3RzW2JdLWwrbCpjKSA6XHJcblx0XHRcdFx0XHRcdCh0cFtiXSt0c1tiXS1sK2wqYyA+PSAwID8gdHBbYl0rdHNbYl0tbCtsKmMgOiB0cFtiXSt0c1tiXS1sLWwqYylcclxuXHRcdFx0XHRdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgeCA9IHBwW2FdO1xyXG5cdFx0XHR2YXIgeSA9IHBwW2JdO1xyXG5cdFx0XHR2YXIgcG9zaXRpb25WYWx1ZSA9IHRoaXNPYmouZml4ZWQgPyAnZml4ZWQnIDogJ2Fic29sdXRlJztcclxuXHRcdFx0dmFyIGNvbnRyYWN0U2hhZG93ID1cclxuXHRcdFx0XHQocHBbMF0gKyBwc1swXSA+IHRwWzBdIHx8IHBwWzBdIDwgdHBbMF0gKyB0c1swXSkgJiZcclxuXHRcdFx0XHQocHBbMV0gKyBwc1sxXSA8IHRwWzFdICsgdHNbMV0pO1xyXG5cclxuXHRcdFx0anNjLl9kcmF3UG9zaXRpb24odGhpc09iaiwgeCwgeSwgcG9zaXRpb25WYWx1ZSwgY29udHJhY3RTaGFkb3cpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRfZHJhd1Bvc2l0aW9uIDogZnVuY3Rpb24gKHRoaXNPYmosIHgsIHksIHBvc2l0aW9uVmFsdWUsIGNvbnRyYWN0U2hhZG93KSB7XHJcblx0XHR2YXIgdlNoYWRvdyA9IGNvbnRyYWN0U2hhZG93ID8gMCA6IHRoaXNPYmouc2hhZG93Qmx1cjsgLy8gcHhcclxuXHJcblx0XHRqc2MucGlja2VyLndyYXAuc3R5bGUucG9zaXRpb24gPSBwb3NpdGlvblZhbHVlO1xyXG5cdFx0anNjLnBpY2tlci53cmFwLnN0eWxlLmxlZnQgPSB4ICsgJ3B4JztcclxuXHRcdGpzYy5waWNrZXIud3JhcC5zdHlsZS50b3AgPSB5ICsgJ3B4JztcclxuXHJcblx0XHRqc2Muc2V0Qm94U2hhZG93KFxyXG5cdFx0XHRqc2MucGlja2VyLmJveFMsXHJcblx0XHRcdHRoaXNPYmouc2hhZG93ID9cclxuXHRcdFx0XHRuZXcganNjLkJveFNoYWRvdygwLCB2U2hhZG93LCB0aGlzT2JqLnNoYWRvd0JsdXIsIDAsIHRoaXNPYmouc2hhZG93Q29sb3IpIDpcclxuXHRcdFx0XHRudWxsKTtcclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0UGlja2VyRGltcyA6IGZ1bmN0aW9uICh0aGlzT2JqKSB7XHJcblx0XHR2YXIgZGlzcGxheVNsaWRlciA9ICEhanNjLmdldFNsaWRlckNvbXBvbmVudCh0aGlzT2JqKTtcclxuXHRcdHZhciBkaW1zID0gW1xyXG5cdFx0XHQyICogdGhpc09iai5pbnNldFdpZHRoICsgMiAqIHRoaXNPYmoucGFkZGluZyArIHRoaXNPYmoud2lkdGggK1xyXG5cdFx0XHRcdChkaXNwbGF5U2xpZGVyID8gMiAqIHRoaXNPYmouaW5zZXRXaWR0aCArIGpzYy5nZXRQYWRUb1NsaWRlclBhZGRpbmcodGhpc09iaikgKyB0aGlzT2JqLnNsaWRlclNpemUgOiAwKSxcclxuXHRcdFx0MiAqIHRoaXNPYmouaW5zZXRXaWR0aCArIDIgKiB0aGlzT2JqLnBhZGRpbmcgKyB0aGlzT2JqLmhlaWdodCArXHJcblx0XHRcdFx0KHRoaXNPYmouY2xvc2FibGUgPyAyICogdGhpc09iai5pbnNldFdpZHRoICsgdGhpc09iai5wYWRkaW5nICsgdGhpc09iai5idXR0b25IZWlnaHQgOiAwKVxyXG5cdFx0XTtcclxuXHRcdHJldHVybiBkaW1zO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRQaWNrZXJPdXRlckRpbXMgOiBmdW5jdGlvbiAodGhpc09iaikge1xyXG5cdFx0dmFyIGRpbXMgPSBqc2MuZ2V0UGlja2VyRGltcyh0aGlzT2JqKTtcclxuXHRcdHJldHVybiBbXHJcblx0XHRcdGRpbXNbMF0gKyAyICogdGhpc09iai5ib3JkZXJXaWR0aCxcclxuXHRcdFx0ZGltc1sxXSArIDIgKiB0aGlzT2JqLmJvcmRlcldpZHRoXHJcblx0XHRdO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRQYWRUb1NsaWRlclBhZGRpbmcgOiBmdW5jdGlvbiAodGhpc09iaikge1xyXG5cdFx0cmV0dXJuIE1hdGgubWF4KHRoaXNPYmoucGFkZGluZywgMS41ICogKDIgKiB0aGlzT2JqLnBvaW50ZXJCb3JkZXJXaWR0aCArIHRoaXNPYmoucG9pbnRlclRoaWNrbmVzcykpO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRQYWRZQ29tcG9uZW50IDogZnVuY3Rpb24gKHRoaXNPYmopIHtcclxuXHRcdHN3aXRjaCAodGhpc09iai5tb2RlLmNoYXJBdCgxKS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdGNhc2UgJ3YnOiByZXR1cm4gJ3YnOyBicmVhaztcclxuXHRcdH1cclxuXHRcdHJldHVybiAncyc7XHJcblx0fSxcclxuXHJcblxyXG5cdGdldFNsaWRlckNvbXBvbmVudCA6IGZ1bmN0aW9uICh0aGlzT2JqKSB7XHJcblx0XHRpZiAodGhpc09iai5tb2RlLmxlbmd0aCA+IDIpIHtcclxuXHRcdFx0c3dpdGNoICh0aGlzT2JqLm1vZGUuY2hhckF0KDIpLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0XHRjYXNlICdzJzogcmV0dXJuICdzJzsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAndic6IHJldHVybiAndic7IGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9LFxyXG5cclxuXHJcblx0b25Eb2N1bWVudE1vdXNlRG93biA6IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAoIWUpIHsgZSA9IHdpbmRvdy5ldmVudDsgfVxyXG5cdFx0dmFyIHRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcclxuXHJcblx0XHRpZiAodGFyZ2V0Ll9qc2NMaW5rZWRJbnN0YW5jZSkge1xyXG5cdFx0XHRpZiAodGFyZ2V0Ll9qc2NMaW5rZWRJbnN0YW5jZS5zaG93T25DbGljaykge1xyXG5cdFx0XHRcdHRhcmdldC5fanNjTGlua2VkSW5zdGFuY2Uuc2hvdygpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRhcmdldC5fanNjQ29udHJvbE5hbWUpIHtcclxuXHRcdFx0anNjLm9uQ29udHJvbFBvaW50ZXJTdGFydChlLCB0YXJnZXQsIHRhcmdldC5fanNjQ29udHJvbE5hbWUsICdtb3VzZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gTW91c2UgaXMgb3V0c2lkZSB0aGUgcGlja2VyIGNvbnRyb2xzIC0+IGhpZGUgdGhlIGNvbG9yIHBpY2tlciFcclxuXHRcdFx0aWYgKGpzYy5waWNrZXIgJiYganNjLnBpY2tlci5vd25lcikge1xyXG5cdFx0XHRcdGpzYy5waWNrZXIub3duZXIuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdG9uRG9jdW1lbnRUb3VjaFN0YXJ0IDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdGlmICghZSkgeyBlID0gd2luZG93LmV2ZW50OyB9XHJcblx0XHR2YXIgdGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xyXG5cclxuXHRcdGlmICh0YXJnZXQuX2pzY0xpbmtlZEluc3RhbmNlKSB7XHJcblx0XHRcdGlmICh0YXJnZXQuX2pzY0xpbmtlZEluc3RhbmNlLnNob3dPbkNsaWNrKSB7XHJcblx0XHRcdFx0dGFyZ2V0Ll9qc2NMaW5rZWRJbnN0YW5jZS5zaG93KCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGFyZ2V0Ll9qc2NDb250cm9sTmFtZSkge1xyXG5cdFx0XHRqc2Mub25Db250cm9sUG9pbnRlclN0YXJ0KGUsIHRhcmdldCwgdGFyZ2V0Ll9qc2NDb250cm9sTmFtZSwgJ3RvdWNoJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoanNjLnBpY2tlciAmJiBqc2MucGlja2VyLm93bmVyKSB7XHJcblx0XHRcdFx0anNjLnBpY2tlci5vd25lci5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0b25XaW5kb3dSZXNpemUgOiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0anNjLnJlZHJhd1Bvc2l0aW9uKCk7XHJcblx0fSxcclxuXHJcblxyXG5cdG9uUGFyZW50U2Nyb2xsIDogZnVuY3Rpb24gKGUpIHtcclxuXHRcdC8vIGhpZGUgdGhlIHBpY2tlciB3aGVuIG9uZSBvZiB0aGUgcGFyZW50IGVsZW1lbnRzIGlzIHNjcm9sbGVkXHJcblx0XHRpZiAoanNjLnBpY2tlciAmJiBqc2MucGlja2VyLm93bmVyKSB7XHJcblx0XHRcdGpzYy5waWNrZXIub3duZXIuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRfcG9pbnRlck1vdmVFdmVudCA6IHtcclxuXHRcdG1vdXNlOiAnbW91c2Vtb3ZlJyxcclxuXHRcdHRvdWNoOiAndG91Y2htb3ZlJ1xyXG5cdH0sXHJcblx0X3BvaW50ZXJFbmRFdmVudCA6IHtcclxuXHRcdG1vdXNlOiAnbW91c2V1cCcsXHJcblx0XHR0b3VjaDogJ3RvdWNoZW5kJ1xyXG5cdH0sXHJcblxyXG5cclxuXHRfcG9pbnRlck9yaWdpbiA6IG51bGwsXHJcblx0X2NhcHR1cmVkVGFyZ2V0IDogbnVsbCxcclxuXHJcblxyXG5cdG9uQ29udHJvbFBvaW50ZXJTdGFydCA6IGZ1bmN0aW9uIChlLCB0YXJnZXQsIGNvbnRyb2xOYW1lLCBwb2ludGVyVHlwZSkge1xyXG5cdFx0dmFyIHRoaXNPYmogPSB0YXJnZXQuX2pzY0luc3RhbmNlO1xyXG5cclxuXHRcdGpzYy5wcmV2ZW50RGVmYXVsdChlKTtcclxuXHRcdGpzYy5jYXB0dXJlVGFyZ2V0KHRhcmdldCk7XHJcblxyXG5cdFx0dmFyIHJlZ2lzdGVyRHJhZ0V2ZW50cyA9IGZ1bmN0aW9uIChkb2MsIG9mZnNldCkge1xyXG5cdFx0XHRqc2MuYXR0YWNoR3JvdXBFdmVudCgnZHJhZycsIGRvYywganNjLl9wb2ludGVyTW92ZUV2ZW50W3BvaW50ZXJUeXBlXSxcclxuXHRcdFx0XHRqc2Mub25Eb2N1bWVudFBvaW50ZXJNb3ZlKGUsIHRhcmdldCwgY29udHJvbE5hbWUsIHBvaW50ZXJUeXBlLCBvZmZzZXQpKTtcclxuXHRcdFx0anNjLmF0dGFjaEdyb3VwRXZlbnQoJ2RyYWcnLCBkb2MsIGpzYy5fcG9pbnRlckVuZEV2ZW50W3BvaW50ZXJUeXBlXSxcclxuXHRcdFx0XHRqc2Mub25Eb2N1bWVudFBvaW50ZXJFbmQoZSwgdGFyZ2V0LCBjb250cm9sTmFtZSwgcG9pbnRlclR5cGUpKTtcclxuXHRcdH07XHJcblxyXG5cdFx0cmVnaXN0ZXJEcmFnRXZlbnRzKGRvY3VtZW50LCBbMCwgMF0pO1xyXG5cclxuXHRcdGlmICh3aW5kb3cucGFyZW50ICYmIHdpbmRvdy5mcmFtZUVsZW1lbnQpIHtcclxuXHRcdFx0dmFyIHJlY3QgPSB3aW5kb3cuZnJhbWVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHR2YXIgb2ZzID0gWy1yZWN0LmxlZnQsIC1yZWN0LnRvcF07XHJcblx0XHRcdHJlZ2lzdGVyRHJhZ0V2ZW50cyh3aW5kb3cucGFyZW50LndpbmRvdy5kb2N1bWVudCwgb2ZzKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYWJzID0ganNjLmdldEFic1BvaW50ZXJQb3MoZSk7XHJcblx0XHR2YXIgcmVsID0ganNjLmdldFJlbFBvaW50ZXJQb3MoZSk7XHJcblx0XHRqc2MuX3BvaW50ZXJPcmlnaW4gPSB7XHJcblx0XHRcdHg6IGFicy54IC0gcmVsLngsXHJcblx0XHRcdHk6IGFicy55IC0gcmVsLnlcclxuXHRcdH07XHJcblxyXG5cdFx0c3dpdGNoIChjb250cm9sTmFtZSkge1xyXG5cdFx0Y2FzZSAncGFkJzpcclxuXHRcdFx0Ly8gaWYgdGhlIHNsaWRlciBpcyBhdCB0aGUgYm90dG9tLCBtb3ZlIGl0IHVwXHJcblx0XHRcdHN3aXRjaCAoanNjLmdldFNsaWRlckNvbXBvbmVudCh0aGlzT2JqKSkge1xyXG5cdFx0XHRjYXNlICdzJzogaWYgKHRoaXNPYmouaHN2WzFdID09PSAwKSB7IHRoaXNPYmouZnJvbUhTVihudWxsLCAxMDAsIG51bGwpOyB9OyBicmVhaztcclxuXHRcdFx0Y2FzZSAndic6IGlmICh0aGlzT2JqLmhzdlsyXSA9PT0gMCkgeyB0aGlzT2JqLmZyb21IU1YobnVsbCwgbnVsbCwgMTAwKTsgfTsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0anNjLnNldFBhZCh0aGlzT2JqLCBlLCAwLCAwKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0Y2FzZSAnc2xkJzpcclxuXHRcdFx0anNjLnNldFNsZCh0aGlzT2JqLCBlLCAwKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdFx0anNjLmRpc3BhdGNoRmluZUNoYW5nZSh0aGlzT2JqKTtcclxuXHR9LFxyXG5cclxuXHJcblx0b25Eb2N1bWVudFBvaW50ZXJNb3ZlIDogZnVuY3Rpb24gKGUsIHRhcmdldCwgY29udHJvbE5hbWUsIHBvaW50ZXJUeXBlLCBvZmZzZXQpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHR2YXIgdGhpc09iaiA9IHRhcmdldC5fanNjSW5zdGFuY2U7XHJcblx0XHRcdHN3aXRjaCAoY29udHJvbE5hbWUpIHtcclxuXHRcdFx0Y2FzZSAncGFkJzpcclxuXHRcdFx0XHRpZiAoIWUpIHsgZSA9IHdpbmRvdy5ldmVudDsgfVxyXG5cdFx0XHRcdGpzYy5zZXRQYWQodGhpc09iaiwgZSwgb2Zmc2V0WzBdLCBvZmZzZXRbMV0pO1xyXG5cdFx0XHRcdGpzYy5kaXNwYXRjaEZpbmVDaGFuZ2UodGhpc09iaik7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdzbGQnOlxyXG5cdFx0XHRcdGlmICghZSkgeyBlID0gd2luZG93LmV2ZW50OyB9XHJcblx0XHRcdFx0anNjLnNldFNsZCh0aGlzT2JqLCBlLCBvZmZzZXRbMV0pO1xyXG5cdFx0XHRcdGpzYy5kaXNwYXRjaEZpbmVDaGFuZ2UodGhpc09iaik7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0b25Eb2N1bWVudFBvaW50ZXJFbmQgOiBmdW5jdGlvbiAoZSwgdGFyZ2V0LCBjb250cm9sTmFtZSwgcG9pbnRlclR5cGUpIHtcclxuXHRcdHJldHVybiBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHR2YXIgdGhpc09iaiA9IHRhcmdldC5fanNjSW5zdGFuY2U7XHJcblx0XHRcdGpzYy5kZXRhY2hHcm91cEV2ZW50cygnZHJhZycpO1xyXG5cdFx0XHRqc2MucmVsZWFzZVRhcmdldCgpO1xyXG5cdFx0XHQvLyBBbHdheXMgZGlzcGF0Y2ggY2hhbmdlcyBhZnRlciBkZXRhY2hpbmcgb3V0c3RhbmRpbmcgbW91c2UgaGFuZGxlcnMsXHJcblx0XHRcdC8vIGluIGNhc2Ugc29tZSB1c2VyIGludGVyYWN0aW9uIHdpbGwgb2NjdXIgaW4gdXNlcidzIG9uY2hhbmdlIGNhbGxiYWNrXHJcblx0XHRcdC8vIHRoYXQgd291bGQgaW50cnVkZSB3aXRoIGN1cnJlbnQgbW91c2UgZXZlbnRzXHJcblx0XHRcdGpzYy5kaXNwYXRjaENoYW5nZSh0aGlzT2JqKTtcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblxyXG5cdGRpc3BhdGNoQ2hhbmdlIDogZnVuY3Rpb24gKHRoaXNPYmopIHtcclxuXHRcdGlmICh0aGlzT2JqLnZhbHVlRWxlbWVudCkge1xyXG5cdFx0XHRpZiAoanNjLmlzRWxlbWVudFR5cGUodGhpc09iai52YWx1ZUVsZW1lbnQsICdpbnB1dCcpKSB7XHJcblx0XHRcdFx0anNjLmZpcmVFdmVudCh0aGlzT2JqLnZhbHVlRWxlbWVudCwgJ2NoYW5nZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHJcblxyXG5cdGRpc3BhdGNoRmluZUNoYW5nZSA6IGZ1bmN0aW9uICh0aGlzT2JqKSB7XHJcblx0XHRpZiAodGhpc09iai5vbkZpbmVDaGFuZ2UpIHtcclxuXHRcdFx0dmFyIGNhbGxiYWNrO1xyXG5cdFx0XHRpZiAodHlwZW9mIHRoaXNPYmoub25GaW5lQ2hhbmdlID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uICh0aGlzT2JqLm9uRmluZUNoYW5nZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2FsbGJhY2sgPSB0aGlzT2JqLm9uRmluZUNoYW5nZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYWxsYmFjay5jYWxsKHRoaXNPYmopO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRzZXRQYWQgOiBmdW5jdGlvbiAodGhpc09iaiwgZSwgb2ZzWCwgb2ZzWSkge1xyXG5cdFx0dmFyIHBvaW50ZXJBYnMgPSBqc2MuZ2V0QWJzUG9pbnRlclBvcyhlKTtcclxuXHRcdHZhciB4ID0gb2ZzWCArIHBvaW50ZXJBYnMueCAtIGpzYy5fcG9pbnRlck9yaWdpbi54IC0gdGhpc09iai5wYWRkaW5nIC0gdGhpc09iai5pbnNldFdpZHRoO1xyXG5cdFx0dmFyIHkgPSBvZnNZICsgcG9pbnRlckFicy55IC0ganNjLl9wb2ludGVyT3JpZ2luLnkgLSB0aGlzT2JqLnBhZGRpbmcgLSB0aGlzT2JqLmluc2V0V2lkdGg7XHJcblxyXG5cdFx0dmFyIHhWYWwgPSB4ICogKDM2MCAvICh0aGlzT2JqLndpZHRoIC0gMSkpO1xyXG5cdFx0dmFyIHlWYWwgPSAxMDAgLSAoeSAqICgxMDAgLyAodGhpc09iai5oZWlnaHQgLSAxKSkpO1xyXG5cclxuXHRcdHN3aXRjaCAoanNjLmdldFBhZFlDb21wb25lbnQodGhpc09iaikpIHtcclxuXHRcdGNhc2UgJ3MnOiB0aGlzT2JqLmZyb21IU1YoeFZhbCwgeVZhbCwgbnVsbCwganNjLmxlYXZlU2xkKTsgYnJlYWs7XHJcblx0XHRjYXNlICd2JzogdGhpc09iai5mcm9tSFNWKHhWYWwsIG51bGwsIHlWYWwsIGpzYy5sZWF2ZVNsZCk7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRzZXRTbGQgOiBmdW5jdGlvbiAodGhpc09iaiwgZSwgb2ZzWSkge1xyXG5cdFx0dmFyIHBvaW50ZXJBYnMgPSBqc2MuZ2V0QWJzUG9pbnRlclBvcyhlKTtcclxuXHRcdHZhciB5ID0gb2ZzWSArIHBvaW50ZXJBYnMueSAtIGpzYy5fcG9pbnRlck9yaWdpbi55IC0gdGhpc09iai5wYWRkaW5nIC0gdGhpc09iai5pbnNldFdpZHRoO1xyXG5cclxuXHRcdHZhciB5VmFsID0gMTAwIC0gKHkgKiAoMTAwIC8gKHRoaXNPYmouaGVpZ2h0IC0gMSkpKTtcclxuXHJcblx0XHRzd2l0Y2ggKGpzYy5nZXRTbGlkZXJDb21wb25lbnQodGhpc09iaikpIHtcclxuXHRcdGNhc2UgJ3MnOiB0aGlzT2JqLmZyb21IU1YobnVsbCwgeVZhbCwgbnVsbCwganNjLmxlYXZlUGFkKTsgYnJlYWs7XHJcblx0XHRjYXNlICd2JzogdGhpc09iai5mcm9tSFNWKG51bGwsIG51bGwsIHlWYWwsIGpzYy5sZWF2ZVBhZCk7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRfdm1sTlMgOiAnanNjX3ZtbF8nLFxyXG5cdF92bWxDU1MgOiAnanNjX3ZtbF9jc3NfJyxcclxuXHRfdm1sUmVhZHkgOiBmYWxzZSxcclxuXHJcblxyXG5cdGluaXRWTUwgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoIWpzYy5fdm1sUmVhZHkpIHtcclxuXHRcdFx0Ly8gaW5pdCBWTUwgbmFtZXNwYWNlXHJcblx0XHRcdHZhciBkb2MgPSBkb2N1bWVudDtcclxuXHRcdFx0aWYgKCFkb2MubmFtZXNwYWNlc1tqc2MuX3ZtbE5TXSkge1xyXG5cdFx0XHRcdGRvYy5uYW1lc3BhY2VzLmFkZChqc2MuX3ZtbE5TLCAndXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp2bWwnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWRvYy5zdHlsZVNoZWV0c1tqc2MuX3ZtbENTU10pIHtcclxuXHRcdFx0XHR2YXIgdGFncyA9IFsnc2hhcGUnLCAnc2hhcGV0eXBlJywgJ2dyb3VwJywgJ2JhY2tncm91bmQnLCAncGF0aCcsICdmb3JtdWxhcycsICdoYW5kbGVzJywgJ2ZpbGwnLCAnc3Ryb2tlJywgJ3NoYWRvdycsICd0ZXh0Ym94JywgJ3RleHRwYXRoJywgJ2ltYWdlZGF0YScsICdsaW5lJywgJ3BvbHlsaW5lJywgJ2N1cnZlJywgJ3JlY3QnLCAncm91bmRyZWN0JywgJ292YWwnLCAnYXJjJywgJ2ltYWdlJ107XHJcblx0XHRcdFx0dmFyIHNzID0gZG9jLmNyZWF0ZVN0eWxlU2hlZXQoKTtcclxuXHRcdFx0XHRzcy5vd25pbmdFbGVtZW50LmlkID0ganNjLl92bWxDU1M7XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0YWdzLmxlbmd0aDsgaSArPSAxKSB7XHJcblx0XHRcdFx0XHRzcy5hZGRSdWxlKGpzYy5fdm1sTlMgKyAnXFxcXDonICsgdGFnc1tpXSwgJ2JlaGF2aW9yOnVybCgjZGVmYXVsdCNWTUwpOycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRqc2MuX3ZtbFJlYWR5ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Y3JlYXRlUGFsZXR0ZSA6IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHR2YXIgcGFsZXR0ZU9iaiA9IHtcclxuXHRcdFx0ZWxtOiBudWxsLFxyXG5cdFx0XHRkcmF3OiBudWxsXHJcblx0XHR9O1xyXG5cclxuXHRcdGlmIChqc2MuaXNDYW52YXNTdXBwb3J0ZWQpIHtcclxuXHRcdFx0Ly8gQ2FudmFzIGltcGxlbWVudGF0aW9uIGZvciBtb2Rlcm4gYnJvd3NlcnNcclxuXHJcblx0XHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHRcdFx0dmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuXHRcdFx0dmFyIGRyYXdGdW5jID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIHR5cGUpIHtcclxuXHRcdFx0XHRjYW52YXMud2lkdGggPSB3aWR0aDtcclxuXHRcdFx0XHRjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuXHRcdFx0XHRjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcblxyXG5cdFx0XHRcdHZhciBoR3JhZCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xyXG5cdFx0XHRcdGhHcmFkLmFkZENvbG9yU3RvcCgwIC8gNiwgJyNGMDAnKTtcclxuXHRcdFx0XHRoR3JhZC5hZGRDb2xvclN0b3AoMSAvIDYsICcjRkYwJyk7XHJcblx0XHRcdFx0aEdyYWQuYWRkQ29sb3JTdG9wKDIgLyA2LCAnIzBGMCcpO1xyXG5cdFx0XHRcdGhHcmFkLmFkZENvbG9yU3RvcCgzIC8gNiwgJyMwRkYnKTtcclxuXHRcdFx0XHRoR3JhZC5hZGRDb2xvclN0b3AoNCAvIDYsICcjMDBGJyk7XHJcblx0XHRcdFx0aEdyYWQuYWRkQ29sb3JTdG9wKDUgLyA2LCAnI0YwRicpO1xyXG5cdFx0XHRcdGhHcmFkLmFkZENvbG9yU3RvcCg2IC8gNiwgJyNGMDAnKTtcclxuXHJcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IGhHcmFkO1xyXG5cdFx0XHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cclxuXHRcdFx0XHR2YXIgdkdyYWQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgY2FudmFzLmhlaWdodCk7XHJcblx0XHRcdFx0c3dpdGNoICh0eXBlLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0XHRjYXNlICdzJzpcclxuXHRcdFx0XHRcdHZHcmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgyNTUsMjU1LDI1NSwwKScpO1xyXG5cdFx0XHRcdFx0dkdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDI1NSwyNTUsMjU1LDEpJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICd2JzpcclxuXHRcdFx0XHRcdHZHcmFkLmFkZENvbG9yU3RvcCgwLCAncmdiYSgwLDAsMCwwKScpO1xyXG5cdFx0XHRcdFx0dkdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDAsMCwwLDEpJyk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y3R4LmZpbGxTdHlsZSA9IHZHcmFkO1xyXG5cdFx0XHRcdGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cGFsZXR0ZU9iai5lbG0gPSBjYW52YXM7XHJcblx0XHRcdHBhbGV0dGVPYmouZHJhdyA9IGRyYXdGdW5jO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIFZNTCBmYWxsYmFjayBmb3IgSUUgNyBhbmQgOFxyXG5cclxuXHRcdFx0anNjLmluaXRWTUwoKTtcclxuXHJcblx0XHRcdHZhciB2bWxDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0dm1sQ29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuXHRcdFx0dm1sQ29udGFpbmVyLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcblxyXG5cdFx0XHR2YXIgaEdyYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGpzYy5fdm1sTlMgKyAnOmZpbGwnKTtcclxuXHRcdFx0aEdyYWQudHlwZSA9ICdncmFkaWVudCc7XHJcblx0XHRcdGhHcmFkLm1ldGhvZCA9ICdsaW5lYXInO1xyXG5cdFx0XHRoR3JhZC5hbmdsZSA9ICc5MCc7XHJcblx0XHRcdGhHcmFkLmNvbG9ycyA9ICcxNi42NyUgI0YwRiwgMzMuMzMlICMwMEYsIDUwJSAjMEZGLCA2Ni42NyUgIzBGMCwgODMuMzMlICNGRjAnXHJcblxyXG5cdFx0XHR2YXIgaFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGpzYy5fdm1sTlMgKyAnOnJlY3QnKTtcclxuXHRcdFx0aFJlY3Quc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRoUmVjdC5zdHlsZS5sZWZ0ID0gLTEgKyAncHgnO1xyXG5cdFx0XHRoUmVjdC5zdHlsZS50b3AgPSAtMSArICdweCc7XHJcblx0XHRcdGhSZWN0LnN0cm9rZWQgPSBmYWxzZTtcclxuXHRcdFx0aFJlY3QuYXBwZW5kQ2hpbGQoaEdyYWQpO1xyXG5cdFx0XHR2bWxDb250YWluZXIuYXBwZW5kQ2hpbGQoaFJlY3QpO1xyXG5cclxuXHRcdFx0dmFyIHZHcmFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChqc2MuX3ZtbE5TICsgJzpmaWxsJyk7XHJcblx0XHRcdHZHcmFkLnR5cGUgPSAnZ3JhZGllbnQnO1xyXG5cdFx0XHR2R3JhZC5tZXRob2QgPSAnbGluZWFyJztcclxuXHRcdFx0dkdyYWQuYW5nbGUgPSAnMTgwJztcclxuXHRcdFx0dkdyYWQub3BhY2l0eSA9ICcwJztcclxuXHJcblx0XHRcdHZhciB2UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoanNjLl92bWxOUyArICc6cmVjdCcpO1xyXG5cdFx0XHR2UmVjdC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHZSZWN0LnN0eWxlLmxlZnQgPSAtMSArICdweCc7XHJcblx0XHRcdHZSZWN0LnN0eWxlLnRvcCA9IC0xICsgJ3B4JztcclxuXHRcdFx0dlJlY3Quc3Ryb2tlZCA9IGZhbHNlO1xyXG5cdFx0XHR2UmVjdC5hcHBlbmRDaGlsZCh2R3JhZCk7XHJcblx0XHRcdHZtbENvbnRhaW5lci5hcHBlbmRDaGlsZCh2UmVjdCk7XHJcblxyXG5cdFx0XHR2YXIgZHJhd0Z1bmMgPSBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgdHlwZSkge1xyXG5cdFx0XHRcdHZtbENvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4JztcclxuXHRcdFx0XHR2bWxDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcclxuXHJcblx0XHRcdFx0aFJlY3Quc3R5bGUud2lkdGggPVxyXG5cdFx0XHRcdHZSZWN0LnN0eWxlLndpZHRoID1cclxuXHRcdFx0XHRcdCh3aWR0aCArIDEpICsgJ3B4JztcclxuXHRcdFx0XHRoUmVjdC5zdHlsZS5oZWlnaHQgPVxyXG5cdFx0XHRcdHZSZWN0LnN0eWxlLmhlaWdodCA9XHJcblx0XHRcdFx0XHQoaGVpZ2h0ICsgMSkgKyAncHgnO1xyXG5cclxuXHRcdFx0XHQvLyBDb2xvcnMgbXVzdCBiZSBzcGVjaWZpZWQgZHVyaW5nIGV2ZXJ5IHJlZHJhdywgb3RoZXJ3aXNlIElFIHdvbid0IGRpc3BsYXlcclxuXHRcdFx0XHQvLyBhIGZ1bGwgZ3JhZGllbnQgZHVyaW5nIGEgc3Vic2VxdWVudGlhbCByZWRyYXdcclxuXHRcdFx0XHRoR3JhZC5jb2xvciA9ICcjRjAwJztcclxuXHRcdFx0XHRoR3JhZC5jb2xvcjIgPSAnI0YwMCc7XHJcblxyXG5cdFx0XHRcdHN3aXRjaCAodHlwZS50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0Y2FzZSAncyc6XHJcblx0XHRcdFx0XHR2R3JhZC5jb2xvciA9IHZHcmFkLmNvbG9yMiA9ICcjRkZGJztcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3YnOlxyXG5cdFx0XHRcdFx0dkdyYWQuY29sb3IgPSB2R3JhZC5jb2xvcjIgPSAnIzAwMCc7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdFxyXG5cdFx0XHRwYWxldHRlT2JqLmVsbSA9IHZtbENvbnRhaW5lcjtcclxuXHRcdFx0cGFsZXR0ZU9iai5kcmF3ID0gZHJhd0Z1bmM7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHBhbGV0dGVPYmo7XHJcblx0fSxcclxuXHJcblxyXG5cdGNyZWF0ZVNsaWRlckdyYWRpZW50IDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdHZhciBzbGlkZXJPYmogPSB7XHJcblx0XHRcdGVsbTogbnVsbCxcclxuXHRcdFx0ZHJhdzogbnVsbFxyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoanNjLmlzQ2FudmFzU3VwcG9ydGVkKSB7XHJcblx0XHRcdC8vIENhbnZhcyBpbXBsZW1lbnRhdGlvbiBmb3IgbW9kZXJuIGJyb3dzZXJzXHJcblxyXG5cdFx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblx0XHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcblx0XHRcdHZhciBkcmF3RnVuYyA9IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBjb2xvcjEsIGNvbG9yMikge1xyXG5cdFx0XHRcdGNhbnZhcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0XHRcdGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG5cdFx0XHRcdGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHJcblx0XHRcdFx0dmFyIGdyYWQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgY2FudmFzLmhlaWdodCk7XHJcblx0XHRcdFx0Z3JhZC5hZGRDb2xvclN0b3AoMCwgY29sb3IxKTtcclxuXHRcdFx0XHRncmFkLmFkZENvbG9yU3RvcCgxLCBjb2xvcjIpO1xyXG5cclxuXHRcdFx0XHRjdHguZmlsbFN0eWxlID0gZ3JhZDtcclxuXHRcdFx0XHRjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHNsaWRlck9iai5lbG0gPSBjYW52YXM7XHJcblx0XHRcdHNsaWRlck9iai5kcmF3ID0gZHJhd0Z1bmM7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gVk1MIGZhbGxiYWNrIGZvciBJRSA3IGFuZCA4XHJcblxyXG5cdFx0XHRqc2MuaW5pdFZNTCgpO1xyXG5cclxuXHRcdFx0dmFyIHZtbENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHR2bWxDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFx0XHR2bWxDb250YWluZXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHJcblx0XHRcdHZhciBncmFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChqc2MuX3ZtbE5TICsgJzpmaWxsJyk7XHJcblx0XHRcdGdyYWQudHlwZSA9ICdncmFkaWVudCc7XHJcblx0XHRcdGdyYWQubWV0aG9kID0gJ2xpbmVhcic7XHJcblx0XHRcdGdyYWQuYW5nbGUgPSAnMTgwJztcclxuXHJcblx0XHRcdHZhciByZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChqc2MuX3ZtbE5TICsgJzpyZWN0Jyk7XHJcblx0XHRcdHJlY3Quc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRyZWN0LnN0eWxlLmxlZnQgPSAtMSArICdweCc7XHJcblx0XHRcdHJlY3Quc3R5bGUudG9wID0gLTEgKyAncHgnO1xyXG5cdFx0XHRyZWN0LnN0cm9rZWQgPSBmYWxzZTtcclxuXHRcdFx0cmVjdC5hcHBlbmRDaGlsZChncmFkKTtcclxuXHRcdFx0dm1sQ29udGFpbmVyLmFwcGVuZENoaWxkKHJlY3QpO1xyXG5cclxuXHRcdFx0dmFyIGRyYXdGdW5jID0gZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGNvbG9yMSwgY29sb3IyKSB7XHJcblx0XHRcdFx0dm1sQ29udGFpbmVyLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xyXG5cdFx0XHRcdHZtbENvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xyXG5cclxuXHRcdFx0XHRyZWN0LnN0eWxlLndpZHRoID0gKHdpZHRoICsgMSkgKyAncHgnO1xyXG5cdFx0XHRcdHJlY3Quc3R5bGUuaGVpZ2h0ID0gKGhlaWdodCArIDEpICsgJ3B4JztcclxuXHJcblx0XHRcdFx0Z3JhZC5jb2xvciA9IGNvbG9yMTtcclxuXHRcdFx0XHRncmFkLmNvbG9yMiA9IGNvbG9yMjtcclxuXHRcdFx0fTtcclxuXHRcdFx0XHJcblx0XHRcdHNsaWRlck9iai5lbG0gPSB2bWxDb250YWluZXI7XHJcblx0XHRcdHNsaWRlck9iai5kcmF3ID0gZHJhd0Z1bmM7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHNsaWRlck9iajtcclxuXHR9LFxyXG5cclxuXHJcblx0bGVhdmVWYWx1ZSA6IDE8PDAsXHJcblx0bGVhdmVTdHlsZSA6IDE8PDEsXHJcblx0bGVhdmVQYWQgOiAxPDwyLFxyXG5cdGxlYXZlU2xkIDogMTw8MyxcclxuXHJcblxyXG5cdEJveFNoYWRvdyA6IChmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgQm94U2hhZG93ID0gZnVuY3Rpb24gKGhTaGFkb3csIHZTaGFkb3csIGJsdXIsIHNwcmVhZCwgY29sb3IsIGluc2V0KSB7XHJcblx0XHRcdHRoaXMuaFNoYWRvdyA9IGhTaGFkb3c7XHJcblx0XHRcdHRoaXMudlNoYWRvdyA9IHZTaGFkb3c7XHJcblx0XHRcdHRoaXMuYmx1ciA9IGJsdXI7XHJcblx0XHRcdHRoaXMuc3ByZWFkID0gc3ByZWFkO1xyXG5cdFx0XHR0aGlzLmNvbG9yID0gY29sb3I7XHJcblx0XHRcdHRoaXMuaW5zZXQgPSAhIWluc2V0O1xyXG5cdFx0fTtcclxuXHJcblx0XHRCb3hTaGFkb3cucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgdmFscyA9IFtcclxuXHRcdFx0XHRNYXRoLnJvdW5kKHRoaXMuaFNoYWRvdykgKyAncHgnLFxyXG5cdFx0XHRcdE1hdGgucm91bmQodGhpcy52U2hhZG93KSArICdweCcsXHJcblx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLmJsdXIpICsgJ3B4JyxcclxuXHRcdFx0XHRNYXRoLnJvdW5kKHRoaXMuc3ByZWFkKSArICdweCcsXHJcblx0XHRcdFx0dGhpcy5jb2xvclxyXG5cdFx0XHRdO1xyXG5cdFx0XHRpZiAodGhpcy5pbnNldCkge1xyXG5cdFx0XHRcdHZhbHMucHVzaCgnaW5zZXQnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdmFscy5qb2luKCcgJyk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBCb3hTaGFkb3c7XHJcblx0fSkoKSxcclxuXHJcblxyXG5cdC8vXHJcblx0Ly8gVXNhZ2U6XHJcblx0Ly8gdmFyIG15Q29sb3IgPSBuZXcganNjb2xvcig8dGFyZ2V0RWxlbWVudD4gWywgPG9wdGlvbnM+XSlcclxuXHQvL1xyXG5cclxuXHRqc2NvbG9yIDogZnVuY3Rpb24gKHRhcmdldEVsZW1lbnQsIG9wdGlvbnMpIHtcclxuXHJcblx0XHQvLyBHZW5lcmFsIG9wdGlvbnNcclxuXHRcdC8vXHJcblx0XHR0aGlzLnZhbHVlID0gbnVsbDsgLy8gaW5pdGlhbCBIRVggY29sb3IuIFRvIGNoYW5nZSBpdCBsYXRlciwgdXNlIG1ldGhvZHMgZnJvbVN0cmluZygpLCBmcm9tSFNWKCkgYW5kIGZyb21SR0IoKVxyXG5cdFx0dGhpcy52YWx1ZUVsZW1lbnQgPSB0YXJnZXRFbGVtZW50OyAvLyBlbGVtZW50IHRoYXQgd2lsbCBiZSB1c2VkIHRvIGRpc3BsYXkgYW5kIGlucHV0IHRoZSBjb2xvciBjb2RlXHJcblx0XHR0aGlzLnN0eWxlRWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7IC8vIGVsZW1lbnQgdGhhdCB3aWxsIHByZXZpZXcgdGhlIHBpY2tlZCBjb2xvciB1c2luZyBDU1MgYmFja2dyb3VuZENvbG9yXHJcblx0XHR0aGlzLnJlcXVpcmVkID0gdHJ1ZTsgLy8gd2hldGhlciB0aGUgYXNzb2NpYXRlZCB0ZXh0IDxpbnB1dD4gY2FuIGJlIGxlZnQgZW1wdHlcclxuXHRcdHRoaXMucmVmaW5lID0gdHJ1ZTsgLy8gd2hldGhlciB0byByZWZpbmUgdGhlIGVudGVyZWQgY29sb3IgY29kZSAoZS5nLiB1cHBlcmNhc2UgaXQgYW5kIHJlbW92ZSB3aGl0ZXNwYWNlKVxyXG5cdFx0dGhpcy5oYXNoID0gZmFsc2U7IC8vIHdoZXRoZXIgdG8gcHJlZml4IHRoZSBIRVggY29sb3IgY29kZSB3aXRoICMgc3ltYm9sXHJcblx0XHR0aGlzLnVwcGVyY2FzZSA9IHRydWU7IC8vIHdoZXRoZXIgdG8gc2hvdyB0aGUgY29sb3IgY29kZSBpbiB1cHBlciBjYXNlXHJcblx0XHR0aGlzLm9uRmluZUNoYW5nZSA9IG51bGw7IC8vIGNhbGxlZCBpbnN0YW50bHkgZXZlcnkgdGltZSB0aGUgY29sb3IgY2hhbmdlcyAodmFsdWUgY2FuIGJlIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nIHdpdGggamF2YXNjcmlwdCBjb2RlKVxyXG5cdFx0dGhpcy5hY3RpdmVDbGFzcyA9ICdqc2NvbG9yLWFjdGl2ZSc7IC8vIGNsYXNzIHRvIGJlIHNldCB0byB0aGUgdGFyZ2V0IGVsZW1lbnQgd2hlbiBhIHBpY2tlciB3aW5kb3cgaXMgb3BlbiBvbiBpdFxyXG5cdFx0dGhpcy5vdmVyd3JpdGVJbXBvcnRhbnQgPSBmYWxzZTsgLy8gd2hldGhlciB0byBvdmVyd3JpdGUgY29sb3JzIG9mIHN0eWxlRWxlbWVudCB1c2luZyAhaW1wb3J0YW50XHJcblx0XHR0aGlzLm1pblMgPSAwOyAvLyBtaW4gYWxsb3dlZCBzYXR1cmF0aW9uICgwIC0gMTAwKVxyXG5cdFx0dGhpcy5tYXhTID0gMTAwOyAvLyBtYXggYWxsb3dlZCBzYXR1cmF0aW9uICgwIC0gMTAwKVxyXG5cdFx0dGhpcy5taW5WID0gMDsgLy8gbWluIGFsbG93ZWQgdmFsdWUgKGJyaWdodG5lc3MpICgwIC0gMTAwKVxyXG5cdFx0dGhpcy5tYXhWID0gMTAwOyAvLyBtYXggYWxsb3dlZCB2YWx1ZSAoYnJpZ2h0bmVzcykgKDAgLSAxMDApXHJcblxyXG5cdFx0Ly8gQWNjZXNzaW5nIHRoZSBwaWNrZWQgY29sb3JcclxuXHRcdC8vXHJcblx0XHR0aGlzLmhzdiA9IFswLCAwLCAxMDBdOyAvLyByZWFkLW9ubHkgIFswLTM2MCwgMC0xMDAsIDAtMTAwXVxyXG5cdFx0dGhpcy5yZ2IgPSBbMjU1LCAyNTUsIDI1NV07IC8vIHJlYWQtb25seSAgWzAtMjU1LCAwLTI1NSwgMC0yNTVdXHJcblxyXG5cdFx0Ly8gQ29sb3IgUGlja2VyIG9wdGlvbnNcclxuXHRcdC8vXHJcblx0XHR0aGlzLndpZHRoID0gMTgxOyAvLyB3aWR0aCBvZiBjb2xvciBwYWxldHRlIChpbiBweClcclxuXHRcdHRoaXMuaGVpZ2h0ID0gMTAxOyAvLyBoZWlnaHQgb2YgY29sb3IgcGFsZXR0ZSAoaW4gcHgpXHJcblx0XHR0aGlzLnNob3dPbkNsaWNrID0gdHJ1ZTsgLy8gd2hldGhlciB0byBkaXNwbGF5IHRoZSBjb2xvciBwaWNrZXIgd2hlbiB1c2VyIGNsaWNrcyBvbiBpdHMgdGFyZ2V0IGVsZW1lbnRcclxuXHRcdHRoaXMubW9kZSA9ICdIU1YnOyAvLyBIU1YgfCBIVlMgfCBIUyB8IEhWIC0gbGF5b3V0IG9mIHRoZSBjb2xvciBwaWNrZXIgY29udHJvbHNcclxuXHRcdHRoaXMucG9zaXRpb24gPSAnYm90dG9tJzsgLy8gbGVmdCB8IHJpZ2h0IHwgdG9wIHwgYm90dG9tIC0gcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIHRhcmdldCBlbGVtZW50XHJcblx0XHR0aGlzLnNtYXJ0UG9zaXRpb24gPSB0cnVlOyAvLyBhdXRvbWF0aWNhbGx5IGNoYW5nZSBwaWNrZXIgcG9zaXRpb24gd2hlbiB0aGVyZSBpcyBub3QgZW5vdWdoIHNwYWNlIGZvciBpdFxyXG5cdFx0dGhpcy5zbGlkZXJTaXplID0gMTY7IC8vIHB4XHJcblx0XHR0aGlzLmNyb3NzU2l6ZSA9IDg7IC8vIHB4XHJcblx0XHR0aGlzLmNsb3NhYmxlID0gZmFsc2U7IC8vIHdoZXRoZXIgdG8gZGlzcGxheSB0aGUgQ2xvc2UgYnV0dG9uXHJcblx0XHR0aGlzLmNsb3NlVGV4dCA9ICdDbG9zZSc7XHJcblx0XHR0aGlzLmJ1dHRvbkNvbG9yID0gJyMwMDAwMDAnOyAvLyBDU1MgY29sb3JcclxuXHRcdHRoaXMuYnV0dG9uSGVpZ2h0ID0gMTg7IC8vIHB4XHJcblx0XHR0aGlzLnBhZGRpbmcgPSAxMjsgLy8gcHhcclxuXHRcdHRoaXMuYmFja2dyb3VuZENvbG9yID0gJyNGRkZGRkYnOyAvLyBDU1MgY29sb3JcclxuXHRcdHRoaXMuYm9yZGVyV2lkdGggPSAxOyAvLyBweFxyXG5cdFx0dGhpcy5ib3JkZXJDb2xvciA9ICcjQkJCQkJCJzsgLy8gQ1NTIGNvbG9yXHJcblx0XHR0aGlzLmJvcmRlclJhZGl1cyA9IDg7IC8vIHB4XHJcblx0XHR0aGlzLmluc2V0V2lkdGggPSAxOyAvLyBweFxyXG5cdFx0dGhpcy5pbnNldENvbG9yID0gJyNCQkJCQkInOyAvLyBDU1MgY29sb3JcclxuXHRcdHRoaXMuc2hhZG93ID0gdHJ1ZTsgLy8gd2hldGhlciB0byBkaXNwbGF5IHNoYWRvd1xyXG5cdFx0dGhpcy5zaGFkb3dCbHVyID0gMTU7IC8vIHB4XHJcblx0XHR0aGlzLnNoYWRvd0NvbG9yID0gJ3JnYmEoMCwwLDAsMC4yKSc7IC8vIENTUyBjb2xvclxyXG5cdFx0dGhpcy5wb2ludGVyQ29sb3IgPSAnIzRDNEM0Qyc7IC8vIHB4XHJcblx0XHR0aGlzLnBvaW50ZXJCb3JkZXJDb2xvciA9ICcjRkZGRkZGJzsgLy8gcHhcclxuICAgICAgICB0aGlzLnBvaW50ZXJCb3JkZXJXaWR0aCA9IDE7IC8vIHB4XHJcbiAgICAgICAgdGhpcy5wb2ludGVyVGhpY2tuZXNzID0gMjsgLy8gcHhcclxuXHRcdHRoaXMuekluZGV4ID0gMTAwMDtcclxuXHRcdHRoaXMuY29udGFpbmVyID0gbnVsbDsgLy8gd2hlcmUgdG8gYXBwZW5kIHRoZSBjb2xvciBwaWNrZXIgKEJPRFkgZWxlbWVudCBieSBkZWZhdWx0KVxyXG5cclxuXHJcblx0XHRmb3IgKHZhciBvcHQgaW4gb3B0aW9ucykge1xyXG5cdFx0XHRpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShvcHQpKSB7XHJcblx0XHRcdFx0dGhpc1tvcHRdID0gb3B0aW9uc1tvcHRdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdHRoaXMuaGlkZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKGlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdGRldGFjaFBpY2tlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnNob3cgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGRyYXdQaWNrZXIoKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMucmVkcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoaXNQaWNrZXJPd25lcigpKSB7XHJcblx0XHRcdFx0ZHJhd1BpY2tlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmltcG9ydENvbG9yID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAoIXRoaXMudmFsdWVFbGVtZW50KSB7XHJcblx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcigpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChqc2MuaXNFbGVtZW50VHlwZSh0aGlzLnZhbHVlRWxlbWVudCwgJ2lucHV0JykpIHtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5yZWZpbmUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmZyb21TdHJpbmcodGhpcy52YWx1ZUVsZW1lbnQudmFsdWUsIGpzYy5sZWF2ZVZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLnN0eWxlRWxlbWVudCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5zdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gdGhpcy5zdHlsZUVsZW1lbnQuX2pzY09yaWdTdHlsZS5iYWNrZ3JvdW5kSW1hZ2U7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnN0eWxlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnN0eWxlRWxlbWVudC5fanNjT3JpZ1N0eWxlLmJhY2tncm91bmRDb2xvcjtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc3R5bGVFbGVtZW50LnN0eWxlLmNvbG9yID0gdGhpcy5zdHlsZUVsZW1lbnQuX2pzY09yaWdTdHlsZS5jb2xvcjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcihqc2MubGVhdmVWYWx1ZSB8IGpzYy5sZWF2ZVN0eWxlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICghdGhpcy5yZXF1aXJlZCAmJiAvXlxccyokLy50ZXN0KHRoaXMudmFsdWVFbGVtZW50LnZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnZhbHVlRWxlbWVudC52YWx1ZSA9ICcnO1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5zdHlsZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnN0eWxlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSB0aGlzLnN0eWxlRWxlbWVudC5fanNjT3JpZ1N0eWxlLmJhY2tncm91bmRJbWFnZTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnN0eWxlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnN0eWxlRWxlbWVudC5fanNjT3JpZ1N0eWxlLmJhY2tncm91bmRDb2xvcjtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnN0eWxlRWxlbWVudC5zdHlsZS5jb2xvciA9IHRoaXMuc3R5bGVFbGVtZW50Ll9qc2NPcmlnU3R5bGUuY29sb3I7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcihqc2MubGVhdmVWYWx1ZSB8IGpzYy5sZWF2ZVN0eWxlKTtcclxuXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuZnJvbVN0cmluZyh0aGlzLnZhbHVlRWxlbWVudC52YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0Ly8gbWFuYWdlZCB0byBpbXBvcnQgY29sb3Igc3VjY2Vzc2Z1bGx5IGZyb20gdGhlIHZhbHVlIC0+IE9LLCBkb24ndCBkbyBhbnl0aGluZ1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBub3QgYW4gaW5wdXQgZWxlbWVudCAtPiBkb2Vzbid0IGhhdmUgYW55IHZhbHVlXHJcblx0XHRcdFx0XHR0aGlzLmV4cG9ydENvbG9yKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmV4cG9ydENvbG9yID0gZnVuY3Rpb24gKGZsYWdzKSB7XHJcblx0XHRcdGlmICghKGZsYWdzICYganNjLmxlYXZlVmFsdWUpICYmIHRoaXMudmFsdWVFbGVtZW50KSB7XHJcblx0XHRcdFx0dmFyIHZhbHVlID0gdGhpcy50b1N0cmluZygpO1xyXG5cdFx0XHRcdGlmICh0aGlzLnVwcGVyY2FzZSkgeyB2YWx1ZSA9IHZhbHVlLnRvVXBwZXJDYXNlKCk7IH1cclxuXHRcdFx0XHRpZiAodGhpcy5oYXNoKSB7IHZhbHVlID0gJyMnICsgdmFsdWU7IH1cclxuXHJcblx0XHRcdFx0aWYgKGpzYy5pc0VsZW1lbnRUeXBlKHRoaXMudmFsdWVFbGVtZW50LCAnaW5wdXQnKSkge1xyXG5cdFx0XHRcdFx0dGhpcy52YWx1ZUVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy52YWx1ZUVsZW1lbnQuaW5uZXJIVE1MID0gdmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghKGZsYWdzICYganNjLmxlYXZlU3R5bGUpKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuc3R5bGVFbGVtZW50KSB7XHJcblx0XHRcdFx0XHR2YXIgYmdDb2xvciA9ICcjJyArIHRoaXMudG9TdHJpbmcoKTtcclxuXHRcdFx0XHRcdHZhciBmZ0NvbG9yID0gdGhpcy5pc0xpZ2h0KCkgPyAnIzAwMCcgOiAnI0ZGRic7XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5zdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ25vbmUnO1xyXG5cdFx0XHRcdFx0dGhpcy5zdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvcjtcclxuXHRcdFx0XHRcdHRoaXMuc3R5bGVFbGVtZW50LnN0eWxlLmNvbG9yID0gZmdDb2xvcjtcclxuXHJcblx0XHRcdFx0XHRpZiAodGhpcy5vdmVyd3JpdGVJbXBvcnRhbnQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsXHJcblx0XHRcdFx0XHRcdFx0J2JhY2tncm91bmQ6ICcgKyBiZ0NvbG9yICsgJyAhaW1wb3J0YW50OyAnICtcclxuXHRcdFx0XHRcdFx0XHQnY29sb3I6ICcgKyBmZ0NvbG9yICsgJyAhaW1wb3J0YW50OydcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCEoZmxhZ3MgJiBqc2MubGVhdmVQYWQpICYmIGlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdHJlZHJhd1BhZCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghKGZsYWdzICYganNjLmxlYXZlU2xkKSAmJiBpc1BpY2tlck93bmVyKCkpIHtcclxuXHRcdFx0XHRyZWRyYXdTbGQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0Ly8gaDogMC0zNjBcclxuXHRcdC8vIHM6IDAtMTAwXHJcblx0XHQvLyB2OiAwLTEwMFxyXG5cdFx0Ly9cclxuXHRcdHRoaXMuZnJvbUhTViA9IGZ1bmN0aW9uIChoLCBzLCB2LCBmbGFncykgeyAvLyBudWxsID0gZG9uJ3QgY2hhbmdlXHJcblx0XHRcdGlmIChoICE9PSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKGlzTmFOKGgpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHRcdGggPSBNYXRoLm1heCgwLCBNYXRoLm1pbigzNjAsIGgpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAocyAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChpc05hTihzKSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0XHRzID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMTAwLCB0aGlzLm1heFMsIHMpLCB0aGlzLm1pblMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh2ICE9PSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKGlzTmFOKHYpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHRcdHYgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIHRoaXMubWF4ViwgdiksIHRoaXMubWluVik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMucmdiID0gSFNWX1JHQihcclxuXHRcdFx0XHRoPT09bnVsbCA/IHRoaXMuaHN2WzBdIDogKHRoaXMuaHN2WzBdPWgpLFxyXG5cdFx0XHRcdHM9PT1udWxsID8gdGhpcy5oc3ZbMV0gOiAodGhpcy5oc3ZbMV09cyksXHJcblx0XHRcdFx0dj09PW51bGwgPyB0aGlzLmhzdlsyXSA6ICh0aGlzLmhzdlsyXT12KVxyXG5cdFx0XHQpO1xyXG5cclxuXHRcdFx0dGhpcy5leHBvcnRDb2xvcihmbGFncyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHQvLyByOiAwLTI1NVxyXG5cdFx0Ly8gZzogMC0yNTVcclxuXHRcdC8vIGI6IDAtMjU1XHJcblx0XHQvL1xyXG5cdFx0dGhpcy5mcm9tUkdCID0gZnVuY3Rpb24gKHIsIGcsIGIsIGZsYWdzKSB7IC8vIG51bGwgPSBkb24ndCBjaGFuZ2VcclxuXHRcdFx0aWYgKHIgIT09IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoaXNOYU4ocikpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRcdFx0ciA9IE1hdGgubWF4KDAsIE1hdGgubWluKDI1NSwgcikpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChnICE9PSBudWxsKSB7XHJcblx0XHRcdFx0aWYgKGlzTmFOKGcpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0XHRcdGcgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIGcpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoYiAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmIChpc05hTihiKSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdFx0XHRiID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMjU1LCBiKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBoc3YgPSBSR0JfSFNWKFxyXG5cdFx0XHRcdHI9PT1udWxsID8gdGhpcy5yZ2JbMF0gOiByLFxyXG5cdFx0XHRcdGc9PT1udWxsID8gdGhpcy5yZ2JbMV0gOiBnLFxyXG5cdFx0XHRcdGI9PT1udWxsID8gdGhpcy5yZ2JbMl0gOiBiXHJcblx0XHRcdCk7XHJcblx0XHRcdGlmIChoc3ZbMF0gIT09IG51bGwpIHtcclxuXHRcdFx0XHR0aGlzLmhzdlswXSA9IE1hdGgubWF4KDAsIE1hdGgubWluKDM2MCwgaHN2WzBdKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGhzdlsyXSAhPT0gMCkge1xyXG5cdFx0XHRcdHRoaXMuaHN2WzFdID0gaHN2WzFdPT09bnVsbCA/IG51bGwgOiBNYXRoLm1heCgwLCB0aGlzLm1pblMsIE1hdGgubWluKDEwMCwgdGhpcy5tYXhTLCBoc3ZbMV0pKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmhzdlsyXSA9IGhzdlsyXT09PW51bGwgPyBudWxsIDogTWF0aC5tYXgoMCwgdGhpcy5taW5WLCBNYXRoLm1pbigxMDAsIHRoaXMubWF4ViwgaHN2WzJdKSk7XHJcblxyXG5cdFx0XHQvLyB1cGRhdGUgUkdCIGFjY29yZGluZyB0byBmaW5hbCBIU1YsIGFzIHNvbWUgdmFsdWVzIG1pZ2h0IGJlIHRyaW1tZWRcclxuXHRcdFx0dmFyIHJnYiA9IEhTVl9SR0IodGhpcy5oc3ZbMF0sIHRoaXMuaHN2WzFdLCB0aGlzLmhzdlsyXSk7XHJcblx0XHRcdHRoaXMucmdiWzBdID0gcmdiWzBdO1xyXG5cdFx0XHR0aGlzLnJnYlsxXSA9IHJnYlsxXTtcclxuXHRcdFx0dGhpcy5yZ2JbMl0gPSByZ2JbMl07XHJcblxyXG5cdFx0XHR0aGlzLmV4cG9ydENvbG9yKGZsYWdzKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuZnJvbVN0cmluZyA9IGZ1bmN0aW9uIChzdHIsIGZsYWdzKSB7XHJcblx0XHRcdHZhciBtO1xyXG5cdFx0XHRpZiAobSA9IHN0ci5tYXRjaCgvXlxcVyooWzAtOUEtRl17M30oWzAtOUEtRl17M30pPylcXFcqJC9pKSkge1xyXG5cdFx0XHRcdC8vIEhFWCBub3RhdGlvblxyXG5cdFx0XHRcdC8vXHJcblxyXG5cdFx0XHRcdGlmIChtWzFdLmxlbmd0aCA9PT0gNikge1xyXG5cdFx0XHRcdFx0Ly8gNi1jaGFyIG5vdGF0aW9uXHJcblx0XHRcdFx0XHR0aGlzLmZyb21SR0IoXHJcblx0XHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uc3Vic3RyKDAsMiksMTYpLFxyXG5cdFx0XHRcdFx0XHRwYXJzZUludChtWzFdLnN1YnN0cigyLDIpLDE2KSxcclxuXHRcdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5zdWJzdHIoNCwyKSwxNiksXHJcblx0XHRcdFx0XHRcdGZsYWdzXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyAzLWNoYXIgbm90YXRpb25cclxuXHRcdFx0XHRcdHRoaXMuZnJvbVJHQihcclxuXHRcdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5jaGFyQXQoMCkgKyBtWzFdLmNoYXJBdCgwKSwxNiksXHJcblx0XHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uY2hhckF0KDEpICsgbVsxXS5jaGFyQXQoMSksMTYpLFxyXG5cdFx0XHRcdFx0XHRwYXJzZUludChtWzFdLmNoYXJBdCgyKSArIG1bMV0uY2hhckF0KDIpLDE2KSxcclxuXHRcdFx0XHRcdFx0ZmxhZ3NcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChtID0gc3RyLm1hdGNoKC9eXFxXKnJnYmE/XFwoKFteKV0qKVxcKVxcVyokL2kpKSB7XHJcblx0XHRcdFx0dmFyIHBhcmFtcyA9IG1bMV0uc3BsaXQoJywnKTtcclxuXHRcdFx0XHR2YXIgcmUgPSAvXlxccyooXFxkKikoXFwuXFxkKyk/XFxzKiQvO1xyXG5cdFx0XHRcdHZhciBtUiwgbUcsIG1CO1xyXG5cdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdHBhcmFtcy5sZW5ndGggPj0gMyAmJlxyXG5cdFx0XHRcdFx0KG1SID0gcGFyYW1zWzBdLm1hdGNoKHJlKSkgJiZcclxuXHRcdFx0XHRcdChtRyA9IHBhcmFtc1sxXS5tYXRjaChyZSkpICYmXHJcblx0XHRcdFx0XHQobUIgPSBwYXJhbXNbMl0ubWF0Y2gocmUpKVxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0dmFyIHIgPSBwYXJzZUZsb2F0KChtUlsxXSB8fCAnMCcpICsgKG1SWzJdIHx8ICcnKSk7XHJcblx0XHRcdFx0XHR2YXIgZyA9IHBhcnNlRmxvYXQoKG1HWzFdIHx8ICcwJykgKyAobUdbMl0gfHwgJycpKTtcclxuXHRcdFx0XHRcdHZhciBiID0gcGFyc2VGbG9hdCgobUJbMV0gfHwgJzAnKSArIChtQlsyXSB8fCAnJykpO1xyXG5cdFx0XHRcdFx0dGhpcy5mcm9tUkdCKHIsIGcsIGIsIGZsYWdzKTtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdCgweDEwMCB8IE1hdGgucm91bmQodGhpcy5yZ2JbMF0pKS50b1N0cmluZygxNikuc3Vic3RyKDEpICtcclxuXHRcdFx0XHQoMHgxMDAgfCBNYXRoLnJvdW5kKHRoaXMucmdiWzFdKSkudG9TdHJpbmcoMTYpLnN1YnN0cigxKSArXHJcblx0XHRcdFx0KDB4MTAwIHwgTWF0aC5yb3VuZCh0aGlzLnJnYlsyXSkpLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSlcclxuXHRcdFx0KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMudG9IRVhTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiAnIycgKyB0aGlzLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMudG9SR0JTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiAoJ3JnYignICtcclxuXHRcdFx0XHRNYXRoLnJvdW5kKHRoaXMucmdiWzBdKSArICcsJyArXHJcblx0XHRcdFx0TWF0aC5yb3VuZCh0aGlzLnJnYlsxXSkgKyAnLCcgK1xyXG5cdFx0XHRcdE1hdGgucm91bmQodGhpcy5yZ2JbMl0pICsgJyknXHJcblx0XHRcdCk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmlzTGlnaHQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0MC4yMTMgKiB0aGlzLnJnYlswXSArXHJcblx0XHRcdFx0MC43MTUgKiB0aGlzLnJnYlsxXSArXHJcblx0XHRcdFx0MC4wNzIgKiB0aGlzLnJnYlsyXSA+XHJcblx0XHRcdFx0MjU1IC8gMlxyXG5cdFx0XHQpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5fcHJvY2Vzc1BhcmVudEVsZW1lbnRzSW5ET00gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmICh0aGlzLl9saW5rZWRFbGVtZW50c1Byb2Nlc3NlZCkgeyByZXR1cm47IH1cclxuXHRcdFx0dGhpcy5fbGlua2VkRWxlbWVudHNQcm9jZXNzZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGVsbSA9IHRoaXMudGFyZ2V0RWxlbWVudDtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBvciBvbmUgb2YgaXRzIHBhcmVudCBub2RlcyBoYXMgZml4ZWQgcG9zaXRpb24sXHJcblx0XHRcdFx0Ly8gdGhlbiB1c2UgZml4ZWQgcG9zaXRpb25pbmcgaW5zdGVhZFxyXG5cdFx0XHRcdC8vXHJcblx0XHRcdFx0Ly8gTm90ZTogSW4gRmlyZWZveCwgZ2V0Q29tcHV0ZWRTdHlsZSByZXR1cm5zIG51bGwgaW4gYSBoaWRkZW4gaWZyYW1lLFxyXG5cdFx0XHRcdC8vIHRoYXQncyB3aHkgd2UgbmVlZCB0byBjaGVjayBpZiB0aGUgcmV0dXJuZWQgc3R5bGUgb2JqZWN0IGlzIG5vbi1lbXB0eVxyXG5cdFx0XHRcdHZhciBjdXJyU3R5bGUgPSBqc2MuZ2V0U3R5bGUoZWxtKTtcclxuXHRcdFx0XHRpZiAoY3VyclN0eWxlICYmIGN1cnJTdHlsZS5wb3NpdGlvbi50b0xvd2VyQ2FzZSgpID09PSAnZml4ZWQnKSB7XHJcblx0XHRcdFx0XHR0aGlzLmZpeGVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChlbG0gIT09IHRoaXMudGFyZ2V0RWxlbWVudCkge1xyXG5cdFx0XHRcdFx0Ly8gRW5zdXJlIHRvIGF0dGFjaCBvblBhcmVudFNjcm9sbCBvbmx5IG9uY2UgdG8gZWFjaCBwYXJlbnQgZWxlbWVudFxyXG5cdFx0XHRcdFx0Ly8gKG11bHRpcGxlIHRhcmdldEVsZW1lbnRzIGNhbiBzaGFyZSB0aGUgc2FtZSBwYXJlbnQgbm9kZXMpXHJcblx0XHRcdFx0XHQvL1xyXG5cdFx0XHRcdFx0Ly8gTm90ZTogSXQncyBub3QganVzdCBvZmZzZXRQYXJlbnRzIHRoYXQgY2FuIGJlIHNjcm9sbGFibGUsXHJcblx0XHRcdFx0XHQvLyB0aGF0J3Mgd2h5IHdlIGxvb3AgdGhyb3VnaCBhbGwgcGFyZW50IG5vZGVzXHJcblx0XHRcdFx0XHRpZiAoIWVsbS5fanNjRXZlbnRzQXR0YWNoZWQpIHtcclxuXHRcdFx0XHRcdFx0anNjLmF0dGFjaEV2ZW50KGVsbSwgJ3Njcm9sbCcsIGpzYy5vblBhcmVudFNjcm9sbCk7XHJcblx0XHRcdFx0XHRcdGVsbS5fanNjRXZlbnRzQXR0YWNoZWQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSB3aGlsZSAoKGVsbSA9IGVsbS5wYXJlbnROb2RlKSAmJiAhanNjLmlzRWxlbWVudFR5cGUoZWxtLCAnYm9keScpKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdC8vIHI6IDAtMjU1XHJcblx0XHQvLyBnOiAwLTI1NVxyXG5cdFx0Ly8gYjogMC0yNTVcclxuXHRcdC8vXHJcblx0XHQvLyByZXR1cm5zOiBbIDAtMzYwLCAwLTEwMCwgMC0xMDAgXVxyXG5cdFx0Ly9cclxuXHRcdGZ1bmN0aW9uIFJHQl9IU1YgKHIsIGcsIGIpIHtcclxuXHRcdFx0ciAvPSAyNTU7XHJcblx0XHRcdGcgLz0gMjU1O1xyXG5cdFx0XHRiIC89IDI1NTtcclxuXHRcdFx0dmFyIG4gPSBNYXRoLm1pbihNYXRoLm1pbihyLGcpLGIpO1xyXG5cdFx0XHR2YXIgdiA9IE1hdGgubWF4KE1hdGgubWF4KHIsZyksYik7XHJcblx0XHRcdHZhciBtID0gdiAtIG47XHJcblx0XHRcdGlmIChtID09PSAwKSB7IHJldHVybiBbIG51bGwsIDAsIDEwMCAqIHYgXTsgfVxyXG5cdFx0XHR2YXIgaCA9IHI9PT1uID8gMysoYi1nKS9tIDogKGc9PT1uID8gNSsoci1iKS9tIDogMSsoZy1yKS9tKTtcclxuXHRcdFx0cmV0dXJuIFtcclxuXHRcdFx0XHQ2MCAqIChoPT09Nj8wOmgpLFxyXG5cdFx0XHRcdDEwMCAqIChtL3YpLFxyXG5cdFx0XHRcdDEwMCAqIHZcclxuXHRcdFx0XTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gaDogMC0zNjBcclxuXHRcdC8vIHM6IDAtMTAwXHJcblx0XHQvLyB2OiAwLTEwMFxyXG5cdFx0Ly9cclxuXHRcdC8vIHJldHVybnM6IFsgMC0yNTUsIDAtMjU1LCAwLTI1NSBdXHJcblx0XHQvL1xyXG5cdFx0ZnVuY3Rpb24gSFNWX1JHQiAoaCwgcywgdikge1xyXG5cdFx0XHR2YXIgdSA9IDI1NSAqICh2IC8gMTAwKTtcclxuXHJcblx0XHRcdGlmIChoID09PSBudWxsKSB7XHJcblx0XHRcdFx0cmV0dXJuIFsgdSwgdSwgdSBdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRoIC89IDYwO1xyXG5cdFx0XHRzIC89IDEwMDtcclxuXHJcblx0XHRcdHZhciBpID0gTWF0aC5mbG9vcihoKTtcclxuXHRcdFx0dmFyIGYgPSBpJTIgPyBoLWkgOiAxLShoLWkpO1xyXG5cdFx0XHR2YXIgbSA9IHUgKiAoMSAtIHMpO1xyXG5cdFx0XHR2YXIgbiA9IHUgKiAoMSAtIHMgKiBmKTtcclxuXHRcdFx0c3dpdGNoIChpKSB7XHJcblx0XHRcdFx0Y2FzZSA2OlxyXG5cdFx0XHRcdGNhc2UgMDogcmV0dXJuIFt1LG4sbV07XHJcblx0XHRcdFx0Y2FzZSAxOiByZXR1cm4gW24sdSxtXTtcclxuXHRcdFx0XHRjYXNlIDI6IHJldHVybiBbbSx1LG5dO1xyXG5cdFx0XHRcdGNhc2UgMzogcmV0dXJuIFttLG4sdV07XHJcblx0XHRcdFx0Y2FzZSA0OiByZXR1cm4gW24sbSx1XTtcclxuXHRcdFx0XHRjYXNlIDU6IHJldHVybiBbdSxtLG5dO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGRldGFjaFBpY2tlciAoKSB7XHJcblx0XHRcdGpzYy51bnNldENsYXNzKFRISVMudGFyZ2V0RWxlbWVudCwgVEhJUy5hY3RpdmVDbGFzcyk7XHJcblx0XHRcdGpzYy5waWNrZXIud3JhcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGpzYy5waWNrZXIud3JhcCk7XHJcblx0XHRcdGRlbGV0ZSBqc2MucGlja2VyLm93bmVyO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBkcmF3UGlja2VyICgpIHtcclxuXHJcblx0XHRcdC8vIEF0IHRoaXMgcG9pbnQsIHdoZW4gZHJhd2luZyB0aGUgcGlja2VyLCB3ZSBrbm93IHdoYXQgdGhlIHBhcmVudCBlbGVtZW50cyBhcmVcclxuXHRcdFx0Ly8gYW5kIHdlIGNhbiBkbyBhbGwgcmVsYXRlZCBET00gb3BlcmF0aW9ucywgc3VjaCBhcyByZWdpc3RlcmluZyBldmVudHMgb24gdGhlbVxyXG5cdFx0XHQvLyBvciBjaGVja2luZyB0aGVpciBwb3NpdGlvbmluZ1xyXG5cdFx0XHRUSElTLl9wcm9jZXNzUGFyZW50RWxlbWVudHNJbkRPTSgpO1xyXG5cclxuXHRcdFx0aWYgKCFqc2MucGlja2VyKSB7XHJcblx0XHRcdFx0anNjLnBpY2tlciA9IHtcclxuXHRcdFx0XHRcdG93bmVyOiBudWxsLFxyXG5cdFx0XHRcdFx0d3JhcCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG5cdFx0XHRcdFx0Ym94IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRib3hTIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIC8vIHNoYWRvdyBhcmVhXHJcblx0XHRcdFx0XHRib3hCIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIC8vIGJvcmRlclxyXG5cdFx0XHRcdFx0cGFkIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRwYWRCIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIC8vIGJvcmRlclxyXG5cdFx0XHRcdFx0cGFkTSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCAvLyBtb3VzZS90b3VjaCBhcmVhXHJcblx0XHRcdFx0XHRwYWRQYWwgOiBqc2MuY3JlYXRlUGFsZXR0ZSgpLFxyXG5cdFx0XHRcdFx0Y3Jvc3MgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0XHRcdGNyb3NzQlkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgLy8gYm9yZGVyIFlcclxuXHRcdFx0XHRcdGNyb3NzQlggOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgLy8gYm9yZGVyIFhcclxuXHRcdFx0XHRcdGNyb3NzTFkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgLy8gbGluZSBZXHJcblx0XHRcdFx0XHRjcm9zc0xYIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIC8vIGxpbmUgWFxyXG5cdFx0XHRcdFx0c2xkIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRzbGRCIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIC8vIGJvcmRlclxyXG5cdFx0XHRcdFx0c2xkTSA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCAvLyBtb3VzZS90b3VjaCBhcmVhXHJcblx0XHRcdFx0XHRzbGRHcmFkIDoganNjLmNyZWF0ZVNsaWRlckdyYWRpZW50KCksXHJcblx0XHRcdFx0XHRzbGRQdHJTIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIC8vIHNsaWRlciBwb2ludGVyIHNwYWNlclxyXG5cdFx0XHRcdFx0c2xkUHRySUIgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgLy8gc2xpZGVyIHBvaW50ZXIgaW5uZXIgYm9yZGVyXHJcblx0XHRcdFx0XHRzbGRQdHJNQiA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCAvLyBzbGlkZXIgcG9pbnRlciBtaWRkbGUgYm9yZGVyXHJcblx0XHRcdFx0XHRzbGRQdHJPQiA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCAvLyBzbGlkZXIgcG9pbnRlciBvdXRlciBib3JkZXJcclxuXHRcdFx0XHRcdGJ0biA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG5cdFx0XHRcdFx0YnRuVCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSAvLyB0ZXh0XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0anNjLnBpY2tlci5wYWQuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5wYWRQYWwuZWxtKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLnBhZEIuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5wYWQpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuY3Jvc3MuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5jcm9zc0JZKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLmNyb3NzLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuY3Jvc3NCWCk7XHJcblx0XHRcdFx0anNjLnBpY2tlci5jcm9zcy5hcHBlbmRDaGlsZChqc2MucGlja2VyLmNyb3NzTFkpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuY3Jvc3MuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5jcm9zc0xYKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLnBhZEIuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5jcm9zcyk7XHJcblx0XHRcdFx0anNjLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5wYWRCKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLmJveC5hcHBlbmRDaGlsZChqc2MucGlja2VyLnBhZE0pO1xyXG5cclxuXHRcdFx0XHRqc2MucGlja2VyLnNsZC5hcHBlbmRDaGlsZChqc2MucGlja2VyLnNsZEdyYWQuZWxtKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLnNsZEIuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5zbGQpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuc2xkQi5hcHBlbmRDaGlsZChqc2MucGlja2VyLnNsZFB0ck9CKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLnNsZFB0ck9CLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuc2xkUHRyTUIpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuc2xkUHRyTUIuYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5zbGRQdHJJQik7XHJcblx0XHRcdFx0anNjLnBpY2tlci5zbGRQdHJJQi5hcHBlbmRDaGlsZChqc2MucGlja2VyLnNsZFB0clMpO1xyXG5cdFx0XHRcdGpzYy5waWNrZXIuYm94LmFwcGVuZENoaWxkKGpzYy5waWNrZXIuc2xkQik7XHJcblx0XHRcdFx0anNjLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5zbGRNKTtcclxuXHJcblx0XHRcdFx0anNjLnBpY2tlci5idG4uYXBwZW5kQ2hpbGQoanNjLnBpY2tlci5idG5UKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLmJveC5hcHBlbmRDaGlsZChqc2MucGlja2VyLmJ0bik7XHJcblxyXG5cdFx0XHRcdGpzYy5waWNrZXIuYm94Qi5hcHBlbmRDaGlsZChqc2MucGlja2VyLmJveCk7XHJcblx0XHRcdFx0anNjLnBpY2tlci53cmFwLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuYm94Uyk7XHJcblx0XHRcdFx0anNjLnBpY2tlci53cmFwLmFwcGVuZENoaWxkKGpzYy5waWNrZXIuYm94Qik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBwID0ganNjLnBpY2tlcjtcclxuXHJcblx0XHRcdHZhciBkaXNwbGF5U2xpZGVyID0gISFqc2MuZ2V0U2xpZGVyQ29tcG9uZW50KFRISVMpO1xyXG5cdFx0XHR2YXIgZGltcyA9IGpzYy5nZXRQaWNrZXJEaW1zKFRISVMpO1xyXG5cdFx0XHR2YXIgY3Jvc3NPdXRlclNpemUgPSAoMiAqIFRISVMucG9pbnRlckJvcmRlcldpZHRoICsgVEhJUy5wb2ludGVyVGhpY2tuZXNzICsgMiAqIFRISVMuY3Jvc3NTaXplKTtcclxuXHRcdFx0dmFyIHBhZFRvU2xpZGVyUGFkZGluZyA9IGpzYy5nZXRQYWRUb1NsaWRlclBhZGRpbmcoVEhJUyk7XHJcblx0XHRcdHZhciBib3JkZXJSYWRpdXMgPSBNYXRoLm1pbihcclxuXHRcdFx0XHRUSElTLmJvcmRlclJhZGl1cyxcclxuXHRcdFx0XHRNYXRoLnJvdW5kKFRISVMucGFkZGluZyAqIE1hdGguUEkpKTsgLy8gcHhcclxuXHRcdFx0dmFyIHBhZEN1cnNvciA9ICdjcm9zc2hhaXInO1xyXG5cclxuXHRcdFx0Ly8gd3JhcFxyXG5cdFx0XHRwLndyYXAuc3R5bGUuY2xlYXIgPSAnYm90aCc7XHJcblx0XHRcdHAud3JhcC5zdHlsZS53aWR0aCA9IChkaW1zWzBdICsgMiAqIFRISVMuYm9yZGVyV2lkdGgpICsgJ3B4JztcclxuXHRcdFx0cC53cmFwLnN0eWxlLmhlaWdodCA9IChkaW1zWzFdICsgMiAqIFRISVMuYm9yZGVyV2lkdGgpICsgJ3B4JztcclxuXHRcdFx0cC53cmFwLnN0eWxlLnpJbmRleCA9IFRISVMuekluZGV4O1xyXG5cclxuXHRcdFx0Ly8gcGlja2VyXHJcblx0XHRcdHAuYm94LnN0eWxlLndpZHRoID0gZGltc1swXSArICdweCc7XHJcblx0XHRcdHAuYm94LnN0eWxlLmhlaWdodCA9IGRpbXNbMV0gKyAncHgnO1xyXG5cclxuXHRcdFx0cC5ib3hTLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5ib3hTLnN0eWxlLmxlZnQgPSAnMCc7XHJcblx0XHRcdHAuYm94Uy5zdHlsZS50b3AgPSAnMCc7XHJcblx0XHRcdHAuYm94Uy5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuXHRcdFx0cC5ib3hTLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuXHRcdFx0anNjLnNldEJvcmRlclJhZGl1cyhwLmJveFMsIGJvcmRlclJhZGl1cyArICdweCcpO1xyXG5cclxuXHRcdFx0Ly8gcGlja2VyIGJvcmRlclxyXG5cdFx0XHRwLmJveEIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUuYm9yZGVyID0gVEhJUy5ib3JkZXJXaWR0aCArICdweCBzb2xpZCc7XHJcblx0XHRcdHAuYm94Qi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMuYm9yZGVyQ29sb3I7XHJcblx0XHRcdHAuYm94Qi5zdHlsZS5iYWNrZ3JvdW5kID0gVEhJUy5iYWNrZ3JvdW5kQ29sb3I7XHJcblx0XHRcdGpzYy5zZXRCb3JkZXJSYWRpdXMocC5ib3hCLCBib3JkZXJSYWRpdXMgKyAncHgnKTtcclxuXHJcblx0XHRcdC8vIElFIGhhY2s6XHJcblx0XHRcdC8vIElmIHRoZSBlbGVtZW50IGlzIHRyYW5zcGFyZW50LCBJRSB3aWxsIHRyaWdnZXIgdGhlIGV2ZW50IG9uIHRoZSBlbGVtZW50cyB1bmRlciBpdCxcclxuXHRcdFx0Ly8gZS5nLiBvbiBDYW52YXMgb3Igb24gZWxlbWVudHMgd2l0aCBib3JkZXJcclxuXHRcdFx0cC5wYWRNLnN0eWxlLmJhY2tncm91bmQgPVxyXG5cdFx0XHRwLnNsZE0uc3R5bGUuYmFja2dyb3VuZCA9XHJcblx0XHRcdFx0JyNGRkYnO1xyXG5cdFx0XHRqc2Muc2V0U3R5bGUocC5wYWRNLCAnb3BhY2l0eScsICcwJyk7XHJcblx0XHRcdGpzYy5zZXRTdHlsZShwLnNsZE0sICdvcGFjaXR5JywgJzAnKTtcclxuXHJcblx0XHRcdC8vIHBhZFxyXG5cdFx0XHRwLnBhZC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcblx0XHRcdHAucGFkLnN0eWxlLndpZHRoID0gVEhJUy53aWR0aCArICdweCc7XHJcblx0XHRcdHAucGFkLnN0eWxlLmhlaWdodCA9IFRISVMuaGVpZ2h0ICsgJ3B4JztcclxuXHJcblx0XHRcdC8vIHBhZCBwYWxldHRlcyAoSFNWIGFuZCBIVlMpXHJcblx0XHRcdHAucGFkUGFsLmRyYXcoVEhJUy53aWR0aCwgVEhJUy5oZWlnaHQsIGpzYy5nZXRQYWRZQ29tcG9uZW50KFRISVMpKTtcclxuXHJcblx0XHRcdC8vIHBhZCBib3JkZXJcclxuXHRcdFx0cC5wYWRCLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5wYWRCLnN0eWxlLmxlZnQgPSBUSElTLnBhZGRpbmcgKyAncHgnO1xyXG5cdFx0XHRwLnBhZEIuc3R5bGUudG9wID0gVEhJUy5wYWRkaW5nICsgJ3B4JztcclxuXHRcdFx0cC5wYWRCLnN0eWxlLmJvcmRlciA9IFRISVMuaW5zZXRXaWR0aCArICdweCBzb2xpZCc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMuaW5zZXRDb2xvcjtcclxuXHJcblx0XHRcdC8vIHBhZCBtb3VzZSBhcmVhXHJcblx0XHRcdHAucGFkTS5fanNjSW5zdGFuY2UgPSBUSElTO1xyXG5cdFx0XHRwLnBhZE0uX2pzY0NvbnRyb2xOYW1lID0gJ3BhZCc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5sZWZ0ID0gJzAnO1xyXG5cdFx0XHRwLnBhZE0uc3R5bGUudG9wID0gJzAnO1xyXG5cdFx0XHRwLnBhZE0uc3R5bGUud2lkdGggPSAoVEhJUy5wYWRkaW5nICsgMiAqIFRISVMuaW5zZXRXaWR0aCArIFRISVMud2lkdGggKyBwYWRUb1NsaWRlclBhZGRpbmcgLyAyKSArICdweCc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5oZWlnaHQgPSBkaW1zWzFdICsgJ3B4JztcclxuXHRcdFx0cC5wYWRNLnN0eWxlLmN1cnNvciA9IHBhZEN1cnNvcjtcclxuXHJcblx0XHRcdC8vIHBhZCBjcm9zc1xyXG5cdFx0XHRwLmNyb3NzLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5jcm9zcy5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0cC5jcm9zcy5zdHlsZS50b3AgPVxyXG5cdFx0XHRcdCcwJztcclxuXHRcdFx0cC5jcm9zcy5zdHlsZS53aWR0aCA9XHJcblx0XHRcdHAuY3Jvc3Muc3R5bGUuaGVpZ2h0ID1cclxuXHRcdFx0XHRjcm9zc091dGVyU2l6ZSArICdweCc7XHJcblxyXG5cdFx0XHQvLyBwYWQgY3Jvc3MgYm9yZGVyIFkgYW5kIFhcclxuXHRcdFx0cC5jcm9zc0JZLnN0eWxlLnBvc2l0aW9uID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLnBvc2l0aW9uID1cclxuXHRcdFx0XHQnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLmNyb3NzQlkuc3R5bGUuYmFja2dyb3VuZCA9XHJcblx0XHRcdHAuY3Jvc3NCWC5zdHlsZS5iYWNrZ3JvdW5kID1cclxuXHRcdFx0XHRUSElTLnBvaW50ZXJCb3JkZXJDb2xvcjtcclxuXHRcdFx0cC5jcm9zc0JZLnN0eWxlLndpZHRoID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLmhlaWdodCA9XHJcblx0XHRcdFx0KDIgKiBUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCArIFRISVMucG9pbnRlclRoaWNrbmVzcykgKyAncHgnO1xyXG5cdFx0XHRwLmNyb3NzQlkuc3R5bGUuaGVpZ2h0ID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLndpZHRoID1cclxuXHRcdFx0XHRjcm9zc091dGVyU2l6ZSArICdweCc7XHJcblx0XHRcdHAuY3Jvc3NCWS5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLnRvcCA9XHJcblx0XHRcdFx0KE1hdGguZmxvb3IoY3Jvc3NPdXRlclNpemUgLyAyKSAtIE1hdGguZmxvb3IoVEhJUy5wb2ludGVyVGhpY2tuZXNzIC8gMikgLSBUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCkgKyAncHgnO1xyXG5cdFx0XHRwLmNyb3NzQlkuc3R5bGUudG9wID1cclxuXHRcdFx0cC5jcm9zc0JYLnN0eWxlLmxlZnQgPVxyXG5cdFx0XHRcdCcwJztcclxuXHJcblx0XHRcdC8vIHBhZCBjcm9zcyBsaW5lIFkgYW5kIFhcclxuXHRcdFx0cC5jcm9zc0xZLnN0eWxlLnBvc2l0aW9uID1cclxuXHRcdFx0cC5jcm9zc0xYLnN0eWxlLnBvc2l0aW9uID1cclxuXHRcdFx0XHQnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLmNyb3NzTFkuc3R5bGUuYmFja2dyb3VuZCA9XHJcblx0XHRcdHAuY3Jvc3NMWC5zdHlsZS5iYWNrZ3JvdW5kID1cclxuXHRcdFx0XHRUSElTLnBvaW50ZXJDb2xvcjtcclxuXHRcdFx0cC5jcm9zc0xZLnN0eWxlLmhlaWdodCA9XHJcblx0XHRcdHAuY3Jvc3NMWC5zdHlsZS53aWR0aCA9XHJcblx0XHRcdFx0KGNyb3NzT3V0ZXJTaXplIC0gMiAqIFRISVMucG9pbnRlckJvcmRlcldpZHRoKSArICdweCc7XHJcblx0XHRcdHAuY3Jvc3NMWS5zdHlsZS53aWR0aCA9XHJcblx0XHRcdHAuY3Jvc3NMWC5zdHlsZS5oZWlnaHQgPVxyXG5cdFx0XHRcdFRISVMucG9pbnRlclRoaWNrbmVzcyArICdweCc7XHJcblx0XHRcdHAuY3Jvc3NMWS5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0cC5jcm9zc0xYLnN0eWxlLnRvcCA9XHJcblx0XHRcdFx0KE1hdGguZmxvb3IoY3Jvc3NPdXRlclNpemUgLyAyKSAtIE1hdGguZmxvb3IoVEhJUy5wb2ludGVyVGhpY2tuZXNzIC8gMikpICsgJ3B4JztcclxuXHRcdFx0cC5jcm9zc0xZLnN0eWxlLnRvcCA9XHJcblx0XHRcdHAuY3Jvc3NMWC5zdHlsZS5sZWZ0ID1cclxuXHRcdFx0XHRUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCArICdweCc7XHJcblxyXG5cdFx0XHQvLyBzbGlkZXJcclxuXHRcdFx0cC5zbGQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuXHRcdFx0cC5zbGQuc3R5bGUud2lkdGggPSBUSElTLnNsaWRlclNpemUgKyAncHgnO1xyXG5cdFx0XHRwLnNsZC5zdHlsZS5oZWlnaHQgPSBUSElTLmhlaWdodCArICdweCc7XHJcblxyXG5cdFx0XHQvLyBzbGlkZXIgZ3JhZGllbnRcclxuXHRcdFx0cC5zbGRHcmFkLmRyYXcoVEhJUy5zbGlkZXJTaXplLCBUSElTLmhlaWdodCwgJyMwMDAnLCAnIzAwMCcpO1xyXG5cclxuXHRcdFx0Ly8gc2xpZGVyIGJvcmRlclxyXG5cdFx0XHRwLnNsZEIuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlTbGlkZXIgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cdFx0XHRwLnNsZEIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLnNsZEIuc3R5bGUucmlnaHQgPSBUSElTLnBhZGRpbmcgKyAncHgnO1xyXG5cdFx0XHRwLnNsZEIuc3R5bGUudG9wID0gVEhJUy5wYWRkaW5nICsgJ3B4JztcclxuXHRcdFx0cC5zbGRCLnN0eWxlLmJvcmRlciA9IFRISVMuaW5zZXRXaWR0aCArICdweCBzb2xpZCc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMuaW5zZXRDb2xvcjtcclxuXHJcblx0XHRcdC8vIHNsaWRlciBtb3VzZSBhcmVhXHJcblx0XHRcdHAuc2xkTS5fanNjSW5zdGFuY2UgPSBUSElTO1xyXG5cdFx0XHRwLnNsZE0uX2pzY0NvbnRyb2xOYW1lID0gJ3NsZCc7XHJcblx0XHRcdHAuc2xkTS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVNsaWRlciA/ICdibG9jaycgOiAnbm9uZSc7XHJcblx0XHRcdHAuc2xkTS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAuc2xkTS5zdHlsZS5yaWdodCA9ICcwJztcclxuXHRcdFx0cC5zbGRNLnN0eWxlLnRvcCA9ICcwJztcclxuXHRcdFx0cC5zbGRNLnN0eWxlLndpZHRoID0gKFRISVMuc2xpZGVyU2l6ZSArIHBhZFRvU2xpZGVyUGFkZGluZyAvIDIgKyBUSElTLnBhZGRpbmcgKyAyICogVEhJUy5pbnNldFdpZHRoKSArICdweCc7XHJcblx0XHRcdHAuc2xkTS5zdHlsZS5oZWlnaHQgPSBkaW1zWzFdICsgJ3B4JztcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcclxuXHJcblx0XHRcdC8vIHNsaWRlciBwb2ludGVyIGlubmVyIGFuZCBvdXRlciBib3JkZXJcclxuXHRcdFx0cC5zbGRQdHJJQi5zdHlsZS5ib3JkZXIgPVxyXG5cdFx0XHRwLnNsZFB0ck9CLnN0eWxlLmJvcmRlciA9XHJcblx0XHRcdFx0VEhJUy5wb2ludGVyQm9yZGVyV2lkdGggKyAncHggc29saWQgJyArIFRISVMucG9pbnRlckJvcmRlckNvbG9yO1xyXG5cclxuXHRcdFx0Ly8gc2xpZGVyIHBvaW50ZXIgb3V0ZXIgYm9yZGVyXHJcblx0XHRcdHAuc2xkUHRyT0Iuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLnNsZFB0ck9CLnN0eWxlLmxlZnQgPSAtKDIgKiBUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCArIFRISVMucG9pbnRlclRoaWNrbmVzcykgKyAncHgnO1xyXG5cdFx0XHRwLnNsZFB0ck9CLnN0eWxlLnRvcCA9ICcwJztcclxuXHJcblx0XHRcdC8vIHNsaWRlciBwb2ludGVyIG1pZGRsZSBib3JkZXJcclxuXHRcdFx0cC5zbGRQdHJNQi5zdHlsZS5ib3JkZXIgPSBUSElTLnBvaW50ZXJUaGlja25lc3MgKyAncHggc29saWQgJyArIFRISVMucG9pbnRlckNvbG9yO1xyXG5cclxuXHRcdFx0Ly8gc2xpZGVyIHBvaW50ZXIgc3BhY2VyXHJcblx0XHRcdHAuc2xkUHRyUy5zdHlsZS53aWR0aCA9IFRISVMuc2xpZGVyU2l6ZSArICdweCc7XHJcblx0XHRcdHAuc2xkUHRyUy5zdHlsZS5oZWlnaHQgPSBzbGlkZXJQdHJTcGFjZSArICdweCc7XHJcblxyXG5cdFx0XHQvLyB0aGUgQ2xvc2UgYnV0dG9uXHJcblx0XHRcdGZ1bmN0aW9uIHNldEJ0bkJvcmRlciAoKSB7XHJcblx0XHRcdFx0dmFyIGluc2V0Q29sb3JzID0gVEhJUy5pbnNldENvbG9yLnNwbGl0KC9cXHMrLyk7XHJcblx0XHRcdFx0dmFyIG91dHNldENvbG9yID0gaW5zZXRDb2xvcnMubGVuZ3RoIDwgMiA/IGluc2V0Q29sb3JzWzBdIDogaW5zZXRDb2xvcnNbMV0gKyAnICcgKyBpbnNldENvbG9yc1swXSArICcgJyArIGluc2V0Q29sb3JzWzBdICsgJyAnICsgaW5zZXRDb2xvcnNbMV07XHJcblx0XHRcdFx0cC5idG4uc3R5bGUuYm9yZGVyQ29sb3IgPSBvdXRzZXRDb2xvcjtcclxuXHRcdFx0fVxyXG5cdFx0XHRwLmJ0bi5zdHlsZS5kaXNwbGF5ID0gVEhJUy5jbG9zYWJsZSA/ICdibG9jaycgOiAnbm9uZSc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5idG4uc3R5bGUubGVmdCA9IFRISVMucGFkZGluZyArICdweCc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmJvdHRvbSA9IFRISVMucGFkZGluZyArICdweCc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLnBhZGRpbmcgPSAnMCAxNXB4JztcclxuXHRcdFx0cC5idG4uc3R5bGUuaGVpZ2h0ID0gVEhJUy5idXR0b25IZWlnaHQgKyAncHgnO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5ib3JkZXIgPSBUSElTLmluc2V0V2lkdGggKyAncHggc29saWQnO1xyXG5cdFx0XHRzZXRCdG5Cb3JkZXIoKTtcclxuXHRcdFx0cC5idG4uc3R5bGUuY29sb3IgPSBUSElTLmJ1dHRvbkNvbG9yO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5mb250ID0gJzEycHggc2Fucy1zZXJpZic7XHJcblx0XHRcdHAuYnRuLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHAuYnRuLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcclxuXHRcdFx0fSBjYXRjaChlT2xkSUUpIHtcclxuXHRcdFx0XHRwLmJ0bi5zdHlsZS5jdXJzb3IgPSAnaGFuZCc7XHJcblx0XHRcdH1cclxuXHRcdFx0cC5idG4ub25tb3VzZWRvd24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0VEhJUy5oaWRlKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdHAuYnRuVC5zdHlsZS5saW5lSGVpZ2h0ID0gVEhJUy5idXR0b25IZWlnaHQgKyAncHgnO1xyXG5cdFx0XHRwLmJ0blQuaW5uZXJIVE1MID0gJyc7XHJcblx0XHRcdHAuYnRuVC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShUSElTLmNsb3NlVGV4dCkpO1xyXG5cclxuXHRcdFx0Ly8gcGxhY2UgcG9pbnRlcnNcclxuXHRcdFx0cmVkcmF3UGFkKCk7XHJcblx0XHRcdHJlZHJhd1NsZCgpO1xyXG5cclxuXHRcdFx0Ly8gSWYgd2UgYXJlIGNoYW5naW5nIHRoZSBvd25lciB3aXRob3V0IGZpcnN0IGNsb3NpbmcgdGhlIHBpY2tlcixcclxuXHRcdFx0Ly8gbWFrZSBzdXJlIHRvIGZpcnN0IGRlYWwgd2l0aCB0aGUgb2xkIG93bmVyXHJcblx0XHRcdGlmIChqc2MucGlja2VyLm93bmVyICYmIGpzYy5waWNrZXIub3duZXIgIT09IFRISVMpIHtcclxuXHRcdFx0XHRqc2MudW5zZXRDbGFzcyhqc2MucGlja2VyLm93bmVyLnRhcmdldEVsZW1lbnQsIFRISVMuYWN0aXZlQ2xhc3MpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBTZXQgdGhlIG5ldyBwaWNrZXIgb3duZXJcclxuXHRcdFx0anNjLnBpY2tlci5vd25lciA9IFRISVM7XHJcblxyXG5cdFx0XHQvLyBUaGUgcmVkcmF3UG9zaXRpb24oKSBtZXRob2QgbmVlZHMgcGlja2VyLm93bmVyIHRvIGJlIHNldCwgdGhhdCdzIHdoeSB3ZSBjYWxsIGl0IGhlcmUsXHJcblx0XHRcdC8vIGFmdGVyIHNldHRpbmcgdGhlIG93bmVyXHJcblx0XHRcdGlmIChqc2MuaXNFbGVtZW50VHlwZShjb250YWluZXIsICdib2R5JykpIHtcclxuXHRcdFx0XHRqc2MucmVkcmF3UG9zaXRpb24oKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRqc2MuX2RyYXdQb3NpdGlvbihUSElTLCAwLCAwLCAncmVsYXRpdmUnLCBmYWxzZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwLndyYXAucGFyZW50Tm9kZSAhPSBjb250YWluZXIpIHtcclxuXHRcdFx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQocC53cmFwKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0anNjLnNldENsYXNzKFRISVMudGFyZ2V0RWxlbWVudCwgVEhJUy5hY3RpdmVDbGFzcyk7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlZHJhd1BhZCAoKSB7XHJcblx0XHRcdC8vIHJlZHJhdyB0aGUgcGFkIHBvaW50ZXJcclxuXHRcdFx0c3dpdGNoIChqc2MuZ2V0UGFkWUNvbXBvbmVudChUSElTKSkge1xyXG5cdFx0XHRjYXNlICdzJzogdmFyIHlDb21wb25lbnQgPSAxOyBicmVhaztcclxuXHRcdFx0Y2FzZSAndic6IHZhciB5Q29tcG9uZW50ID0gMjsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHggPSBNYXRoLnJvdW5kKChUSElTLmhzdlswXSAvIDM2MCkgKiAoVEhJUy53aWR0aCAtIDEpKTtcclxuXHRcdFx0dmFyIHkgPSBNYXRoLnJvdW5kKCgxIC0gVEhJUy5oc3ZbeUNvbXBvbmVudF0gLyAxMDApICogKFRISVMuaGVpZ2h0IC0gMSkpO1xyXG5cdFx0XHR2YXIgY3Jvc3NPdXRlclNpemUgPSAoMiAqIFRISVMucG9pbnRlckJvcmRlcldpZHRoICsgVEhJUy5wb2ludGVyVGhpY2tuZXNzICsgMiAqIFRISVMuY3Jvc3NTaXplKTtcclxuXHRcdFx0dmFyIG9mcyA9IC1NYXRoLmZsb29yKGNyb3NzT3V0ZXJTaXplIC8gMik7XHJcblx0XHRcdGpzYy5waWNrZXIuY3Jvc3Muc3R5bGUubGVmdCA9ICh4ICsgb2ZzKSArICdweCc7XHJcblx0XHRcdGpzYy5waWNrZXIuY3Jvc3Muc3R5bGUudG9wID0gKHkgKyBvZnMpICsgJ3B4JztcclxuXHJcblx0XHRcdC8vIHJlZHJhdyB0aGUgc2xpZGVyXHJcblx0XHRcdHN3aXRjaCAoanNjLmdldFNsaWRlckNvbXBvbmVudChUSElTKSkge1xyXG5cdFx0XHRjYXNlICdzJzpcclxuXHRcdFx0XHR2YXIgcmdiMSA9IEhTVl9SR0IoVEhJUy5oc3ZbMF0sIDEwMCwgVEhJUy5oc3ZbMl0pO1xyXG5cdFx0XHRcdHZhciByZ2IyID0gSFNWX1JHQihUSElTLmhzdlswXSwgMCwgVEhJUy5oc3ZbMl0pO1xyXG5cdFx0XHRcdHZhciBjb2xvcjEgPSAncmdiKCcgK1xyXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChyZ2IxWzBdKSArICcsJyArXHJcblx0XHRcdFx0XHRNYXRoLnJvdW5kKHJnYjFbMV0pICsgJywnICtcclxuXHRcdFx0XHRcdE1hdGgucm91bmQocmdiMVsyXSkgKyAnKSc7XHJcblx0XHRcdFx0dmFyIGNvbG9yMiA9ICdyZ2IoJyArXHJcblx0XHRcdFx0XHRNYXRoLnJvdW5kKHJnYjJbMF0pICsgJywnICtcclxuXHRcdFx0XHRcdE1hdGgucm91bmQocmdiMlsxXSkgKyAnLCcgK1xyXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChyZ2IyWzJdKSArICcpJztcclxuXHRcdFx0XHRqc2MucGlja2VyLnNsZEdyYWQuZHJhdyhUSElTLnNsaWRlclNpemUsIFRISVMuaGVpZ2h0LCBjb2xvcjEsIGNvbG9yMik7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3YnOlxyXG5cdFx0XHRcdHZhciByZ2IgPSBIU1ZfUkdCKFRISVMuaHN2WzBdLCBUSElTLmhzdlsxXSwgMTAwKTtcclxuXHRcdFx0XHR2YXIgY29sb3IxID0gJ3JnYignICtcclxuXHRcdFx0XHRcdE1hdGgucm91bmQocmdiWzBdKSArICcsJyArXHJcblx0XHRcdFx0XHRNYXRoLnJvdW5kKHJnYlsxXSkgKyAnLCcgK1xyXG5cdFx0XHRcdFx0TWF0aC5yb3VuZChyZ2JbMl0pICsgJyknO1xyXG5cdFx0XHRcdHZhciBjb2xvcjIgPSAnIzAwMCc7XHJcblx0XHRcdFx0anNjLnBpY2tlci5zbGRHcmFkLmRyYXcoVEhJUy5zbGlkZXJTaXplLCBUSElTLmhlaWdodCwgY29sb3IxLCBjb2xvcjIpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlZHJhd1NsZCAoKSB7XHJcblx0XHRcdHZhciBzbGRDb21wb25lbnQgPSBqc2MuZ2V0U2xpZGVyQ29tcG9uZW50KFRISVMpO1xyXG5cdFx0XHRpZiAoc2xkQ29tcG9uZW50KSB7XHJcblx0XHRcdFx0Ly8gcmVkcmF3IHRoZSBzbGlkZXIgcG9pbnRlclxyXG5cdFx0XHRcdHN3aXRjaCAoc2xkQ29tcG9uZW50KSB7XHJcblx0XHRcdFx0Y2FzZSAncyc6IHZhciB5Q29tcG9uZW50ID0gMTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAndic6IHZhciB5Q29tcG9uZW50ID0gMjsgYnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciB5ID0gTWF0aC5yb3VuZCgoMSAtIFRISVMuaHN2W3lDb21wb25lbnRdIC8gMTAwKSAqIChUSElTLmhlaWdodCAtIDEpKTtcclxuXHRcdFx0XHRqc2MucGlja2VyLnNsZFB0ck9CLnN0eWxlLnRvcCA9ICh5IC0gKDIgKiBUSElTLnBvaW50ZXJCb3JkZXJXaWR0aCArIFRISVMucG9pbnRlclRoaWNrbmVzcykgLSBNYXRoLmZsb29yKHNsaWRlclB0clNwYWNlIC8gMikpICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpc1BpY2tlck93bmVyICgpIHtcclxuXHRcdFx0cmV0dXJuIGpzYy5waWNrZXIgJiYganNjLnBpY2tlci5vd25lciA9PT0gVEhJUztcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gYmx1clZhbHVlICgpIHtcclxuXHRcdFx0VEhJUy5pbXBvcnRDb2xvcigpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQvLyBGaW5kIHRoZSB0YXJnZXQgZWxlbWVudFxyXG5cdFx0aWYgKHR5cGVvZiB0YXJnZXRFbGVtZW50ID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHR2YXIgaWQgPSB0YXJnZXRFbGVtZW50O1xyXG5cdFx0XHR2YXIgZWxtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG5cdFx0XHRpZiAoZWxtKSB7XHJcblx0XHRcdFx0dGhpcy50YXJnZXRFbGVtZW50ID0gZWxtO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGpzYy53YXJuKCdDb3VsZCBub3QgZmluZCB0YXJnZXQgZWxlbWVudCB3aXRoIElEIFxcJycgKyBpZCArICdcXCcnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0YXJnZXRFbGVtZW50KSB7XHJcblx0XHRcdHRoaXMudGFyZ2V0RWxlbWVudCA9IHRhcmdldEVsZW1lbnQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRqc2Mud2FybignSW52YWxpZCB0YXJnZXQgZWxlbWVudDogXFwnJyArIHRhcmdldEVsZW1lbnQgKyAnXFwnJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMudGFyZ2V0RWxlbWVudC5fanNjTGlua2VkSW5zdGFuY2UpIHtcclxuXHRcdFx0anNjLndhcm4oJ0Nhbm5vdCBsaW5rIGpzY29sb3IgdHdpY2UgdG8gdGhlIHNhbWUgZWxlbWVudC4gU2tpcHBpbmcuJyk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRoaXMudGFyZ2V0RWxlbWVudC5fanNjTGlua2VkSW5zdGFuY2UgPSB0aGlzO1xyXG5cclxuXHRcdC8vIEZpbmQgdGhlIHZhbHVlIGVsZW1lbnRcclxuXHRcdHRoaXMudmFsdWVFbGVtZW50ID0ganNjLmZldGNoRWxlbWVudCh0aGlzLnZhbHVlRWxlbWVudCk7XHJcblx0XHQvLyBGaW5kIHRoZSBzdHlsZSBlbGVtZW50XHJcblx0XHR0aGlzLnN0eWxlRWxlbWVudCA9IGpzYy5mZXRjaEVsZW1lbnQodGhpcy5zdHlsZUVsZW1lbnQpO1xyXG5cclxuXHRcdHZhciBUSElTID0gdGhpcztcclxuXHRcdHZhciBjb250YWluZXIgPVxyXG5cdFx0XHR0aGlzLmNvbnRhaW5lciA/XHJcblx0XHRcdGpzYy5mZXRjaEVsZW1lbnQodGhpcy5jb250YWluZXIpIDpcclxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTtcclxuXHRcdHZhciBzbGlkZXJQdHJTcGFjZSA9IDM7IC8vIHB4XHJcblxyXG5cdFx0Ly8gRm9yIEJVVFRPTiBlbGVtZW50cyBpdCdzIGltcG9ydGFudCB0byBzdG9wIHRoZW0gZnJvbSBzZW5kaW5nIHRoZSBmb3JtIHdoZW4gY2xpY2tlZFxyXG5cdFx0Ly8gKGUuZy4gaW4gU2FmYXJpKVxyXG5cdFx0aWYgKGpzYy5pc0VsZW1lbnRUeXBlKHRoaXMudGFyZ2V0RWxlbWVudCwgJ2J1dHRvbicpKSB7XHJcblx0XHRcdGlmICh0aGlzLnRhcmdldEVsZW1lbnQub25jbGljaykge1xyXG5cdFx0XHRcdHZhciBvcmlnQ2FsbGJhY2sgPSB0aGlzLnRhcmdldEVsZW1lbnQub25jbGljaztcclxuXHRcdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChldnQpIHtcclxuXHRcdFx0XHRcdG9yaWdDYWxsYmFjay5jYWxsKHRoaXMsIGV2dCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnRhcmdldEVsZW1lbnQub25jbGljayA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGZhbHNlOyB9O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0LypcclxuXHRcdHZhciBlbG0gPSB0aGlzLnRhcmdldEVsZW1lbnQ7XHJcblx0XHRkbyB7XHJcblx0XHRcdC8vIElmIHRoZSB0YXJnZXQgZWxlbWVudCBvciBvbmUgb2YgaXRzIG9mZnNldFBhcmVudHMgaGFzIGZpeGVkIHBvc2l0aW9uLFxyXG5cdFx0XHQvLyB0aGVuIHVzZSBmaXhlZCBwb3NpdGlvbmluZyBpbnN0ZWFkXHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIE5vdGU6IEluIEZpcmVmb3gsIGdldENvbXB1dGVkU3R5bGUgcmV0dXJucyBudWxsIGluIGEgaGlkZGVuIGlmcmFtZSxcclxuXHRcdFx0Ly8gdGhhdCdzIHdoeSB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSByZXR1cm5lZCBzdHlsZSBvYmplY3QgaXMgbm9uLWVtcHR5XHJcblx0XHRcdHZhciBjdXJyU3R5bGUgPSBqc2MuZ2V0U3R5bGUoZWxtKTtcclxuXHRcdFx0aWYgKGN1cnJTdHlsZSAmJiBjdXJyU3R5bGUucG9zaXRpb24udG9Mb3dlckNhc2UoKSA9PT0gJ2ZpeGVkJykge1xyXG5cdFx0XHRcdHRoaXMuZml4ZWQgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoZWxtICE9PSB0aGlzLnRhcmdldEVsZW1lbnQpIHtcclxuXHRcdFx0XHQvLyBhdHRhY2ggb25QYXJlbnRTY3JvbGwgc28gdGhhdCB3ZSBjYW4gcmVjb21wdXRlIHRoZSBwaWNrZXIgcG9zaXRpb25cclxuXHRcdFx0XHQvLyB3aGVuIG9uZSBvZiB0aGUgb2Zmc2V0UGFyZW50cyBpcyBzY3JvbGxlZFxyXG5cdFx0XHRcdGlmICghZWxtLl9qc2NFdmVudHNBdHRhY2hlZCkge1xyXG5cdFx0XHRcdFx0anNjLmF0dGFjaEV2ZW50KGVsbSwgJ3Njcm9sbCcsIGpzYy5vblBhcmVudFNjcm9sbCk7XHJcblx0XHRcdFx0XHRlbG0uX2pzY0V2ZW50c0F0dGFjaGVkID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0gd2hpbGUgKChlbG0gPSBlbG0ub2Zmc2V0UGFyZW50KSAmJiAhanNjLmlzRWxlbWVudFR5cGUoZWxtLCAnYm9keScpKTtcclxuXHRcdCovXHJcblxyXG5cdFx0Ly8gdmFsdWVFbGVtZW50XHJcblx0XHRpZiAodGhpcy52YWx1ZUVsZW1lbnQpIHtcclxuXHRcdFx0aWYgKGpzYy5pc0VsZW1lbnRUeXBlKHRoaXMudmFsdWVFbGVtZW50LCAnaW5wdXQnKSkge1xyXG5cdFx0XHRcdHZhciB1cGRhdGVGaWVsZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFRISVMuZnJvbVN0cmluZyhUSElTLnZhbHVlRWxlbWVudC52YWx1ZSwganNjLmxlYXZlVmFsdWUpO1xyXG5cdFx0XHRcdFx0anNjLmRpc3BhdGNoRmluZUNoYW5nZShUSElTKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGpzYy5hdHRhY2hFdmVudCh0aGlzLnZhbHVlRWxlbWVudCwgJ2tleXVwJywgdXBkYXRlRmllbGQpO1xyXG5cdFx0XHRcdGpzYy5hdHRhY2hFdmVudCh0aGlzLnZhbHVlRWxlbWVudCwgJ2lucHV0JywgdXBkYXRlRmllbGQpO1xyXG5cdFx0XHRcdGpzYy5hdHRhY2hFdmVudCh0aGlzLnZhbHVlRWxlbWVudCwgJ2JsdXInLCBibHVyVmFsdWUpO1xyXG5cdFx0XHRcdHRoaXMudmFsdWVFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXV0b2NvbXBsZXRlJywgJ29mZicpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc3R5bGVFbGVtZW50XHJcblx0XHRpZiAodGhpcy5zdHlsZUVsZW1lbnQpIHtcclxuXHRcdFx0dGhpcy5zdHlsZUVsZW1lbnQuX2pzY09yaWdTdHlsZSA9IHtcclxuXHRcdFx0XHRiYWNrZ3JvdW5kSW1hZ2UgOiB0aGlzLnN0eWxlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UsXHJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yIDogdGhpcy5zdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yLFxyXG5cdFx0XHRcdGNvbG9yIDogdGhpcy5zdHlsZUVsZW1lbnQuc3R5bGUuY29sb3JcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy52YWx1ZSkge1xyXG5cdFx0XHQvLyBUcnkgdG8gc2V0IHRoZSBjb2xvciBmcm9tIHRoZSAudmFsdWUgb3B0aW9uIGFuZCBpZiB1bnN1Y2Nlc3NmdWwsXHJcblx0XHRcdC8vIGV4cG9ydCB0aGUgY3VycmVudCBjb2xvclxyXG5cdFx0XHR0aGlzLmZyb21TdHJpbmcodGhpcy52YWx1ZSkgfHwgdGhpcy5leHBvcnRDb2xvcigpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5pbXBvcnRDb2xvcigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XHJcblxyXG5cclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQdWJsaWMgcHJvcGVydGllcyBhbmQgbWV0aG9kc1xyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5cclxuLy8gQnkgZGVmYXVsdCwgc2VhcmNoIGZvciBhbGwgZWxlbWVudHMgd2l0aCBjbGFzcz1cImpzY29sb3JcIiBhbmQgaW5zdGFsbCBhIGNvbG9yIHBpY2tlciBvbiB0aGVtLlxyXG4vL1xyXG4vLyBZb3UgY2FuIGNoYW5nZSB3aGF0IGNsYXNzIG5hbWUgd2lsbCBiZSBsb29rZWQgZm9yIGJ5IHNldHRpbmcgdGhlIHByb3BlcnR5IGpzY29sb3IubG9va3VwQ2xhc3NcclxuLy8gYW55d2hlcmUgaW4geW91ciBIVE1MIGRvY3VtZW50LiBUbyBjb21wbGV0ZWx5IGRpc2FibGUgdGhlIGF1dG9tYXRpYyBsb29rdXAsIHNldCBpdCB0byBudWxsLlxyXG4vL1xyXG5qc2MuanNjb2xvci5sb29rdXBDbGFzcyA9ICdqc2NvbG9yJztcclxuXHJcblxyXG5qc2MuanNjb2xvci5pbnN0YWxsQnlDbGFzc05hbWUgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XHJcblx0dmFyIGlucHV0RWxtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbnB1dCcpO1xyXG5cdHZhciBidXR0b25FbG1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2J1dHRvbicpO1xyXG5cclxuXHRqc2MudHJ5SW5zdGFsbE9uRWxlbWVudHMoaW5wdXRFbG1zLCBjbGFzc05hbWUpO1xyXG5cdGpzYy50cnlJbnN0YWxsT25FbGVtZW50cyhidXR0b25FbG1zLCBjbGFzc05hbWUpO1xyXG59O1xyXG5cclxuXHJcbmpzYy5yZWdpc3RlcigpO1xyXG5cclxuXHJcbnJldHVybiBqc2MuanNjb2xvcjtcclxuXHJcblxyXG59KSgpOyB9XHJcbiJdfQ==