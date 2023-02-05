import React, { useEffect, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
	Box,
	Button,
	Chip,
	Divider,
	Typography,
	useTheme,
} from '@mui/material';
import { link } from 'react-router-dom';
import { AutoPlay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast } from 'react-toastify';

import { setGlobalLoading } from '../../redux/features/globalLoadingSlice';
import { routesGen } from '../../routes/routes';
import uiConfigs from '../../configs/ui.config';
import CircularRate from './CircularRate';
import genreApi from '../../api/modules/genre.api';
import mediaApi from '../../api/modules/media.api';
import { useDispatch } from 'react-redux';

const HeroSlice = ({ mediaType, mediaCategory }) => {
	const dispatch = useDispatch();

	const [movies, setMovies] = useState([]);
	const [genres, setGenres] = useState([]);

	useEffect(() => {
		const getMedias = async () => {
			const { response, error } = await mediaApi.getList({
				mediaType,
				mediaCategory,
			});

			if (response) setMovies(response.result);
			if (error) toast.error(error.message);
		};

		const getGenres = async () => {
			dispatch(setGlobalLoading(true));
			const { response, error } = await genreApi.getList({ mediaType });

			if (response) {
				setGenres(response.genres);
				getMedias();
			}
			if (error) setMovies(response.results);

			dispatch(setGlobalLoading(false));
		};

		// RUN
		getGenres();
	}, [mediaType, mediaCategory, dispatch]);

	return <div>HeroSlice</div>;
};

export default HeroSlice;
