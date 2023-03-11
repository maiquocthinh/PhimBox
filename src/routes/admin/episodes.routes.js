const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const episodesController = require('../../controllers/admin/episodes.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post(
	'/datatables_ajax',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse episodes']),
	episodesController.ajaxDatatables,
);
router.post(
	'/errors/datatables_ajax',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse episodes']),
	episodesController.errorsAjaxDatatables,
);
router.post(
	'/create',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['create episodes']),
	episodesController.createEpisode,
);
router.get(
	'/read/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse episodes']),
	episodesController.readEpisode,
);
router.post(
	'/read-many/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse episodes']),
	episodesController.readManyEpisode,
);
router.patch(
	'/update/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update episodes']),
	episodesController.updateEpisode,
);
router.patch(
	'/update-many',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update episodes']),
	episodesController.updateManyEpisode,
);
router.delete(
	'/delete/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete episodes']),
	episodesController.deleteEpisode,
);
router.delete(
	'/delete-many',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete episodes']),
	episodesController.deleteManyEpisode,
);

// PAGE
router.get(
	'/errors',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse episodes']),
	episodesController.errors,
);
router.get(
	'/:filmId',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse episodes']),
	episodesController.episodes,
);

module.exports = router;
