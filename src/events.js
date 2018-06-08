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


function pullEvents () {
	let sortedDateArr = [];

	for (let i = 0; i < eventsList.events.data.length; i++) {
		let event = {};
		event.eventName = eventsList.events.data[i].name;
		event.eventDesc = eventsList.events.data[i].description;
		// console.log('event.eventDesc ' + event.eventDesc);
		event.eventDescTrim = trim(event.eventDesc, 300);
		event.eventTime = eventsList.events.data[i].start_time;
		event.eventTimeConverted = convertTime(event.eventTime);
		event.eventDateConverted = convertDate(event.eventTime);
		event.eventDate = convertDate2(event.eventTime);
		event.eventLocation = eventsList.events.data[i].place.location;
		event.eventCity = eventsList.events.data[i].place.location.city;
		event.eventState = eventsList.events.data[i].place.location.state;
		event.eventCountry = eventsList.events.data[i].place.location.country;
		event.eventID = eventsList.events.data[i].id;

		if ((new Date().getTime()) < (new Date(event.eventDate).getTime())) {
			sortedDateArr.push(event);
		}
	}

	sortedDateArr.reverse();

	let dateArrVar = 0;

	for (let i = 0; i < sortedDateArr.length; i++) {
		FB.api('/' + sortedDateArr[i].eventID, { fields: 'cover', access_token }, function (response) {
			sortedDateArr[i].photoURL = response.cover.source;
			dateArrVar += 1;
			if (dateArrVar === sortedDateArr.length) {
				for (let j = 0; j < sortedDateArr.length; j++) {
					displayEvent(sortedDateArr[j]);
				}
			}
		});
	}
}

function displayEvent (event) {
	const eventContainer = document.createElement('div');
	eventContainer.className = 'col-12 col-lg-4 event-wrap';
	const imageContainer = document.createElement('div');
	imageContainer.className = 'event-image-wrap';
	const eventName = document.createTextNode(event.eventName);
	const eventURL = 'https://www.facebook.com/events/'+ event.eventID + '/';
	const dateDescContainer = document.createElement('div');
	dateDescContainer.className = 'event-title-and-date';
	const titleNode = document.createElement('a');
	titleNode.href = eventURL;
	titleNode.appendChild(eventName);
	titleNode.target = "_blank";
	titleNode.classList = 'event-title-and-link';
	const eventDate = document.createElement('a');
	eventDate.href = eventURL;
	const eventDateTextObject = document.createTextNode(event.eventDateConverted);
	eventDate.appendChild(eventDateTextObject);
	eventDate.target = "_blank";
	const dateNode = document.createElement('p');
	const eventImage = document.createElement('img');
	eventImage.src = event.photoURL;
	eventImage.className = 'event-image';
	const anchorAroundEventImage = document.createElement('a');
	anchorAroundEventImage.href = eventURL;
	anchorAroundEventImage.target = "_blank";
	anchorAroundEventImage.className = 'anchor-around-thumbnail';
	anchorAroundEventImage.appendChild(eventImage);
	const eventDescText = document.createTextNode(event.eventDescTrim);
	const eventDescPreformated = document.createElement('pre');
	eventDescPreformated.appendChild(eventDescText);
	const eventDescNode = document.createElement('article');
	eventDescNode.className = 'event-desription';
	eventDescNode.appendChild(eventDescPreformated);
	const eventMoreLink = document.createElement('a');
	const linkText = document.createTextNode("More");
	eventMoreLink.appendChild(linkText);
	eventMoreLink.title = "More about this event on CMC's Facebook page";
	eventMoreLink.target = "_blank";
	eventMoreLink.className = 'more-link';
	eventMoreLink.href = eventURL;
	dateNode.appendChild(eventDate);
	imageContainer.appendChild(anchorAroundEventImage);
	eventContainer.appendChild(imageContainer);
	dateDescContainer.appendChild(titleNode);
	dateDescContainer.appendChild(dateNode);
	eventContainer.appendChild(dateDescContainer);
	eventsTableNode.appendChild(eventContainer);
	eventContainer.appendChild(eventDescNode);
	eventDescPreformated.appendChild(eventMoreLink);
}

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
