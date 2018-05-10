import { MkComponent } from '../MkComponent/MkComponent.js';

class NumberBox extends MkComponent {
	registerEventHandlers () {
		this.inputNode.addEventListener('change', this.handleInput.bind(this));
	}

	handleInput () {
		document.getElementsByClassName('numberbox')
		let currentValue = parseInt(document.getElementById('total').innerHTML);
		let total = currentValue + this.inputNode.dataset.price * this.inputNode.value;

		console.log(total);

		// document.getElementById('total').innerHTML = total;
	}
}

export { NumberBox };
