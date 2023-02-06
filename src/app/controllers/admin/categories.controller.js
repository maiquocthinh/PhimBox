const Categories = require('../../models/category.models');

// [POST] admin/categories/datatables_ajax
const ajaxDatatablesCategories = async (req, res) => {
	const draw = req.body.draw;
	const start = req.body.start;
	const length = req.body.length;
	const columnIndex = req.body.order[0]['column'];
	const columnName = req.body.columns[columnIndex]['name'];
	const columnSortOrder = req.body.order[0]['dir'] === 'asc' ? 1 : -1;
	const searchValue = req.body.search.value;
	const searchQueryDB = {
		$or: [{ category_name: new RegExp(searchValue, 'i') }, { category_slug: new RegExp(searchValue, 'i') }],
	};

	let totalCategory;
	let totalCategoryWithFilter;
	let dataCategories;
	if (req.query.type === 'trash') {
		totalCategory = await Categories.countDocumentsDeleted({});
		totalCategoryWithFilter = await Categories.countDocumentsDeleted(searchQueryDB);
		dataCategories = await Categories.findDeleted(searchQueryDB)
			.skip(start)
			.limit(length)
			.sort({ [columnName]: columnSortOrder });
	} else {
		totalCategory = await Categories.countDocuments({});
		totalCategoryWithFilter = await Categories.countDocuments(searchQueryDB);
		dataCategories = await Categories.find(searchQueryDB)
			.skip(start)
			.limit(length)
			.sort({ [columnName]: columnSortOrder });
	}

	res.status(200).json({
		draw,
		recordsTotal: totalCategory,
		recordsFiltered: totalCategoryWithFilter,
		data: dataCategories.reduce((arrDataCategories, currentDataCategory) => {
			arrDataCategories.push([
				'#' + currentDataCategory._doc.category_id,
				currentDataCategory._doc.category_name,
				currentDataCategory._doc.category_slug,
				currentDataCategory._doc.updatedAt.toISOString().substring(0, 10),
				req.query.type === 'trash'
					? `<div class="d-flex order-actions">
                        <a href="javascript:;" class="ms-1 btn-restore" onclick="restoreCategory('${currentDataCategory._doc._id.toString()}')"><i class="bx bx-undo"></i></a>
                        <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
							currentDataCategory._doc.category_name
						}','${currentDataCategory._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                    </div>`
					: `<div class="d-flex order-actions">
                        <a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
                        <a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${currentDataCategory._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
                        <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
							currentDataCategory._doc.category_name
						}','${currentDataCategory._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                    </div>`,
			]);
			return arrDataCategories;
		}, []),
	});
};

// [GET] admin/categories
const allCategories = (req, res) => {
	res.render('admin/categories', {
		user: { ...req.user._doc },
		ajaxType: '',
	});
};

// [POST] admin/categories/create
const createCategory = (req, res) => {
	const category = new Categories({
		category_name: req.body.category_name,
		category_slug: req.body.slug,
	});
	category
		.save()
		.then(() => {
			res.status(200).json({ message: 'Create Category Success' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [GET] admin/categories/read/:id
const readCategory = async (req, res) => {
	try {
		const category = await Categories.findById(req.params.id);
		res.status(200).json(category);
	} catch (error) {
		return res.status(500).json(error);
	}
};

// [PUT] admin/categories/update/:id
const updateCategory = (req, res) => {
	Categories.updateOne(
		{ _id: req.params.id },
		{
			category_name: req.body.category_name,
			category_slug: req.body.slug,
		},
	)
		.then(() => {
			res.status(200).json({ message: 'Update Category Success' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [DELETE] admin/categories/delete/:id
const deleteCategory = (req, res) => {
	Categories.delete({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete Category Success!' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [PATCH] admin/categories/restore/:id
const restoreCategory = (req, res) => {
	Categories.restore({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Restore Category Success' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [DELETE] admin/categories/destroy/:id
const destroyCategory = (req, res) => {
	Categories.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete Category Success!' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [GET] admin/categories/trash
const categoriesTrash = (req, res) => {
	res.render('admin/categoriesTrash', {
		user: { ...req.user._doc },
		ajaxType: 'trash',
	});
};

module.exports = {
	ajaxDatatablesCategories,
	allCategories,
	createCategory,
	readCategory,
	updateCategory,
	deleteCategory,
	restoreCategory,
	destroyCategory,
	categoriesTrash,
};
