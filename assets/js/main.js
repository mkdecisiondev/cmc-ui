import { Header } from '../../src/components/Header/Header.js';
new Header(document.getElementById('header'));

const common = {
	home: 'home'
};

module.exports = Object.assign(
	common,
	events,
	home,
	photos,
);
