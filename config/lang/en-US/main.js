const events = require('./events.js');
const form = require('./form.js');
const home = require('./home.js');
const thankYou = require('./thankYou');

const common = {
	home: 'home',
	events: 'events',
	photos: 'photos',
	registration: 'registration',
	contactUS: 'contact us',
	siteName: 'Alumni Association of Christian Medical College',
};

module.exports = Object.assign(
	common,
	events,
	form,
	home,
	thankYou
);
