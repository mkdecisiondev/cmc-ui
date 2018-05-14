import { MkComponent } from '../MkComponent/MkComponent.js';

class TextArea extends MkComponent {
	init () {
		this.requiredMessage = this.node.dataset.requiredMessage;
		this.validationMessage = this.validationNode.textContent;
	}

	registerEventHandlers () {
		this.inputNode.addEventListener('input', this.handleInput.bind(this));
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

	handleInvalidInput () {
		if (this.inputNode.classList.contains('populated')) {
			this.validationNode.textContent = this.validationMessage;
		}
		else {
			this.validationNode.textContent = this.requiredMessage;
		}

		this.validationNode.classList.remove('hidden');
	}

	handleValidInput () {
		if (!this.inputNode.required || this.inputNode.classList.contains('populated')) {
			this.validationNode.classList.add('hidden');
		}
	}
}

export { TextArea };
