function handlePostalCodeEntry (app, postalCodeTextBox, cityTextBox, stateSelect) {
	if (postalCodeTextBox.inputNode.validity.valid) {
		app.lookupCityState(postalCodeTextBox.inputNode.value, setCityState.bind(null, cityTextBox, stateSelect));
	}
}

function setCityState (cityTextBox, stateSelect, cityStateInfo) {
	if (!cityStateInfo.city) {
		return;
	}

	if (!(cityTextBox.inputNode === document.activeElement && cityTextBox.inputNode.value.length)) {
		cityTextBox.inputNode.value = cityStateInfo.city;
		cityTextBox.validate();
	}

	if (!(stateSelect.inputNode === document.activeElement && stateSelect.inputNode.value.length)) {
		stateSelect.inputNode.value = cityStateInfo.state;
		stateSelect.validate();
	}
}

const forms = {
	addCurrencyBehavior (inputNode) {
		inputNode.addEventListener('input', function (event) {
			const node = event.target;
			let currencyValue = node.value.toString();
			currencyValue = currencyValue.replace('$', '');
			currencyValue = currencyValue.replace(/,/g, '');

			if (currencyValue.length) {
				currencyValue = parseInt(currencyValue, 10);
				if (!isNaN(currencyValue)) {
					node.value = '$' + currencyValue.toLocaleString();
				}
			}
			else {
				node.value = '';
				node.classList.remove('populated');
			}
		});
	},

	/**
	 * Prevent input of non-whitelisted characters in an input field
	 * This function should be provided an HTMLInputElement (`options.inputNode`).
	 * It will respond to the 'input' event and prevent it if the typed character is not numeric (or within the
	 * characters specified in `options.allow`).
	 * Additionally it can auto-insert dashes at desired locations.
	 * @param {Object} options
	 * @param {HTMLInputElement} options.inputNode
	 * @param {[string[]]} options.allow Extra characters (in addition to 0-9) to allow to be typed
	 * @param {[number[]]} options.positions Zero-based indexes in the input string to insert dashes (if they are not
	 * 	typed)
	 */
	constrainInput (options) {
		let allowedRegExp = '[^0-9';

		if (options.allow) {
			options.allow.forEach(function (allowedInput) {
				allowedRegExp += allowedInput;
			});
		}

		allowedRegExp += ']';
		allowedRegExp = new RegExp(allowedRegExp, 'g');

		options.inputNode.addEventListener('input', function (event) {
			const node = event.target;
			let formattedValue = node.value.replace(allowedRegExp, '');

			if (options.positions) {
				options.allow.forEach(function (allowedInput) {
					const allowedInputPositions = [];

					for (let inputIndex = 0; inputIndex < formattedValue.length; inputIndex++) {
						if (formattedValue[inputIndex] === allowedInput) {
							allowedInputPositions.push({
								index: inputIndex,
								correctPosition: false,
							});
						}
					}

					options.positions.forEach(function (position) {
						allowedInputPositions.forEach(function (allowedInputPosition) {
							if (allowedInputPosition.index === position) {
								allowedInputPosition.correctPosition = true;
							}
						});
					});

					allowedInputPositions.forEach(function (allowedInputPosition) {
						const allowedInputIndex = allowedInputPosition.index;
						if (formattedValue[allowedInputIndex + 1]) {
							if (allowedInputPosition.correctPosition) {
								formattedValue = formattedValue.substr(0, allowedInputIndex) + '-' + formattedValue.substr(allowedInputIndex + 1);
							}
							else {
								formattedValue = formattedValue.substr(0, allowedInputIndex) + formattedValue.substr(allowedInputIndex + 1);
							}
						}
					});
				});

				options.positions.forEach(function (position) {
					if (formattedValue[position]) {
						let isFormatted = false;
						options.allow.forEach(function (allowedInput) {
							if (formattedValue[position] === allowedInput) {
								isFormatted = true;
							}
						});

						if (!isFormatted) {
							if (options.inputNode.hasAttribute('maxLength')) {
								formattedValue = formattedValue.substr(0, position) + '-' + formattedValue.substring(position, node.maxLength - 1);
							}
							else {
								formattedValue = formattedValue.substr(0, position) + '-' + formattedValue.substr(position);
							}
						}
					}
				});
			}

			node.value = formattedValue;
			if (!node.value.length) {
				node.classList.remove('populated');
			}
		});
	},

	capitalizeOnChange (inputNode) {
		inputNode.addEventListener('change', function (event) {
			const node = event.target;
			if (node.value) {
				node.value = node.value[0].toUpperCase() + node.value.substr(1);
			}
		});
	},

	setAgeConstraint (ageConstraint, constraintType, inputNode) {
		const now = new Date();
		const currentYear = now.getFullYear();
		let currentMonth = now.getMonth() + 1;
		let currentDate = now.getDate();

		if (currentMonth.toString().length === 1) {
			currentMonth = '0' + currentMonth;
		}

		if (currentDate.toString().length === 1) {
			currentDate = '0' + currentDate;
		}

		const dateConstraint = (currentYear - ageConstraint) + '-' + currentMonth + '-' + currentDate;
		inputNode.setAttribute(constraintType, dateConstraint);
	},

	setCityStateFromPostalCode (options) {
		const {
			app,
			cityTextBox,
			postalCodeTextBox,
			stateSelect,
		} = options;

		postalCodeTextBox.inputNode.addEventListener('input', handlePostalCodeEntry.bind(null, app, postalCodeTextBox, cityTextBox, stateSelect));
	},
};

export { forms };
