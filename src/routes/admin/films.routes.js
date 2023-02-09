const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const createFilmMiddleware = require('../../middlewares/handleCreateFilm.middleware');
const filmsController = require('../../controllers/admin/films.controller');

// API
router.post('/datatables_ajax', authMiddleware.auth, filmsController.ajaxDatatablesFilms);
router.post('/create', authMiddleware.auth, createFilmMiddleware.handeDataPost, filmsController.createFilm);
router.get('/read/:id', authMiddleware.auth, filmsController.readFilm);
router.put('/update/:id', authMiddleware.auth, createFilmMiddleware.handeDataPost, filmsController.updateFilm);
router.delete('/delete/:id', authMiddleware.auth, filmsController.deleteFilm);
router.patch('/restore/:id', authMiddleware.auth, filmsController.restoreFilm);
router.delete('/destroy/:id', authMiddleware.auth, filmsController.destroyFilm);
// PAGE
router.get('/', authMiddleware.auth, filmsController.allFilms);
router.get('/add', authMiddleware.auth, filmsController.addFilm);
router.get('/movies', authMiddleware.auth, filmsController.filmsMovies);
router.get('/series', authMiddleware.auth, filmsController.filmsSeries);
router.get('/cartoon-anime', authMiddleware.auth, filmsController.filmsCartoonAnime);
router.get('/cinema', authMiddleware.auth, filmsController.filmsCinema);
router.get('/hot', authMiddleware.auth, filmsController.filmsHot);
router.get('/trailer', authMiddleware.auth, filmsController.filmsTrailer);
router.get('/no-episode', authMiddleware.auth, filmsController.filmsNotEp);
router.get('/error', authMiddleware.auth, filmsController.filmsError);
router.get('/trash', authMiddleware.auth, filmsController.filmsTrash);

module.exports = router;
