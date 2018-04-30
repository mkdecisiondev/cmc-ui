import { MkComponent } from '../MkComponent/MkComponent.js';

function parseDate (inputNode) {
	if (window.JSJoda) {
		try {
			const [
				month,
				day,
				year,
			] = inputNode.value.split('-').map(x => parseInt(x, 10));

			return JSJoda.LocalDate.of(year, month, day);
		}
		catch (error) {
			/* eslint-disable no-console */
			console.error(error);
			/* eslint-enable no-console */

			return null;
		}
	}
	else {
		return null;
	}
}

class TextBox extends MkComponent {
	init () {
		this.mask = false;

		if (this.node.dataset.requiredMessage === 'undefined') {
			this.requiredMessage = window.lang.fieldIsRequired;
		}
		else {
			this.requiredMessage = this.node.dataset.requiredMessage;
		}
		this.validationMessage = this.validationNode.textContent || window.lang.fieldIsRequired;

		if (this.node.dataset.minMessage === 'undefined') {
			this.minMessage = this.validationMessage;
		}
		else {
			this.minMessage = this.node.dataset.minMessage;
		}

		if (this.node.dataset.maxMessage === 'undefined') {
			this.maxMessage = this.validationMessage;
		}
		else {
			this.maxMessage = this.node.dataset.maxMessage;
		}

		setTimeout(function () {
			if (this.inputNode.value) {
				this.validate();
			}
		}.bind(this), 0);

		if (this.infoContentNode.textContent) {
			this.infoBoxNode.id = this.inputNode.name + 'Tooltip';
			this.infoIconNode.setAttribute('aria-describedby', this.infoBoxNode.id);
			this.infoIconNode.classList.remove('hidden');
			this.infoBoxNode.classList.remove('hidden');
		}

		this._fixDateCompatibility();
	}

	registerEventHandlers () {
		this.inputNode.addEventListener('input', this.handleInput.bind(this));
		this.inputNode.addEventListener('blur', this.maskInput.bind(this));
		this.inputNode.addEventListener('focus', this.unmaskInput.bind(this));
		this.inputNode.addEventListener('invalid', this.handleInvalidInput.bind(this));
		this.inputNode.addEventListener('valid', this.handleValidInput.bind(this));
	}

	handleInput () {
		if (this.inputNode.value.length) {
			this.inputNode.classList.add('populated');
		}
		else {
			this.inputNode.classList.remove('populated');
		}
	}

	maskInput () {
		if (this.mask && this.inputNode.value.length) {
			this.maskNode.textContent = '';

			for (let i = 0; i < this.inputNode.value.length; i++) {
				this.maskNode.textContent += '•';
			}

			this.inputNode.classList.add('hide-input');
			this.maskNode.classList.remove('hidden');
		}
	}

	unmaskInput () {
		if (this.mask && this.inputNode.value.length) {
			this.maskNode.classList.add('hidden');
			this.inputNode.classList.remove('hide-input');
		}
	}

	handleInvalidInput () {
		if (this.inputNode.type === 'date') {
			if (this.inputNode.validity.rangeUnderflow) {
				this.validationMessage = this.minMessage;
			}
			else if (this.inputNode.validity.rangeOverflow) {
				this.validationMessage = this.maxMessage;
			}
		}

		if (this.inputNode.classList.contains('populated')) {
			this.validationNode.textContent = this.validationMessage;
		}
		else {
			this.validationNode.textContent = this.requiredMessage;
		}

		this.descriptionNode.classList.add('hidden');
		this.validationNode.classList.remove('hidden');
	}

	handleValidInput () {
		if (!this.inputNode.required || this.inputNode.classList.contains('populated')) {
			this.validationNode.classList.add('hidden');
			this.descriptionNode.classList.remove('hidden');
		}
	}

	validate () {
		this.handleInput();
		hyperform.checkValidity(this.inputNode);
	}

	get dateString () {
		return (parseDate(this.inputNode) || this.inputNode.value).toString();
	}

	/**
	 * For browsers (IE11) that don't support input[type=date] the input format needs to be changed
	 */
	_fixDateCompatibility () {
		const intendedType = this.inputNode.getAttribute('type');

		if (intendedType === 'date') {
			const actualType = this.inputNode.type;

			if (actualType !== intendedType) {
				// necessary to prevent hyperform from performing bad validation
				this.inputNode.type = 'text';
				this.inputNode.setAttribute('type', 'text');
				this.inputNode.classList.add('unsupported');
				this.descriptionNode.textContent = 'MM-DD-YYYY';
				this.initialValidationMessage = this.validationMessage;

				/* eslint-disable complexity */
				hyperform.addValidator(this.inputNode, function (inputNode) {
					if (!inputNode.value && !inputNode.required) {
						return true;
					}

					const parsedDate = parseDate(inputNode);

					if (!parsedDate) {
						this.validationMessage = this.initialValidationMessage;

						return false;
					}

					let isValid = true;
					let withinMin = true;
					let withinMax = true;
					const minValue = this.inputNode.getAttribute('min');
					const maxValue = this.inputNode.getAttribute('max');
					if (minValue || maxValue) {
						try {
							if (minValue && maxValue) {
								const minDate = JSJoda.LocalDate.parse(minValue);
								const maxDate = JSJoda.LocalDate.parse(maxValue);
								withinMin = parsedDate.compareTo(minDate) >= 0;
								withinMax = parsedDate.compareTo(maxDate) <= 0;
								isValid = withinMin && withinMax;
							}
							else if (minValue) {
								const minDate = JSJoda.LocalDate.parse(minValue);
								withinMax = parsedDate.compareTo(minDate) >= 0;
								isValid = withinMax;
							}
							else if (maxValue) {
								const maxDate = JSJoda.LocalDate.parse(maxValue);
								withinMax = parsedDate.compareTo(maxDate) <= 0;
								isValid = withinMax;
							}
						}
						catch (error) {
							/* eslint-disable no-console */
							console.error(error);
							/* eslint-enable no-console */
						}
					}

					if (!withinMin) {
						this.validationMessage = this.minMessage;
					}

					if (!withinMax) {
						this.validationMessage = this.maxMessage;
					}

					return isValid;
				}.bind(this));
				/* eslint-enable complexity */
			}
		}
	}
}

TextBox.prototype.tooltipPosition = 'ne';

export { TextBox };
