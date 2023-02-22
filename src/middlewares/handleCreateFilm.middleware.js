const slugify = require('slugify');

const handeDataPost = (req, res, next) => {
	req.body.is_cinema = !!parseInt(req.body.is_cinema);
	req.body.is_film_hot = !!parseInt(req.body.is_film_hot);
	req.body.is_film_canonical = !!parseInt(req.body.is_film_canonical);
	req.body.tags = req.body.tags.split(',').map((tag) => tag.toLowerCase());
	req.body.tagsascii = req.body.tags.map((tagsAscii) =>
		slugify(tagsAscii, {
			lower: true,
			locale: 'vi',
			remove: /[*+~.()'"!:@]/g,
		}),
	);

	next();
};

module.exports = {
	handeDataPost,
};
