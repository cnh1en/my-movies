import React, { useEffect, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
	Box,
	Button,
	Chip,
	Divider,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import { Link, link } from 'react-router-dom';
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
import tmdbConfigs from '../../api/configs/tmdb.config';

const HeroSlice = ({ mediaType, mediaCategory }) => {
	const theme = useTheme();
	const dispatch = useDispatch();

	const [movies, setMovies] = useState([]);
	const [genres, setGenres] = useState([]);

	useEffect(() => {
		const getMedias = async () => {
			const { response, error } = await mediaApi.getList({
				mediaType,
				mediaCategory,
			});

			if (response) setMovies(response.results);
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

	return (
		<Box
			sx={{
				position: 'relative',
				color: 'primary.contrastText',
				'&::before': {
					content: '""',
					width: '100%',
					height: '30%',
					position: 'absolute',
					bottom: 0,
					left: 0,
					zIndex: 2,
					pointerEvents: 'none',
					...uiConfigs.style.gradientBgImage[theme.palette.mode],
				},
			}}
		>
			<Swiper
				grabCursor={true}
				loop={true}
				// modules={[Autoplay]}
				style={{ width: '100%', height: 'max-content' }}
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
				}}
			>
				{movies?.map((movie, index) => (
					<SwiperSlide key={index}>
						<Box
							sx={{
								paddingTop: {
									xs: '130%',
									sm: '80%',
									md: '60%',
									lg: '45%',
								},
								backgroundPosition: 'top',
								backgroundSize: 'cover',
								backgroundImage: `url(${tmdbConfigs.backdropPath(
									movie.backdrop_path || movie.poster_path
								)})`,
							}}
						/>
						<Box
							sx={{
								width: '100%',
								height: '100%',
								position: 'absolute',
								top: 0,
								left: 0,
								...uiConfigs.style.horizontalGradientBgImage[
									theme.palette.mode
								],
							}}
						/>
						<Box
							sx={{
								width: '100%',
								height: '100%',
								position: 'absolute',
								top: 0,
								left: 0,
								paddingX: { sm: '10px', md: '5rem', lg: '10rem' },
							}}
						>
							<Box
								sx={{
									height: '100%',
									display: 'flex',
									alignItems: 'center',
									paddingX: '30px',
									color: 'text.primary',
									width: { sm: 'unset', md: '30%', lg: '40%' },
								}}
							>
								<Stack spacing={4} direction="column">
									{/* TITLE */}
									<Typography
										variant="h4"
										fontSize={{ xs: '2rem', md: '2rem', lg: '4rem' }}
										fontWeight="700"
										sx={{
											...uiConfigs.style.typoLines(2, 'left'),
										}}
									>
										{movie.title || movie.name}
									</Typography>
									{/* TITLE */}

									<Stack direction="row" spacing={1} alignItems="center">
										{/* RATING */}
										<CircularRate value={movie.vote_average} />
										{/* RATING */}

										<Divider orientation="vertical" />
										{/* GENRES */}
										{[...movie.genre_ids]
											.splice(0, 4)
											?.map((genreId, index) => (
												<Chip
													variant="filled"
													color="primary"
													key={index}
													label={
														genres.find((e) => e.id === genreId) &&
														genres.find((e) => e.id === genreId).name
													}
												/>
											))}
										{/* GENRES */}
									</Stack>

									{/* OVERVIEW */}
									<Typography
										variant="body1"
										sx={{
											...uiConfigs.style.typoLines(3),
										}}
									>
										{movie.overview}
									</Typography>
									{/* OVERVIEW */}

									{/* BUTTONS */}
									<Button
										variant="contained"
										size="large"
										startIcon={<PlayArrowIcon />}
										component={Link}
										to={routesGen.mediaDetail(mediaType, movie.id)}
										sx={{ width: 'max-content' }}
									>
										watch now
									</Button>
									{/* BUTTONS */}
								</Stack>
							</Box>
						</Box>
					</SwiperSlide>
				))}
			</Swiper>
		</Box>
	);
};

export default HeroSlice;
