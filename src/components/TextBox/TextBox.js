import { MkComponent } from '../MkComponent/MkComponent.js';

class TextBox extends MkComponent {
	init () {
		this.mask = false;

		if (this.node.dataset.requiredMessage) {
			this.requiredMessage = this.node.dataset.requiredMessage;
		}
		this.validationMessage = this.validationNode.textContent;
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
}

export { TextBox };
