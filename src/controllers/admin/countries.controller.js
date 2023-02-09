const Countries = require('../../models/country.models');

// ###### API ######

// [POST] admin/countries/datatables_ajax
const ajaxDatatablesCountries = async (req, res) => {
	const draw = req.body.draw;
	const start = req.body.start;
	const length = req.body.length;
	const columnIndex = req.body.order[0]['column'];
	const columnName = req.body.columns[columnIndex]['name'];
	const columnSortOrder = req.body.order[0]['dir'] === 'asc' ? 1 : -1;
	const searchValue = req.body.search.value;
	const searchQueryDB = {
		$or: [{ country_name: new RegExp(searchValue, 'i') }, { country_slug: new RegExp(searchValue, 'i') }],
	};

	let totalCountry;
	let totalCountryWithFilter;
	let dataCountries;
	if (req.query.type === 'trash') {
		totalCountry = await Countries.countDocumentsDeleted({});
		totalCountryWithFilter = await Countries.countDocumentsDeleted(searchQueryDB);
		dataCountries = await Countries.findDeleted(searchQueryDB)
			.skip(start)
			.limit(length)
			.sort({ [columnName]: columnSortOrder });
	} else {
		totalCountry = await Countries.countDocuments({});
		totalCountryWithFilter = await Countries.countDocuments(searchQueryDB);
		dataCountries = await Countries.find(searchQueryDB)
			.skip(start)
			.limit(length)
			.sort({ [columnName]: columnSortOrder });
	}

	res.status(200).json({
		draw,
		recordsTotal: totalCountry,
		recordsFiltered: totalCountryWithFilter,
		data: dataCountries.reduce((arrDataCountries, currentDataCountry) => {
			arrDataCountries.push([
				'#' + currentDataCountry._doc.country_id,
				currentDataCountry._doc.country_name,
				currentDataCountry._doc.country_slug,
				currentDataCountry._doc.updatedAt.toISOString().substring(0, 10),
				req.query.type === 'trash'
					? `<div class="d-flex order-actions">
                            <a href="javascript:;" class="ms-1 btn-restore" onclick="restoreCountry('${currentDataCountry._doc._id.toString()}')"><i class="bx bx-undo"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
								currentDataCountry._doc.country_name
							}','${currentDataCountry._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`
					: `<div class="d-flex order-actions">
                            <a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
                            <a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${currentDataCountry._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
								currentDataCountry._doc.country_name
							}','${currentDataCountry._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`,
			]);
			return arrDataCountries;
		}, []),
	});
};

// [POST] admin/countries/create
const createCountry = (req, res) => {
	const country = new Countries({
		country_name: req.body.country_name,
		country_slug: req.body.slug,
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
		const country = await Countries.findById(req.params.id);
		res.status(200).json(country);
	} catch (error) {
		console.log(error);
		next();
	}
};

// [PUT] admin/countries/update/:id
const updateCountry = (req, res) => {
	Countries.updateOne(
		{ _id: req.params.id },
		{
			country_name: req.body.country_name,
			country_slug: req.body.slug,
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
	Countries.delete({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete Country Success!' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [PATCH] admin/countries/restore/:id
const restoreCountry = (req, res) => {
	Countries.restore({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Restore Country Success' });
		})
		.catch((error) => {
			return res.status(500).json(error);
		});
};

// [DELETE] admin/countries/destroy/:id
const destroyCountry = (req, res) => {
	Countries.deleteOne({ _id: req.params.id })
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
		ajaxType: '',
	});
};

// [GET] admin/countries/trash
const countriesTrash = (req, res) => {
	res.render('admin/countriesTrash', {
		user: req.session.user,
		ajaxType: 'trash',
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
	countriesTrash,
};
