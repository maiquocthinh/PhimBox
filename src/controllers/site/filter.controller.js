const categoryModels = require('../../models/category.models');
const countryModels = require('../../models/country.models');
const filterFilmUtils = require('../../utils/site/filterFilm.utils');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');
const { getPagination } = require('../../utils/site/pagination.util');
const getNotificationOfUser = require('../../helpers/getNotificationOfUser.helper');

module.exports = async (req, res) => {
	const { _id: userId } = req.session.user || {};
	let { categoryId, countryId, year, type, sort, page } = req.query;
	const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);

	if (page) page = parseInt(page);
	if (year) year = parseInt(year);

	let typeName = 'Phim';

	switch (type) {
		case 'le':
			type = 'movie';
			typeName = 'Phim Lẻ';
			break;

		case 'bo':
			type = 'series';
			typeName = 'Phim Bộ';
			break;
		case 'rap':
			type = 'rap';
			typeName = 'Phim Chiếu Rạp';
			break;
	}

	if (categoryId) typeName += ' ' + (await categoryModels.findOne({ _id: categoryId }, { name: 1 }).then(({ name }) => name));
	if (countryId) typeName += ' ' + (await countryModels.findOne({ _id: countryId }, { name: 1 }).then(({ name }) => name));

	switch (sort) {
		case 'new':
			typeName += ' Mới';
			sort = { createdAt: -1 };
			break;

		case 'view':
			sort = { viewed: -1 };
			break;

		case 'year':
			sort = { year: -1 };
			break;

		case 'name':
			sort = { name: 1 };
			break;

		default:
			// typeName += ' Mới';
			sort = { updatedAt: -1 };
	}

	if (year) typeName += ' Năm ' + year;

	const {
		data: films,
		pageNumber,
		totalPage,
	} = await filterFilmUtils({ categoryId, countryId, year, sort, type, inCinema: type === 'rap' }, page);

	// catalogue data
	const catalogue = {
		films,
		totalPage,
		pageNumber,
		breadcrumb: `<li><a href="#"><i class="iconify" data-icon="openmoji:filter"></i> Lọc Phim</a></li>
		<li><a href="#"><i class="iconify" data-icon="twemoji:clapper-board"></i> ${typeName}</a></li>`,
		sectionBarTitle: `<span><i class="iconify section-bar__icon" data-icon="bx:film"></i> ${typeName}</span><i class="skew-left"></i>`,
		listCategory: await categoryModels.find({}, { _id: 1, name: 1 }),
		listCountry: await countryModels.find({}, { _id: 1, name: 1 }),
		pagination: getPagination(url, pageNumber, totalPage),
	};

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
