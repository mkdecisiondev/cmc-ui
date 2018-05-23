const requireText = require('require-text');

module.exports = {
	privacyPolicyContent: requireText('./privacyPolicyContent.html', require),
	eventContent: requireText('./eventContent.html', require),
};
