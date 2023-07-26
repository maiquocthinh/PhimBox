$(function () {
	'use strict';
	try {
		new PerfectScrollbar('.header-message-list'),
			new PerfectScrollbar('.header-notifications-list'),
			$('.mobile-search-icon').on('click', function () {
				$('.search-bar').addClass('full-search-bar');
			}),
			$('.search-close').on('click', function () {
				$('.search-bar').removeClass('full-search-bar');
			}),
			$('.mobile-toggle-menu').on('click', function () {
				$('.wrapper').addClass('toggled');
			}),
			$('.toggle-icon').click(function () {
				$('.wrapper').hasClass('toggled')
					? ($('.wrapper').removeClass('toggled'), $('.sidebar-wrapper').unbind('hover'))
					: ($('.wrapper').addClass('toggled'),
					  $('.sidebar-wrapper').hover(
							function () {
								$('.wrapper').addClass('sidebar-hovered');
							},
							function () {
								$('.wrapper').removeClass('sidebar-hovered');
							},
					  ));
			});
	} catch (error) {}

	$(document).ready(function () {
		$(window).on('scroll', function () {
			$(this).scrollTop() > 300 ? $('.back-to-top').fadeIn() : $('.back-to-top').fadeOut();
		}),
			$('.back-to-top').on('click', function () {
				return (
					$('html, body').animate(
						{
							scrollTop: 0,
						},
						600,
					),
					!1
				);
			});
	}),
		$(document).ready(function () {
			$(window).on('scroll', function () {
				if ($(this).scrollTop() > 60) {
					$('.topbar').addClass('bg-dark');
				} else {
					$('.topbar').removeClass('bg-dark');
				}
			});
			$('.back-to-top').on('click', function () {
				$('html, body').animate(
					{
						scrollTop: 0,
					},
					600,
				);
				return false;
			});
		});

	$(function () {
		for (
			var e = window.location,
				o = $('.metismenu li a')
					.filter(function () {
						return this.href == e;
					})
					.addClass('')
					.parent()
					.addClass('mm-active');
			o.is('li');

		)
			o = o.parent('').addClass('mm-show').parent('').addClass('mm-active');
	}),
		$(function () {
			$('#menu').metisMenu();
		}),
		$('.chat-toggle-btn').on('click', function () {
			$('.chat-wrapper').toggleClass('chat-toggled');
		}),
		$('.chat-toggle-btn-mobile').on('click', function () {
			$('.chat-wrapper').removeClass('chat-toggled');
		}),
		$('.email-toggle-btn').on('click', function () {
			$('.email-wrapper').toggleClass('email-toggled');
		}),
		$('.email-toggle-btn-mobile').on('click', function () {
			$('.email-wrapper').removeClass('email-toggled');
		}),
		$('.compose-mail-btn').on('click', function () {
			$('.compose-mail-popup').show();
		}),
		$('.compose-mail-close').on('click', function () {
			$('.compose-mail-popup').hide();
		}),
		$('.switcher-btn').on('click', function () {
			$('.switcher-wrapper').toggleClass('switcher-toggled');
		}),
		$('.close-switcher').on('click', function () {
			$('.switcher-wrapper').removeClass('switcher-toggled');
		}),
		$('#theme1').click(theme1);
	$('#theme2').click(theme2);
	$('#theme3').click(theme3);
	$('#theme4').click(theme4);
	$('#theme5').click(theme5);
	$('#theme6').click(theme6);
	$('#theme7').click(theme7);
	$('#theme8').click(theme8);
	$('#theme9').click(theme9);
	$('#theme10').click(theme10);
	$('#theme11').click(theme11);
	$('#theme12').click(theme12);
	$('#theme13').click(theme13);
	$('#theme14').click(theme14);

	function theme1() {
		$('body').attr('class', 'bg-theme bg-theme1');
		changeBgThemeOfModal('bg-theme1');
		localStorage.setItem('bgTheme', 'bg-theme1');
	}

	function theme2() {
		$('body').attr('class', 'bg-theme bg-theme2');
		changeBgThemeOfModal('bg-theme2');
		localStorage.setItem('bgTheme', 'bg-theme2');
	}

	function theme3() {
		$('body').attr('class', 'bg-theme bg-theme3');
		changeBgThemeOfModal('bg-theme3');
		localStorage.setItem('bgTheme', 'bg-theme3');
	}

	function theme4() {
		$('body').attr('class', 'bg-theme bg-theme4');
		changeBgThemeOfModal('bg-theme4');
		localStorage.setItem('bgTheme', 'bg-theme4');
	}

	function theme5() {
		$('body').attr('class', 'bg-theme bg-theme5');
		changeBgThemeOfModal('bg-theme5');
		localStorage.setItem('bgTheme', 'bg-theme5');
	}

	function theme6() {
		$('body').attr('class', 'bg-theme bg-theme6');
		changeBgThemeOfModal('bg-theme6');
		localStorage.setItem('bgTheme', 'bg-theme6');
	}

	function theme7() {
		$('body').attr('class', 'bg-theme bg-theme7');
		changeBgThemeOfModal('bg-theme7');
		localStorage.setItem('bgTheme', 'bg-theme7');
	}

	function theme8() {
		$('body').attr('class', 'bg-theme bg-theme8');
		changeBgThemeOfModal('bg-theme8');
		localStorage.setItem('bgTheme', 'bg-theme8');
	}

	function theme9() {
		$('body').attr('class', 'bg-theme bg-theme9');
		changeBgThemeOfModal('bg-theme9');
		localStorage.setItem('bgTheme', 'bg-theme9');
	}

	function theme10() {
		$('body').attr('class', 'bg-theme bg-theme10');
		changeBgThemeOfModal('bg-theme10');
		localStorage.setItem('bgTheme', 'bg-theme10');
	}

	function theme11() {
		$('body').attr('class', 'bg-theme bg-theme11');
		changeBgThemeOfModal('bg-theme11');
		localStorage.setItem('bgTheme', 'bg-theme11');
	}

	function theme12() {
		$('body').attr('class', 'bg-theme bg-theme12');
		changeBgThemeOfModal('bg-theme12');
		localStorage.setItem('bgTheme', 'bg-theme12');
	}

	function theme13() {
		$('body').attr('class', 'bg-theme bg-theme13');
		changeBgThemeOfModal('bg-theme13');
		localStorage.setItem('bgTheme', 'bg-theme13');
	}
	function theme14() {
		$('body').attr('class', 'bg-theme bg-theme14');
		changeBgThemeOfModal('bg-theme14');
		localStorage.setItem('bgTheme', 'bg-theme14');
	}
});

// Store bg-theme to localstorage
$(document).ready(function () {
	const currentBgTheme = localStorage.getItem('bgTheme');
	if (currentBgTheme) {
		$('body').attr('class', `bg-theme ${currentBgTheme}`);
		$('.modal-content').addClass(`bg-theme ${currentBgTheme}`);
	}
});

function changeBgThemeOfModal(bgTheme) {
	const currentBgTheme = localStorage.getItem('bgTheme');
	$('.modal-content').removeClass(`bg-theme ${currentBgTheme}`);
	$('.modal-content').addClass(`bg-theme ${bgTheme}`);
}

// NOTYF
const notyf = new Notyf({
	duration: 6000,
	position: { x: 'right', y: 'top' },
	dismissible: true,
	ripple: true,
});

// ImgUr upload function
function imgurUpload(img) {
	const API_URL = 'https://tame-red-clownfish-tutu.cyclic.app/image';

	const formData = new FormData();
	formData.append('image', img);

	const config = {
		async: false,
		cache: false,
		contentType: false,
		processData: false,
		url: API_URL,
		type: 'POST',
		data: formData,
	};

	return $.ajax(config);
}

// Upload Images with Imgur API
document.querySelectorAll('form .ig-upload-img').forEach((inputGroup) => {
	const inputFileElm = inputGroup.querySelector('input[type=file][accept="image/*"]');
	const inputUrlElm = inputGroup.querySelector('input[type=url]');
	const btnUpload = inputGroup.querySelector('.btn-upload-img');

	inputFileElm.onchange = function (e) {
		inputUrlElm.value = e.target.files[0].name;
	};

	btnUpload.onclick = async function () {
		const pattern = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/;

		if (pattern.test(inputUrlElm.value)) {
			const res = await imgurUpload(inputUrlElm.value);
			inputUrlElm.value = res.data.link;
		} else if (inputFileElm.files.length !== 0) {
			const res = await imgurUpload(inputFileElm.files[0]);
			inputUrlElm.value = res.data.link;
		} else {
			notyf.error('Image url is invalid!');
		}
	};
});

// Upload file
$(document).bind('DOMSubtreeModified', function () {
	document.querySelectorAll('form .ig-upload-file').forEach((inputGroup, idx) => {
		const inputFileElm = inputGroup.querySelector('input[type=file][accept=".srt,.ssa,.vtt"]');
		const inputUrlElm = inputGroup.querySelector('input[type=url]');
		const labelElm = inputGroup.querySelector('label');
		const btnUpload = inputGroup.querySelector('.btn-upload-img');

		// change id input file suitablle for label
		inputFileElm.id = 'upload_file-' + idx;
		labelElm.setAttribute('for', inputFileElm.id);

		inputFileElm.onchange = function (e) {
			inputUrlElm.value = e.target.files[0].name;
		};

		btnUpload.onclick = async function () {
			if (inputFileElm.files.length === 0) return notyf.error('Please select a file!');
			const file = inputFileElm.files[0];
			const formData = new FormData();
			formData.append('file', file);

			// notyf upload
			const notification = notyf.open({
				message: `${file.name} Uploading`,
				background: '#9c9cff',
				duration: 900000, // 30 minutes
				icon: { className: 'gg-spinner-two', tagName: 'i', color: 'none' },
			});

			$.ajax({
				type: 'POST',
				url: '/admin/upload/subtitle',
				data: formData,
				processData: false,
				contentType: false,
			})
				.done(({ url, msg }) => {
					notyf.dismiss(notification);
					notyf.success(msg);
					inputUrlElm.value = url;
				})
				.fail(({ responseJSON }) => {
					notyf.error(responseJSON.msg);
				});
		};
	});
});

// do logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn)
	logoutBtn.addEventListener('click', (e) => {
		e.preventDefault();
		$.ajax({
			type: 'delete',
			url: '/admin/logout',
		})
			.done((res) => {
				notyf.success(res.message);
				setTimeout(() => (window.location.pathname = '/admin/login'), 1200);
			})
			.fail(({ responseJSON }) => {
				notyf.error(responseJSON.message);
			});
	});
