const access_token = '667008477022260|wD5hJrxsPXtX7oAnmQuzJi_OVX0';
let eventsList;
let currentDate = convertDate2(new Date());
window.fbAsyncInit = function() {
	FB.init({
		appId: '667008477022260',
		autoLogAppEvents: true,
		xfbml: true,
		version: 'v2.11',
	});
};

(function (d, s, id) {
	var js,
	fjs = d.getElementsByTagName(s)[0];

	if (d.getElementById(id)) {
		return;
	}

	js = d.createElement(s);
	js.id = id;
	js.src = 'https://connect.facebook.net/en_US/sdk.js';
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function convertTime (input) {
	return moment(input, 'HH:mm:ss').format('h:mm A');
}

function convertDate (input) {
	return moment(input, '').format('LL');
}

function convertDate2 (input) {
	return moment(input, '').format('L');
}

function trim (str, len) {
	return(str.slice(0, len) + '...');
}
