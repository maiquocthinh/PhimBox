const { nanoid } = require('nanoid');
const Categories = require('../../models/category.models');

// ###### API ######

// [POST] admin/categories/datatables_ajax
const ajaxDatatablesCategories = async (req, res) => {
	const { deleted } = req.query;
	const { columns, order, start, length, search, draw } = req.body;
	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'];
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	let queryToDB = {};

	if (search.value) queryToDB.name = new RegExp(search.value, 'i');

	const totalCategory = deleted ? await Categories.countDocumentsDeleted({}) : await Categories.countDocuments({});
	const dataCategories = deleted
		? await Categories.findDeleted(queryToDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder })
		: await Categories.find(queryToDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder });

	const data = dataCategories.reduce((arrDataCategories, currentDataCategory) => {
		arrDataCategories.push([
			currentDataCategory.id,
			currentDataCategory.name,
			currentDataCategory.slug,
			currentDataCategory.createdAt.toISOString().substring(0, 10),
			currentDataCategory.updatedAt.toISOString().substring(0, 10),
			deleted
				? `<div class="d-flex order-actions">
					<a href="javascript:;" class="ms-1 btn-restore" onclick="restoreCategory('${currentDataCategory._id.toString()}')"><i class="bx bx-undo"></i></a>
					<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeletePermanentlyForm('${
						currentDataCategory.name
					}','${currentDataCategory._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
				</div>`
				: `<div class="d-flex order-actions">
					<a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
					<a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${currentDataCategory._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
					<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
						currentDataCategory.name
					}','${currentDataCategory._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
				</div>`,
		]);
		return arrDataCategories;
	}, []);

	res.status(200).json({
		draw,
		recordsTotal: totalCategory,
		recordsFiltered: dataCategories.length,
		data,
	});
};

// [POST] admin/categories/create
const createCategory = (req, res) => {
	const category = new Categories({
		id: nanoid(7),
		name: req.body.name,
		slug: req.body.slug,
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
			name: req.body.name,
			slug: req.body.slug,
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

// ###### PAGE ######

// [GET] admin/categories
const allCategories = (req, res) => {
	res.render('admin/categories', {
		user: req.session.user,
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
};
