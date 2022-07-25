// Import Models
const Users = require('../models/user.models');
const Films = require('../models/film.models');
const Episodes = require('../models/episode.models');
const Categories = require('../models/category.models');
const Countries = require('../models/country.models');
const Configurations = require('../models/configuration.models');
// Import Until
const ajaxFilmsUntil = require('../../util/ajaxFilms.util');
const { query } = require('express');


class AdminController {

    // [GET] /admin
    admin(req, res, next) {
        res.redirect('./dashboard');
    }

    // [GET] admin/login
    login(req, res, next) {
        res.render('admin/login', {
            messageError: '',
        });
    }

    // [POST] admin/login
    loginHandler(req, res, next) {
        Users.findOne({ user_mail: req.body.user_mail })
            .then(data => {
                if (req.body.user_pass !== data.user_pass) {
                    res.render('admin/login', {
                        messageError: 'Mail or Password Wrong !!!',
                    });
                    return;
                }
                res.cookie('_id', data._id.toString(), { maxAge: 3 * 3600 * 1000 });
                res.redirect('/admin/dashboard');
            })
            .catch(next);
    }

    // [GET] admin/logout
    logout(req, res, next) {
        res.clearCookie('_id');
        res.redirect('./login');
    }

    // [GET] admin/dashboard
    dashboard(req, res, next) {
        Promise.all([
            Users.countDocuments({}),
            Films.countDocuments({}),
            Episodes.countDocuments({}),
            Films.find({}, {
                film_id: 1,
                film_img: 1,
                film_originalname: 1,
                film_year: 1,
                film_uploadby: 1,
                updatedAt: 1,
            }).sort({ _id: -1 }).limit(10),
            Users.find({}, { user_pass: 0 }).sort({ _id: -1 }).limit(10),
        ])
            .then(([totalUser, totalFilm, totalEpisode, Films, Users]) => {
                const totalCount = {
                    user: totalUser,
                    film: totalFilm,
                    episode: totalEpisode,
                };
                const films = Films.reduce((films, currentFilm) => {
                    films.push(currentFilm._doc);
                    return films;
                }, []);
                const users = Users.reduce((users, currentUser) => {
                    users.push(currentUser._doc);
                    return users;
                }, []);

                res.render('admin/dashboard', {
                    user: { ...req.user._doc },
                    totalCount,
                    films,
                    users,
                });
            })
            .catch(next);
    }

    // [GET] admin/profile
    profile(req, res, next) {
        res.render('admin/profile', {
            user: { ...req.user._doc },
        });
    }

    // [POST] admin/films/datatables_ajax
    async ajaxDatatablesFilms(req, res, next) {
        try {
            // res.sendFile('D:/Codes/Backend/Nodejs/Movies_Web/src/public/admin/ajax.txt');
            // res.send(JSON.stringify(req.body));
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
                dataFilms = await Films.findDeleted(searchQueryDB).skip(start).limit(length).sort({ [columnName]: columnSortOrder });
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
                totalFilmWithFilter = await Films.countDocuments({ ...queryDB, ...searchQueryDB, });
                dataFilms = await Films.find({ ...queryDB, ...searchQueryDB, })
                    .skip(start).limit(length).sort({ [columnName]: columnSortOrder });
            }

            res.send(JSON.stringify({
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
                        ajaxFilmsUntil.arrayToCategories(currentDataFilm._doc.film_category, listCategories),
                        currentDataFilm._doc.film_episodes.length,
                        `<span class="badge rounded-pill text-white bg-gradient-burning w-100">${currentDataFilm._doc.film_status}</span>`,
                        `<div class="badge rounded-pill text-white bg-gradient-blues p-2 text-uppercase px-3">
                            <i class="bx bx-show align-middle me-1"></i>Public
                        </div>`,
                        ajaxFilmsUntil.getUserById(currentDataFilm._doc.film_uploadby, listUsers),
                        currentDataFilm._doc.updatedAt.toISOString().substring(0, 10),
                        req.query.type === 'trash' ?
                            `<div class="d-flex order-actions">
                            <a href="javascript:;" class="ms-1 btn-restore" onclick="restoreFilm('${currentDataFilm._doc._id.toString()}')"><i class="bx bx-undo"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataFilm._doc.film_originalname} (${currentDataFilm._doc.film_year})','${currentDataFilm._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>` :
                            `<div class="d-flex order-actions">
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
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataFilm._doc.film_originalname} (${currentDataFilm._doc.film_year})','${currentDataFilm._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`,
                    ]);
                    return arrDataFilms;
                }, []),
            }));

        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films
    async allFilms(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: '',
                ajaxType: '',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [POST] admin/films/create
    createFilm(req, res, next) {
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
        films.save()
            .then(() => {
                // res.send({'message':'Create Film Success'});
                res.redirect('/admin/films');
            })
            .catch(next);
    }

    // [GET] admin/films/read/:id
    async readFilm(req, res, next) {
        try {
            const film = await Films.findById(req.params.id);
            res.send(JSON.stringify(film));
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [PUT] admin/films/update/:id
    updateFilm(req, res, next) {
        Films.updateOne({ _id: req.params.id }, {
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
        }).then(() => {
            res.send({ 'message': 'Update Film Success' });
        }).catch(next);
    }

    // [DELETE] admin/films/delete/:id
    deleteFilm(req, res, next) {
        Films.delete({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Delete Film Success!' });
            })
            .catch(next);
    }

    // [PATCH] admin/films/restore/:id
    restoreFilm(req, res, next) {
        Films.restore({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Restore Film Success' });
            })
            .catch(next);
    }

    // [DELETE] admin/films/destroy/:id
    destroyFilm(req, res, next) {
        Films.deleteOne({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Delete Forever Success!' });
            })
            .catch(next);
    }

    // [GET] admin/films/add
    async addFilm(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/addFilm', {
                user: { ...req.user._doc },
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/movies
    async filmsMovies(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: 'Movies',
                ajaxType: 'movies',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/series
    async filmsSeries(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: 'Series',
                ajaxType: 'series',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/cartoon-anime
    async filmsCartoonAnime(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: 'Cartoon & Anime',
                ajaxType: 'cartoon_anime',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/cinema
    async filmsCinema(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: 'Cinema',
                ajaxType: 'cinema',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/hot
    async filmsHot(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: 'Film Hot',
                ajaxType: 'film_hot',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/trailer
    async filmsTrailer(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: 'Trailer',
                ajaxType: 'film_trailer',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/no-episode
    async filmsNotEp(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: 'Haven\'t Episode',
                ajaxType: 'not_ep',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/error
    async filmsError(req, res, next) {
        try {
            const categories = (await Categories.find({}, { category_slug: 0, _id: 0 })).reduce((categories, currentCategory) => {
                categories.push(currentCategory._doc);
                return categories;
            }, []);
            const countries = (await Countries.find({}, { country_slug: 0, _id: 0 })).reduce((countries, currentCountry) => {
                countries.push(currentCountry._doc);
                return countries;
            }, []);

            res.render('admin/films', {
                user: { ...req.user._doc },
                title: 'Error',
                ajaxType: '',
                categories,
                countries,
            });
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [GET] admin/films/trash
    filmsTrash(req, res, next) {
        res.render('admin/filmsTrash', {
            user: { ...req.user._doc },
        });
    }

    // [POST] admin/categories/datatables_ajax
    async ajaxDatatablesCategories(req, res, next) {
        const draw = req.body.draw;
        const start = req.body.start;
        const length = req.body.length;
        const columnIndex = req.body.order[0]['column'];
        const columnName = req.body.columns[columnIndex]['name'];
        const columnSortOrder = req.body.order[0]['dir'] === 'asc' ? 1 : -1;
        const searchValue = req.body.search.value;
        const searchQueryDB = {
            $or: [
                { category_name: new RegExp(searchValue, 'i') },
                { category_slug: new RegExp(searchValue, 'i') }
            ]
        };

        let totalCategory;
        let totalCategoryWithFilter;
        let dataCategories;
        if (req.query.type === 'trash') {
            totalCategory = await Categories.countDocumentsDeleted({});
            totalCategoryWithFilter = await Categories.countDocumentsDeleted(searchQueryDB);
            dataCategories = await Categories.findDeleted(searchQueryDB).skip(start).limit(length).sort({ [columnName]: columnSortOrder });
        } else {
            totalCategory = await Categories.countDocuments({});
            totalCategoryWithFilter = await Categories.countDocuments(searchQueryDB);
            dataCategories = await Categories.find(searchQueryDB).skip(start).limit(length).sort({ [columnName]: columnSortOrder });
        }

        res.send(JSON.stringify({
            draw,
            recordsTotal: totalCategory,
            recordsFiltered: totalCategoryWithFilter,
            data: dataCategories.reduce((arrDataCategories, currentDataCategory) => {
                arrDataCategories.push([
                    '#' + currentDataCategory._doc.category_id,
                    currentDataCategory._doc.category_name,
                    currentDataCategory._doc.category_slug,
                    currentDataCategory._doc.updatedAt.toISOString().substring(0, 10),
                    req.query.type === 'trash' ?
                        `<div class="d-flex order-actions">
                            <a href="javascript:;" class="ms-1 btn-restore" onclick="restoreCategory('${currentDataCategory._doc._id.toString()}')"><i class="bx bx-undo"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataCategory._doc.category_name}','${currentDataCategory._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`:
                        `<div class="d-flex order-actions">
                            <a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
                            <a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${currentDataCategory._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataCategory._doc.category_name}','${currentDataCategory._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`,
                ]);
                return arrDataCategories;
            }, []),
        }));
    }

    // [GET] admin/categories
    allCategories(req, res, next) {
        res.render('admin/categories', {
            user: { ...req.user._doc },
            ajaxType: '',
        });
    }

    // [POST] admin/categories/create
    createCategory(req, res, next) {
        // res.send(JSON.stringify(req.body));
        const category = new Categories({
            category_name: req.body.category_name,
            category_slug: req.body.slug,
        });
        category.save()
            .then(() => {
                res.send({ 'message': 'Create Category Success' });
            })
            .catch(next);
    }

    // [GET] admin/categories/read/:id
    async readCategory(req, res, next) {
        try {
            const category = await Categories.findById(req.params.id);
            res.send(JSON.stringify(category));
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [PUT] admin/categories/update/:id
    updateCategory(req, res, next) {
        Categories.updateOne({ _id: req.params.id }, {
            category_name: req.body.category_name,
            category_slug: req.body.slug,
        }).then(() => {
            res.send({ 'message': 'Update Category Success' });
        }).catch(next);
    }

    // [DELETE] admin/categories/delete/:id
    deleteCategory(req, res, next) {
        Categories.delete({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Delete Category Success!' });
            })
            .catch(next);
    }

    // [PATCH] admin/categories/restore/:id
    restoreCategory(req, res, next) {
        Categories.restore({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Restore Category Success' });
            })
            .catch(next);
    }

    // [DELETE] admin/categories/destroy/:id
    destroyCategory(req, res, next) {
        Categories.deleteOne({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Delete Category Success!' });
            })
            .catch(next);
    }

    // [GET] admin/categories/trash
    categoriesTrash(req, res, next) {
        res.render('admin/categoriesTrash', {
            user: { ...req.user._doc },
            ajaxType: 'trash',
        });
    }

    // [POST] admin/countries/datatables_ajax
    async ajaxDatatablesCountries(req, res, next) {
        const draw = req.body.draw;
        const start = req.body.start;
        const length = req.body.length;
        const columnIndex = req.body.order[0]['column'];
        const columnName = req.body.columns[columnIndex]['name'];
        const columnSortOrder = req.body.order[0]['dir'] === 'asc' ? 1 : -1;
        const searchValue = req.body.search.value;
        const searchQueryDB = {
            $or: [
                { country_name: new RegExp(searchValue, 'i') },
                { country_slug: new RegExp(searchValue, 'i') }
            ]
        };

        let totalCountry;
        let totalCountryWithFilter;
        let dataCountries;
        if (req.query.type === 'trash') {
            totalCountry = await Countries.countDocumentsDeleted({});
            totalCountryWithFilter = await Countries.countDocumentsDeleted(searchQueryDB);
            dataCountries = await Countries.findDeleted(searchQueryDB).skip(start).limit(length).sort({ [columnName]: columnSortOrder });
        } else {
            totalCountry = await Countries.countDocuments({});
            totalCountryWithFilter = await Countries.countDocuments(searchQueryDB);
            dataCountries = await Countries.find(searchQueryDB).skip(start).limit(length).sort({ [columnName]: columnSortOrder });
        }


        res.send(JSON.stringify({
            draw,
            recordsTotal: totalCountry,
            recordsFiltered: totalCountryWithFilter,
            data: dataCountries.reduce((arrDataCountries, currentDataCountry) => {
                arrDataCountries.push([
                    '#' + currentDataCountry._doc.country_id,
                    currentDataCountry._doc.country_name,
                    currentDataCountry._doc.country_slug,
                    currentDataCountry._doc.updatedAt.toISOString().substring(0, 10),
                    req.query.type === 'trash' ?
                        `<div class="d-flex order-actions">
                            <a href="javascript:;" class="ms-1 btn-restore" onclick="restoreCountry('${currentDataCountry._doc._id.toString()}')"><i class="bx bx-undo"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataCountry._doc.country_name}','${currentDataCountry._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`:
                        `<div class="d-flex order-actions">
                            <a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
                            <a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${currentDataCountry._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataCountry._doc.country_name}','${currentDataCountry._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`,
                ]);
                return arrDataCountries;
            }, []),
        }));
    }

    // [GET] admin/countries
    allCountries(req, res, next) {
        res.render('admin/countries', {
            user: { ...req.user._doc },
            ajaxType: ''
        });
    }

    // [POST] admin/countries/create
    createCountry(req, res, next) {
        // res.send(JSON.stringify(req.body));
        const country = new Countries({
            country_name: req.body.country_name,
            country_slug: req.body.slug,
        });
        country.save()
            .then(() => {
                res.send({ 'message': 'Create Country Success' });
            })
            .catch(next);
    }

    // [GET] admin/countries/read/:id
    async readCountry(req, res, next) {
        try {
            const country = await Countries.findById(req.params.id);
            res.send(JSON.stringify(country));
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [PUT] admin/countries/update/:id
    updateCountry(req, res, next) {
        Countries.updateOne({ _id: req.params.id }, {
            country_name: req.body.country_name,
            country_slug: req.body.slug,
        }).then(() => {
            res.send({ 'message': 'Update Country Success' });
        }).catch(next);
    }

    // [DELETE] admin/countries/delete/:id
    deleteCountry(req, res, next) {
        Countries.delete({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Delete Country Success!' });
            })
            .catch(next);
    }

    // [PATCH] admin/countries/restore/:id
    restoreCountry(req, res, next) {
        Countries.restore({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Restore Country Success' });
            })
            .catch(next);
    }

    // [DELETE] admin/countries/destroy/:id
    destroyCountry(req, res, next) {
        Countries.deleteOne({ _id: req.params.id })
            .then(() => {
                res.send({ 'message': 'Delete Country Success!' });
            })
            .catch(next);
    }

    // [GET] admin/countries/trash
    countriesTrash(req, res, next) {
        res.render('admin/countriesTrash', {
            user: { ...req.user._doc },
            ajaxType: 'trash',

        });
    }

    // [POST] admin/countries/datatables_ajax
    async ajaxDatatablesUsers(req, res, next) {
        const draw = req.body.draw;
        const start = req.body.start;
        const length = req.body.length;
        const columnIndex = req.body.order[0]['column'];
        const columnName = req.body.columns[columnIndex]['name'];
        const columnSortOrder = req.body.order[0]['dir'] === 'asc' ? 1 : -1;
        const searchValue = req.body.search.value;
        const searchQueryDB = {
            $or: [
                { user_mail: new RegExp(searchValue, 'i') },
                { user_name: new RegExp(searchValue, 'i') }
            ]
        };

        let totalUser;
        let totalUserWithFilter;
        let dataUsers;
        if (req.query.type === 'trash') {
            totalUser = await Users.countDocumentsDeleted({});
            totalUserWithFilter = await Users.countDocumentsDeleted(searchQueryDB);
            dataUsers = await Users.findDeleted(searchQueryDB).skip(start).limit(length).sort({ [columnName]: columnSortOrder });
        } else {
            totalUser = await Users.countDocuments({});
            totalUserWithFilter = await Users.countDocuments(searchQueryDB);
            dataUsers = await Users.find(searchQueryDB).skip(start).limit(length).sort({ [columnName]: columnSortOrder });
        }


        res.send(JSON.stringify({
            draw,
            recordsTotal: totalUser,
            recordsFiltered: totalUserWithFilter,
            data: dataUsers.reduce((arrDataUsers, currentDataUser) => {
                arrDataUsers.push([
                    '#' + currentDataUser._doc.user_id,
                    `<div class="d-flex align-items-center">
                        <div class="recent-product-img">
                        <img src="${currentDataUser._doc.user_avatar}" alt="">
                        </div>
                        <div class="ms-2">
                        <h6 class="mb-1 font-14">${currentDataUser._doc.user_name}</h6>
                        </div>
                    </div>`,
                    currentDataUser._doc.user_email,
                    currentDataUser._doc.user_level === 0 ?
                        `<span class="badge text-white bg-gradient-lush text-uppercase px-3">Admin</span>` :
                        currentDataUser._doc.user_level === 1 ?
                            `<span class="badge text-white bg-gradient-blues text-uppercase px-3">Poster</span>` :
                            `<span class="badge text-white bg-gradient-kyoto text-uppercase px-3">Member</span>`,
                    ``,
                    currentDataUser._doc.updatedAt.toISOString().substring(0, 10),
                    req.query.type === 'trash' ?
                        `<div class="d-flex order-actions">
                            <a href="javascript:;" class="ms-1 btn-restore" onclick="restoreUser('${currentDataUser._doc._id.toString()}')"><i class="bx bx-undo"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataUser._doc.user_name}','${currentDataUser._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`:
                        `<div class="d-flex order-actions">
                            <a href="javascript:;" class="text-white"><i class="bx bx-detail"></i></a>
                            <a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${currentDataUser._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${currentDataUser._doc.user_name}','${currentDataUser._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`,
                ]);
                return arrDataUsers;
            }, []),
        }));
    }

    // [GET] admin/members
    allMembers(req, res, next) {
        res.render('admin/members', {
            user: { ...req.user._doc },
            ajaxType: '',
        });
    }

    // [POST] admin/members/create
    createMember(req, res, next) {
        const user = new Users(req.body);
        user.save()
            .then(() => {
                res.send({ message: 'Create User Success' });
            })
            .catch(next)
    }

    // [GET] admin/members/read/:id
    async readMember(req, res, next) {
        try {
            const user = await Users.findById(req.params.id);
            res.send(JSON.stringify(user));
        } catch (error) {
            console.log(error);
            next();
        }
    }

    // [PUT] admin/members/update/:id
    updateMember(req, res, next) {
        Users.updateOne({ _id: req.params.id }, req.body)
            .then(() => {
                res.send({ message: 'Update User Success' });
            })
            .catch(next);
    }

    // [DELETE] admin/members/delete/:id
    deleteMember(req, res, next) {
        Users.delete({ _id: req.params.id })
            .then(() => {
                res.send({ message: 'Delete User Success' });
            })
            .catch(next);
    }

    // [POST] admin/members/restore/:id
    restoreMember(req, res, next) {
        Users.restore({ _id: req.params.id })
            .then(() => {
                res.send({ message: 'Restore User Success' });
            })
            .catch(next);
    }

    // [DELETE] admin/members/destroy/:id
    destroyMember(req, res, next) {
        Users.deleteOne({ _id: req.params.id })
            .then(() => {
                res.send({ message: 'Destroy User Success' });
            })
            .catch(next);
    }

    // [GET] admin/members/trash
    membersTrash(req, res, next) {
        res.render('admin/membersTrash', {
            user: { ...req.user._doc },
            ajaxType: 'trash',
        });
    }

    // [GET] admin/configuration
    configuration(req, res, next) {
        Configurations.findOne()
            .then((config) => {
                res.render('admin/configuration', {
                    user: { ...req.user._doc },
                    config: { ...config._doc },
                });
            })
            .catch(next);
    }

    // [PATCH] admin/configuration/update
    configurationUpdate(req, res, next) {
        Configurations.updateOne({}, {
            config_web_title: req.body.web_title,
            config_web_url: req.body.web_url,
            config_web_description: req.body.web_description,
            config_web_keyword: req.body.web_keys,
            config_web_servers: req.body.web_servers,
            config_web_tags: req.body.web_tags,
            config_timecache: req.body.timecache,
        })
            .then(() => {
                res.send({ message: 'Update Configurations Success' });
            })
            .catch(next);
    }
}
module.exports = new AdminController;