const btnReportEpError = document.getElementById('btn-report-ep-error');
const btnNextEp = document.getElementById('btn-next-ep');
const btnPrevEp = document.getElementById('btn-prev-ep');
const allEp = document.querySelectorAll('.xpo-list-episodes__episode-item');
const loadIcon = document.querySelector('.xpo-player-loader');
const embedContainer = document.querySelector('.xpo-player-area .embed-container');
const listServer = document.querySelector('.list-server');

document.addEventListener('DOMContentLoaded', async function () {
	await firstLoadEpisode();

	// report episode error
	if (btnReportEpError)
		btnReportEpError.onclick = function () {
			const describeOfError = prompt('Please describe the error of the episode!');
			if (describeOfError?.length < 3) return;
			fetch('/api/report-error-episode', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ episodeId: window.app.currentEpId }),
			})
				.then(function (response) {
					return response.json();
				})
				.then(function (res) {
					alert(res.message);
				})
				.catch(function (err) {
					alert(err);
				});
		};

	// set function change ep for next, prev, eps btn when click
	if (btnNextEp)
		btnNextEp.onclick = function () {
			changeEpisode({ id: btnNextEp.dataset.id, href: btnNextEp.dataset.href });
		};

	if (btnPrevEp)
		btnPrevEp.onclick = function () {
			changeEpisode({ id: btnPrevEp.dataset.id, href: btnPrevEp.dataset.href });
		};

	if (allEp)
		allEp.forEach(function (ep) {
			ep.onclick = function (event) {
				event.preventDefault();
				const aTag = ep.querySelector('a');
				changeEpisode({ id: aTag.dataset.id, href: aTag.href });
			};
		});
});

function fetchEpisode(episodeId, serverId) {
	// display load icon
	loadIcon.classList.remove('hidden');

	return new Promise(function (resolve, reject) {
		fetch('/api/loadEpisode', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ episodeId, serverId }),
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (res) {
				resolve(res);
				setTimeout(function () {
					// hidden load icon
					loadIcon.classList.add('hidden');
				}, 150);
			});
	});
}

async function changeEpisode(episode) {
	if (!episode.id) return alert("Don't have episode");
	const { id, href } = episode;
	const { image, title, links, subtitle, next, prev, servers } = await fetchEpisode(id, null);

	// change next, prev, current ep
	window.app.currentEpId = id;
	btnNextEp.dataset.id = next?._id || '';
	btnNextEp.dataset.href = next?.href || '';
	btnPrevEp.dataset.id = prev?._id || '';
	btnPrevEp.dataset.href = prev?.href || '';

	const activeEp = document.querySelector('.xpo-list-episodes__episode-item.active');
	const currentActiveEp = document.querySelector(
		`.xpo-list-episodes__episode-item a[data-id="${window.app.currentEpId}"]`,
	).parentElement;

	// change btn ep active
	activeEp?.classList?.remove('active');
	currentActiveEp?.classList?.add('active');

	// change url & title
	window.history.pushState(null, '', href);
	document.title = title;

	//change servers
	Array.apply(null, listServer.children).forEach(function (child, index) {
		if (index > 0) child.remove();
	});
	servers.forEach(function (server, index) {
		const rawHtml = `<li class="list-server__item ${index === 0 ? 'active' : ''}">
						<button class="btn" data-server-id="" onclick="changeServer(this, ${server.id})">${server.name}</button>
						</li>`;
		listServer.insertAdjacentHTML('beforeend', rawHtml);
	});

	// change player
	if (links.type === 'embed') loadIframe(links.data[0]);
	else if (links.type === 'direct') loadPlayer(links.data, image, title, subtitle);

	// scroll to player
	xpoPlayerBox.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

async function changeServer(event, serverId) {
	// change active of server btn
	document.querySelector('.list-server__item.active').classList.remove('active');
	event.closest('.list-server__item').classList.add('active');

	// fetch ep data then change player
	const { links, subtitle, image, title } = await fetchEpisode(window.app.currentEpId, serverId);
	if (links.type === 'embed') loadIframe(links.data[0]);
	else if (links.type === 'direct') loadPlayer(links.data, image, title, subtitle);
}

function loadIframe(link) {
	jwplayer('player').remove();
	embedContainer.classList.remove('hidden');
	embedContainer.innerHTML = `<iframe class="embed-item" src="${link}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`;
}

function loadPlayer(links, image, title, subtitle) {
	jwplayer('player').remove();
	embedContainer.classList.add('hidden');
	embedContainer.innerHTML = '';

	const jwpSetup = {
		width: '100%',
		height: '100%',
		title: title,
		image: image,
		width: '100%',
		height: '100%',
		controls: true,
		autostart: false,
		allowfullscreen: true,
		abouttext: 'Phimbox.ml',
		aboutlink: 'http://phimbox.ml',
		playbackRateControls: true,
		displayPlaybackLabel: true,
		primary: 'html5',
	};

	if (links.length > 1) {
		jwpSetup.sources = links.map(function (link) {
			return {
				file: link.file,
				label: link.label,
				type: link.type,
			};
		});
	} else if (links.length === 1) {
		jwpSetup.sources = [
			{
				default: false,
				type: links[0].type,
				file: links[0].file,
				label: '0',
			},
		];
	}
	if (subtitle) {
		jwpSetup.tracks = [{ file: subtitle, label: 'Vietnamese', kind: 'captions', default: 'true' }];
	}

	jwplayer('player').setup(jwpSetup);
}

async function firstLoadEpisode() {
	const { links, subtitle, image, title, next, prev } = await fetchEpisode(window.app.currentEpId, null);

	btnNextEp.dataset.id = next?._id || '';
	btnNextEp.dataset.href = next?.href || '';
	btnPrevEp.dataset.id = prev?._id || '';
	btnPrevEp.dataset.href = prev?.href || '';

	if (links.type === 'embed') loadIframe(links.data[0]);
	else if (links.type === 'direct') loadPlayer(links.data, image, title, subtitle);
}
