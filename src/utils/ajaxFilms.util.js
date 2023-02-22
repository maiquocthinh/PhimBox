const arrayToCategories = (arrayCategories, listCategories) => {
	const listHtmlCategories = arrayCategories
		.map((categoryItem) => {
			for (const element of listCategories) {
				if (categoryItem === element._id.toString()) {
					return `<span class="badge rounded-pill text-white bg-gradient-cosmic">${element.name}</span>`;
				}
			}
		})
		.join('');

	return `<div class="d-flex flex-wrap gap-2" style="min-width:160px;">${listHtmlCategories}</div>`;
};

const getUserById = (id, listUsers) => {
	for (const userItem of listUsers) {
		if (id === userItem._id.toString()) {
			return userItem.user_name;
		}
	}
};

module.exports = {
	arrayToCategories,
	getUserById,
};
