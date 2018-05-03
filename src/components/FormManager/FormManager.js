import { events } from '../../util/events.js';
/**
 * Fields to ignore: if a field's 'type' attribute matches it will be ignored
 */
const IGNORED_TYPES = {
	button: 1,
	image: 1,
	reset: 1,
	submit: 1,
};

/**
 * @param {HTMLSelectElement} select
 * @param {string} newValue
 */
function setMultiSelectValue (select, newValue) {
	if (!Array.isArray(newValue)) {
		newValue = [ newValue ];
	}

	for (let i = 0; i < select.length; i++) {
		const option = select.options[i];
		option.selected = false;

		for (let j = 0; j < newValue.length; j++) {
			if (option.value === newValue[j]) {
				option.selected = true;
			}
		}
	}
}

/**
 * Modern browsers provide the 'elements' property not only on HTMLFormElement but also on HTMLFieldSetElement
 * For older browsers we need to query for them.
 * NOTE: this is not a comprehensive solution that adheres to the spec:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements#Value
 * @param {HTMLFormElement|HTMLFieldSetElement} node
 */
export function getChildElements (node) {
	if (node.elements) {
		return node.elements;
	}

	const childElements = node.querySelectorAll('input, select, textarea');
	for (let i = 0; i < childElements.length; i++) {
		const elementName = childElements[i].name;

		if (elementName) {
			childElements[elementName] = childElements[i];
		}
	}

	return childElements;
}

class FormManager {
	/**
	 * @param {HTMLFormElement} node
	 */
	constructor (node) {
		this.elements = {};
		this.node = node;

		const childElements = getChildElements(node);

		// NOTE: This is a one-time setup of field accessors when the constructor is called
		// Fields added to the form afterwards will not have accessors provided, though they
		// will show up in form.value
		for (let i = 0; i < childElements.length; i++) {
			const fieldName = childElements[i].name;
			// NOTE: this may not be the same as node.elements[i], e.g. for radio
			const field = childElements[fieldName];

			if (!fieldName ||
				this.elements.hasOwnProperty(fieldName) ||
				field.type in IGNORED_TYPES) {
				continue;
			}

			Object.defineProperty(this.elements, fieldName, {
				get: function () {
					let value = '';

					if (field.type === 'select-multiple') {
						let multipleValues = [];

						for (let j = 0; j < field.options.length; j++) {
							if (field.options[j].selected) {
								multipleValues.push(field.options[j].value);
							}
						}

						value = multipleValues;
					}
					else if (field[0] && field[0].type === 'radio') {
						for (let j = 0; j < field.length; j++) {
							if (field[j].checked) {
								value = field[j].value;
							}
						}
					}
					else if (field.checked || field.type !== 'checkbox') {
						value = field.form.elements[fieldName].value;
					}

					return value;
				},

				set: function (newValue) {
					if (field.type === 'select-multiple') {
						setMultiSelectValue(field, newValue);
					}
					else if (field.type === 'checkbox') {
						if (newValue && newValue === field.value) {
							field.checked = true;
						}
						else {
							field.checked = false;
						}
					}
					else if (field instanceof HTMLElement) {
						field.value = newValue;
					}
					else if (field[0] && field[0].type === 'radio') {
						for (let j = 0; j < field.length; j++) {
							field[j].checked = field[j].value === newValue;
						}
					}
					else {
						throw new Error('Unknown element: ' + field.tagName + '[type=' + field.type + ']');
					}

					if (field instanceof HTMLSelectElement) {
						events.emit(field, 'change');
					}
					else {
						events.emit(field, 'input');
					}
				},
			});
		}

		Object.defineProperty(this, 'value', {
			get: function () {
				// Recalculate this to handle run-time DOM changes
				const currentChildElements = getChildElements(node);
				let formValues = {};

				for (let i = 0; i < currentChildElements.length; i++) {
					const fieldName = currentChildElements[i].name;

					if (!fieldName) {
						continue;
					}

					formValues[fieldName] = this.elements[fieldName];
				}

				return formValues;
			},

			set: function (newValue) {
				// Recalculate this to handle run-time DOM changes
				const currentChildElements = getChildElements(node);

				Object.keys(newValue).forEach(function (elementName) {
					const field = currentChildElements[elementName];

					if (!field) {
						return;
					}

					const newFieldValue = newValue[elementName];
					this.elements[elementName] = newFieldValue;
				}, this);
			},
		});
	}
}

export { FormManager };
