import { MkComponent } from '../MkComponent/MkComponent.js';
import { Select } from '../Select/Select.js';
import { TextBox } from '../TextBox/TextBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	Select,
	TextBox,
});

class ContactForm extends MkComponent {
	init () {
		console.log(this.firstNameTextBox);
	}

	registerEventHandlers () {
		hyperform(this.node, {
			classes: {
				invalid: 'invalid',
				valid: 'valid',
			},
			revalidate: 'onblur',
		});

	}
}

export { ContactForm };
