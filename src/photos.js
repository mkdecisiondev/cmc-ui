// TODO: set this const to the correct Facebook access token once obtained
// const access_token
let albumIDs;
window.fbAsyncInit = function () {
	FB.init({
		appId: '667008477022260',
		autoLogAppEvents: true,
		xfbml: true,
		version: 'v2.11',
	});
	FB.api(
		'/gurunanakdwara',
		'GET',
		{ fields: 'albums', access_token },
		function (response) {
			albumIDs = response;
			datePull(function (sortedArray) {
				pullAlbumIDs(sortedArray);
			});
		}
	);
};

(function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];

	if (d.getElementById(id)) {
		return;
	}
	js = d.createElement(s);
	js.id = id;
	js.src = 'https://connect.facebook.net/en_US/sdk.js';
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function datePull (callback) {
	let arr = [];
	arr = albumIDs.albums.data;

	for (let i = 0; i < arr.length; i++) {
    arr[i].created_time = moment(arr[i].created_time);
	}

	let sortedArray = arr.sort(function (date2, date1) {
		return date1.created_time - date2.created_time;
	});

	callback(sortedArray);
}

function pullAlbumIDs (input) {
	let counter = 0;
	let newArray = [];

	for (let i = 0; i < input.length - 1; i++) {
		const album = input[i];
		let albumID = input[i].id;

		pullCoverPhoto(albumID, function (id) {
			pullPhoto(id, function (url) {
				album.photoUrl = url;
				counter += 1;
				newArray[i] = album;
				if (counter === input.length - 1) {
					display(newArray);
				}
			});
		});
	}
}

function pullCoverPhoto (input, callback) {
	FB.api('/' + input, { fields: 'cover_photo', access_token }, function (response) {
		let coverPhotoID = response.cover_photo.id;
		callback(coverPhotoID);
	});
}

function pullPhoto (input, callback) {
	FB.api('/' + input, { fields: 'images', access_token }, function (response) {
		let photoURL = null;
		try {
			photoURL = response.images[5].source;
		}
		catch (error) {
			console.log(response);
		}
		callback(photoURL);
	});
}

function display (array) {
	for (let i = 0; i < array.length; i++) {
		const item = array[i];
		const time = convertDate(array[i].created_time);
		displayAlbumCover(array[i].photoUrl, array[i].name, time, array[i].id);
	}
}

function displayAlbumCover (photo, name, date, albumID) {
	let photosTableNode = document.getElementById('albumListing');
	let albumContainer = document.createElement('div');
	albumContainer.className = 'col-lg-4 col-12 album-wrap';
	let imageContainer = document.createElement('div');
	imageContainer.className = 'col-12 album-image-wrap';
	let nodeImg = document.createElement('img');
	nodeImg.className = 'album-image';
	nodeImg.src = photo;
	let photoDesc = document.createElement('p');
	photoDesc.className = 'album-description';
	let photoDate = document.createElement('p');
	photoDate.className = 'album-date';
	let eventName = document.createTextNode(name);
	let eventDate = document.createTextNode(date);

	nodeImg.onclick = function () {
		// redirect to gallery.html
		// pass variable(albumID) here through query parameter
		let url = new URL('gallery.html', window.location);
		url.search = '?photoURL=' + albumID;
		window.location = url;
	};

	photoDesc.appendChild(eventName);
	photoDate.appendChild(eventDate);
	imageContainer.appendChild(nodeImg);
	photosTableNode.appendChild(albumContainer);
	albumContainer.appendChild(imageContainer);
	albumContainer.appendChild(photoDesc);
	albumContainer.appendChild(photoDate);
}

function convertDate (input) {
	return input.format('LL');
}
