import { MkComponent } from '../MkComponent/MkComponent.js';
import { NumberBox } from '../NumberBox/NumberBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	NumberBox,
});

class EventFees extends MkComponent {
	init () {
		this.annualFee = document.getElementsByName('annualFee');
		this.lifetimeFee = document.getElementsByName('lifetimeFee');
		this.membershipFees = 0;
	}

	registerEventHandlers () {
		this.node.addEventListener('change', this.handleFeesChange.bind(this));
		document.getElementById('annualFee').addEventListener('change', this.handleAnnual.bind(this));
		document.getElementById('lifetimeFee').addEventListener('change', this.handleLifetime.bind(this));
	}

	handleFeesChange () {
		this.totalFees = this.adultFullNumberBox.total + this.adultOneDayNumberBox.total + this.adultTwoDayNumberBox.total + this.residentsNumberBox.total + this.spouseNumberBox.total + this.childrenNumberBox.total + this.guestsNumberBox.total + this.membershipFees;

		this.total.textContent = this.totalFees;
	}

	handleAnnual () {
		for (let i = 0, length = this.annualFee.length; i < length; i++) {
			if (this.annualFee[i].checked) {
				if (this.annualFee[i].value === 'true') {
					this.lifetimeFee[1].click();
					this.membershipFees = 100;
					this.handleFeesChange();
				}
				break;
			}
		}
	}

	handleLifetime () {
		for (let i = 0, length = this.lifetimeFee.length; i < length; i++) {
			if (this.lifetimeFee[i].checked) {
				if (this.lifetimeFee[i].value === 'true') {
					this.annualFee[1].click();
					this.membershipFees = 500;
					this.handleFeesChange();
				}
				break;
			}
		}
	}
}

export { EventFees };
