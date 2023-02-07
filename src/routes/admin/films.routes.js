const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const createFilmMiddleware = require('../../middlewares/handleCreateFilm.middleware');
const filmsController = require('../../controllers/admin/films.controller');

// API
router.post('/datatables_ajax', authMiddleware.authRequire, filmsController.ajaxDatatablesFilms);
router.post('/create', authMiddleware.authRequire, createFilmMiddleware.handeDataPost, filmsController.createFilm);
router.get('/read/:id', authMiddleware.authRequire, filmsController.readFilm);
router.put('/update/:id', authMiddleware.authRequire, createFilmMiddleware.handeDataPost, filmsController.updateFilm);
router.delete('/delete/:id', authMiddleware.authRequire, filmsController.deleteFilm);
router.patch('/restore/:id', authMiddleware.authRequire, filmsController.restoreFilm);
router.delete('/destroy/:id', authMiddleware.authRequire, filmsController.destroyFilm);
// PAGE
router.get('/', authMiddleware.authRequire, filmsController.allFilms);
router.get('/add', authMiddleware.authRequire, filmsController.addFilm);
router.get('/movies', authMiddleware.authRequire, filmsController.filmsMovies);
router.get('/series', authMiddleware.authRequire, filmsController.filmsSeries);
router.get('/cartoon-anime', authMiddleware.authRequire, filmsController.filmsCartoonAnime);
router.get('/cinema', authMiddleware.authRequire, filmsController.filmsCinema);
router.get('/hot', authMiddleware.authRequire, filmsController.filmsHot);
router.get('/trailer', authMiddleware.authRequire, filmsController.filmsTrailer);
router.get('/no-episode', authMiddleware.authRequire, filmsController.filmsNotEp);
router.get('/error', authMiddleware.authRequire, filmsController.filmsError);
router.get('/trash', authMiddleware.authRequire, filmsController.filmsTrash);

module.exports = router;
