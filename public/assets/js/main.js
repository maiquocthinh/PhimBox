$('#xpo-hot').owlCarousel({
	loop: true,
	margin: 6,
	nav: true,
	navText: ['<i class="iconify" data-icon="fa:chevron-left"></i>', '<i class="iconify" data-icon="fa:chevron-right"></i>'],
	autoplay: true,
	autoplayTimeout: 3000,
	autoplayHoverPause: true,
	dotsEach: true,
	responsive: {
		0: {
			items: 2,
		},
		480: {
			items: 3,
		},
		600: {
			items: 4,
		},
		763: {
			items: 5,
		},
		1000: {
			items: 6,
		},
	},
});
$('.xpo-content-cat').owlCarousel({
	loop: true,
	margin: 6,
	nav: true,
	navText: ['<i class="iconify" data-icon="fa:chevron-left"></i>', '<i class="iconify" data-icon="fa:chevron-right"></i>'],
	autoplay: true,
	autoplayTimeout: 3000,
	autoplayHoverPause: true,
	dotsEach: true,
	responsive: {
		0: {
			items: 2,
		},
		480: {
			items: 3,
		},
		600: {
			items: 4,
		},
		1000: {
			items: 5,
		},
	},
});
$('#xpo-sidebar-trailer').owlCarousel({
	loop: true,
	margin: 6,
	nav: false,
	autoplay: true,
	autoplayTimeout: 3000,
	autoplayHoverPause: true,
	dotsEach: true,
	items: 1,
});
$('.xpo-slide-full__list').owlCarousel({
	loop: true,
	margin: 6,
	nav: true,
	navText: ['<i class="iconify" data-icon="fa:chevron-left"></i>', '<i class="iconify" data-icon="fa:chevron-right"></i>'],
	autoplay: true,
	autoplayTimeout: 3000,
	autoplayHoverPause: true,
	dotsEach: true,
	items: 1,
});
$('.xpo-list-cast').owlCarousel({
	margin: 24,
	nav: true,
	navText: ['<i class="iconify" data-icon="fa:chevron-left"></i>', '<i class="iconify" data-icon="fa:chevron-right"></i>'],
	responsive: {
		0: {
			items: 4,
		},
		700: {
			items: 5,
		},
		1024: {
			items: 6,
		},
	},
});
$('.xpo-film-content__images').owlCarousel({
	loop: true,
	margin: 6,
	nav: true,
	navText: ['<i class="iconify" data-icon="fa:chevron-left"></i>', '<i class="iconify" data-icon="fa:chevron-right"></i>'],
	autoplay: true,
	autoplayTimeout: 3000,
	autoplayHoverPause: true,
	dots: false,
	items: 1,
});
$('#xpo-film-related__list').owlCarousel({
	loop: true,
	margin: 6,
	nav: true,
	navText: ['<i class="iconify" data-icon="fa:chevron-left"></i>', '<i class="iconify" data-icon="fa:chevron-right"></i>'],
	autoplay: true,
	autoplayTimeout: 3000,
	autoplayHoverPause: true,
	dotsEach: true,
	responsive: {
		0: {
			items: 2,
		},
		480: {
			items: 3,
		},
		600: {
			items: 4,
		},
		900: {
			items: 5,
		},
	},
});
$(document).ready(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 0) {
			$('#scroll-top').fadeIn();
		} else {
			$('#scroll-top').fadeOut();
		}
	});
	$('#scroll-top').click(function () {
		$('body,html').animate(
			{
				scrollTop: 0,
			},
			400,
		);
		return false;
	});
});
// show hidden menu in mobile
const menuMobileBtn = document.querySelector('.menu-mobile');
if (menuMobileBtn)
	menuMobileBtn.onclick = function () {
		const headerNavbar = document.querySelector('.header-navbar');
		headerNavbar.classList.toggle('sm-hidden');
		if (headerNavbar.classList.contains('sm-hidden')) {
			document.querySelector('#navbar-mobile__icon-list').style.display = 'inline-block';
			document.querySelector('#navbar-mobile__icon-close').style.display = 'none';
		} else {
			document.querySelector('#navbar-mobile__icon-list').style.display = 'none';
			document.querySelector('#navbar-mobile__icon-close').style.display = 'inline-block';
			hiddenUserBoxAndNotifyBox();
		}
	};
// show dropdown-list in mobile
const navbarItems = document.querySelectorAll('.header-navbar__menu-item.dropdown>a');
navbarItems.forEach(function (element) {
	element.onclick = function () {
		const dropdownList = this.nextElementSibling;
		const dropdownListOpen = document.querySelector('.dropdown-list:not(.sm-hidden)');
		if (dropdownListOpen && dropdownListOpen !== dropdownList) {
			dropdownListOpen.classList.add('sm-hidden');
		}
		dropdownList.classList.toggle('sm-hidden');
	};
});
// show search input in mobile
const searchMobileBtn = document.querySelector('.search-mobile');
if (searchMobileBtn)
	searchMobileBtn.onclick = function () {
		const searchInput = document.querySelector('.header-search');
		searchInput.classList.toggle('sm-hidden');
		if (searchInput.classList.contains('sm-hidden')) {
			document.querySelector('#navbar-mobile__icon-search').style.display = 'inline-block';
			document.querySelector('#navbar-mobile__icon-close-search').style.display = 'none';
		} else {
			document.querySelector('#navbar-mobile__icon-search').style.display = 'none';
			document.querySelector('#navbar-mobile__icon-close-search').style.display = 'inline-block';
			hiddenUserBoxAndNotifyBox();
		}
	};
// show login/register in mobile
const userMobileBtn = document.querySelector('.user-mobile .user-mobile__icon');
if (userMobileBtn)
	userMobileBtn.onclick = function () {
		const authModal = document.querySelector('.auth-modal');
		authModal.classList.toggle('hidden');
	};
// close auth modal
const authModalCloseBtn = document.querySelector('.modal-dialog__tabs-close');
authModalCloseBtn.onclick = function () {
	const authModal = document.querySelector('.auth-modal');
	authModal.classList.add('hidden');
};
// change tab active of authModal
let authModalTabs = document.querySelectorAll('.modal-dialog__tabs-list>li.modal-dialog__tabs-item');
authModalTabs.forEach(function (element) {
	element.onclick = function () {
		document.querySelector('.modal-dialog__tabs-item.active').classList.remove('active');
		document.querySelector('.modal-dialog__content>div:not(.hidden').classList.add('hidden');

		this.classList.add('active');

		if (document.querySelector('#modal-dialog__tab-login').classList.contains('active')) {
			document.querySelector('.modal-dialog__content .modal-login').classList.remove('hidden');
		}
		if (document.querySelector('#modal-dialog__tab-register').classList.contains('active')) {
			document.querySelector('.modal-dialog__content .modal-register').classList.remove('hidden');
		}
	};
});
let forgotUser = document.querySelector('.forgot-user');
forgotUser.onclick = function () {
	document.querySelector('.modal-dialog__content>div:not(.hidden').classList.add('hidden');
	document.querySelector('.modal-dialog__content .modal-forgot').classList.remove('hidden');
};

// show auth modal in desktop & tablet
const btnLogin = document.querySelector('#btn-login');
const btnRegister = document.querySelector('#btn-register');
const authModal = document.querySelector('.auth-modal');
if (btnLogin)
	btnLogin.onclick = function () {
		authModal.classList.remove('hidden');

		document.querySelector('.modal-dialog__tabs-item.active').classList.remove('active');
		document.querySelector('.modal-dialog__content>div:not(.hidden').classList.add('hidden');

		document.querySelector('#modal-dialog__tab-login').classList.add('active');
		document.querySelector('.modal-dialog__content .modal-login').classList.remove('hidden');
	};
if (btnRegister)
	btnRegister.onclick = function () {
		authModal.classList.remove('hidden');

		document.querySelector('.modal-dialog__tabs-item.active').classList.remove('active');
		document.querySelector('.modal-dialog__content>div:not(.hidden').classList.add('hidden');

		document.querySelector('#modal-dialog__tab-register').classList.add('active');
		document.querySelector('.modal-dialog__content .modal-register').classList.remove('hidden');
	};

// show hidden when click notification & userbox
const userBtn = document.querySelector('.header-user__btn-user');
const notifyBtn = document.querySelector('.header-user__btn-notify');
const userBox = document.querySelector('.user-box');
const notifyBox = document.querySelector('.notify-box');
const notifyBoxArrowUp = document.querySelector('.notify-box-arrow-up');

if (userBtn && notifyBtn && userBox && notifyBox && notifyBoxArrowUp) {
	userBtn.onclick = function () {
		userBox.classList.toggle('hidden');
	};

	notifyBtn.onclick = function () {
		notifyBox.classList.toggle('hidden');
		notifyBoxArrowUp.classList.toggle('hidden');
	};

	userBox.onclick = notifyBox.onclick = function (event) {
		event.stopPropagation();
	};
}

function hiddenUserBoxAndNotifyBox() {
	// hidden userBox & notifyBox
	userBox?.classList?.add('hidden');
	notifyBox?.classList?.add('hidden');
	notifyBoxArrowUp?.classList?.add('hidden');
}

// change tab top aside
const popularPosts = document.querySelectorAll('.tab-container .popular-posts');
popularPosts.forEach(function (popularPost) {
	const asideTopTabs = popularPost.querySelectorAll('.tab-header>li');
	asideTopTabs.forEach(function (element) {
		element.onclick = function () {
			popularPost.querySelector('.tab-header>li.active').classList.remove('active');
			popularPost.querySelector('.tab-container .tab-content:not(.hidden)').classList.add('hidden');

			this.classList.add('active');

			if (this === popularPost.querySelector('#tab-label-1')) {
				popularPost.querySelector('#tab-content-1').classList.remove('hidden');
			}
			if (this === popularPost.querySelector('#tab-label-2')) {
				popularPost.querySelector('#tab-content-2').classList.remove('hidden');
			}
			if (this === popularPost.querySelector('#tab-label-3')) {
				popularPost.querySelector('#tab-content-3').classList.remove('hidden');
			}
		};
	});
});

// fill infoFilm to xpoMiniInfo
function fillDataToXpoMiniInfo(xpoMiniInfo, infoFilm) {
	if (xpoMiniInfo && infoFilm) {
		xpoMiniInfo.querySelector('.xpo-mini-info__name').textContent = infoFilm.dataset.name;
		xpoMiniInfo.querySelector('.xpo-mini-info__original-name').textContent = infoFilm.dataset.originalName;
		xpoMiniInfo.querySelector('.xpo-mini-info__imdb').lastChild.textContent = infoFilm.dataset.imdb;
		xpoMiniInfo.querySelector('.xpo-mini-info__duration').lastChild.textContent = infoFilm.dataset.duration;
		xpoMiniInfo.querySelector('.xpo-mini-info__year').lastChild.textContent = infoFilm.dataset.year;
		xpoMiniInfo.querySelector('.xpo-mini-info__short-description').textContent = infoFilm.dataset.shortDescription;
		xpoMiniInfo.querySelector('.xpo-mini-info__countries').lastChild.textContent = infoFilm.dataset.countries;
		xpoMiniInfo.querySelector('.xpo-mini-info__categories').lastChild.textContent = infoFilm.dataset.categories;
		xpoMiniInfo.querySelector('.xpo-mini-info__actors').lastChild.textContent = infoFilm.dataset.actors;
	}
}
// box mini info film: show/hiden when mouse hover, bla bla,....
const xpoItems = document.querySelectorAll('.xpo-item, .xpo-slide-full__item');
const xpoMiniInfo = document.querySelector('.xpo-mini-info');
xpoMiniInfo.onmouseover = function () {
	xpoMiniInfo.style.display = 'block';
	xpoMiniInfo.onmousemove = function (event) {
		xpoMiniInfo.style.left = -50 + event.pageX + 'px';
		xpoMiniInfo.style.top = 20 + event.pageY + 'px';
	};
};
xpoMiniInfo.onmouseleave = function () {
	xpoMiniInfo.style.display = 'none';
};
xpoItems.forEach(function (xpoItem) {
	// get info of film
	const infoFilm = xpoItem.querySelector('.xpo-mini-info__data');

	// handle hiden/show when mouseover/mouseout
	xpoItem.onmouseover = function () {
		const width = window.innerWidth;
		if (width >= 740) {
			fillDataToXpoMiniInfo(xpoMiniInfo, infoFilm);
			xpoMiniInfo.style.display = 'block';
			xpoItem.onmousemove = function (event) {
				if (width - event.pageX < 320) xpoMiniInfo.style.left = width - 320 + 'px';
				else xpoMiniInfo.style.left = -50 + event.pageX + 'px';
				xpoMiniInfo.style.top = 30 + event.pageY + 'px';
			};
		}
	};
	xpoItem.onmouseleave = function () {
		xpoMiniInfo.style.display = 'none';
	};
});

// rating film
function scoreToText(score) {
	switch (score) {
		case 1:
			return 'Dở tệ';
		case 2:
			return 'Dở';
		case 3:
			return 'Không hay';
		case 4:
			return 'Ko hay lắm';
		case 5:
			return 'Bình thường';
		case 6:
			return 'Xem được';
		case 7:
			return 'Có vẻ hay';
		case 8:
			return 'Hay';
		case 9:
			return 'Rất hay';
		case 10:
			return 'Hay tuyệt';
	}
}
(function ratingFilm(initRating = 5) {
	if (document.getElementById('film-rating')) {
		$('.rating-label').text(scoreToText(initRating * 2));
		$('#film-rating').starRating({
			initialRating: initRating / 2,
			totalStars: 5,
			starSize: 18,
			strokeWidth: 6,
			strokeColor: 'black',
			emptyColor: 'lightgray',
			hoverColor: 'crimson',
			activeColor: 'crimson',
			useGradient: false,
			onHover: function (currentIndex, currentRating, $el) {
				$('.rating-label').text(scoreToText(currentIndex * 2));
			},
			onLeave: function (currentIndex, currentRating, $el) {
				$('.rating-label').text(scoreToText(currentRating * 2));
			},
			callback: function (currentRating, ratingElement) {
				const ratingPoint = currentRating * 2;
				// do somthing with ratingPoint....
			},
		});
	}
})();

// add film to boxfilm and follow film
const btnFollowFilm = document.querySelector('.xpo-film-info button.poster__follow');
const btnBookmarkFilm = document.querySelector('.xpo-film-info button.poster__bookmark');

if (btnFollowFilm) {
	btnFollowFilm.onclick = function () {
		const iconFollowFilm = btnFollowFilm.querySelector('.iconify');
		const labelFollowFilm = btnFollowFilm.querySelector('.poster__follow-label');
		if (iconFollowFilm.dataset.icon === iconFollowFilm.dataset.iconAdd) {
			iconFollowFilm.dataset.icon = iconFollowFilm.dataset.iconRemove;
			labelFollowFilm.textContent = labelFollowFilm.dataset.msgRemove;
			btnFollowFilm.title = labelFollowFilm.dataset.msgRemove;

			// make somthing when follow film....
		} else if (iconFollowFilm.dataset.icon === iconFollowFilm.dataset.iconRemove) {
			iconFollowFilm.dataset.icon = iconFollowFilm.dataset.iconAdd;
			labelFollowFilm.textContent = labelFollowFilm.dataset.msgAdd;
			btnFollowFilm.title = labelFollowFilm.dataset.msgAdd;

			// make somthing when unfollow film....
		}
	};
}
if (btnBookmarkFilm) {
	btnBookmarkFilm.onclick = function () {
		const iconBookmarkFilm = btnBookmarkFilm.querySelector('.iconify');
		const labelBookmarkFilm = btnBookmarkFilm.querySelector('.poster__bookmark-label');
		if (iconBookmarkFilm.dataset.icon === iconBookmarkFilm.dataset.iconAdd) {
			iconBookmarkFilm.dataset.icon = iconBookmarkFilm.dataset.iconRemove;
			labelBookmarkFilm.textContent = labelBookmarkFilm.dataset.msgRemove;
			btnBookmarkFilm.title = labelBookmarkFilm.dataset.msgRemove;

			// make somthing when add film to bookmark....
		} else if (iconBookmarkFilm.dataset.icon === iconBookmarkFilm.dataset.iconRemove) {
			iconBookmarkFilm.dataset.icon = iconBookmarkFilm.dataset.iconAdd;
			labelBookmarkFilm.textContent = labelBookmarkFilm.dataset.msgAdd;
			btnBookmarkFilm.title = labelBookmarkFilm.dataset.msgAdd;

			// make somthing when remove film form bookmark....
		}
	};
}

// showmore/showless film content
const contentBox = document.querySelector('.xpo-film-content__box');
const toggleBtnContent = document.querySelector('.xpo-film-content__btn-toggle button');

if (toggleBtnContent) {
	toggleBtnContent.onclick = function () {
		contentBox.classList.toggle('collapse');
		if (contentBox.classList.contains('collapse')) {
			toggleBtnContent.textContent = toggleBtnContent.dataset.showmore;
		} else {
			toggleBtnContent.textContent = toggleBtnContent.dataset.showless;
		}
	};
}

// Trailer modal popup show
function showTrailer() {
	document.querySelector('#trailer-popup').classList.remove('hidden');
}

// Modal popup
const modals = document.querySelectorAll('.modal');
modals.forEach((modal) => {
	const btnCloseModal = modal.querySelector('.modal-close-btn');
	btnCloseModal.onclick = function () {
		modal.classList.add('hidden');
		// stop video iframe if this is playing
		if (modal.querySelector('iframe')) {
			modal.querySelector('iframe').src = modal.querySelector('iframe').src;
		}
	};
});

// show/hidden film filter on mobile
const formFilter = document.querySelector('#form-filter');
const btnToggleFilter = document.querySelector('.btn-toggle-filter');
if (btnToggleFilter) {
	btnToggleFilter.onclick = function () {
		if (btnToggleFilter.dataset.show === 'false') {
			btnToggleFilter.dataset.show = 'true';
			btnToggleFilter.innerHTML = 'Ẩn lọc phim &#10606;';
			formFilter.classList.remove('sm-hidden');
		} else {
			btnToggleFilter.dataset.show = 'false';
			btnToggleFilter.innerHTML = 'Chức năng lọc phim &#10606;';
			formFilter.classList.add('sm-hidden');
		}
	};
}

// Nav tabs
const navTabsComponents = document.querySelectorAll('.nav-tabs-component');
navTabsComponents.forEach((navTabsComponent) => {
	const tabsContent = navTabsComponent.querySelector('.tabs-content');
	const tabs = navTabsComponent.querySelectorAll('.nav-tabs .nav-tabs__item');
	tabs.forEach((tab) => {
		tab.onclick = function (event) {
			navTabsComponent.querySelector('.nav-tabs .nav-tabs__item.active').classList.remove('active');
			event.target.closest('.nav-tabs__item').classList.add('active');
			const selectTab = event.target.closest('.nav-tabs__item span').dataset.tabSelect;
			tabsContent.querySelector('.tabs-content__item.active').classList.remove('active');
			tabsContent.querySelector(`.tabs-content__item[data-tab-target="${selectTab}"]`).classList.add('active');
		};
	});
});

// expand/compress player
const btnExpandPlayer = document.querySelector('#expand-player');
const xpoPlayerBox = document.querySelector('.xpo-film-media__player');
const asideBox = document.querySelector('aside.sidebar');
if (btnExpandPlayer)
	btnExpandPlayer.onclick = function () {
		if (btnExpandPlayer.dataset.status === 'expanded') {
			// change content, icon, status of btnExpandPlayer
			btnExpandPlayer.innerHTML = `<i class="iconify" data-icon="fa:compress" style="font-size:1rem;transform:translateY(0);"></i>Thu nhỏ`;
			btnExpandPlayer.dataset.status = 'compressed';

			const widthFull = document.querySelector('.container>div').offsetWidth - 32;

			// change width, height of element related with xpoPlayerBox
			xpoPlayerBox.style.width = widthFull + 'px';
			xpoPlayerBox.style.maxHeight = xpoPlayerBox.offsetHeight + 'px';
			asideBox.style.marginTop = xpoPlayerBox.offsetHeight - 18 + 'px';

			// scroll top of xpoPlayerBox
			xpoPlayerBox.scrollIntoView({ block: 'start', behavior: 'smooth' });
		} else {
			// change content, icon, status of btnExpandPlayer
			btnExpandPlayer.innerHTML = `<i class="iconify" data-icon="fa:expand" style="font-size:1rem;transform:translateY(0);"></i>Mở rộng`;
			btnExpandPlayer.dataset.status = 'expanded';

			// change width, height of element related with xpoPlayerBox
			xpoPlayerBox.style.width = 'unset';
			xpoPlayerBox.style.maxHeight = 'unset';
			asideBox.style.marginTop = '-24px';

			// scroll top of xpoPlayerBox
			xpoPlayerBox.scrollIntoView({ block: 'start', behavior: 'smooth' });
		}
	};

// turn off/on light on watch page
const lightOut = document.querySelector('#lightout');
const btnToggleLight = document.querySelector('#toggle-light');
const boxMediaUserAction = document.querySelector('.xpo-film-media__user-action');
function toggleLight() {
	const isLightOn = lightOut.classList.contains('hidden');
	btnToggleLight.innerHTML = '<i class="iconify" data-icon="fa:adjust"></i> ' + (isLightOn ? 'Bật đèn' : 'Tắt đèn');

	// add/remove lightup class
	if (isLightOn) {
		xpoPlayerBox.classList.add('lightup');
		boxMediaUserAction.classList.add('lightup');
	} else {
		xpoPlayerBox.classList.remove('lightup');
		boxMediaUserAction.classList.remove('lightup');
	}

	// scroll top of xpoPlayerBox
	xpoPlayerBox.scrollIntoView({ block: 'start', behavior: 'smooth' });

	lightOut.classList.toggle('hidden');
}
if (lightOut)
	lightOut.onclick = function () {
		toggleLight();
	};
if (btnToggleLight)
	btnToggleLight.onclick = function () {
		toggleLight();
	};

// Share social modal popup show
function showShareSocial() {
	document.querySelector('#share-popup').classList.remove('hidden');
}

// Header Search
const searchInput = document.querySelector('.header-search__input');
const searchResults = document.querySelector('.header-search__results-list');
if (searchInput) {
	const loadIcon = document.querySelector('.header-search__icon-load');
	const keyWordSpan = document.querySelector('.header-search__results-list > li:nth-child(1) > span');

	searchInput.onkeyup = debounce(handleSearch, 500);

	function handleSearch(event) {
		const keyWord = searchInput.value.trim();
		if (keyWord) {
			loadIcon.classList.remove('hidden');
			searchResults.classList.remove('hidden');
			keyWordSpan.innerHTML = keyWord;

			if (event.keyCode === 13) window.location.replace(`/search/${keyWord.replace(' ', '+')}`);

			fetch('/api/search', {
				method: 'POST',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify({ keyWord }),
			}).then(function (response) {
				response.json().then(function (data) {
					handleLoadSearchResults(data);
					loadIcon.classList.add('hidden');
				});
			});
		} else {
			searchResults.classList.add('hidden');
		}
	}

	function handleLoadSearchResults(data) {
		// remove old search results
		Array.apply(null, searchResults.children).forEach(function (child, index) {
			if (index > 0) child.remove();
		});

		const innerHTML = data
			.map(function (item) {
				return `<li class="header-search__results-item">
				<a href="${item.href}" title="${item.name} - ${item.quality} ${item.language}">
					<div class="header-search__results-box">
						<div class="results-box__image">
							<img src="${item.poster}" alt="${item.name}"/>
						</div>
						<div class="results-box__info">
							<span for="" class="results-box__info-name">${item.name}</span>
							<span for="" class="results-box__info-engname">${item.originalName}</span>
							<span for="" class="results-box__info-status"><span>${item.quality} ${item.language}</span></span>
						</div>
					</div>
				</a>
			</li>`;
			})
			.join('');

		keyWordSpan.parentNode.insertAdjacentHTML('afterend', innerHTML);
	}
}

function debounce(func, timeout = 300) {
	let timer;

	return function (...args) {
		if (timer) clearTimeout(timer);

		const _this = this;

		timer = setTimeout(function () {
			func.apply(_this, args);
		}, timeout);
	};
}

// NOTYF
const notyf = new Notyf({
	duration: 6000,
	position: { x: 'right', y: 'top' },
	dismissible: true,
	ripple: true,
});

// Register
const formRegister = document.querySelector('.auth-modal .modal-register form');
if (formRegister) {
	formRegister.onsubmit = function (event) {
		event.preventDefault();

		const fullname = formRegister.querySelector("input[name='fullname']").value;
		const username = formRegister.querySelector("input[name='username']").value;
		const email = formRegister.querySelector("input[name='email']").value;
		const password = formRegister.querySelector("input[name='password']").value;
		const rePassword = formRegister.querySelector("input[name='re-password']").value;
		const termsAccept = formRegister.querySelector("input[name='terms-accept']").checked;

		// validate
		if (!termsAccept) {
			return notyf.error('Vui lòng đồng ý điều khoản để tiếp tục!');
		}

		if (!fullname || !username || !email || !password || !rePassword) {
			return notyf.error('Không được bỏ trống trường nào!');
		}

		if (fullname.length < 3 || fullname.length > 32) {
			return notyf.error('Họ và tên phải từ 3 đến 32 kí tự!');
		}

		if (username.length < 3 || username.length > 32) {
			return notyf.error('Tên người dùng phải từ 3 đến 32 kí tự!');
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return notyf.error('Email không đúng định dạng!');
		}

		if (password.length < 6 || password.length > 32) {
			return notyf.error('Password phải từ 6 đến 32 kí tự!');
		}

		if (password !== rePassword) {
			return notyf.error('Xác nhận mật khẩu không trùng!');
		}

		fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fullname, username, email, password }),
		}).then(async function (res) {
			const data = await res.json();
			if (res.ok) notyf.success(data.msg);
			else notyf.error(data.msg);
		});
	};
}

// Login
const formLogin = document.querySelector('.auth-modal .modal-login form');
if (formLogin) {
	formLogin.onsubmit = function (event) {
		event.preventDefault();

		const email = formLogin.querySelector("input[name='email']").value;
		const password = formLogin.querySelector("input[name='password']").value;
		const remember = formLogin.querySelector("input[name='remember']").checked;

		if (!email || !password) {
			return notyf.error('Không được bỏ trống trường nào!');
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return notyf.error('Email không đúng định dạng!');
		}

		fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, remember }),
		}).then(async function (res) {
			const data = await res.json();
			if (res.ok) {
				notyf.success(data.msg);
				setTimeout(function () {
					location.reload();
				}, 1500);
			} else notyf.error(data.msg);
		});
	};
}

// Logout
function logout(event) {
	event.preventDefault();

	fetch('/api/auth/logout', {
		method: 'DELETE',
	}).then(async function (res) {
		const data = await res.json();
		if (res.ok) {
			notyf.success(data.msg);
			setTimeout(function () {
				location.reload();
			}, 1500);
		} else notyf.error(data.msg);
	});
}
