function copyProfileLink() {
	const textarea = document.querySelector('#link-profile');
	if (textarea) {
		textarea.focus();
		textarea.select();
		document.execCommand('copy');

		notyf.success('Đã sao chép liên kết tài khoản!');
	}
}

// switch tab profile
const profileTabs = document.querySelectorAll('.xpo-profile__tabs-item');
const profileContent = document.querySelectorAll('.xpo-profile__tabs-content__item');
if (profileTabs && profileContent) {
	let activeTab = document.querySelector('.xpo-profile__tabs-item.active');
	let activeContent = document.querySelector('.xpo-profile__tabs-content__item.active');

	profileTabs.forEach(function (profileTab, idx) {
		profileTab.onclick = function () {
			// change tab
			activeTab.classList.remove('active');
			profileTab.classList.add('active');
			activeTab = profileTab;

			// change content
			activeContent.classList.remove('active');
			profileContent[idx].classList.add('active');
			activeContent = profileContent[idx];

			// save tab index
			saveTabProfile(idx);
		};
	});

	function saveTabProfile(index) {
		const url = new URL(window.location.href);

		const searchParams = new URLSearchParams(url.search);
		searchParams.set('tab', index);

		url.search = searchParams.toString();

		window.history.pushState(null, '', url.toString());
	}

	function getTabProfile() {
		const urlParams = new URLSearchParams(window.location.search);
		const tabProfile = parseInt(urlParams.get('tab'));
		return !isNaN(tabProfile) ? tabProfile : -1;
	}

	// auto load profile tab
	(function loadProfileTab() {
		const tabIndex = getTabProfile();

		if (tabIndex !== -1) {
			// change tab
			activeTab.classList.remove('active');
			profileTabs[tabIndex].classList.add('active');
			activeTab = profileTabs[tabIndex];

			// change content
			activeContent.classList.remove('active');
			profileContent[tabIndex].classList.add('active');
			activeContent = profileContent[tabIndex];
		}
	})();
}

// handle update info
const btnSaveInfo = document.querySelector(".xpo-profile__tabs-content__item--form > form >button[type='submit']");
if (btnSaveInfo) {
	const form = document.querySelector('.xpo-profile__tabs-content__item--form > form');
	btnSaveInfo.onclick = function (e) {
		e.preventDefault();

		const fullname = form.querySelector("input[name='fullname']").value;
		const password = form.querySelector("input[name='password']").value;
		const email = form.querySelector("input[name='email']").value;
		const descript = form.querySelector("textarea[name='profile_sefl']").value;

		// validate data
		if (fullname.length < 3 || fullname.length > 32) {
			notyf.error('Họ và tên phải từ 3 đến 32 kí tự!');
			return;
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			notyf.error('Email không đúng rùii!');
			return;
		}

		if (password.length > 0) {
			if (password.length < 6 || password.length > 32) {
				notyf.error('Password phải từ 6 đến 32 kí tự!');
				return;
			}
		}

		if (descript.length > 255) {
			notyf.error('Giới thiệu bản thân tối đa 255 kí tự thoii');
			return;
		}

		// call api update here...
		fetch('/api/info/update-info', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				fullname,
				email,
				password,
				descript,
			}),
		}).then(async function (res) {
			const data = await res.json();
			if (res.ok) notyf.success(data.msg);
			else notyf.error(data.msg);
		});
	};
}

// handle update avatar
const avatarInput = document.getElementById('avatar_input');
if (avatarInput) {
	let blobUrl = '';
	avatarInput.onchange = function () {
		const file = this.files[0];
		if (!file) return;
		if (!confirm('Bạn có muốn đổi avatar thành hình này không?')) return;

		const imgElm = document.querySelector('.xpo-profile__overview-box .avatar__image');

		if (blobUrl) URL.revokeObjectURL(blobUrl);
		blobUrl = URL.createObjectURL(file);

		// call api upload
		const notification = notyf.open({
			message: 'Image Uploading',
			background: '#9c9cff',
			duration: 900000, // 30 minutes
			icon: { className: 'gg-spinner-two', tagName: 'i', color: 'none' },
		});

		const formData = new FormData();
		formData.append('file', file);

		fetch('/api/info/update-avatar', {
			method: 'POST',
			body: formData,
		}).then(async function (res) {
			const data = await res.json();
			if (res.ok) {
				notyf.success(data.msg);
				imgElm.src = blobUrl;
			} else notyf.error(data.msg);
			notyf.dismiss(notification);
		});
	};
}

// handle remove ep watched
function removeEpWatched({ event, epId }) {
	fetch('/api/films/history/' + epId, {
		method: 'DELETE',
	}).then(async function (res) {
		const data = await res.json();
		if (!res.ok) notyf.error(data.msg);
		else {
			notyf.success(data.msg);
			event.target.parentElement.remove();
		}
	});
}

// handle remove film follow & film bookmark
function removeFilmCollection({ event, filmId }) {
	event.preventDefault();

	fetch('/api/films/collection/' + filmId, {
		method: 'DELETE',
	}).then(async function (res) {
		const data = await res.json();
		if (!res.ok) notyf.error(data.msg);
		else {
			notyf.success(data.msg);
			event.target.closest('.item.col').remove();
		}
	});
}

function removeFilmFollow({ event, filmId }) {
	event.preventDefault();

	fetch('/api/films/follow/' + filmId, {
		method: 'DELETE',
	}).then(async function (res) {
		const data = await res.json();
		if (!res.ok) notyf.error(data.msg);
		else {
			notyf.success(data.msg);
			event.target.closest('.item.col').remove();
		}
	});
}

// handle search film follow & film bookmark
const colectionSearchInpput = document.getElementById('colection_search');
const followSearchInpput = document.getElementById('follow_search');

if (colectionSearchInpput && followSearchInpput) {
	const colectionBox = document.getElementById('colection_box');
	const followBox = document.getElementById('follow_box');

	colectionSearchInpput.onkeyup = function (event) {
		const keyword = event.target.value.toLowerCase();

		debounce(function () {
			Array.apply(null, colectionBox.children).forEach(function (item) {
				item.style.display = 'block';

				if (keyword === '' || keyword.length < 2) return;

				const name = item.querySelector('.xpo-vn-name a').innerText.toLowerCase();
				const originName = item.querySelector('.xpo-original-name').innerText.toLowerCase();

				if (!name.includes(keyword) && !originName.includes(keyword)) item.style.display = 'none';
			});
		})();
	};

	followSearchInpput.onkeyup = function (event) {
		const keyword = event.target.value.toLowerCase();

		debounce(function () {
			Array.apply(null, followBox.children).forEach(function (item) {
				item.style.display = 'block';

				if (keyword === '' || keyword.length < 2) return;

				const name = item.querySelector('.xpo-vn-name a').innerText.toLowerCase();
				const originName = item.querySelector('.xpo-original-name').innerText.toLowerCase();

				if (!name.includes(keyword) && !originName.includes(keyword)) item.style.display = 'none';
			});
		})();
	};
}

// load view history of user
const isLoadViewHistory = document.getElementById('tab_view_history');
if (isLoadViewHistory) {
	window.addEventListener('DOMContentLoaded', function () {
		const viewHistoryContainer = document.querySelector('.xpo-profile__tabs-content__history');

		// fetch api
		fetch('/api/films/history')
			.then(async function (res) {
				return await res.json();
			})
			.then(function (result) {
				if (!result && !Array.isArray(result)) return;
				// render to view
				viewHistoryContainer.innerHTML = result
					.map(function (history) {
						return `<div class="tabs-content__history--item">
								<div class="poster"><img src="${history.poster}"></div>
								<div class="content">
									<a class="ep-name" href="${history.url}">${history.name}</a>
									<span class="date">${history.date}</span>
								</div>
								<span class="xpo-remove" onclick="removeEpWatched({event, epId: '${history.id}'})">&times;</span>
							</div>`;
					})
					.join('\n');
			});
	});
}

// load collection films of user
const isLoadCollection = document.getElementById('colection_box');
if (isLoadCollection) {
	window.addEventListener('DOMContentLoaded', function () {
		const collectionBox = document.getElementById('colection_box');

		// fetch api
		fetch('/api/films/collection')
			.then(async function (res) {
				return await res.json();
			})
			.then(function (result) {
				if (!result && !Array.isArray(result)) return;
				// render to view
				collectionBox.innerHTML = result
					.map(function (film) {
						return `<div class="item col col-lg-3 col-md-4 col-sm-6">
									<div class="xpo-item">
										<a class="xpo-thumb" href="${film.url}" title="${film.name} - ${film.originalName} (${film.year})">
											<img src="${film.poster}" alt="${film.name} - ${film.originalName} (${film.year})">
											<span class="xpo-status">${film.status}</span>
											<span class="xpo-year">${film.year}</span>
											<span class="xpo-language">${film.language}</span>
											<div class="xpo-icon-overlay"></div>
											<span class="xpo-remove" onclick="removeFilmCollection({event, filmId: '${film._id}'});">&times;</span>
										</a>
										<div class="xpo-content">
											<div class="xpo-content__name">
												<h3 class="xpo-vn-name">
													<a href="./info.html" title="${film.name} - ${film.originalName} (${film.year})">${film.name} - ${film.originalName} (${film.year})</a>
												</h3>
												<p class="xpo-original-name">${film.originalName}</p>
											</div>
										</div>
									</div>
								</div>`;
					})
					.join('\n');
			});
	});
}

// load films follow of user
const isLoadFollow = document.getElementById('follow_box');
if (isLoadFollow) {
	window.addEventListener('DOMContentLoaded', function () {
		const followBox = document.getElementById('follow_box');

		// fetch api
		fetch('/api/films/follow')
			.then(async function (res) {
				return await res.json();
			})
			.then(function (result) {
				if (!result && !Array.isArray(result)) return;
				// render to view
				followBox.innerHTML = result
					.map(function (film) {
						return `<div class="item col col-lg-3 col-md-4 col-sm-6">
									<div class="xpo-item">
										<a class="xpo-thumb" href="${film.url}" title="${film.name} - ${film.originalName} (${film.year})">
											<img src="${film.poster}" alt="${film.name} - ${film.originalName} (${film.year})">
											<span class="xpo-status">${film.status}</span>
											<span class="xpo-year">${film.year}</span>
											<span class="xpo-language">${film.language}</span>
											<div class="xpo-icon-overlay"></div>
											<span class="xpo-remove" onclick="removeFilmFollow({event, filmId: '${film._id}'});">&times;</span>
										</a>
										<div class="xpo-content">
											<div class="xpo-content__name">
												<h3 class="xpo-vn-name">
													<a href="./info.html" title="${film.name} - ${film.originalName} (${film.year})">${film.name} - ${film.originalName} (${film.year})</a>
												</h3>
												<p class="xpo-original-name">${film.originalName}</p>
											</div>
										</div>
									</div>
								</div>`;
					})
					.join('\n');
			});
	});
}
