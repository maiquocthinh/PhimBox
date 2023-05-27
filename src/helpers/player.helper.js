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
	}).then(async (res) => await res.text());

	const regex = /https:\/\/video-downloads\.googleusercontent\.com\/[^"\s]+/gm;
	const matches = rawHtml.match(regex);

	return matches[0];
};

module.exports = async (link) => {
	const regexYoutube = /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/).*/;
	const regexGooglePhotos = /^https?:\/\/photos\.google\.com\/.*\/photo\/.*/;
	const regexM3U8 = /^(http|https):\/\/[^\s$.?#].[^\s]*\.m3u8$/;
	const regexMP4 = /^(http|https):\/\/[^\s$.?#].[^\s]*\.mp4$/;

	if (regexYoutube.test(link)) {
		return {
			type: 'embed',
			data: [getYoutubeEmbed(link)],
		};
	} else if (regexGooglePhotos.test(link)) {
		return {
			type: 'direct',
			data: [
				{
					file: await getDirectVideoGooglePhoto(link),
					type: 'video/mp4',
				},
			],
		};
	} else if (regexM3U8.test(link)) {
		return {
			type: 'direct',
			data: [
				{
					file: link,
					type: 'hls',
				},
			],
		};
	} else if (regexMP4.test(link)) {
		return {
			type: 'direct',
			data: [
				{
					file: link,
					type: 'video/mp4',
				},
			],
		};
	} else {
		return {
			type: 'embed',
			data: [link],
		};
	}
};
