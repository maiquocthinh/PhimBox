const { nanoid } = require('nanoid');
const Users = require('../../models/user.models');
const roleModels = require('../../models/role.models');
const userRoleModels = require('../../models/userRole.models');
const { getUserLevelHtml } = require('../../utils/ajaxUsers.util');

// ###### API ######

// [POST] admin/users/datatables_ajax
const ajaxDatatablesUsers = async (req, res) => {
	const { deleted } = req.query;
	const { columns, order, start, length, search, draw } = req.body;

	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'];
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	let queryToDB = {};

	if (search.value)
		queryToDB['$or'] = [{ name: new RegExp(search.value, 'i') }, { email: new RegExp(search.value, 'i') }];

	const totalUser = deleted ? await Users.countDocumentsDeleted({}) : await Users.countDocuments({});
	const dataUsers = await Users.aggregate([
		{ $match: { ...queryToDB, deleted: !!deleted } },
		{ $addFields: { _id: { $toString: '$_id' } } },
		{
			$lookup: {
				from: 'user_role',
				localField: '_id',
				foreignField: 'userId',
				as: 'userRole',
			},
		},
		{
			$lookup: {
				from: 'roles',
				let: { roleId: { $arrayElemAt: ['$userRole.roleId', 0] } },
				pipeline: [
					{ $addFields: { _id: { $toString: '$_id' } } },
					{ $match: { $expr: { $eq: ['$_id', '$$roleId'] } } },
				],
				as: 'role',
			},
		},
		{
			$lookup: {
				from: 'films',
				localField: '_id',
				foreignField: 'createdBy',
				as: 'updated',
			},
		},
		{ $addFields: { updated: { $size: '$updated' } } },
		{ $skip: parseInt(start) },
		{ $limit: parseInt(length) },
		{ $sort: { [columnName]: columnSortOrder } },
	]);

	const data = dataUsers.map((user) => [
		user.id,
		`<div class="d-flex align-items-center">
			<div class="recent-product-img">
			<img src="${user.avatar}" alt="">
			</div>
			<div class="ms-2">
			<h6 class="mb-1 font-14">${user.name}</h6>
			</div>
		</div>`,
		user.email,
		getUserLevelHtml(user.role[0]?.permissions),
		user.updated,
		user.createdAt.toISOString().substring(0, 10),
		user.updatedAt.toISOString().substring(0, 10),
		deleted
			? `<div class="d-flex order-actions">
				<a href="javascript:;" class="ms-1 btn-restore" onclick="restoreUser('${user._id.toString()}')"><i class="bx bx-undo"></i></a>
				<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeletePermanentlyForm('${
					user.name
				}','${user._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
			</div>`
			: `<div class="d-flex order-actions">
				<a href="javascript:;" class="text-white"><i class="bx bx-detail"></i></a>
				<a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${user._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
				<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
					user.name
				}','${user._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
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
const createUser = (req, res) => {
	const user = new Users({
		id: nanoid(7),
		email: req.body.email,
		name: req.body.name,
		password: req.body.password,
		status: req.body.status,
		avatar: req.body.avatar,
	});
	user.save()
		.then((result) => {
			res.status(200).json({ message: 'Create User Success', _id: result._id });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [GET] admin/users/read/:id
const readUser = async (req, res) => {
	try {
		const user = await Users.findById(req.params.id, { password: 0 });
		const userRole = await userRoleModels.findOne({ userId: user._id.toString() });
		if (userRole) res.status(200).json({ ...user._doc, roleId: userRole.roleId });
		else res.status(200).json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.message });
	}
};

// [PUT] admin/users/update/:id
const updateUser = (req, res) => {
	Users.updateOne(
		{ _id: req.params.id },
		{
			email: req.body.email,
			name: req.body.name,
			password: req.body.password,
			level: req.body.level,
			status: req.body.status,
			avatar: req.body.avatar,
		},
	)
		.then(async () => {
			// change user info in current session
			if (req.session.user._id === req.params.id) {
				const user = await Users.findById(req.params.id);
				user.password = undefined;
				req.session.user = user;
			}
			res.status(200).json({ message: 'Update User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
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
	Promise.all([userRoleModels.findOneAndDelete({ userId: req.params.id }), Users.deleteOne({ _id: req.params.id })])
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
		});
	} catch (error) {
		console.log(error);
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
