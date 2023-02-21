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
router.delete('/delete-many/', authMiddleware.auth, filmsController.deleteManyFilm);
router.patch('/restore-many/', authMiddleware.auth, filmsController.restoreManyFilm);
router.delete('/destroy-many/', authMiddleware.auth, filmsController.destroyManyFilm);
// PAGE
router.get('/', authMiddleware.auth, filmsController.allFilms);
router.get('/add', authMiddleware.auth, filmsController.addFilm);
router.get('/error', authMiddleware.auth, filmsController.filmsError);

module.exports = router;
