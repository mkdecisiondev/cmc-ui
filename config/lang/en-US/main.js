const events = require('./events.js');
const form = require('./form.js');
const home = require('./home.js');
const thankYou = require('./thankYou');

const common = {
	organizationName: 'CMC Alumni Association',
};

module.exports = Object.assign(
	common,
	events,
	form,
	home,
	thankYou
);
