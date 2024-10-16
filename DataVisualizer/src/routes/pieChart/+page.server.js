import { fetchData } from '$lib/index.js';

const getData = async () => {
	try {
		return await fetchData('pie-chart');
	} catch (error) {
		console.error('Error loading data:', error);
	}
};

export function load() {
	return getData();
}
