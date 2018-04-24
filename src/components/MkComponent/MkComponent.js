import { events } from '../../util/events.js';
import '../../util/polyfill.js'; // Object.assign

const COMPONENT_TYPE_ATTRIBUTE = 'data-component-type';
const NODE_NAME_ATTRIBUTE = 'data-node-name';

/**
 * @param {Node} node
 */
function getParentNode (node) {
	let parent = node.parentElement;

	while (parent && !parent.getAttribute(COMPONENT_TYPE_ATTRIBUTE)) {
		parent = parent.parentElement;
	}

	return parent;
}

class MkComponent {
	/**
	 * @param {HTMLElement} node - root node to attach the element instance to
	 * @param {Object} [options] - options for the component
	 */
	constructor (node, options) {
		if (!(node instanceof Node)) {
			options = node;
			node = null;
		}

		if (!node) {
			if (this.constructor._template) {
				node = this.constructor._template.cloneNode(true);
				node._isMkTemplate = false;
			}
			else {
				return;
			}
		}

		if (!this.constructor._template) {
			this.constructor._template = node.cloneNode(true);
			this.constructor._template.removeAttribute('id');
			node._isMkTemplate = true;
		}

		this._setNodeReferences(node);
		this.setDefaults();

		if (options) {
			Object.assign(this, options);
		}

		this._createChildComponents();
		this.init();
		this.registerEventHandlers();

		if (node._isMkTemplate !== true && window.MK_DEBUG !== true) {
			node.removeAttribute(COMPONENT_TYPE_ATTRIBUTE);
		}
	}

	/**
	 * Query node tree for named nodes and set references
	 * @protected
	 * @param {HTMLElement} node - root node to attach the element instance to
	 */
	_setNodeReferences (node) {
		this.node = node;

		if (node._mkComponentNodes) {
			for (let i = 0; i < node._mkComponentNodes.length; i++) {
				this._setNodeReference(node._mkComponentNodes[i], this.node);
			}
			node._mkComponentNodes = undefined;
		}
		else {
			const nodes = node.querySelectorAll(`[${NODE_NAME_ATTRIBUTE}]`);
			for (let i = 0; i < nodes.length; i++) {
				const currentNode = nodes[i];
				const parentNode = getParentNode(currentNode);
				if (parentNode === this.node) {
					this._setNodeReference(currentNode, this.node);
				}
				else if (parentNode) {
					parentNode._mkComponentNodes = parentNode._mkComponentNodes || [];
					parentNode._mkComponentNodes.push(currentNode);
				}
				else {
					const error = new Error('Cannot find parent of named node');
					error.componentNode = node;
					error.namedNode = currentNode;
					throw error;
				}
			}
		}
	}

	/**
	 * @param {Node|ComponentInfo} node Component child node with a node reference attribute or an object with a
	 * 	component instance and node name
	 * @param {Node} rootNode Component root node
	 */
	_setNodeReference (node, rootNode) {
		if (node.component) {
			if (this[node.nodeName]) {
				if (!Array.isArray(this[node.nodeName])) {
					this[node.nodeName] = [ this[node.nodeName] ];
				}
				this[node.nodeName].push(node.component);
			}
			else {
				this[node.nodeName] = node.component;
			}
		}
		else {
			const nodeName = node.getAttribute(NODE_NAME_ATTRIBUTE);
			if (this[nodeName]) {
				if (!Array.isArray(this[nodeName])) {
					this[nodeName] = [ this[nodeName] ];
				}
				this[nodeName].push(node);
			}
			else {
				this[nodeName] = node;
			}

			if (rootNode._isMkTemplate !== true && window.MK_DEBUG !== true) {
				node.removeAttribute(NODE_NAME_ATTRIBUTE);
			}
		}
	}

	_createChildComponents () {
		const componentNodes = this.node.querySelectorAll(`[${COMPONENT_TYPE_ATTRIBUTE}]`);
		for (let i = 0; i < componentNodes.length; i++) {
			const currentNode = componentNodes[i];
			const componentType = currentNode.getAttribute(COMPONENT_TYPE_ATTRIBUTE);
			const ComponentConstructor = MkComponent._mkComponentConstructors[componentType];
			if (ComponentConstructor) {
				const component = new ComponentConstructor(currentNode, { app: this.app });
				const nodeName = currentNode.getAttribute(NODE_NAME_ATTRIBUTE);
				if (nodeName) {
					const parentNode = getParentNode(currentNode);
					if (parentNode === this.node) {
						this[nodeName] = component;
					}
					else {
						parentNode._mkComponentNodes = parentNode._mkComponentNodes || [];
						parentNode._mkComponentNodes.push({
							component,
							nodeName,
						});
					}
				}
			}
		}
	}

	/**
	 * 0th Lifecycle method: set default instance property values
	 * @abstract
	 */
	setDefaults () {}

	/**
	 * 1st Lifecycle method: initialize state and DOM
	 * @abstract
	 */
	init () {}

	/**
	 * 2nd Lifecycle method: register event handlers
	 * @abstract
	 */
	registerEventHandlers () {}

	/**
	 * Emit a DOM event from the component's node
	 * @param {string} eventName Name of event
	 * @param {Object} [eventData] Data to include in `event.detail`
	 * @param {Object} [options] Event options
	 * @returns {boolean} true if the event was canceled, otherwise false
	 */
	emit (eventName, eventData, options) {
		return events.emit(this.node, eventName, eventData, options);
	}
}

MkComponent._mkComponentConstructors = Object.create(null);

export { MkComponent };
