const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const countriesController = require('../../controllers/admin/countries.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post(
	'/datatables_ajax',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse countries']),
	countriesController.ajaxDatatablesCountries,
);
router.post(
	'/create',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['create countries']),
	countriesController.createCountry,
);
router.get(
	'/read/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse countries']),
	countriesController.readCountry,
);
router.put(
	'/update/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update countries']),
	countriesController.updateCountry,
);
router.delete(
	'/delete/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete countries']),
	countriesController.deleteCountry,
);
router.patch(
	'/restore/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update countries']),
	countriesController.restoreCountry,
);
router.delete(
	'/destroy/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete countries']),
	countriesController.destroyCountry,
);
// PAGE
router.get(
	'/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse countries']),
	countriesController.allCountries,
);

module.exports = router;
