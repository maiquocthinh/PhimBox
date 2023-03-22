const ajaxFilmsUtil = require('../../utils/ajaxFilms.util');
const { nanoid } = require('nanoid');
const filmModels = require('../../models/film.models');
const categoryModels = require('../../models/category.models');
const countryModels = require('../../models/country.models');

// ###### API ######

// [POST] admin/films/datatables_ajax
const ajaxDatatablesFilms = async (req, res) => {
	const { status, type, category, country, info, deleted } = req.query;
	const { columns, order, start, length, search, draw } = req.body;
	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'] || 'createdAt';
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	const listCategories = await categoryModels.find();
	let queryToDB = {};

	if (search.value) queryToDB.originalName = new RegExp(search.value, 'i');
	if (category) queryToDB.category = category;
	if (country) queryToDB.country = country;
	if (status)
		switch (status) {
			case 'complete':
				queryToDB.status = 'complete';
				break;
			case 'ongoing':
				queryToDB.status = 'ongoing';
				break;
			case 'trailer':
				queryToDB.status = 'trailer';
				break;
		}
	if (type)
		switch (type) {
			case 'movies':
				queryToDB.type = 'movie';
				break;
			case 'series':
				queryToDB.type = 'series';
				break;
			case 'shownInCinema':
				queryToDB.film_cinema = true;
				break;
			case 'recommend':
				queryToDB.recommend = true;
				break;
			case 'canonical':
				queryToDB.canonical = true;
				break;
		}
	if (info)
		switch (info) {
			case 'missingPoster':
				queryToDB.poster = '';
				break;
			case 'missingBackdrops':
				queryToDB.backdrops = '';
				break;
			case 'missingLogo':
				queryToDB.logo = '';
				break;
			case 'missingTrailer':
				queryToDB.trailer = '';
				break;
			case 'missingEpisode':
				queryToDB.episodes = { $not: { $exists: true, $type: 'array', $ne: [] } };
				break;
		}
	console.log(queryToDB);
	const dataFilmsWithFilter = deleted
		? await filmModels
				.findDeleted(queryToDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder })
		: await filmModels
				.find(queryToDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder });
	const totalFilm = deleted ? await filmModels.countDocumentsDeleted({}) : await filmModels.countDocuments({});

	const data = dataFilmsWithFilter.map((film) => [
		film.id,
		film.id,
		`<div class="d-flex align-items-center">
					<div class="recent-product-img"><img src="${film.poster}" alt="" /></div>
					<div class="ms-2">
						<h6 class="mb-1 font-14">${film.originalName} (${film.year})</h6>
						<div class="d-flex gap-1">
							<span class="badge rounded-pill text-white bg-gradient-lush text-capitalize" style="max-width: 72px">${film.type}</span>
							<span class="badge rounded-pill text-white bg-gradient-kyoto text-capitalize" style="max-width: 72px">${film.status}</span>
						</div>
					</div>
				</div>`,
		ajaxFilmsUtil.arrayToCategories(film.category, listCategories),
		film.episodes.length,
		film.createdAt.toISOString().substring(0, 10),
		film.viewable
			? `<div class="badge rounded-pill text-white bg-gradient-blues p-1 text-capitalize px-3">
					<i class="bx bx-show align-middle me-1"></i> Public
				</div>`
			: `<div class="badge rounded-pill text-white bg-gradient-burning p-1 text-capitalize px-3">
				<i class="bx bx-hide align-middle me-1"></i> Hidden
			</div>`,
		deleted
			? `<div class="d-flex order-actions">
				<a href="javascript:;" class="ms-1 btn-restore" onclick="restoreFilm('${film._id.toString()}')"><i class="bx bx-undo"></i></a>
				<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeletePermanentlyForm('${film.originalName} (${
					film.year
			  })','${film._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
			</div>`
			: `<div class="d-flex order-actions">
				<a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
				<a href="/admin/episodes/${film._id.toString()}" class="ms-1"><i class="bx bx-collection"></i></a>
				<a href="javascript:;" class="text-warning ms-1" onclick="fillDataFilmToForm('${film._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
				<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${film.originalName} (${
					film.year
			  })','${film._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
			</div>`,
	]);

	return res.status(200).json({
		draw: draw,
		recordsTotal: totalFilm,
		recordsFiltered: totalFilm,
		data: data,
	});
};

// [POST] admin/films/create
const createFilm = (req, res) => {
	const films = new filmModels({
		id: nanoid(7),
		name: req.body.name,
		originalName: req.body.original_name,
		status: req.body.status,
		viewable: !!req.body.viewable,
		poster: req.body.poster,
		backdrops: req.body.backdrops,
		backdropsCanonical: req.body.backdrops_canonical,
		logo: req.body.logo,
		category: req.body.categories,
		country: req.body.countries,
		trailer: req.body.trailer,
		duration: req.body.duration,
		quality: req.body.quality,
		year: req.body.year,
		imdb: req.body.imdb,
		language: req.body.language,
		type: req.body.type,
		inCinema: req.body.in_cinema,
		recommend: req.body.recommend,
		canonical: req.body.canonical,
		notify: req.body.notify,
		description: req.body.description,
		info: req.body.info,
		tag: req.body.tags,
		tagAscii: req.body.tagsascii,
		createdBy: req.session.user._id,
		updatedBy: req.session.user._id,
	});
	films
		.save()
		.then(() => {
			res.status(200).json({ message: 'Create Film Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [GET] admin/films/read/:id
const readFilm = async (req, res) => {
	try {
		const film = await filmModels.findById(req.params.id);
		res.status(200).json(film);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [PUT] admin/films/update/:id
const updateFilm = (req, res) => {
	filmModels
		.updateOne(
			{ _id: req.params.id },
			{
				name: req.body.name,
				originalName: req.body.original_name,
				status: req.body.status,
				viewable: !!req.body.viewable,
				poster: req.body.poster,
				backdrops: req.body.backdrops,
				backdropsCanonical: req.body.backdrops_canonical,
				logo: req.body.logo,
				category: req.body.categories,
				country: req.body.countries,
				trailer: req.body.trailer,
				duration: req.body.duration,
				quality: req.body.quality,
				year: req.body.year,
				imdb: req.body.imdb,
				language: req.body.language,
				type: req.body.type,
				inCinema: req.body.in_cinema,
				recommend: req.body.recommend,
				canonical: req.body.canonical,
				notify: req.body.notify,
				description: req.body.description,
				info: req.body.info,
				tag: req.body.tags,
				tagAscii: req.body.tagsascii,
				updatedBy: req.session.user._id,
			},
		)
		.then(() => {
			res.status(200).json({ message: 'Update Film Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [DELETE] admin/films/delete/:id
const deleteFilm = (req, res) => {
	filmModels
		.delete({ _id: req.params.id })
		.then(() => {
			res.send({ message: 'Delete Film Success!' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [PATCH] admin/films/restore/:id
const restoreFilm = (req, res) => {
	filmModels
		.restore({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Restore Film Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [DELETE] admin/films/destroy/:id
const destroyFilm = (req, res) => {
	filmModels
		.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete Permanently Film Success!' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};
// [DELETE] admin/films/delete-many/
const deleteManyFilm = (req, res) => {
	const { ids } = req.body;
	filmModels
		.delete({ id: { $in: ids } })
		.then(() => {
			res.send({ message: 'Delete Films Success!' });
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
};

// [PATCH] admin/films/restore-many/
const restoreManyFilm = (req, res) => {
	const { ids } = req.body;
	filmModels
		.restore({ id: { $in: ids } })
		.then(() => {
			res.status(200).json({ message: 'Restore Films Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [DELETE] admin/films/destroy-many/
const destroyManyFilm = (req, res) => {
	const { ids } = req.body;
	filmModels
		.deleteMany({ id: { $in: ids } })
		.then(() => {
			res.status(200).json({ message: 'Delete Permanently Films Success!' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// ###### PAGE ######

// [GET] admin/films/add
const addFilm = async (req, res) => {
	try {
		const categories = await categoryModels.find({}, { _id: 1, name: 1 });
		const countries = await countryModels.find({}, { _id: 1, name: 1 });

		res.render('admin/addFilm', {
			user: req.session.user,
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films
const allFilms = async (req, res) => {
	try {
		const categories = await categoryModels.find({}, { _id: 1, name: 1 });
		const countries = await countryModels.find({}, { _id: 1, name: 1 });

		res.render('admin/films', {
			user: req.session.user,
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	ajaxDatatablesFilms,
	allFilms,
	createFilm,
	readFilm,
	updateFilm,
	deleteFilm,
	restoreFilm,
	destroyFilm,
	deleteManyFilm,
	restoreManyFilm,
	destroyManyFilm,
	addFilm,
};
