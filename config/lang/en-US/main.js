const home = require('./home.js');
const thankYou = require('./thankYou');

const common = {
	organizationName: 'CMC Alumni Association',
};

module.exports = Object.assign(
	common,
	home,
	thankYou
);
