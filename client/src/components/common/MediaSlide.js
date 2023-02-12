import React, { useEffect, useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import mediaApi from '../../api/modules/media.api';
import AutoSwiper from './AutoSwiper';
import { toast } from 'react-toastify';
import useFetch from '../../hooks/useFetch';
import MediaItem from './MediaItem';

const MediaSlide = ({ mediaType, mediaCategory }) => {
	const [medias, setMedias] = useState([]);

	const { data, error, isLoading } = useFetch({
		deps: [mediaType, mediaCategory],
		queryFn: () =>
			mediaApi.getList({
				mediaCategory,
				mediaType,
				page: 1,
			}),
	});

	// useEffect(() => {
	// 	const getMeidas = async () => {
	// 		const { response, error } = await mediaApi.getList({
	// 			mediaCategory,
	// 			mediaType,
	// 			page: 1,
	// 		});
	// 		if (response) setMedias(response.results);
	// 		if (error) toast.error(error.message);
	// 	};

	// 	getMeidas();
	// }, [mediaType, mediaCategory]);

	return (
		<AutoSwiper>
			{data?.results.map((media, index) => (
				<SwiperSlide key={index}>
					<MediaItem media={media} mediaType={mediaType} />
				</SwiperSlide>
			))}
		</AutoSwiper>
	);
};

export default MediaSlide;
