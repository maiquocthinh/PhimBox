const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../app/middlewares/auth.middleware');
const countriesController = require('../../app/controllers/admin/countries.controller');

router.get('/', authMiddleware.authRequire, countriesController.allCountries);
router.post('/datatables_ajax', authMiddleware.authRequire, countriesController.ajaxDatatablesCountries);
router.post('/create', authMiddleware.authRequire, countriesController.createCountry);
router.get('/read/:id', authMiddleware.authRequire, countriesController.readCountry);
router.put('/update/:id', authMiddleware.authRequire, countriesController.updateCountry);
router.delete('/delete/:id', authMiddleware.authRequire, countriesController.deleteCountry);
router.patch('/restore/:id', authMiddleware.authRequire, countriesController.restoreCountry);
router.delete('/destroy/:id', authMiddleware.authRequire, countriesController.destroyCountry);
router.get('/trash', authMiddleware.authRequire, countriesController.countriesTrash);

module.exports = router;
