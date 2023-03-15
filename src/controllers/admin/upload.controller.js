const dropbox = async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0)
		return res.status(400).json({ msg: 'No files were uploaded.' });

	const { files } = req.files;

	if (Array.isArray(files)) return res.status(400).json({ msg: 'Only one file can be uploaded.' });

	try {
		// upload file
		const resultUpload = await fetch('https://content.dropboxapi.com/2/files/upload', {
			method: 'POST',
			body: files.data,
			headers: {
				Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
				'Dropbox-API-Arg': JSON.stringify({
					path: `/Subtitle/${files.name}`,
					mode: 'overwrite',
					autorename: true,
				}),
				'Content-Type': 'application/octet-stream',
			},
		});
		// get path
		const { path_display: path } = await resultUpload.json();

		// create share link
		const resultShare = await fetch('https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings', {
			method: 'POST',
			body: JSON.stringify({ path }),
			headers: {
				Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
		});

		// get share info & send response
		const resultShareJson = await resultShare.json();
		if (resultShareJson.error) {
			const { name, size, url } = resultShareJson.error.shared_link_already_exists.metadata;
			return res.status(200).json({
				name,
				size,
				url: url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', ''),
			});
		}
		const { name, size, url } = resultShareJson;
		return res.status(200).json({
			name,
			size,
			url: url.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', ''),
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: error.message });
	}
};

module.exports = { dropbox };
