import { MkComponent } from '../MkComponent/MkComponent.js';

class NumberBox extends MkComponent {
	init () {
		this.total = 0;
	}

	registerEventHandlers () {
		this.inputNode.addEventListener('change', this.handleInput.bind(this));
	}

	handleInput () {
		this.total = this.inputNode.dataset.price * this.inputNode.value;
	}
}

export { NumberBox };
