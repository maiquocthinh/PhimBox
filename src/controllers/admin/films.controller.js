const Films = require('../../models/film.models');
const Categories = require('../../models/category.models');
const Countries = require('../../models/country.models');
const Users = require('../../models/user.models');
const ajaxFilmsUtil = require('../../utils/ajaxFilms.util');

// ###### API ######

// [POST] admin/films/datatables_ajax
const ajaxDatatablesFilms = async (req, res) => {
	try {
		// res.sendFile('D:/Codes/Backend/Nodejs/Movies_Web/src/public/admin/ajax.txt');
		const draw = req.body.draw;
		const start = req.body.start;
		const length = req.body.length;
		const columnIndex = req.body.order[0]['column'];
		const columnName = req.body.columns[columnIndex]['name'];
		const columnSortOrder = req.body.order[0]['dir'] === 'asc' ? 1 : -1;
		const searchValue = req.body.search.value;
		const searchQueryDB = { film_originalname: new RegExp(searchValue, 'i') };

		const listCategories = await Categories.find();
		const listUsers = await Users.find();
		let totalFilm;
		let totalFilmWithFilter;
		let dataFilms;
		if (req.query.type === 'trash') {
			totalFilm = await Films.countDocumentsDeleted({});
			totalFilmWithFilter = await Films.countDocumentsDeleted(searchQueryDB);
			dataFilms = await Films.findDeleted(searchQueryDB)
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder });
		} else {
			let queryDB;
			switch (req.query.type) {
				case 'movies':
					queryDB = { film_type: 'movie' };
					break;
				case 'series':
					queryDB = { film_type: { $in: ['serie_full', 'serie_not_full'] } };
					break;
				case 'cartoon_anime':
					queryDB = { film_category: '16' };
					break;
				case 'cinema':
					queryDB = { film_cinema: true };
					break;
				case 'film_hot':
					queryDB = { film_hot: true };
					break;
				case 'film_canonical':
					queryDB = { film_canonical: true };
					break;
				case 'film_trailer':
					queryDB = { film_type: 'film_trailer' };
					break;
				case 'not_ep':
					queryDB = { film_episodes: { $not: { $exists: true, $type: 'array', $ne: [] } } };
					break;
				default:
					queryDB = {};
					break;
			}
			totalFilm = await Films.countDocuments({});
			totalFilmWithFilter = await Films.countDocuments({ ...queryDB, ...searchQueryDB });
			dataFilms = await Films.find({ ...queryDB, ...searchQueryDB })
				.skip(start)
				.limit(length)
				.sort({ [columnName]: columnSortOrder });
		}

		res.status(200).json({
			draw,
			recordsTotal: totalFilm,
			recordsFiltered: totalFilmWithFilter,
			data: dataFilms.reduce((arrDataFilms, currentDataFilm) => {
				arrDataFilms.push([
					'#' + currentDataFilm._doc.film_id,
					`<div class="d-flex align-items-center">
                            <div class="recent-product-img">
                            <img src="${currentDataFilm._doc.film_img}" alt="" />
                            </div>
                            <div class="ms-2">
                            <h6 class="mb-1 font-14">
                            ${currentDataFilm._doc.film_originalname} (${currentDataFilm._doc.film_year})
                            </h6>
                            </div>
                        </div>`,
					ajaxFilmsUtil.arrayToCategories(currentDataFilm._doc.film_category, listCategories),
					currentDataFilm._doc.film_episodes.length,
					`<span class="badge rounded-pill text-white bg-gradient-burning w-100">${currentDataFilm._doc.film_status}</span>`,
					`<div class="badge rounded-pill text-white bg-gradient-blues p-2 text-uppercase px-3">
                            <i class="bx bx-show align-middle me-1"></i>Public
                        </div>`,
					ajaxFilmsUtil.getUserById(currentDataFilm._doc.film_uploadby, listUsers),
					currentDataFilm._doc.updatedAt.toISOString().substring(0, 10),
					req.query.type === 'trash'
						? `<div class="d-flex order-actions">
                            <a href="javascript:;" class="ms-1 btn-restore" onclick="restoreFilm('${currentDataFilm._doc._id.toString()}')"><i class="bx bx-undo"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
								currentDataFilm._doc.film_originalname
							} (${
								currentDataFilm._doc.film_year
						  })','${currentDataFilm._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
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
                            <a href="javascript:;" class="text-warning ms-1" onclick="fillDataFilmToForm('${currentDataFilm._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
								currentDataFilm._doc.film_originalname
							} (${
								currentDataFilm._doc.film_year
						  })','${currentDataFilm._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`,
				]);
				return arrDataFilms;
			}, []),
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [POST] admin/films/create
const createFilm = (req, res) => {
	const films = new Films({
		film_name: req.body.name,
		film_originalname: req.body.original_name,
		film_status: req.body.status,
		film_img: req.body.image,
		film_imgbn: req.body.image_banner,
		film_imgbn_canonical: req.body.image_canonical,
		film_category: req.body.categories,
		film_country: req.body.countries,
		film_trailer: req.body.trailer,
		film_duration: req.body.duration,
		film_quality: req.body.quality,
		film_year: req.body.year,
		film_imdb: req.body.imdb,
		film_language: req.body.language,
		film_cinema: req.body.is_cinema,
		film_hot: req.body.is_film_hot,
		film_canonical: req.body.is_film_canonical,
		film_type: req.body.type_film,
		film_message: req.body.message_film,
		film_description: req.body.description_film,
		film_info: req.body.info_film,
		film_tag: req.body.tags,
		film_tagascii: req.body.tagsascii,
		film_uploadby: req.body.user_id,
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
		res.send(JSON.stringify(film));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [PUT] admin/films/update/:id
const updateFilm = (req, res) => {
	Films.updateOne(
		{ _id: req.params.id },
		{
			film_name: req.body.name,
			film_originalname: req.body.original_name,
			film_status: req.body.status,
			film_img: req.body.image,
			film_imgbn: req.body.image_banner,
			film_imgbn_canonical: req.body.image_canonical,
			film_category: req.body.categories,
			film_country: req.body.countries,
			film_trailer: req.body.trailer,
			film_duration: req.body.duration,
			film_quality: req.body.quality,
			film_year: req.body.year,
			film_imdb: req.body.imdb,
			film_language: req.body.language,
			film_cinema: req.body.is_cinema,
			film_hot: req.body.is_film_hot,
			film_canonical: req.body.is_film_canonical,
			film_type: req.body.type_film,
			film_message: req.body.message_film,
			film_description: req.body.description_film,
			film_info: req.body.info_film,
			film_tag: req.body.tags,
			film_tagascii: req.body.tagsascii,
			film_slug: req.body.slug,
			film_uploadby: req.body.user_id,
		},
	)
		.then(() => {
			res.send({ message: 'Update Film Success' });
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
			res.send({ message: 'Restore Film Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [DELETE] admin/films/destroy/:id
const destroyFilm = (req, res) => {
	Films.deleteOne({ _id: req.params.id })
		.then(() => {
			res.send({ message: 'Delete Forever Success!' });
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
			title: '',
			ajaxType: '',
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films/movies
const filmsMovies = async (req, res) => {
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
			title: 'Movies',
			ajaxType: 'movies',
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films/series
const filmsSeries = async (req, res) => {
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
			title: 'Series',
			ajaxType: 'series',
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films/cartoon-anime
const filmsCartoonAnime = async (req, res) => {
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
			title: 'Cartoon & Anime',
			ajaxType: 'cartoon_anime',
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films/cinema
const filmsCinema = async (req, res) => {
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
			title: 'Cinema',
			ajaxType: 'cinema',
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films/hot
const filmsHot = async (req, res) => {
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
			title: 'Film Hot',
			ajaxType: 'film_hot',
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films/trailer
const filmsTrailer = async (req, res) => {
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
			title: 'Trailer',
			ajaxType: 'film_trailer',
			categories,
			countries,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [GET] admin/films/no-episode
const filmsNotEp = async (req, res) => {
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
			title: "Haven't Episode",
			ajaxType: 'not_ep',
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

// [GET] admin/films/trash
const filmsTrash = (req, res) => {
	res.render('admin/filmsTrash', {
		user: req.session.user,
	});
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
	filmsMovies,
	filmsSeries,
	filmsCartoonAnime,
	filmsCinema,
	filmsHot,
	filmsTrailer,
	filmsNotEp,
	filmsError,
	filmsTrash,
};
