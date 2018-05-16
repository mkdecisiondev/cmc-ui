import { MkComponent } from '../MkComponent/MkComponent.js';
import { NumberBox } from '../NumberBox/NumberBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	NumberBox,
});

class Fees extends MkComponent {
	init () {
		this.eventFees = 0;
	}

	registerEventHandlers () {
		this.eventFeesNode.addEventListener('change', this.updateTotalFees.bind(this));
		this.submitButton.addEventListener('click', this.validateEventFees.bind(this));
	}

	updateTotalFees () {
		this.eventFees = this.adultNumberBox.total + this.childrenNumberBox.total;
		this.totalNode.textContent = this.eventFees;
		this.validateEventFees();
	}

	validateEventFees (event) {
		if (this.eventFees) {
			this.eventFeesErrorNode.classList.add('hidden');
		}
		else {
			if (event) {
				event.preventDefault();
			}
			this.eventFeesErrorNode.classList.remove('hidden');
		}
	}
}

export { Fees };
