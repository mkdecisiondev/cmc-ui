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
	}

	updateTotalFees () {
		this.eventFees = this.adultNumberBox.total + this.childrenNumberBox.total;
		this.totalNode.textContent = this.eventFees;
		this.validateEventFees();
	}

	validateEventFees () {
		if (this.eventFees) {
			this.eventFeesErrorNode.classList.add('hidden');

			return true;
		}
		else {
			this.eventFeesErrorNode.classList.remove('hidden');

			return false;
		}
	}
}

export { Fees };
