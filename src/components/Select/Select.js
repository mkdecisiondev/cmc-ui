import { MkComponent } from '../MkComponent/MkComponent.js';
//import { Tooltip } from '../Tooltip/Tooltip.js';

class Select extends MkComponent {
	init () {
		if (this.node.dataset.requiredMessage === 'undefined') {
			this.requiredMessage = window.lang.fieldIsRequired;
		}
		else {
			this.requiredMessage = this.node.dataset.requiredMessage;
		}
		this.validationMessage = this.validationNode.textContent;

		setTimeout(function () {
			if (this.inputNode.value) {
				this.validate();
			}
		}.bind(this), 0);

		// if (this.infoContentNode.textContent) {
		// 	this.infoBoxNode.id = this.inputNode.name + 'Tooltip';
		// 	this.infoIconNode.setAttribute('aria-describedby', this.infoBoxNode.id);
		// 	this.infoIconNode.classList.remove('hidden');
		// 	this.infoTooltip = new Tooltip(this.node, {
		// 		position: 'ne',
		// 		tooltipContent: this.infoBoxNode,
		// 	});
		// 	this.infoBoxNode.classList.remove('hidden');
		// }
	}

	registerEventHandlers () {
		this.inputNode.addEventListener('change', this.handleInput.bind(this));
		this.inputNode.addEventListener('invalid', this.handleInvalidInput.bind(this));
		this.inputNode.addEventListener('valid', this.handleValidInput.bind(this));

		// if (this.infoTooltip) {
		// 	this.infoIconNode.addEventListener('click', this.infoTooltip.toggle.bind(this.infoTooltip));
		// 	this.infoBoxCloseNode.addEventListener('click', this.infoTooltip.hide.bind(this.infoTooltip, undefined));
		// }
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

export { Select };
