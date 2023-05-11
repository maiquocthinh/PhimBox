const filterFilmUtils = require('../../utils/site/filterFilm.utils');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadLeftSidebarData = require('../../utils/site/loadLeftSidebarData.util');

module.exports = async (req, res) => {
	let { keyWord, page } = req.params;

	keyWord = keyWord.replace('+', ' ');
	if (page) page = page.split('-').pop();

	const { data: films, pageNumber, totalPage } = await filterFilmUtils({ keyWord }, page);

	const breadcrumb = `<li><a href="#"><i class="iconify" data-icon="noto-v1:magnifying-glass-tilted-left"></i> Tìm kiếm</a></li>
						<li class="active"><a href="#">${keyWord}</a></li>`;

	const sectionBarTitle = `<span><i class="iconify section-bar__icon" data-icon="bx:film"></i> Kết quả tìm kiếm: ${keyWord}</span><i class="skew-left"></i>`;

	res.render('site/catalogue', {
		header: await loadHeaderData.load(),
		leftSidebar: await loadLeftSidebarData.load(),
		catalogue: {
			films,
			totalPage,
			pageNumber,
			currentHref: req.originalUrl.split('/page-').shift(),
			breadcrumb,
			sectionBarTitle,
			keyWord,
		},
	});
};
