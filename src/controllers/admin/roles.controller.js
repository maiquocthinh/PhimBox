const roleModels = require('../../models/role.models');
const Users = require('../../models/user.models');
const PERMISSION = require('../../config/permission.config');

// ###### API ######

// [POST] admin/roles/datatables_ajax
const ajaxDatatablesUsers = async (req, res) => {
	const { columns, order, start, length, search, draw } = req.body;
	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'];
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	let queryToDB = {};

	if (search.value) queryToDB.name = new RegExp(search.value, 'i');

	const totalRole = await roleModels.countDocuments({});
	let dataRoles = await roleModels.aggregate([
		{ $match: queryToDB },
		{ $addFields: { _id: { $toString: '$_id' } } },
		{
			$lookup: {
				from: 'user_role',
				localField: '_id',
				foreignField: 'roleId',
				as: 'toggleUser',
			},
		},
		{ $addFields: { toggleUser: { $size: '$toggleUser' } } },
		{ $skip: parseInt(start) },
		{ $limit: parseInt(length) },
		{ $sort: { [columnName]: columnSortOrder } },
	]);

	const data = dataRoles.map((role) => [
		role.name,
		role.toggleUser,
		role.createdAt?.toISOString().substring(0, 10),
		role.updatedAt?.toISOString().substring(0, 10),
		`<div class="d-flex justify-content-center order-actions">
			<a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${role._id}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
			<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${role.name}','${role._id}')" 
				data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
		</div>`,
	]);

	res.status(200).json({
		draw,
		recordsTotal: totalRole,
		recordsFiltered: totalRole,
		data,
	});
};

// [POST] admin/roles/create
const createUser = (req, res) => {
	const role = new roleModels({
		name: req.body.name,
		permissions: req.body.permissions,
	});
	role.save()
		.then(() => {
			res.status(200).json({ message: 'Create Role Success' });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: error.message });
		});
};

// [GET] admin/roles/read/:id
const readUser = async (req, res) => {
	try {
		const role = await roleModels.findById(req.params.id);
		res.status(200).json(role);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

// [PUT] admin/roles/update/:id
const updateUser = (req, res) => {
	roleModels
		.findByIdAndUpdate(req.params.id, {
			name: req.body.name,
			permissions: req.body.permissions,
		})
		.then(async () => {
			res.status(200).json({ message: 'Update User Success' });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: error.message });
		});
};

// [DELETE] admin/roles/delete/:id
const deleteUser = (req, res) => {
	roleModels
		.findByIdAndDelete(req.params.id)
		.then(() => {
			res.status(200).json({ message: 'Delete User Success' });
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({ message: error.message });
		});
};

// ###### PAGE ######

// [GET] admin/roles
const allUsers = (req, res) => {
	res.render('admin/roles', {
		user: req.session.user,
		listPermissions: PERMISSION,
	});
};

module.exports = {
	ajaxDatatablesUsers,
	allUsers,
	createUser,
	readUser,
	updateUser,
	deleteUser,
};
