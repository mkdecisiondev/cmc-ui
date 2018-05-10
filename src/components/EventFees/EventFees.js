import { MkComponent } from '../MkComponent/MkComponent.js';
import { NumberBox } from '../NumberBox/NumberBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	NumberBox,
});

class EventFees extends MkComponent {
	registerEventHandlers () {
		this.node.addEventListener('change', this.handleFeesChange.bind(this));
	}

	handleFeesChange () {
		this.totalFees = this.adultFullNumberBox.total + this.adultOneDayNumberBox.total + this.adultTwoDayNumberBox.total + this.residentsNumberBox.total + this.spouseNumberBox.total + this.childrenNumberBox.total + this.guestsNumberBox.total;

		this.total.textContent = this.totalFees
	}
}

export { EventFees };
