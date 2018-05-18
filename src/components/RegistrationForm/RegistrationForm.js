import { Dialog } from '../Dialog/Dialog.js';
import { Fees } from '../Fees/Fees.js';
import { forms } from '../form/forms.js';
import { MkComponent } from '../MkComponent/MkComponent.js';
import { Select } from '../Select/Select.js';
import { TextBox } from '../TextBox/TextBox.js';
import { FormManager } from '../FormManager/FormManager.js';

Object.assign(MkComponent._mkComponentConstructors, {
	Dialog,
	Fees,
	Select,
	TextBox,
});

const stripe = Stripe('pk_test_2LGkBPerOovneoO2isQ6aq6H');
const elements = stripe.elements();

class RegistrationForm extends MkComponent {
	init () {
		/* eslint-disable no-magic-numbers */
		forms.constrainInput({
			inputNode: this.phoneNumberTextBox.inputNode,
			allow: [ '-' ],
			positions: [ 3, 7 ],
		});
		/* eslint-enable no-magic-numbers */

		this.card = elements.create('card', { hidePostalCode: true });
		this.card.mount(this.feesNode.cardInformation);
		this.card.valid = false;
		this.card.requiredMessage = this.feesNode.cardInformationErrorNode.textContent;

		this.registrationFeesDialog.closeable = true;
		this.form = new FormManager(this.node);
	}

	registerEventHandlers () {
		hyperform(this.node, {
			classes: {
				invalid: 'invalid',
				valid: 'valid',
			},
			revalidate: 'onblur',
		});

		this.card.addEventListener('change', this.validateCardInformation.bind(this));
		this.card.addEventListener('blur', this.handleCardInformationValidity.bind(this));
		this.feesNode.submitButton.addEventListener('click', this.validateForm.bind(this));
		this.node.addEventListener('submit', function (event) {
			event.preventDefault();
		});
		this.registrationFeesDialog.continueButton.addEventListener('click', this.handleSubmit.bind(this));
	}

	validateCardInformation (event) {
		if (event.error) {
			this.feesNode.cardInformationErrorNode.textContent = event.error.message;
			this.card.valid = false;
		}
		else {
			this.feesNode.cardInformationErrorNode.textContent = this.card.requiredMessage;
			this.card.valid = true;
		}

		this.handleCardInformationValidity();
	}

	handleCardInformationValidity () {
		if (this.feesNode.cardInformation.classList.contains('StripeElement--empty')) {
			this.card.valid = false;
		}

		if (this.card.valid) {
			this.feesNode.cardInformationErrorNode.classList.add('hidden');
		}
		else {
			this.feesNode.cardInformationErrorNode.classList.remove('hidden');
		}
	}

	validateForm () {
		this.node.checkValidity();
		this.feesNode.validateEventFees();
		this.handleCardInformationValidity();

		if (this.node.checkValidity() && this.card.valid && this.feesNode.validateEventFees()) {
			this.registrationFeesDialog.totalFeesNode.textContent = this.feesNode.totalNode.textContent;
			this.registrationFeesDialog.show();
		}
	}

	handleSubmit (event) {
		event.preventDefault();
		this.registrationFeesDialog.continueButton.disabled = true;
		this.formData = this.form.value;

		try {
			registerElements([ this.card ]).then((t) => {
				return t.token.id;
			})
				.then((token) => {
					this.formData.stripeToken = token;
					this.formData.amount = this.feesNode.eventFees;
				})
				.then(() => {
					this.formData = removeEmpty(this.formData);
				})
				.then(() => {
					return axios.post(
						'https://api.cmcnaa.org/live/registration',
						JSON.stringify(this.formData), {
							headers: {
								'Content-Type': 'application/json',
							},
						});
				})
				.then(() => {
					window.location.href = '/thank-you.html';
				});
		}
		catch (error) {
			this.registrationFeesDialog.continueButton.disabled = false;

			// TODO: add Dialog
			window.alert('We\'re sorry, an error occurred with your request.');
		}

		function registerElements (el) {
			return stripe.createToken(el[0])
				.then((result) => {
					return result;
				});
		}

		function removeEmpty (data) {
			let cleanedObject = {};
			Object.keys(data).forEach(function (key) {
				if (data[key] !== '') {
					cleanedObject[key] = data[key];
				}
			});

			return cleanedObject;
		}
	}
}

export { RegistrationForm };
