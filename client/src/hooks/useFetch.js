/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

const useFetch = ({ deps, queryFn }) => {
	const [response, setResponse] = useState(null);
	const [error, setError] = useState(null);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		setIsLoading(true);

		const fetchData = async () => {
			try {
				const { response, error } = await queryFn();
				if (error) {
					setError(error);
					setIsError(true);
				}
				setResponse(response);
			} catch (error) {
				setError(error);
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [JSON.stringify(deps)]);

	return { data: response, error, isLoading, isError };
};

export default useFetch;
