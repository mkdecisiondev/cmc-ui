import { Dialog } from '../Dialog/Dialog.js';
import { Fees } from '../Fees/Fees.js';
import { forms } from '../form/forms.js';
import { MkComponent } from '../MkComponent/MkComponent.js';
import { Select } from '../Select/Select.js';
import { TextBox } from '../TextBox/TextBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	Dialog,
	Fees,
	Select,
	TextBox,
});

class RegistrationForm extends MkComponent {
	init () {
		this.registrationFeesDialog.closeable = true;

		/* eslint-disable no-magic-numbers */
		forms.constrainInput({
			inputNode: this.phoneNumberTextBox.inputNode,
			allow: [ '-' ],
			positions: [ 3, 7 ],
		});
		/* eslint-enable no-magic-numbers */
	}

	registerEventHandlers () {
		hyperform(this.node, {
			classes: {
				invalid: 'invalid',
				valid: 'valid',
			},
			revalidate: 'onblur',
		});

		this.feesNode.submitButton.addEventListener('click', this.validateForm.bind(this));
		this.node.addEventListener('submit', this.showDialog.bind(this));
		this.registrationFeesDialog.continueButton.addEventListener('click', this.handleSubmit.bind(this));
	}

	validateForm () {
		this.node.checkValidity();
	}

	showDialog (event) {
		event.preventDefault();
		this.registrationFeesDialog.totalFeesNode.textContent = this.feesNode.totalNode.textContent;
		this.registrationFeesDialog.show();
	}

	handleSubmit () {
		window.location.href = '/thank-you.html';
	}
}

export { RegistrationForm };
