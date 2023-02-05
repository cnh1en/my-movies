import axios from 'axios';

const get = async (url) => {
	const response = await axios.get(url);
	console.log({ url, response });
	return response.data;
};

export default { get };