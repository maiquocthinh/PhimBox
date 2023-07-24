const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';
const { G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, ADMIN_EMAIL } = process.env;

const oauth2client = new google.auth.OAuth2(G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, OAUTH_PLAYGROUND);
oauth2client.setCredentials({ refresh_token: G_REFRESH_TOKEN });

const getAccessToken = async () => {
	try {
		const { token } = await oauth2client.getAccessToken();
		return token;
	} catch (error) {
		console.error('Error Get AccessToken:', error);
		throw error;
	}
};

const transporter = nodemailer.createTransport({
	pool: true,
	maxConnections: 10,
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: ADMIN_EMAIL,
		clientId: G_CLIENT_ID,
		clientSecret: G_CLIENT_SECRET,
		refreshToken: G_REFRESH_TOKEN,
		getAccessToken: () => getAccessToken(),
	},
});

const sendMail = async (recipientEmails, subject, content) => {
	const mailOptions = {
		from: ADMIN_EMAIL,
		subject,
		html: content.isHtml ? content.data : undefined,
		text: !content.isHtml ? content.data : undefined,
	};

	const promiseArray = recipientEmails.map((recipientEmail) =>
		transporter.sendMail({
			...mailOptions,
			to: recipientEmail,
		}),
	);

	await Promise.all(promiseArray);
};

module.exports = { sendMail };
