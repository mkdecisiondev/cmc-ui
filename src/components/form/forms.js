const forms = {
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
};

export { forms };
