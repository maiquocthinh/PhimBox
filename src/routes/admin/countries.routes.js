const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const countriesController = require('../../controllers/admin/countries.controller');

// API
router.post('/datatables_ajax', authMiddleware.auth, countriesController.ajaxDatatablesCountries);
router.post('/create', authMiddleware.auth, countriesController.createCountry);
router.get('/read/:id', authMiddleware.auth, countriesController.readCountry);
router.put('/update/:id', authMiddleware.auth, countriesController.updateCountry);
router.delete('/delete/:id', authMiddleware.auth, countriesController.deleteCountry);
router.patch('/restore/:id', authMiddleware.auth, countriesController.restoreCountry);
router.delete('/destroy/:id', authMiddleware.auth, countriesController.destroyCountry);
// PAGE
router.get('/', authMiddleware.auth, countriesController.allCountries);

module.exports = router;
