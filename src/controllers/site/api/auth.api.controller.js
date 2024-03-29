const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const userModels = require('../../../models/user.models');
const { validateEmail, generateHashPassword } = require('../../../utils');
const { sendMail } = require('../../../services/email.service');
const { getTemplateWelcome, getTemplateNewPassword } = require('../../../helpers/emailTemplate.helper');
const notificationModels = require('../../../models/notification.models');
const { userStatus } = require('../../../config/constants');

const registerController = async (req, res) => {
	const { fullname, username, email, password } = req.body;

	if (!fullname || !username || !email || !password) return res.status(400).json({ msg: 'Please fill in all fields.' });
	if (fullname.length < 3 || fullname.length > 32)
		return res.status(400).json({ msg: 'Fullname must be between 3 and 32 characters!' });
	if (!validateEmail(email)) return res.status(400).json({ msg: 'The email is invalid.' });
	if (password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters.' });

	try {
		// hash password
		const salt = await bcrypt.genSalt();
		const hashPassword = await bcrypt.hash(password, salt);

		// save new user
		const userInserted = await userModels.create({
			fullname,
			username,
			email,
			password: hashPassword,
		});

		// send email welcome
		sendMail([email], 'Chào mừng đến với PhimBox', {
			isHtml: true,
			data: getTemplateWelcome({ username }),
		});

		// insert notification
		await notificationModels.create({
			userId: userInserted._id,
			title: 'Chào mừng đến với PhimBox. Chúc bạn xem phim vui vẻ.',
			image: '/assets/images/logonew-icon.png',
			url: '/',
		});

		// register success
		res.status(200).json({ msg: 'Register account success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const loginController = async (req, res) => {
	const { email, password, remember } = req.body;

	if (!email || !password) return res.status(400).json({ msg: 'Please fill in all fields.' });
	if (!validateEmail(email)) return res.status(400).json({ msg: 'The email is invalid.' });
	if (password.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters.' });

	try {
		// check user
		const user = await userModels.findOne({ email: email }, { limit: 0, films: 0 });
		if (!user) return res.status(400).json({ msg: 'This email is not registered in the system.' });

		// check user status (is banned?)
		if (user.status === userStatus.BANNED)
			return res.status(403).json({ msg: 'This account have been banned. Contact admin for help.' });

		// check password
		if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ msg: 'The password is incorrect.' });

		// set session
		user.password = undefined;
		req.session.user = user;
		if (remember) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // a week

		// login success
		res.status(200).json({ msg: 'Login Success.' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

const logoutController = (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ msg: err.message });
		return res.status(200).json({ msg: 'Logout Success.' });
	});
};

const forgotPasswordController = async (req, res) => {
	const { email } = req.body;

	if (!validateEmail(email)) return res.status(400).json({ msg: 'The email is invalid.' });

	try {
		// check user
		const user = await userModels.findOne({ email: email }, { _id: 1, username: 1 });
		if (!user) return res.status(400).json({ msg: 'This email is not registered in the system.' });

		// general new pass & save
		const newPassword = nanoid(7);
		await userModels.updateOne(
			{ email },
			{
				password: generateHashPassword(newPassword),
			},
		);
		// send to email
		sendMail([email], 'Mật khẩu mới', {
			isHtml: true,
			data: getTemplateNewPassword({ username: user.username, newPassword }),
		});

		// insert notification
		await notificationModels.create({
			userId: user._id,
			title: 'Mật khẩu mới đã được gửi đến email của bạn. Kiểm tra email để lấy mật khẩu.',
			image: '/assets/images/logonew-icon.png',
			url: '/profile',
		});

		// login success
		res.status(200).json({ msg: 'Check your email to get new password.' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};

module.exports = { registerController, loginController, logoutController, forgotPasswordController };
