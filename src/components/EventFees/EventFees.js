import { MkComponent } from '../MkComponent/MkComponent.js';
import { NumberBox } from '../NumberBox/NumberBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	NumberBox,
});

class EventFees extends MkComponent {
	init () {
		this.membershipFees = 0;
	}

	registerEventHandlers () {
		this.node.addEventListener('change', this.handleFeesChange.bind(this));
		this.annualFeeToggle.addEventListener('change', this.handleAnnual.bind(this));
		this.lifetimeFeeToggle.addEventListener('change', this.handleLifetime.bind(this));
	}

	handleFeesChange () {
		this.totalFees = this.adultFullNumberBox.total +
		this.adultOneDayNumberBox.total +
		this.adultTwoDayNumberBox.total +
		this.residentsNumberBox.total +
		this.spouseNumberBox.total +
		this.childrenNumberBox.total +
		this.guestsNumberBox.total +
		this.membershipFees;

		this.total.textContent = this.totalFees;
	}

	handleAnnual () {
		if (this.annualFeeOn.checked) {
			this.lifetimeFeeOff.click();
			this.membershipFees = 100;
		}
		else {
			this.membershipFees = 0;
		}
	}

	handleLifetime () {
		if (this.lifetimeFeeOn.checked) {
			this.annualFeeOff.click();
			this.membershipFees = 500;
		}
		else {
			this.membershipFees = 0;
		}
	}
}

export { EventFees };
