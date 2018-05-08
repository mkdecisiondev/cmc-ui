const events = require('./events.js');
const form = require('./form.js');
const home = require('./home.js');
const links = require('./links.js');
const thankYou = require('./thankYou');

const common = {
	alumniAssociationChristianMedicalCollege: 'Alumni Association of Christian Medical College',
};

module.exports = Object.assign(
	common,
	events,
	form,
	home,
	links,
	thankYou
);
