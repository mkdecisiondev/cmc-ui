import { MkComponent } from '../MkComponent/MkComponent.js';
import { EventFees } from '../EventFees/EventFees.js';
import { Select } from '../Select/Select.js';
import { TextBox } from '../TextBox/TextBox.js';

Object.assign(MkComponent._mkComponentConstructors, {
	EventFees,
	Select,
	TextBox,
});

class RegistrationForm extends MkComponent {
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

export { RegistrationForm };
