const countryModels = require('../../models/country.models');

// ###### API ######

// [POST] admin/countries/datatables_ajax
const ajaxDatatablesCountries = async (req, res) => {
	const { deleted } = req.query;
	const { columns, order, start, length, search, draw } = req.body;
	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'];
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	let queryToDB = {};

	if (search.value) queryToDB.name = new RegExp(search.value, 'i');

	const totalCountry = deleted ? await countryModels.countDocumentsDeleted({}) : await countryModels.countDocuments({});
	const dataCountries = deleted
		? await countryModels
				.findDeleted(queryToDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder })
		: await countryModels
				.find(queryToDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder });

	const data = dataCountries.map((country) => [
		country.name,
		country.slug,
		country.createdAt.toISOString().substring(0, 10),
		country.updatedAt.toISOString().substring(0, 10),
		deleted
			? `<div class="d-flex order-actions">
				<a href="javascript:;" class="ms-1 btn-restore" onclick="restoreCountry('${country._id}')"><i class="bx bx-undo"></i></a>
				<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeletePermanentlyForm('${country.name}','${country._id}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
			</div>`
			: `<div class="d-flex justify-content-center order-actions">
				<a href="/country/${country.slug}" target="_blank" class="text-primary"><i class="bx bx-link-external"></i></a>
				<a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${country._id}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
				<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${country.name}','${country._id}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
			</div>`,
	]);

	res.status(200).json({
		draw,
		recordsTotal: totalCountry,
		recordsFiltered: totalCountry,
		data,
	});
};

// [POST] admin/countries/create
const createCountry = (req, res) => {
	const country = new countryModels({
		name: req.body.name,
		slug: req.body.slug,
	});
	country
		.save()
		.then(() => {
			res.status(200).json({ message: 'Create Country Success' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [GET] admin/countries/read/:id
const readCountry = async (req, res) => {
	try {
		const country = await countryModels.findById(req.params.id);
		res.status(200).json(country);
	} catch (error) {
		return res.status(500).json(error);
	}
};

// [PUT] admin/countries/update/:id
const updateCountry = (req, res) => {
	countryModels
		.updateOne(
			{ _id: req.params.id },
			{
				name: req.body.name,
				slug: req.body.slug,
			},
		)
		.then(() => {
			res.status(200).json({ message: 'Update Country Success' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [DELETE] admin/countries/delete/:id
const deleteCountry = (req, res) => {
	countryModels
		.delete({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete Country Success!' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [PATCH] admin/countries/restore/:id
const restoreCountry = (req, res) => {
	countryModels
		.restore({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Restore Country Success' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [DELETE] admin/countries/destroy/:id
const destroyCountry = (req, res) => {
	countryModels
		.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete Country Success!' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// ###### PAGE ######

// [GET] admin/countries
const allCountries = (req, res) => {
	res.render('admin/countries', {
		user: req.session.user,
	});
};

module.exports = {
	ajaxDatatablesCountries,
	allCountries,
	createCountry,
	readCountry,
	updateCountry,
	deleteCountry,
	restoreCountry,
	destroyCountry,
};
