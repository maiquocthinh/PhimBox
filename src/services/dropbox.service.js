const { Dropbox } = require('dropbox');
const path = require('path');

const DBX = new Dropbox({
	clientId: process.env.DROPBOX_CLIENT_ID,
	clientSecret: process.env.DROPBOX_CLIENT_SECRET,
	refreshToken: process.env.DROPBOX_REFESH_TOKEN,
});

const upload = async ({ file: { filename, contents }, destination }) => {
	// upload
	const _path = path.join(destination, filename).replace(/\\/g, '/');
	const {
		result: { name, size, path_display },
	} = await DBX.filesUpload({
		path: _path,
		contents,
		mode: 'overwrite',
		autorename: true,
	});

	// get shared link
	const {
		result: { url },
	} = await DBX.sharingCreateSharedLink({
		path: path_display,
		short_url: true,
	});

	return {
		name,
		size,
		url: url
			.replace('www.dropbox.com', 'dl.dropboxusercontent.com')
			.replace('/scl/fi', '/s')
			.replace(/[?&]dl=0/g, ''),
	};
};

module.exports = { upload };
