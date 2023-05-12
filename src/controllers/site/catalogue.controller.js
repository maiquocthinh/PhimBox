const categoryModels = require('../../models/category.models');
const countryModels = require('../../models/country.models');
const filterFilmUtils = require('../../utils/site/filterFilm.utils');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadLeftSidebarData = require('../../utils/site/loadLeftSidebarData.util');

module.exports = async (req, res) => {
	let { type, page } = req.params;

	if (page) page = page.split('-').pop();
	let typeName = '';

	switch (type) {
		case 'phim-le':
			type = 'movie';
			typeName = 'Phim Lẻ';
			break;

		case 'phim-bo':
			type = 'series';
			typeName = 'Phim Bộ';
			break;
		case 'phim-chieu-rap':
			type = '';
			typeName = 'Phim Chiếu Rạp';
			break;
	}

	const { data: films, pageNumber, totalPage } = await filterFilmUtils({ type, inCinema: !type }, page);

	// catalogue data
	const catalogue = {
		films,
		totalPage,
		pageNumber,
		currentHref: req.originalUrl.split('/page-').shift(),
		breadcrumb: `<li><a href="#"><i class="iconify" data-icon="twemoji:clapper-board"></i> ${typeName}</a></li>`,
		sectionBarTitle: `<span><i class="iconify section-bar__icon" data-icon="bx:film"></i> ${typeName}</span><i class="skew-left"></i>`,
		listCategory: await categoryModels.find({}, { _id: 1, name: 1 }),
		listCountry: await countryModels.find({}, { _id: 1, name: 1 }),
	};

	// SEO
	const SEO = {
		title: `${typeName} - Trang ${pageNumber}`,
	};

	res.render('site/catalogue', {
		header: await loadHeaderData.load(),
		leftSidebar: await loadLeftSidebarData.load(),
		catalogue,
		SEO,
	});
};
