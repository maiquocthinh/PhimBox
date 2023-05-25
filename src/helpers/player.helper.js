const { default: fetch } = require('node-fetch');

const getYoutubeEmbed = (link) => {
	const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	const pattern = new RegExp(regex);
	const matches = link.match(pattern);

	if (matches && matches[7] !== null) {
		const videoId = matches[7];
		return `https://www.youtube.com/embed/${videoId}`;
	}
};

const getDirectVideoGooglePhoto = async (link) => {
	const rawHtml = await fetch(link, {
		method: 'GET',
	}).then(async (res) => await res.body());

	console.log(rawHtml);
};

module.exports = async (link) => {
	const youtubeRegex = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/).*/;
	const googlePhotosRegex = /^https?:\/\/photos\.google\.com\/.*\/photo\/.*/;

	if (youtubeRegex.test(link)) {
		return {
			type: 'embed',
			link: getYoutubeEmbed(link),
		};
	} else if (googlePhotosRegex.test(link)) {
		return {
			type: 'embed',
			link: await getDirectVideoGooglePhoto(link),
		};
	} else {
		return {
			type: 'embed',
			link: link,
		};
	}
};
