const { upload } = require('../../services/dropbox.service');

const dropbox = async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ msg: 'No files were uploaded.' });
	const { file } = req.files;
	if (Array.isArray(file)) return res.status(400).json({ msg: 'Only one file can be uploaded.' });

	const { filename, destination } = req.body;
	const stream = file.data;

	try {
		const { name, size, url } = await upload({
			file: {
				filename: filename || file.name,
				contents: stream,
			},
			destination,
		});

		res.status(200).json({ name, size, url });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: error.message });
	}
};

module.exports = { dropbox };
