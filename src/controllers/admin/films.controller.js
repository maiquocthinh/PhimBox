const Films = require('../../models/film.models');
const Categories = require('../../models/category.models');
const Countries = require('../../models/country.models');
const Users = require('../../models/user.models');
const ajaxFilmsUtil = require('../../utils/ajaxFilms.util');
const { nanoid } = require('nanoid');

// ###### API ######

// [POST] admin/films/datatables_ajax
const ajaxDatatablesFilms = async (req, res) => {
	const { status, type, category, country, info, deleted } = req.query;
	const { columns, order, start, length, search, draw } = req.body;
	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'];
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	const listCategories = await Categories.find();
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

	const dataFilmsWithFilter = deleted
		? await Films.findDeleted(queryToDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder })
		: await Films.find(queryToDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder });
	const totalFilm = deleted ? await Films.countDocumentsDeleted({}) : await Films.countDocuments({});

	const data = dataFilmsWithFilter.reduce((arrDataFilms, currentDataFilm) => {
		arrDataFilms.push([
			currentDataFilm.id,
			`<div class="d-flex align-items-center">
					<div class="recent-product-img"><img src="${currentDataFilm.poster}" alt="" /></div>
					<div class="ms-2">
						<h6 class="mb-1 font-14">${currentDataFilm.originalName} (${currentDataFilm.year})</h6>
						<div class="d-flex gap-1">
							<span class="badge rounded-pill text-white bg-gradient-lush text-capitalize" style="max-width: 72px">${currentDataFilm.type}</span>
							<span class="badge rounded-pill text-white bg-gradient-kyoto text-capitalize" style="max-width: 72px">${currentDataFilm.status}</span>
						</div>
					</div>
				</div>`,
			ajaxFilmsUtil.arrayToCategories(currentDataFilm.category, listCategories),
			currentDataFilm.episodes.length,
			currentDataFilm.viewable
				? `<div class="badge rounded-pill text-white bg-gradient-blues p-1 text-capitalize px-3">
					<i class="bx bx-show align-middle me-1"></i> Public
				</div>`
				: `<div class="badge rounded-pill text-white bg-gradient-burning p-1 text-capitalize px-3">
				<i class="bx bx-hide align-middle me-1"></i> Hidden
			</div>`,
			deleted
				? `<div class="d-flex order-actions">
					<a href="javascript:;" class="ms-1 btn-restore" onclick="restoreFilm('${currentDataFilm._id.toString()}')"><i class="bx bx-undo"></i></a>
					<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeletePermanentlyForm('${
						currentDataFilm.originalName
					} (${
						currentDataFilm.year
				  })','${currentDataFilm._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
				</div>`
				: `<div class="d-flex order-actions">
					<a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
					<div class="dropdown ms-1">
						<a class="btn btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="bx bx-add-to-queue" style="transform: translateX(2px);"></i></a>
						<ul class="dropdown-menu" style="margin: 0px;">
							<li><button class="dropdown-item">List Episode</button></li>
							<li><hr class="dropdown-divider"></li>
							<li><button class="dropdown-item">Add Episode</button></li>
							<li><button class="dropdown-item">Add Episode Quick</button></li>
						</ul>
					</div>
					<a href="javascript:;" class="text-warning ms-1" onclick="fillDataFilmToForm('${currentDataFilm._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
					<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataFilm.originalName} (${
						currentDataFilm.year
				  })','${currentDataFilm._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
				</div>`,
		]);
		return arrDataFilms;
	}, []);

	return res.status(200).json({
		draw: draw,
		recordsFiltered: dataFilmsWithFilter.length,
		recordsTotal: totalFilm,
		data: data,
	});
};

// [POST] admin/films/create
const createFilm = (req, res) => {
	const films = new Films({
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
			// res.send({'message':'Create Film Success'});
			res.redirect('/admin/films');
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [GET] admin/films/read/:id
const readFilm = async (req, res) => {
	try {
		const film = await Films.findById(req.params.id);
		res.status(200).json(film);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [PUT] admin/films/update/:id
const updateFilm = (req, res) => {
	Films.updateOne(
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
	Films.delete({ _id: req.params.id })
		.then(() => {
			res.send({ message: 'Delete Film Success!' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [PATCH] admin/films/restore/:id
const restoreFilm = (req, res) => {
	Films.restore({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Restore Film Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [DELETE] admin/films/destroy/:id
const destroyFilm = (req, res) => {
	Films.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete Forever Success!' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// ###### PAGE ######

// [GET] admin/films/add
const addFilm = async (req, res) => {
	try {
		const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce(
			(categories, currentCategory) => {
				categories.push(currentCategory._doc);
				return categories;
			},
			[],
		);
		const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce(
			(countries, currentCountry) => {
				countries.push(currentCountry._doc);
				return countries;
			},
			[],
		);

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
		const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce(
			(categories, currentCategory) => {
				categories.push(currentCategory._doc);
				return categories;
			},
			[],
		);
		const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce(
			(countries, currentCountry) => {
				countries.push(currentCountry._doc);
				return countries;
			},
			[],
		);

		res.render('admin/films', {
			user: req.session.user,
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films/error
const filmsError = async (req, res) => {
	try {
		const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce(
			(categories, currentCategory) => {
				categories.push(currentCategory._doc);
				return categories;
			},
			[],
		);
		const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce(
			(countries, currentCountry) => {
				countries.push(currentCountry._doc);
				return countries;
			},
			[],
		);

		res.render('admin/films', {
			user: req.session.user,
			title: 'Error',
			ajaxType: '',
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
	addFilm,
	filmsError,
};
