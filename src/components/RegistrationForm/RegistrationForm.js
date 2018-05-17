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
const elements = stripe.elements({
	fonts: [
		{
			cssSrc: 'https://fonts.googleapis.com/css?family=Source+Code+Pro',
		},
	],
	locale: window.__exampleLocale,
});

const cardNumber = elements.create('cardNumber');
const cardExpiry = elements.create('cardExpiry');
const cardCvc = elements.create('cardCvc');
cardNumber.mount('#cardNumber');
cardExpiry.mount('#cardExpiry');
cardCvc.mount('#cardCvc');

class RegistrationForm extends MkComponent {
	init () {
		this.registrationFeesDialog.closeable = true;

		/* eslint-disable no-magic-numbers */
		forms.constrainInput({
			inputNode: this.phoneNumberTextBox.inputNode,
			allow: ['-'],
			positions: [3, 7],
		});
		/* eslint-enable no-magic-numbers */
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

	handleSubmit (event) {
		event.preventDefault();
		this.formData = this.form.value;
		try {
			registerElements([ cardNumber, cardExpiry, cardCvc ]).then((t) => {
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
						'https://cbj6udiqj4.execute-api.us-west-2.amazonaws.com/Stage/registration',
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
