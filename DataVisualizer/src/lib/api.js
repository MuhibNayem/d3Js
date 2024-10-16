import axios from 'axios';

export async function fetchData(endpoint) {
	try {
		const response = await axios.get(`http://localhost:3000/${endpoint}`);
		return response?.data;
	} catch (error) {
		throw new Error('Failed to fetch data', error);
	}
}
