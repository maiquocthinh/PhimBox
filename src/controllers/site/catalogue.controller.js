const categoryModels = require('../../models/category.models');
const countryModels = require('../../models/country.models');
const filterFilmUtils = require('../../utils/site/filterFilm.utils');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');
const { getPagination } = require('../../utils/site/pagination.util');
const getNotificationOfUser = require('../../helpers/getNotificationOfUser.helper');

module.exports = async (req, res) => {
	const { _id: userId } = req.session.user || {};
	let { type } = req.params;
	let { page } = req.query;
	const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);

	if (page) page = parseInt(page);
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
		breadcrumb: `<li><a href="#"><i class="iconify" data-icon="twemoji:clapper-board"></i> ${typeName}</a></li>`,
		sectionBarTitle: `<span><i class="iconify section-bar__icon" data-icon="bx:film"></i> ${typeName}</span><i class="skew-left"></i>`,
		listCategory: await categoryModels.find({}, { _id: 1, name: 1 }),
		listCountry: await countryModels.find({}, { _id: 1, name: 1 }),
		pagination: getPagination(url, pageNumber, totalPage),
	};

	console.log(catalogue.pages);

	// SEO
	const SEO = {
		title: `${typeName} - Trang ${pageNumber}`,
	};

	const [header, rightSidebar, notifications] = await Promise.all([
		loadHeaderData.load(),
		loadRightSidebarData.load(),
		userId && getNotificationOfUser(userId),
	]);

	res.render('site/catalogue', {
		header: { ...header, notifications },
		rightSidebar,
		catalogue,
		SEO,
		user: req.session.user,
	});
};
