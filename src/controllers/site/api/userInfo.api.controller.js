const bcrypt = require('bcryptjs');
const path = require('path');
const userModels = require('../../../models/user.models');
const { validateEmail, generateHashPassword } = require('../../../utils');
const { upload } = require('../../../services/dropbox.service');

const updateInfoController = async (req, res) => {
	const { username } = req.session.user;
	const { fullname, email, password, descript } = req.body;

	if (!fullname || !email) return res.status(400).json({ msg: 'Please fill in all fields.' });
	if (fullname.length < 3 || fullname.length > 32)
		return res.status(400).json({ msg: 'Fullname must be between 3 and 32 characters!' });
	if (!validateEmail(email)) return res.status(400).json({ msg: 'The email is invalid.' });
	if (password && password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters.' });

	try {
		// check user
		const user = await userModels.findOne({ username });

		if (!user) return res.status(400).json({ msg: 'This user is not exist in the system.' });

		// hash password
		const hashPassword = password ? generateHashPassword(password) : undefined;

		// update user
		await userModels.findOneAndUpdate(
			{ username },
			{
				fullname,
				email,
				password: hashPassword,
				descript,
			},
		);

		// update session
		req.session.user = { ...req.session.user, fullname, email, descript };

		// change success
		res.status(200).json({ msg: 'Change info success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const updateAvatarController = async (req, res) => {
	// check user
	const { username } = req.session.user;
	const user = userModels.findOne({ username }, { _id: 1 });
	if (!user) return res.status(403).json({ msg: 'Access denied. Only user of system are permitted for upload' });

	// check file
	if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ msg: 'No files were uploaded.' });
	const { file } = req.files;
	if (Array.isArray(file)) return res.status(400).json({ msg: 'Only one file can be uploaded.' });

	// check extension
	const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
	const fileExtension = path.extname(file.name).toLowerCase();
	if (!allowedExtensions.includes(fileExtension)) return res.status(400).json({ msg: 'Only allow image file' });

	// upload
	const stream = file.data;
	const { url } = await upload({
		file: {
			filename: username + fileExtension,
			contents: stream,
		},
		destination: '/Avatar',
	});

	// update avatar
	await userModels.findOneAndUpdate({ username }, { avatar: url });

	// update session
	req.session.user.avatar = url;

	return res.status(200).json({ msg: 'Change avatar success!' });
};

module.exports = { updateInfoController, updateAvatarController };
