const { userStatus } = require('../config/constants');
const PERMISSIONS = require('../config/permission.config');

const getUserLevelHtml = (permissionsArray) => {
	if (!permissionsArray || permissionsArray.length === 0)
		return '<span class="badge text-white bg-gradient-kyoto text-uppercase px-3">Member</span>';
	else if (Object.values(PERMISSIONS).sort().join(',') === permissionsArray.sort().join(','))
		return '<span class="badge text-white bg-gradient-lush text-uppercase px-3">Admin</span>';
	else return '<span class="badge text-white bg-gradient-blues text-uppercase px-3">Moderate</span>';
};

const getUserStatusHtml = (status) => {
	switch (status) {
		case userStatus.ACTIVATED:
			return `<div class="badge rounded-pill text-white bg-gradient-blues p-1 text-capitalize px-3">
						<i class="bx bx-check-shield align-middle me-1"></i> Activated
					</div>`;
		case userStatus.BANNED:
			return `<div class="badge rounded-pill text-white bg-gradient-burning p-1 text-capitalize px-3">
						<i class="bx bx-shield-x align-middle me-1"></i> Banned
					</div>`;
	}
};

module.exports = { getUserLevelHtml, getUserStatusHtml };
