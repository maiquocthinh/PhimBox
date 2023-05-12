const countryModels = require('../../models/country.models');
const filterFilmUtils = require('../../utils/site/filterFilm.utils');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadLeftSidebarData = require('../../utils/site/loadLeftSidebarData.util');

module.exports = async (req, res) => {
	let { countrySlug, page } = req.params;

	if (page) page = page.split('-').pop();

	const countryName = await countryModels.findOne({ slug: countrySlug }, { name: 1 }).then(({ name }) => name);
	const { data: films, pageNumber, totalPage } = await filterFilmUtils({ countrySlug }, page);

	// catalogue data
	const catalogue = {
		films,
		totalPage,
		pageNumber,
		currentHref: req.originalUrl.split('/page-').shift(),
		breadcrumb: `<li><a href="#"><i class="iconify" data-icon="fluent-emoji:globe-showing-asia-australia"></i> Quốc gia</a></li>
		<li class="active"><a href="${req.originalUrl}">${countryName}</a></li>`,
		sectionBarTitle: `<span><i class="iconify section-bar__icon" data-icon="bx:film"></i> Quốc gia ${countryName}</span><i class="skew-left"></i>`,
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
