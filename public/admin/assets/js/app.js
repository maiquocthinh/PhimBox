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
	$('#theme14').click(theme14);
	$('#theme15').click(theme15);

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
});

// do logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn)
	logoutBtn.addEventListener('click', (e) => {
		e.preventDefault();
		fetch('./logout', {
			method: 'delete',
		}).then((res) => {
			if (res.ok) window.location.pathname = '/admin/login';
		});
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

// Get data film and fill this data to form edit
async function fillDataFilmToForm(id) {
	const film = await $.ajax({ url: '/admin/films/read/' + id, type: 'GET' });
	const formEdit = document.getElementById('form-info-film');
	if (formEdit) {
		formEdit.querySelector('input[name="name"]').value = film.name;
		formEdit.querySelector('input[name="original_name"]').value = film.originalName;
		formEdit.querySelector('select[name="status"]').value = film.status;
		formEdit.querySelector('select[name="viewable"]').value = film.viewable ? 1 : '';
		formEdit.querySelector('input[name="poster"]').value = film.poster;
		formEdit.querySelector('input[name="backdrops"]').value = film.backdrops;
		formEdit.querySelector('input[name="backdrops_canonical"]').value = film.backdropsCanonical;
		formEdit.querySelector('input[name="logo"]').value = film.logo;
		$('.multiple-select[name="categories[]"]').val(film.category).change();
		$('.multiple-select[name="countries[]"]').val(film.country).change();
		formEdit.querySelector('input[name="trailer"]').value = film.trailer;
		formEdit.querySelector('input[name="duration"]').value = film.duration;
		formEdit.querySelector('input[name="quality"]').value = film.quality;
		formEdit.querySelector('input[name="year"]').value = film.year;
		formEdit.querySelector('input[name="imdb"]').value = film.imdb;
		formEdit.querySelector('select[name="language"]').value = film.language;
		formEdit.querySelector('select[name="type"]').value = film.type;
		formEdit.querySelector('select[name="in_cinema"]').value = film.inCinema ? 1 : '';
		formEdit.querySelector('select[name="recommend"]').value = film.recommend ? 1 : '';
		formEdit.querySelector('select[name="canonical"]').value = film.canonical ? 1 : '';
		formEdit.querySelector('input[name="notify"]').value = film.notify;
		formEdit.querySelector('textarea[name="description"]').value = film.description;
		CKEDITOR.instances['info_film'].setData(film.info);
		$('input[name="tags"]').tagsinput('removeAll');
		film.tag.forEach((tag) => $('input[name="tags"]').tagsinput('add', tag));
		formEdit.querySelector('input[name="slug"]').value = film.slug;
		formEdit.querySelector('input[name="film_id"]').value = film._id.toString();
	}
}

// Handle submit update
const saveBtn = document.querySelector('#editModal .modal-footer .btn-save');
if (saveBtn)
	saveBtn.onclick = function () {
		const formEdit = document.querySelector('#editModal form');
		const filmId = formEdit.querySelector('input[name="film_id"]').value;
		const dataForm = Object.fromEntries(new FormData(formEdit));
		dataForm.info = CKEDITOR.instances['info_film'].getData();
		dataForm['categories[]'] = $('#editModal form .multiple-select[name="categories[]"]')
			.select2('data')
			.reduce((categories, category) => {
				categories.push(category.id);
				return categories;
			}, []);
		dataForm['countries[]'] = $('#editModal form .multiple-select[name="countries[]"]')
			.select2('data')
			.reduce((countries, country) => {
				countries.push(country.id);
				return countries;
			}, []);
		$.ajax({
			type: 'PUT',
			url: '/admin/films/update/' + filmId,
			data: dataForm,
		}).done(() => {
			$('#editModal').modal('hide');
			dataTable.ajax.reload(null, false);
		});
	};

// Fill name, id of film to modal delete
function fillDataToDeleteForm(nameFilm, idFilm) {
	document.querySelector('#permanently-text').classList.add('d-none');
	document.querySelector('#film-name-text').textContent = nameFilm;
	document.querySelector('#deleteModal .modal-footer .btn-delete').onclick = function () {
		$.ajax({
			type: 'DELETE',
			url: '/admin/films/delete/' + idFilm,
		}).done(() => {
			$('#deleteModal').modal('hide');
			dataTable.ajax.reload(null, false);
		});
	};
}

// Fill name, id of film to modal delete permanently
function fillDataToDeletePermanentlyForm(nameFilm, idFilm) {
	document.querySelector('#permanently-text').classList.remove('d-none');
	document.querySelector('#film-name-text').textContent = nameFilm;
	document.querySelector('#deleteModal .modal-footer .btn-delete').onclick = function () {
		$.ajax({
			type: 'DELETE',
			url: '/admin/films/destroy/' + idFilm,
		}).done(() => {
			$('#deleteModal').modal('hide');
			dataTable.ajax.reload(null, false);
		});
	};
}

// Handle restore film
function restoreFilm(idFilm) {
	$.ajax({
		type: 'PATCH',
		url: '/admin/films/restore/' + idFilm,
	}).done(() => {
		dataTable.ajax.reload(null, false);
	});
}

// Filter form
const filterForm = document.getElementById('tableFilmsFilterForm');
if (filterForm) {
	const { 6: btnReset, 7: btnFilter } = filterForm;
	btnReset.onclick = function () {
		window.location.pathname = '/admin/films';
	};
	btnFilter.onclick = function () {
		const { 0: status, 1: type, 2: category, 3: country, 4: info, 5: deleted } = filterForm;

		const params = {
			deleted: deleted.value,
			status: status.value,
			type: type.value,
			category: category.value,
			country: country.value,
			info: info.value,
		};

		let paramsStr = '?';
		for (const key in params) if (Object.hasOwnProperty.call(params, key)) paramsStr += `${key}=${params[key]}&`;

		dataTable.ajax.url('/admin/films/datatables_ajax/' + paramsStr).load();
	};
}
