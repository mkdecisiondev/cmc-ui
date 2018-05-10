import { MkComponent } from '../MkComponent/MkComponent.js';

const MAX_INPUT = 10;

class NumberBox extends MkComponent {
	init () {
		this.total = 0;
	}

	registerEventHandlers () {
		this.inputNode.addEventListener('change', this.handleInput.bind(this));
	}

	handleInput () {
		if (this.inputNode.value > MAX_INPUT) {
			this.inputNode.value = MAX_INPUT;
		}

		this.total = this.inputNode.dataset.price * this.inputNode.value;
	}
}

export { NumberBox };
