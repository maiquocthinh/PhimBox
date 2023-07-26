const { upload } = require('../../services/dropbox.service');
const path = require('path');

const subtitle = async (req, res) => {
	// check file
	if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ msg: 'No files were uploaded.' });
	const { file } = req.files;
	if (Array.isArray(file)) return res.status(400).json({ msg: 'Only one file can be uploaded.' });

	// check extension
	const allowedExtensions = ['.srt', '.vtt'];
	const fileExtension = path.extname(file.name).toLowerCase();
	if (!allowedExtensions.includes(fileExtension)) return res.status(400).json({ msg: 'Only allow image file' });

	try {
		const stream = file.data;
		const { url } = await upload({
			file: {
				filename: file.name,
				contents: stream,
			},
			destination: '/Subtitle',
		});

		res.status(200).json({ msg: 'Upload subtitle success', url });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: error.message });
	}
};

module.exports = { subtitle };
