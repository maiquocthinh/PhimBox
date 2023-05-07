const fetch = require('node-fetch');

const getIMDBScore = async (imdbID) => {
	try {
		const score = await fetch('https://imdb-api.projects.thetuhin.com/title/' + imdbID)
			.then(async (result) => await result.json())
			.then(({ rating }) => rating.star);
		return score;
	} catch (error) {
		return NaN;
	}
};

const convertToYoutubeEmbed = (url) => {
	const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	const pattern = new RegExp(regex);
	const matches = url.match(pattern);

	if (matches && matches[7] !== null) {
		const videoId = matches[7];
		return `https://www.youtube.com/embed/${videoId}`;
	}

	return '';
};

module.exports = { getIMDBScore, convertToYoutubeEmbed };
