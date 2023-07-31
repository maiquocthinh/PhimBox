const Users = require('../../models/user.models');
const roleModels = require('../../models/role.models');
const { getUserLevelHtml, getUserStatusHtml } = require('../../utils/ajaxUsers.util');
const { generateHashPassword } = require('../../utils');
const { userStatus } = require('../../config/constants');
const checkPermissionChangeRole = require('../../utils/checkPermissionChangeRole.util');

// ###### API ######

// [POST] admin/users/datatables_ajax
const ajaxDatatablesUsers = async (req, res) => {
	const { deleted } = req.query;
	const { columns, order, start, length, search, draw } = req.body;

	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'];
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	let queryToDB = {};

	if (search.value) queryToDB['$or'] = [{ name: new RegExp(search.value, 'i') }, { email: new RegExp(search.value, 'i') }];

	const totalUser = deleted ? await Users.countDocumentsDeleted({}) : await Users.countDocuments({});
	const dataUsers = await Users.aggregateWithDeleted([
		{ $match: { ...queryToDB, deleted: !!deleted } },
		{
			$lookup: {
				from: 'roles',
				localField: 'roleId',
				foreignField: '_id',
				as: 'role',
			},
		},
		{
			$lookup: {
				from: 'films',
				localField: '_id',
				foreignField: 'createdBy',
				as: 'uploaded',
			},
		},
		{
			$addFields: {
				createdAt: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } },
				updatedAt: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } },
				uploaded: { $size: '$uploaded' },
			},
		},
		{
			$project: { password: 0, roleId: 0, limit: 0, films: 0 },
		},
		{ $skip: parseInt(start) },
		{ $limit: parseInt(length) },
		{ $sort: { [columnName]: columnSortOrder } },
	]);

	const data = dataUsers.map((user) => [
		user._id,
		`<div class="d-flex flex-column align-items-center">
			<div class="recent-product-img"><img src="${user.avatar}" alt=""></div>
			<div class="ms-2">
			<h6 class="mb-1 font-14">${user.username}</h6>
			</div>
		</div>`,
		user.email,
		getUserStatusHtml(user.status),
		getUserLevelHtml(user?.role[0]?.permissions),
		user.uploaded,
		user.createdAt,
		user.updatedAt,
		deleted
			? `<div class="d-flex order-actions">
				<a href="javascript:;" class="ms-1 btn-restore" onclick="restoreUser('${user._id}')"><i class="bx bx-undo"></i></a>
				<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeletePermanentlyForm('${user.username}','${user._id}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
			</div>`
			: `<div class="d-flex order-actions">
				<a href="/profile/${user.username}" target="_blank" class="text-primary"><i class="bx bx-link-external"></i></a>
				<a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${user._id}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
				<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${user.username}','${user._id}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
			</div>`,
	]);

	res.status(200).json({
		draw,
		recordsTotal: totalUser,
		recordsFiltered: totalUser,
		data,
	});
};

// [POST] admin/users/create
const createUser = async (req, res) => {
	const { _id: userId } = req.session.user || {};
	const { fullname, username, email, avatar, password, status, role: roleId } = req.body;

	// hash password
	const hashPassword = req.body.password ? generateHashPassword(password) : undefined;

	try {
		// check permission to change role
		if (roleId && !(await checkPermissionChangeRole(userId)))
			return res.status(400).json({ message: 'You have not permission.' });

		// create new user
		await Users.create({
			fullname,
			username,
			email,
			password: hashPassword,
			status,
			avatar,
			roleId: !!roleId ? roleId : undefined,
		});

		return res.status(200).json({ message: 'Create User Success' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// [GET] admin/users/read/:id
const readUser = async (req, res) => {
	try {
		const user = await Users.findById(req.params.id, { password: 0, films: 0, limit: 0 });
		return res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [PUT] admin/users/update/:id
const updateUser = async (req, res) => {
	const { _id: userId } = req.session.user || {};
	const { fullname, username, email, password, status, avatar, role: roleId } = req.body;

	// hash password
	const hashPassword = req.body.password ? generateHashPassword(req.body.password) : undefined;

	try {
		// check permission to change role
		if (roleId && !(await checkPermissionChangeRole(userId)))
			return res.status(400).json({ message: 'You have not permission.' });

		// update user
		await Users.updateOne(
			{ _id: req.params.id },
			{ fullname, username, email, password: hashPassword, status, avatar, roleId: !!roleId ? roleId : undefined },
		);

		// change user info in current session
		if (userId === req.params.id) {
			const user = req.session.user;
			req.session.user = {
				...user,
				fullname: fullname || user.fullname,
				username: username || user.username,
				email: email || user.email,
				status: status || user.status,
				avatar: avatar || user.avatar,
			};
		}

		return res.status(200).json({ message: 'Update User Success' });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// [DELETE] admin/users/delete/:id
const deleteUser = (req, res) => {
	Users.delete({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [POST] admin/users/restore/:id
const restoreUser = (req, res) => {
	Users.restore({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Restore User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [DELETE] admin/users/destroy/:id
const destroyUser = (req, res) => {
	Users.deleteOne({ _id: req.params.id })
		.then(() => {
			res.status(200).json({ message: 'Delete Permanently User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// ###### PAGE ######

// [GET] admin/users
const allUsers = async (req, res) => {
	try {
		const roles = await roleModels.find({}, { _id: 1, name: 1 });

		res.render('admin/users', {
			user: req.session.user,
			roles,
			userStatus,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

module.exports = {
	ajaxDatatablesUsers,
	allUsers,
	createUser,
	readUser,
	updateUser,
	deleteUser,
	restoreUser,
	destroyUser,
};
