const categoryModels = require('../../models/category.models');
const countryModels = require('../../models/country.models');
const filterFilmUtils = require('../../utils/site/filterFilm.utils');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadRightSidebarData = require('../../utils/site/loadRightSidebarData.util');
const { getPagination } = require('../../utils/site/pagination.util');
const getNotificationOfUser = require('../../helpers/getNotificationOfUser.helper');

module.exports = async (req, res) => {
	const { _id: userId } = req.session.user || {};
	let { countrySlug } = req.params;
	let { page } = req.query;
	const url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);

	if (page) page = parseInt(page);

	const { name: countryName, _id: countryId } = (await countryModels.findOne({ slug: countrySlug }, { name: 1, _id: 1 })) || {};

	// check exist country
	if (!countryId || !countryName) return res.status(404).json({ msg: 'Page not found!' });

	const { data: films, pageNumber, totalPage } = await filterFilmUtils({ countryId }, page);

	// catalogue data
	const catalogue = {
		films,
		totalPage,
		pageNumber,
		breadcrumb: `<li><a href="#"><i class="iconify" data-icon="fluent-emoji:globe-showing-asia-australia"></i> Quốc gia</a></li>
		<li class="active"><a href="${req.originalUrl}">${countryName}</a></li>`,
		sectionBarTitle: `<span><i class="iconify section-bar__icon" data-icon="bx:film"></i> Quốc gia ${countryName}</span><i class="skew-left"></i>`,
		listCategory: await categoryModels.find({}, { _id: 1, name: 1 }),
		listCountry: await countryModels.find({}, { _id: 1, name: 1 }),
		pagination: getPagination(url, pageNumber, totalPage),
	};

	// SEO
	const SEO = {
		title: `Phim Quốc gia  ${countryName} - Trang ${pageNumber}`,
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
