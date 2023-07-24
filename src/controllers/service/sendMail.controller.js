const { sendMail } = require('../../services/email.service');
const { getTemplateNewPassword, getTemplateWelcome, getTemplateNewEpUpdate } = require('../../helpers/emailTemplate.helper');

module.exports = async (req, res) => {
	try {
		const { emails, subject, content } = req.body;
		await sendMail(emails, subject, content);
		res.status(200).json({ msg: 'Send email success!' });
	} catch (error) {
		return res.status(500).json({ msg: error.message });
	}
};
