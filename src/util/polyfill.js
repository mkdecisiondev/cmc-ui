if (!Object.assign) {
	/* IE11 */
	Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function (target) {
			if (target == null) {
				throw new TypeError('Cannot convert target to object');
			}

			target = Object(target);

			for (let i = 1; i < arguments.length; i++) {
				const nextSource = arguments[i];

				if (nextSource != null) {
					for (let nextKey in nextSource) {
						const descriptor = Object.getOwnPropertyDescriptor(nextSource, nextKey);

						if (descriptor && descriptor.enumerable) {
							target[nextKey] = nextSource[nextKey];
						}
					}
				}
			}

			return target;
		},
	});
}

if (typeof window.CustomEvent !== 'function') {
	/* IE11 */
	window.CustomEvent = function CustomEvent (eventName, options) {
		const event = document.createEvent('CustomEvent');

		options = Object.assign({
			bubbles: false,
			cancelable: false,
		}, options);
		event.initCustomEvent(eventName, options.bubbles, options.cancelable, options.detail);

		return event;
	};

	window.CustomEvent.prototype = window.Event.prototype;
}

// This renders code that relies on IntersectionObserver non-functional. The polyfill is flaky in IE11.
// We're OK breaking it since it is just used for sticky header/footer elements. Functionality remains fine
// without these.
if (/Trident/.test(window.navigator.userAgent)) {
	window.IntersectionObserver = function IntersectionObserver () {};
	window.IntersectionObserver.prototype = {
		observe: function () {},
		unobserve: function () {},
	};
}
