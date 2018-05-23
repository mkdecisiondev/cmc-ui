const requireText = require('require-text');

module.exports = {
	eventContent: requireText('./eventContent.html', require),
	privacyPolicyContent: requireText('./privacyPolicyContent.html', require),
};
