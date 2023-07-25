const bcrypt = require('bcryptjs');
const userModels = require('../../../models/user.models');
const { validateEmail, generateHashPassword } = require('../../../utils');

const updateInfoController = async (req, res) => {
	const { fullname, username, email, password, descript } = req.body;

	if (!fullname || !username || !email || !password) return res.status(400).json({ msg: 'Please fill in all fields.' });
	if (fullname.length < 3 || fullname.length > 32)
		return res.status(400).json({ msg: 'Fullname must be between 3 and 32 characters!' });
	if (!validateEmail(email)) return res.status(400).json({ msg: 'The email is invalid.' });
	if (password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters.' });

	try {
		// check user
		const user = await userModels.findOne({ username });

		if (!user) return res.status(400).json({ msg: 'This user is not exist in the system.' });

		// hash password
		const salt = await bcrypt.genSalt();
		const hashPassword = password ? await bcrypt.hash(password, salt) : undefined;

		// update user
		await userModels.findOneAndUpdate(
			{ username },
			{
				fullname,
				username,
				email,
				password: hashPassword,
				descript,
			},
		);

		// change success
		res.status(200).json({ msg: 'Change info success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

module.exports = { updateInfoController };
