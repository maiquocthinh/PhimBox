const PERMISSIONS = require('../config/permission.config');

const getUserLevelHtml = (permissionsArray) => {
	if (!permissionsArray || permissionsArray.length === 0)
		return '<span class="badge text-white bg-gradient-kyoto text-uppercase px-3">Member</span>';
	else if (Object.values(PERMISSIONS).sort().join(',') === permissionsArray.sort().join(','))
		return '<span class="badge text-white bg-gradient-lush text-uppercase px-3">Admin</span>';
	else return '<span class="badge text-white bg-gradient-blues text-uppercase px-3">Moderate</span>';
};

module.exports = { getUserLevelHtml };
