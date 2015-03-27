angular.module('SE').directive('seDraggable',

	function ($document) {

		'use strict';

		return {
			require: ['seDraggable','?^seDraggableContainer'],
			controller: ['$scope', '$window', function ($scope, $window) {

				var resizeIntention,
					lastKnownPosition = {
						x:0.1,
						y:0.6
					};

				function Draggable () {

					this.start = this.start.bind(this);
					this.move = this.move.bind(this);
					this.stop = this.stop.bind(this);

					angular.element($window).on('resize', function () {
						if (resizeIntention) {
							clearTimeout(resizeIntention);
						}
						resizeIntention = setTimeout(this.verifyInBounds.bind(this), 1000);
					}.bind(this));

				}
				Draggable.prototype = {

					init: function (element, container, ondrag) {

						var anchorBox, elementBox;

						this.element = element;
						this.container = container || angular.element($document[0].body);
						this.anchor = this.anchor || this.element;
						this.ondrag = ondrag;

						anchorBox = this.anchor[0].getBoundingClientRect();
						elementBox = this.element[0].getBoundingClientRect();
						this.originOffset = {
							x: elementBox.left - (anchorBox.left + anchorBox.width/2),
							y: elementBox.top - (anchorBox.top + anchorBox.height/2)
						};
						this.anchor.on('mousedown', this.start);
						this.anchor.on('touchstart', this.start);
					},

					start: function (e) {

						var coords = this.normalizeCoords(e),
							box = this.anchor[0].getBoundingClientRect();

						$document.on('touchmove', this.forward);
						$document.on('touchend', this.stop);
						$document.on('mousemove', this.move);
						$document.on('mouseup', this.stop);

						this.bounds = this.container[0].getBoundingClientRect();

						this.mouseOffset = {
							x:coords.x - (box.left + box.width/2) - this.originOffset.x,
							y:coords.y - (box.top + box.height/2) - this.originOffset.y
						};

						this.origin = {
							x:coords.x,
							y:coords.y
						};

					},

					move: function (e) {

						var coords = this.normalizeCoords(e),
							left, top;

						if (!$scope.isDragging && Math.abs(coords.x - this.origin.x) > 5 && Math.abs(coords.y - this.origin.y) > 5) {
							$scope.isDragging = true;
							$scope.$apply();
						}

						left = (coords.x - this.bounds.left - this.mouseOffset.x);
						top = (coords.y - this.bounds.top - this.mouseOffset.y);

						if (left < 0) {
							left = 0;
						}

						if (left > this.bounds.width) {
							left = this.bounds.width;
						}

						if (this.ondrag) {
							$scope.$eval(this.ondrag, {
								x:left/this.bounds.width,
								y:top/this.bounds.height
							});
						} else {
							this.element.css({
								left: left,
								top: top
							});
						}

						lastKnownPosition = {
							x:left/this.bounds.width,
							y:top/this.bounds.height
						};

						e.preventDefault();
						e.stopPropagation();
					},

					stop: function () {

						if ($scope.isDragging) {
							$scope.$evalAsync(function (scope) {scope.isDragging = false})
						}
						$document.unbind('touchmove', this.forward);
						$document.unbind('touchend', this.stop);
						$document.unbind('mousemove', this.move);
						$document.unbind('mouseup', this.stop);

					},

					setAnchor: function (element) {

						this.anchor = element;
					},

					normalizeCoords: function (e) {

						if (e.originalEvent) {e = e.originalEvent}

						if (e.type.indexOf('touch') >= 0) {

							return {
								x: e.touches[0].clientX,
								y: e.touches[0].clientY
							};
						} else {
							return {
								x: e.clientX,
								y: e.clientY
							}
						}
					},

					verifyInBounds: function () {

						var bounds = this.container[0].getBoundingClientRect();

						this.element.css({
							left: lastKnownPosition.x * bounds.width,
							top: lastKnownPosition.y * bounds.height
						});

					},

					forward: function (e) {

						if (e.originalEvent) {e = e.originalEvent}

						var origin,
							touch = e.touches[0],
							forwardEvent = $document[0].createEvent("MouseEvent");

						forwardEvent.initMouseEvent(
							"mousemove",
							true,
							true,
							window,
							1,
							touch.screenX,
							touch.screenY,
							touch.clientX,
							touch.clientY,
							false,
							false,
							false,
							false,
							0,
							null
						);

						origin = document.elementFromPoint(touch.clientX, touch.clientY);
						origin.dispatchEvent(forwardEvent);

						e.preventDefault();
					}
				};

				return new Draggable();
			}],

			link: function (scope, element, attrs, controllers) {

				controllers[0].init(element, controllers[1], attrs.ondrag);

			}
		}
	}
);

angular.module('SE').directive('seDraggableAnchor',
	function () {

		return {
			require: '^seDraggable',
			link: function (scope, element, attr, controller) {
				controller.setAnchor(element);
			}
		}
	}
);

angular.module('SE').directive('seDraggableContainer',
	function () {
		return {
			controller: ['$element', function ($element) {
				return $element
			}]
		}
	}
);
