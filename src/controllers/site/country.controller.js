const categoryModels = require('../../models/category.models');
const countryModels = require('../../models/country.models');
const filterFilmUtils = require('../../utils/site/filterFilm.utils');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadLeftSidebarData = require('../../utils/site/loadLeftSidebarData.util');

module.exports = async (req, res) => {
	let { countrySlug, page } = req.params;

	if (page) page = page.split('-').pop();

	const { name: countryName, _id: countryId } = await countryModels
		.findOne({ slug: countrySlug }, { name: 1, _id: 1 })
		.then(({ name, _id }) => ({ name, _id }));
	const { data: films, pageNumber, totalPage } = await filterFilmUtils({ countryId }, page);

	// catalogue data
	const catalogue = {
		films,
		totalPage,
		pageNumber,
		currentHref: req.originalUrl.split('/page-').shift(),
		breadcrumb: `<li><a href="#"><i class="iconify" data-icon="fluent-emoji:globe-showing-asia-australia"></i> Quốc gia</a></li>
		<li class="active"><a href="${req.originalUrl}">${countryName}</a></li>`,
		sectionBarTitle: `<span><i class="iconify section-bar__icon" data-icon="bx:film"></i> Quốc gia ${countryName}</span><i class="skew-left"></i>`,
		listCategory: await categoryModels.find({}, { _id: 1, name: 1 }),
		listCountry: await countryModels.find({}, { _id: 1, name: 1 }),
	};

	// SEO
	const SEO = {
		title: `Phim Quốc gia  ${countryName} - Trang ${pageNumber}`,
	};

	res.render('site/catalogue', {
		header: await loadHeaderData.load(),
		leftSidebar: await loadLeftSidebarData.load(),
		catalogue,
		SEO,
	});
};
