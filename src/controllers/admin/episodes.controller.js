const episodeModels = require('../../models/episode.models');
const filmModels = require('../../models/film.models');
const configurationModels = require('../../models/configuration.models');

// ###### API ######

// [POST] admin/episodes/datatables_ajax
const ajaxDatatables = async (req, res) => {
	const { filmId } = req.query;
	const { columns, order, start, length, search, draw } = req.body;
	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'] || 'createdAt';
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	const queryToDB = { filmId };

	if (search.value) queryToDB.name = new RegExp(search.value, 'i');

	const totalEpisode = await episodeModels.countDocuments(queryToDB);
	const dataEpisodes = await episodeModels
		.find(queryToDB)
		.skip(start)
		.limit(length)
		.sort({ [columnName]: columnSortOrder });

	const data = dataEpisodes.map((episode) => [
		episode._id,
		episode._id,
		episode.name,
		episode.language,
		episode.subtitle ? 'Yes' : 'No',
		episode.createdAt.toISOString().substring(0, 10),
		episode.updatedAt.toISOString().substring(0, 10),
		`<div class="d-flex order-actions">
			<a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
			<a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${episode._id}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
			<a href="javascript:;" class="text-danger ms-1" onclick="fillDataToDeleteForm('${episode.name}','${episode._id}')" data-bs-toggle="modal" data-bs-target="#deleteModal"><i class="bx bxs-trash"></i></a>
		</div>`,
	]);

	res.status(200).json({
		draw,
		recordsTotal: totalEpisode,
		recordsFiltered: totalEpisode,
		data,
	});
};

// [POST] admin/episodes/datatables_ajax
const errorsAjaxDatatables = async (req, res) => {
	const { columns, order, start, length, search, draw } = req.body;
	const columnIndex = order[0]['column'];
	const columnName = columns[columnIndex]['name'] || 'createdAt';
	const columnSortOrder = order[0]['dir'] === 'asc' ? 1 : -1;
	const queryToDB = { isError: true };

	if (search.value) queryToDB.name = new RegExp(search.value, 'i');

	const totalEpisode = await episodeModels.countDocuments(queryToDB);
	const dataEpisodes = await episodeModels.aggregate([
		{ $match: queryToDB },
		{
			$lookup: {
				from: 'films',
				localField: 'filmId',
				foreignField: '_id',
				as: 'film',
			},
		},
		{
			$project: {
				id: 1,
				name: 1,
				updatedAt: 1,
				film: { originalName: '$film.originalName', poster: '$film.poster', year: '$film.year' },
			},
		},
		{ $skip: parseInt(start) },
		{ $limit: parseInt(length) },
		{ $sort: { [columnName]: columnSortOrder } },
	]);

	const data = dataEpisodes.map((episode) => [
		episode._id,
		episode.name,
		`<div class="d-flex align-items-center">
				<div class="recent-product-img"><img src="${episode.film[0].poster[0]}" alt="" /></div>
				<div class="ms-2"><h6 class="mb-1 font-14">${episode.film[0].originalName[0]} (${episode.film[0].year[0]})</h6></div>
			</div>`,
		episode.updatedAt.toISOString().substring(0, 10),
		`<div class="d-flex justify-content-center order-actions">
			<a href="javascript:;" class="text-primary"><i class="bx bx-link-external"></i></a>
			<a href="javascript:;" class="text-warning ms-1" onclick="fillDataToEditForm('${episode._id}')" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bx bxs-edit"></i></a>
		</div>`,
	]);

	res.status(200).json({
		draw,
		recordsTotal: totalEpisode,
		recordsFiltered: totalEpisode,
		data,
	});
};

// [POST] admin/episodes/create
const createEpisode = async (req, res) => {
	const { data, filmId } = req.body;
	try {
		const dataInserted = await episodeModels.insertMany(data.map((d) => ({ filmId, ...d })));
		await filmModels.findByIdAndUpdate(filmId, {
			$push: { episodes: { $each: dataInserted.map((d) => d._id) } },
		});
		return res.status(200).json({ message: 'Create Episodes Success' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

// [GET] admin/episodes/read/:id
const readEpisode = (req, res) => {
	episodeModels
		.findById(req.params.id)
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
};
// [POST] admin/episodes/read-many
const readManyEpisode = (req, res) => {
	const { ids } = req.body;
	episodeModels
		.find({ _id: { $in: ids } })
		.then((results) => {
			res.status(200).json(results);
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
};

// [PATCH] admin/episodes/update/:id
const updateEpisode = (req, res) => {
	episodeModels
		.updateOne(
			{ _id: req.params.id },
			{
				name: req.body.name,
				message: req.body.message,
				subtitle: req.body.subtitle,
				language: req.body.language,
				links: req.body.links,
				isError: req.body.isError,
			},
		)
		.then(async () => {
			res.status(200).json({ message: 'Update Episode Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [PATCH] admin/episodes/update/:id
const updateManyEpisode = (req, res) => {
	const { data } = req.body;
	episodeModels
		.bulkWrite(
			data.map((dataEpisode) => ({
				updateOne: { filter: { _id: dataEpisode.id }, update: dataEpisode },
			})),
		)
		.then(async () => {
			res.status(200).json({ message: 'Update Episodes Success' });
		})
		.catch((error) => {
			res.status(500).json({ error: error.message });
		});
};

// [POST] admin/episodes/delete/:id
const deleteEpisode = (req, res) => {
	const { filmId } = req.body;
	const episodeId = req.params.id;

	Promise.all([
		filmModels.findByIdAndUpdate(filmId, { $pull: { episodes: episodeId } }),
		episodeModels.findByIdAndDelete(episodeId),
	])
		.then(() => {
			res.status(200).json({ message: 'Delete Episodes Success' });
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
};

// [POST] admin/episodes/delete-many
const deleteManyEpisode = (req, res) => {
	const { filmId, episodeIds } = req.body;

	Promise.all([
		filmModels.findByIdAndUpdate(filmId, { $pull: { episodes: { $in: episodeIds } } }),
		episodeModels.deleteMany({ _id: { $in: episodeIds } }),
	])
		.then(() => {
			res.status(200).json({ message: 'Delete Episodes Success' });
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
};

// ###### PAGE ######

// [GET] admin/episodes/:filmId
const episodes = async (req, res) => {
	const filmInfo = await filmModels.findById(req.params.filmId, { originalName: 1, year: 1 });
	const { web_servers } = await configurationModels.findOne({});
	const listLanguages = web_servers.split(',');

	res.render('admin/episodes', {
		user: req.session.user,
		filmInfo,
		listLanguages,
	});
};

// [GET] admin/episodes/errors
const errors = async (req, res) => {
	res.render('admin/episodesError', {
		user: req.session.user,
	});
};

module.exports = {
	ajaxDatatables,
	errorsAjaxDatatables,
	episodes,
	errors,
	createEpisode,
	readEpisode,
	readManyEpisode,
	updateEpisode,
	updateManyEpisode,
	deleteEpisode,
	deleteManyEpisode,
};
