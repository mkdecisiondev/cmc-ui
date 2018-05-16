const events = require('./events.js');
const form = require('./form.js');
const home = require('./home.js');
const links = require('./links.js');
const thankYou = require('./thankYou');
const confirmation = require('./confirmation');
// const htmlResources = require('./htmlResources.js');

const common = {
	alumniAssociationChristianMedicalCollege: 'Alumni Association of Christian Medical College',
	privacyPolicy: 'Privacy Policy',
};

module.exports = Object.assign(
	common,
	confirmation,
	events,
	form,
	home,
	links,
	thankYou,
	//htmlResources,
);
