import { MkComponent } from '../MkComponent/MkComponent.js';
import { NumberBox } from '../NumberBox/NumberBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	NumberBox,
});

class Fees extends MkComponent {
	init () {
		this.membershipFees = 0;
		this.eventFees = 0;
	}

	registerEventHandlers () {
		this.annualFeeToggle.addEventListener('change', this.handleAnnual.bind(this));
		this.lifetimeFeeToggle.addEventListener('change', this.handleLifetime.bind(this));
		this.eventFeesNode.addEventListener('change', this.updateTotalFees.bind(this));
		this.submitButton.addEventListener('click', this.validateEventFees.bind(this));
	}

	updateTotalFees () {
		this.eventFees = this.adultOneDayNumberBox.total +
		this.adultTwoDayNumberBox.total +
		this.residentsNumberBox.total +
		this.spouseNumberBox.total +
		this.childrenNumberBox.total +
		this.guestsNumberBox.total;

		this.totalNode.textContent = this.eventFees + this.membershipFees;
		this.validateEventFees();
	}

	handleAnnual () {
		if (this.annualFeeOn.checked) {
			this.lifetimeFeeOff.click();
			this.membershipFees = 100;
		}
		else {
			this.membershipFees = 0;
		}

		this.totalNode.textContent = this.eventFees + this.membershipFees;
	}

	handleLifetime () {
		if (this.lifetimeFeeOn.checked) {
			this.annualFeeOff.click();
			this.membershipFees = 500;
		}
		else {
			this.membershipFees = 0;
		}

		this.totalNode.textContent = this.eventFees + this.membershipFees;
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
