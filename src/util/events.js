import './polyfill.js'; // CustomEvent

const events = {
	/**
	 * Emit a DOM event from a node
	 * @param {Node} node The node that should emit the event
	 * @param {string} eventName Name of event
	 * @param {Object} [eventData] Data to include in `event.detail`
	 * @param {Object} [options] Event options
	 * @returns {boolean} true if the event was canceled, otherwise false
	 */
	emit (node, eventName, eventData, options) {
		const eventOptions = Object.assign({ detail: eventData }, options);
		const event = new CustomEvent(eventName, eventOptions);

		return node.dispatchEvent(event);
	},
};

export { events };
