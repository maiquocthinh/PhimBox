const getPagination = (url, pageNumber, totalPage) => {
	// custom method for URL object
	URL.prototype.setQueryParam = function (key, value) {
		this.searchParams.set(key, value);
		return this;
	};

	if (url instanceof String) url = new URL(url);
	if (url instanceof URL)
		return {
			first: url.setQueryParam('page', 1).toString(),
			last: url.setQueryParam('page', totalPage).toString(),
			next: url.setQueryParam('page', pageNumber + 1 <= totalPage ? pageNumber + 1 : totalPage).toString(),
			prev: url.setQueryParam('page', pageNumber - 1 > 0 ? pageNumber - 1 : 1).toString(),
			list: Array.from({ length: totalPage }, (v, i) => ({
				href: url.setQueryParam('page', ++i).toString(),
				name: i,
				isCurrentPage: i === pageNumber,
			})),
		};
	else throw new Error('url: must be String or URL');
};

module.exports = { getPagination };
