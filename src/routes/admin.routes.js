const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/admin.controller');
const authMiddleware = require('../app/middlewares/auth.middleware');
const createFilmMiddleware = require('../app/middlewares/handleCreateFilm.middleware');



router.get('/login', authMiddleware.authRequire, adminController.login);
router.post('/login', adminController.loginHandler);
router.get('/logout', adminController.logout);
router.get('/dashboard', authMiddleware.authRequire, adminController.dashboard);
router.get('/profile', authMiddleware.authRequire, adminController.profile);
// film
router.post('/films/datatables_ajax', authMiddleware.authRequire, adminController.ajaxDatatablesFilms);
router.get('/films', authMiddleware.authRequire, adminController.allFilms);
router.get('/films/add', authMiddleware.authRequire, adminController.addFilm);
router.post('/films/create', authMiddleware.authRequire, createFilmMiddleware.handeDataPost, adminController.createFilm);
router.get('/films/read/:id', authMiddleware.authRequire, adminController.readFilm);
router.put('/films/update/:id', authMiddleware.authRequire, createFilmMiddleware.handeDataPost, adminController.updateFilm);
router.delete('/films/delete/:id', authMiddleware.authRequire, adminController.deleteFilm);
router.patch('/films/restore/:id', authMiddleware.authRequire, adminController.restoreFilm);
router.delete('/films/destroy/:id', authMiddleware.authRequire, adminController.destroyFilm);
router.get('/films/movies', authMiddleware.authRequire, adminController.filmsMovies);
router.get('/films/series', authMiddleware.authRequire, adminController.filmsSeries);
router.get('/films/cartoon-anime', authMiddleware.authRequire, adminController.filmsCartoonAnime);
router.get('/films/cinema', authMiddleware.authRequire, adminController.filmsCinema);
router.get('/films/hot', authMiddleware.authRequire, adminController.filmsHot);
router.get('/films/trailer', authMiddleware.authRequire, adminController.filmsTrailer);
router.get('/films/no-episode', authMiddleware.authRequire, adminController.filmsNotEp);
router.get('/films/error', authMiddleware.authRequire, adminController.filmsError);
router.get('/films/trash', authMiddleware.authRequire, adminController.filmsTrash);
// category
router.get('/categories', authMiddleware.authRequire, adminController.allCategories);
router.post('/categories/datatables_ajax', authMiddleware.authRequire, adminController.ajaxDatatablesCategories);
router.post('/categories/create', authMiddleware.authRequire, adminController.createCategory);
router.get('/categories/read/:id', authMiddleware.authRequire, adminController.readCategory);
router.put('/categories/update/:id', authMiddleware.authRequire, adminController.updateCategory);
router.delete('/categories/delete/:id', authMiddleware.authRequire, adminController.deleteCategory);
router.patch('/categories/restore/:id', authMiddleware.authRequire, adminController.restoreCategory);
router.delete('/categories/destroy/:id', authMiddleware.authRequire, adminController.destroyCategory);
router.get('/categories/trash', authMiddleware.authRequire, adminController.categoriesTrash);
// country
router.get('/countries', authMiddleware.authRequire, adminController.allCountries);
router.post('/countries/datatables_ajax', authMiddleware.authRequire, adminController.ajaxDatatablesCountries);
router.post('/countries/create', authMiddleware.authRequire, adminController.createCountry);
router.get('/countries/read/:id', authMiddleware.authRequire, adminController.readCountry);
router.put('/countries/update/:id', authMiddleware.authRequire, adminController.updateCountry);
router.delete('/countries/delete/:id', authMiddleware.authRequire, adminController.deleteCountry);
router.patch('/countries/restore/:id', authMiddleware.authRequire, adminController.restoreCountry);
router.delete('/countries/destroy/:id', authMiddleware.authRequire, adminController.destroyCountry);
router.get('/countries/trash', authMiddleware.authRequire, adminController.countriesTrash);
// member
router.get('/members', authMiddleware.authRequire, adminController.allMembers);
router.post('/members/datatables_ajax', authMiddleware.authRequire, adminController.ajaxDatatablesUsers);
router.post('/members/create', authMiddleware.authRequire, adminController.createMember);
router.get('/members/read/:id', authMiddleware.authRequire, adminController.readMember);
router.patch('/members/update/:id', authMiddleware.authRequire, adminController.updateMember);
router.delete('/members/delete/:id', authMiddleware.authRequire, adminController.deleteMember);
router.patch('/members/restore/:id', authMiddleware.authRequire, adminController.restoreMember);
router.delete('/members/destroy/:id', authMiddleware.authRequire, adminController.destroyMember);
router.get('/members/trash', authMiddleware.authRequire, adminController.membersTrash);
// config
router.get('/configuration', authMiddleware.authRequire, adminController.configuration);
router.patch('/configuration/update', authMiddleware.authRequire, adminController.configurationUpdate);
router.get('/', authMiddleware.authRequire, adminController.admin);

module.exports = router;