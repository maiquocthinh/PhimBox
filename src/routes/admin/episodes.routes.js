const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const episodesController = require('../../controllers/admin/episodes.controller');

// API
router.post('/datatables_ajax', authMiddleware.auth, episodesController.ajaxDatatables);
router.post('/create', authMiddleware.auth, episodesController.createEpisode);
router.get('/read/:id', authMiddleware.auth, episodesController.readEpisode);
router.patch('/update/:id', authMiddleware.auth, episodesController.updateEpisode);
router.delete('/delete/:id', authMiddleware.auth, episodesController.deleteEpisode);
router.patch('/restore/:id', authMiddleware.auth, episodesController.restoreEpisode);
router.delete('/destroy/:id', authMiddleware.auth, episodesController.destroyEpisode);

// PAGE
router.get('/errors', authMiddleware.auth, episodesController.errors);
router.get('/:filmId', authMiddleware.auth, episodesController.episodes);

module.exports = router;
