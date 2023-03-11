const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const createFilmMiddleware = require('../../middlewares/handleCreateFilm.middleware');
const filmsController = require('../../controllers/admin/films.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post(
	'/datatables_ajax',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse films']),
	filmsController.ajaxDatatablesFilms,
);
router.post(
	'/create',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['create films']),
	createFilmMiddleware.handeDataPost,
	filmsController.createFilm,
);
router.get(
	'/read/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse films']),
	filmsController.readFilm,
);
router.put(
	'/update/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update films']),
	createFilmMiddleware.handeDataPost,
	filmsController.updateFilm,
);
router.delete(
	'/delete/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete films']),
	filmsController.deleteFilm,
);
router.patch(
	'/restore/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update films']),
	filmsController.restoreFilm,
);
router.delete(
	'/destroy/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete films']),
	filmsController.destroyFilm,
);
router.delete(
	'/delete-many/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete films']),
	filmsController.deleteManyFilm,
);
router.patch(
	'/restore-many/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update films']),
	filmsController.restoreManyFilm,
);
router.delete(
	'/destroy-many/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete films']),
	filmsController.destroyManyFilm,
);
// PAGE
router.get(
	'/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse films']),
	filmsController.allFilms,
);
router.get('/add', authMiddleware.auth, filmsController.addFilm);

module.exports = router;
