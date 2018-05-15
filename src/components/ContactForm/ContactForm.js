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
		let formData = {};
		formData.firstName = this.node[0].value;
		formData.lastName = this.node[1].value;
		formData.emailAddress = this.node[2].value;
		formData.primaryPhoneNumber = this.node[3].value;
		formData.questionText = this.node[5].value;
		formData.questionType = this.node[4].value;

		axios.post('prod-api-url-goes-here',
			JSON.stringify(formData), {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then(() => {
				window.location.assign('../../confirmation.html');
			})
			.catch(() => {
				window.alert('We\'re sorry, an error occurred. Please try again.');
			});
	}
}

export { ContactForm };
