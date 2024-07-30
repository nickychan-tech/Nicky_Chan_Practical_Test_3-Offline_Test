const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTkwNDIzNDY3ODZhOTIxY2E3MzJmZmM0YzAxYTIxZiIsIm5iZiI6MTcyMTgwNzc3MC40NTAyNzcsInN1YiI6IjY2YTBhN2VhZjdhMTE0YTA4M2UwZDRhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SQjgB9waWCim1CPQFSbrHehebcAcr4uDQV8iIYgIrps';
const fadeSpeed = 400;

const mainMenuAnimLen = 3;
let mainMenuAnimCount = mainMenuAnimLen;

const hasTouch = isTouchDevice();
let results = [];
var body, loading;

function homeInit() {
	body = $('body');
	loading = $('.loading');

	if(!hasTouch) body.addClass('noTouch')

	bindHomeEvent();
	getMovieList();
}

function bindHomeEvent() {
	$('.btn-sort').on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('by-popularity');

		let _resultsCopy = [...results];
		if($(this).hasClass('by-popularity')) {
			_resultsCopy.sort(sortByPopularity());

		} else {
			_resultsCopy.sort(sortByDate());

		}
		createMovieList(_resultsCopy)
	});

	// Header menu
	$('.btn-open-main_menu').on('click', function(e) {
		e.preventDefault();
		if(body.hasClass('menu-opened')) {
			closeMainMenu();
		} else {
			openMainMenu();
		}
	});
	$('.btn-close-main_menu').on("click", function(e) {
		e.preventDefault();
		closeMainMenu();
	});

	$('.nav-wrapper').on("click", function(e) {
		const eTarget = $(e.target);
		if(!eTarget.hasClass('nav-container') && !eTarget.parents('.nav-wrapper').length) {
			e.preventDefault();
			console.log(eTarget)
			closeMainMenu();
		}
	});
	$('.nav-wrapper').on("animationend webkitAnimationEnd", function(e) {
		e.preventDefault();
		if(--mainMenuAnimCount <= 0) {
			if(body.hasClass('menu-opened menu-closing')) {
				body.removeClass('menu-opened menu-closing');
			}
		}
	});
}

// Sorting
function sortByPopularity() {
	return (a, b) => {
		if(a.popularity < b.popularity) {
			return 1;
		} else if(a.popularity > b.popularity) {
			return -1;
		}
		return 0;
	}
}
function sortByDate() {
	return (a, b) => {
		if(new Date(a.release_date) < new Date(b.release_date)) {
			return 1;
		} else if(new Date(a.release_date) > new Date(b.release_date)) {
			return -1;
		}
		return 0;
	}
}

// Main Menu
function openMainMenu() {
	mainMenuAnimCount = mainMenuAnimLen;
	body.addClass('menu-opened');
}

function closeMainMenu() {
	mainMenuAnimCount = mainMenuAnimLen;
	if(body.hasClass('menu-opened')) {
		body.addClass('menu-closing');
	}
}

// Create movie list
function createMovieList(data) {
	let _imgBaseUrl = 'https://image.tmdb.org/t/p/w400/';
	let _html = '';
	for(let i=0; i<data.length; i++) {
		let _item = data[i];
		_html += `<div class="main-item" data-date="${_item.release_date}" data-popularity="${_item.popularity}">
			<a class="item-img-container" href="javascript:void(0)">
				<img src="${_imgBaseUrl + _item.poster_path}" alt="${_item.title}" class="item-img">
			</a>
			<div class="item-content">
				<div class="item-title">${_item.title}</div>
				<div class="item-desc">${_item.overview}</div>
				<div class="item-popularity">${formatMoney(_item.popularity, 0)}</div>
			</div>
		</div>`;
	}
	$('.main-list').html(_html);
}

// call API
function getMovieList() {
	showLoading();

	const options = {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: 'Bearer ' + apiKey
		}
	};
	
	fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
	.then(response => response.json())
	.then(response => {
		results = response.results;
		let _resultsCopy = [...results];
		_resultsCopy.sort(sortByDate());
		createMovieList(_resultsCopy)
		hideLoading();
	})
	.catch(err => {
		console.error(err);
		alert(err);
		hideLoading();
	});
}

// Loading
function showLoading() {
	loading.fadeIn(fadeSpeed);
}

function hideLoading() {
	loading.fadeOut(fadeSpeed);
}

// Helpers
function isTouchDevice() {
	return (('ontouchstart' in window) ||
	   (navigator.maxTouchPoints > 0) ||
	   (navigator.msMaxTouchPoints > 0));
}

function formatMoney(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}

// For unit test
// module.exports = {sortByPopularity, sortByDate};