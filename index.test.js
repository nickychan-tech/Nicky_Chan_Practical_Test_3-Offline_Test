const {sortByPopularity, sortByDate} = require('./index');

test('Check popularity array is sorted', () => {
	let results = [
		{popularity: 1},
		{popularity: 4},
		{popularity: 5},
		{popularity: 2},
		{popularity: 3}
	];
	let _resultsCopy = [...results];
	_resultsCopy.sort(sortByPopularity());
	expect(_resultsCopy).not.toEqual(results);
});
test('Check date array is sorted', () => {
	let results = [
		{release_date: '1990-05-05'},
		{release_date: '2000-11-05'},
		{release_date: '2024-07-01'},
		{release_date: '2000-10-25'},
		{release_date: '1989-03-03'}
	];
	let _resultsCopy = [...results];
	_resultsCopy.sort(sortByDate());
	expect(_resultsCopy).not.toEqual(results);
});