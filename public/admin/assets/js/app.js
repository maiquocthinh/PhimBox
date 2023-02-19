$(function () {
	'use strict';
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
		}),
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

	function theme1() {
		$('body').attr('class', 'bg-theme bg-theme1');
	}

	function theme2() {
		$('body').attr('class', 'bg-theme bg-theme2');
	}

	function theme3() {
		$('body').attr('class', 'bg-theme bg-theme3');
	}

	function theme4() {
		$('body').attr('class', 'bg-theme bg-theme4');
	}

	function theme5() {
		$('body').attr('class', 'bg-theme bg-theme5');
	}

	function theme6() {
		$('body').attr('class', 'bg-theme bg-theme6');
	}

	function theme7() {
		$('body').attr('class', 'bg-theme bg-theme7');
	}

	function theme8() {
		$('body').attr('class', 'bg-theme bg-theme8');
	}

	function theme9() {
		$('body').attr('class', 'bg-theme bg-theme9');
	}

	function theme10() {
		$('body').attr('class', 'bg-theme bg-theme10');
	}

	function theme11() {
		$('body').attr('class', 'bg-theme bg-theme11');
	}

	function theme12() {
		$('body').attr('class', 'bg-theme bg-theme12');
	}

	function theme13() {
		$('body').attr('class', 'bg-theme bg-theme13');
	}
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
document.querySelectorAll('#form-info-film input[type=file][accept="image/*"]').forEach((inputEl) => {
	const inputGroup = inputEl.parentElement;
	const inputUrlEl = inputGroup.querySelector('input[type=url]');
	const btnUpload = inputGroup.querySelector('.btn-upload-img');

	inputEl.onchange = function (e) {
		inputUrlEl.value = e.target.files[0].name;
	};

	btnUpload.onclick = async function () {
		const pattern = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/;

		if (pattern.test(inputUrlEl.value)) {
			const res = await imgurUpload(inputUrlEl.value);
			inputUrlEl.value = res.data.link;
		} else if (inputEl.files.length !== 0) {
			const res = await imgurUpload(inputEl.files[0]);
			inputUrlEl.value = res.data.link;
		}
	};
});

// NOTYF
const notyf = new Notyf({
	duration: 6000,
	position: { x: 'right', y: 'top' },
	dismissible: true,
	ripple: true,
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
				setTimeout(() => (window.location.pathname = '/admin/login'), 2000);
			})
			.fail(({ responseJSON }) => {
				notyf.error(responseJSON.message);
			});
	});
