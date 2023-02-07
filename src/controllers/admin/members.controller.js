const Users = require('../../models/user.models');

// [POST] admin/members/datatables_ajax
const ajaxDatatablesUsers = async (req, res) => {
	const draw = req.body.draw;
	const start = req.body.start;
	const length = req.body.length;
	const columnIndex = req.body.order[0]['column'];
	const columnName = req.body.columns[columnIndex]['name'];
	const columnSortOrder = req.body.order[0]['dir'] === 'asc' ? 1 : -1;
	const searchValue = req.body.search.value;
	const searchQueryDB = {
		$or: [{ user_mail: new RegExp(searchValue, 'i') }, { user_name: new RegExp(searchValue, 'i') }],
	};

	let totalUser;
	let totalUserWithFilter;
	let dataUsers;
	if (req.query.type === 'trash') {
		totalUser = await Users.countDocumentsDeleted({});
		totalUserWithFilter = await Users.countDocumentsDeleted(searchQueryDB);
		dataUsers = await Users.findDeleted(searchQueryDB)
			.skip(start)
			.limit(length)
			.sort({ [columnName]: columnSortOrder });
	} else {
		totalUser = await Users.countDocuments({});
		totalUserWithFilter = await Users.countDocuments(searchQueryDB);
		dataUsers = await Users.find(searchQueryDB)
			.skip(start)
			.limit(length)
			.sort({ [columnName]: columnSortOrder });
	}

	res.status(200).json({
		draw,
		recordsTotal: totalUser,
		recordsFiltered: totalUserWithFilter,
		data: dataUsers.reduce((arrDataUsers, currentDataUser) => {
			arrDataUsers.push([
				'#' + currentDataUser._doc.user_id,
				`<div class="d-flex align-items-center">
                        <div class="recent-product-img">
                        <img src="${currentDataUser._doc.user_avatar}" alt="">
                        </div>
                        <div class="ms-2">
                        <h6 class="mb-1 font-14">${currentDataUser._doc.user_name}</h6>
                        </div>
                    </div>`,
				currentDataUser._doc.user_email,
				currentDataUser._doc.user_level === 0
					? `<span class="badge text-white bg-gradient-lush text-uppercase px-3">Admin</span>`
					: currentDataUser._doc.user_level === 1
					? `<span class="badge text-white bg-gradient-blues text-uppercase px-3">Poster</span>`
					: `<span class="badge text-white bg-gradient-kyoto text-uppercase px-3">Member</span>`,
				``,
				currentDataUser._doc.updatedAt.toISOString().substring(0, 10),
				req.query.type === 'trash'
					? `<div class="d-flex order-actions">
                            <a href="javascript:;" class="ms-1 btn-restore" onclick="restoreUser('${currentDataUser._doc._id.toString()}')"><i class="bx bx-undo"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
								currentDataUser._doc.user_name
							}','${currentDataUser._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`
					: `<div class="d-flex order-actions">
                            <a href="javascript:;" class="text-white"><i class="bx bx-detail"></i></a>
                            <a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${currentDataUser._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
                            <a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${
								currentDataUser._doc.user_name
							}','${currentDataUser._doc._id.toString()}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
                        </div>`,
			]);
			return arrDataUsers;
		}, []),
	});
};

// [GET] admin/members
const allMembers = (req, res) => {
	res.render('admin/members', {
		user: { ...req.user._doc },
		ajaxType: '',
	});
};

// [POST] admin/members/create
const createMember = (req, res) => {
	const user = new Users(req.body);
	user.save()
		.then(() => {
			res.send({ message: 'Create User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [GET] admin/members/read/:id
const readMember = async (req, res) => {
	try {
		const user = await Users.findById(req.params.id);
		res.send(JSON.stringify(user));
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// [PUT] admin/members/update/:id
const updateMember = (req, res) => {
	Users.updateOne({ _id: req.params.id }, req.body)
		.then(() => {
			res.send({ message: 'Update User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [DELETE] admin/members/delete/:id
const deleteMember = (req, res) => {
	Users.delete({ _id: req.params.id })
		.then(() => {
			res.send({ message: 'Delete User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [POST] admin/members/restore/:id
const restoreMember = (req, res) => {
	Users.restore({ _id: req.params.id })
		.then(() => {
			res.send({ message: 'Restore User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [DELETE] admin/members/destroy/:id
const destroyMember = (req, res) => {
	Users.deleteOne({ _id: req.params.id })
		.then(() => {
			res.send({ message: 'Destroy User Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [GET] admin/members/trash
const membersTrash = (req, res) => {
	res.render('admin/membersTrash', {
		user: { ...req.user._doc },
		ajaxType: 'trash',
	});
};

module.exports = {
	ajaxDatatablesUsers,
	allMembers,
	createMember,
	readMember,
	updateMember,
	deleteMember,
	restoreMember,
	destroyMember,
	membersTrash,
};
