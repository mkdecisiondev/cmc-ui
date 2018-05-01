const home = require('./home.js');
const form = require('./form.js');

const common = {
	organizationName: 'CMC Alumni Association',
};

module.exports = Object.assign(
	common,
	form,
	home
);
