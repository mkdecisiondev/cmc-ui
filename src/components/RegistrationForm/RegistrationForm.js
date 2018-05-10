import { MkComponent } from '../MkComponent/MkComponent.js';
import { NumberBox } from '../NumberBox/NumberBox.js';
import { Select } from '../Select/Select.js';
import { TextBox } from '../TextBox/TextBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	Select,
	TextBox,
	NumberBox,
});

class RegistrationForm extends MkComponent {
	init () {
		console.log(this.adultFullNode);
	}

	registerEventHandlers () {
		hyperform(this.node, {
			classes: {
				invalid: 'invalid',
				valid: 'valid',
			},
			revalidate: 'onblur',
		});
		this.eventFeesNode.addEventListener('change', this.handleFeesChange.bind(this));
	}

	handleFeesChange () {
	}
}

export { RegistrationForm };
