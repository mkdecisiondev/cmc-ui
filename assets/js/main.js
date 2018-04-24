import { Header } from '../../src/components/Header/Header.js';

new Header(document.getElementById('header'));
import * as config from '../../config/main.js';
/*const home = require('./home.js');*/

const common = {
	home: 'Home'
};

module.exports = Object.assign(
	common,
	events,
	home,
	photos,
);
