import { FormManager } from '../FormManager/FormManager.js';
import { forms } from '../form/forms.js';
import { MkComponent } from '../MkComponent/MkComponent.js';
import { Select } from '../Select/Select.js';
import { TextBox } from '../TextBox/TextBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	Select,
	TextBox,
});

class ContactForm extends MkComponent {
	init () {
		/* eslint-disable no-magic-numbers */
		forms.constrainInput({
			inputNode: this.phoneNumberTextBox.inputNode,
			allow: [ '-' ],
			positions: [ 3, 7 ],
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
		this.node.addEventListener('submit', this.handleSubmit.bind(this));
	}

	handleSubmit (event) {
		event.preventDefault();

		const removeEmpty = function (data) {
			let cleanedObject = {};
			Object.keys(data).forEach(function (key) {
				if (data[key] !== '') {
					cleanedObject[key] = data[key];
				}
			});

			return cleanedObject;
		};
		this.formData = removeEmpty(this.form.value);

		axios.post('https://api.cmcnaa.org/live/contact',
			JSON.stringify(this.formData), {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then(() => {
				window.location.href = '/confirmation.html';
			})
			.catch(() => {
				// TODO: Add dialog
				window.alert('We\'re sorry, an error occurred. Please try again.');
			});
	}
}

export { ContactForm };
