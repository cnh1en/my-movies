import React from 'react';
import { Box } from '@mui/material';
import { SwiperSlide } from 'swiper/react';
import tmdbConfigs from '../../api/configs/tmdb.config';
import AutoSwiper from './AutoSwiper';

const PosterSlice = ({ posters }) => {
	return (
		<AutoSwiper>
			{posters.splice(0, 10).map((item, index) => (
				<SwiperSlide key={index}>
					<Box
						sx={{
							pt: '60%',
							backgroundPosition: 'top',
							backgroundSize: 'cover',
							backgroundImage: `url(${tmdbConfigs.backdropPath(
								item.file_path
							)})`,
						}}
					></Box>
				</SwiperSlide>
			))}
		</AutoSwiper>
	);
};

export default PosterSlice;
