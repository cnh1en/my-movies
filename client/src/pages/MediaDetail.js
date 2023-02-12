import React, { useEffect, useState, useRef } from 'react';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import CircularRate from '../components/common/CircularRate';
import Container from '../components/common/Container';
import ImageHeader from '../components/common/ImageHeader';

import uiConfigs from '../configs/ui.config';
import tmdbConfigs from '../api/configs/tmdb.config';
import mediaApi from '../api/modules/media.api';

import favoriteApi from '../api/modules/favorite.api';

import { setGlobalLoading } from '../redux/features/globalLoadingSlice';
import { setAuthModalOpen } from '../redux/features/authModalSlice';
import MediaItem from '../components/common/MediaItem';
import CastSlide from '../components/common/CastSlide';

import {
	setAddFavorite,
	setRemoveFavorites,
} from '../redux/features/userSlice';
import MediaVideoSlide from '../components/common/MediaVideoSlide';
import BackdropSlide from '../components/common/BackdropSlide';
import PosterSlice from '../components/common/PosterSlice';
import RecommendSlide from '../components/common/RecommendSlide';
import MediaSlide from '../components/common/MediaSlide';

const MediaDetail = () => {
	const { mediaType, mediaId } = useParams();

	const { user, listFavorites } = useSelector((state) => state.user);
	const [media, setMedia] = useState();
	const [isFavorite, setIsFavorite] = useState(false);
	const [onRequest, setOnRequest] = useState(false);
	const [genres, setGenres] = useState([]);

	const dispatch = useDispatch();

	const videoRef = useRef(null);

	const onFavoriteClick = async () => {
		if (!user) return dispatch(setAuthModalOpen(true));

		if (onRequest) return;

		if (isFavorite) {
			onRemoveFavorite();
			return;
		}

		setOnRequest(true);

		const body = {
			mediaId: media.id,
			mediaTitle: media.title || media.name,
			mediaType: mediaType,
			mediaPoster: media.poster_path,
			mediaRate: media.vote_average,
		};

		const { response, err } = await favoriteApi.add(body);

		setOnRequest(false);

		if (err) toast.error(err.message);
		if (response) {
			dispatch(setAddFavorite([response]));
			setIsFavorite(true);
			toast.success('Add favorite success');
		}
	};

	const onRemoveFavorite = async () => {
		if (onRequest) return;

		setOnRequest(true);

		const favorite = listFavorites.find(
			(e) => e.media?.toString() === media.id?.toString()
		);

		const { response, error } = await favoriteApi.remove({
			favoriteId: favorite.id,
		});

		setOnRequest(false);

		if (error) {
			toast.error(error.message);
		}

		if (response) {
			dispatch(setRemoveFavorites(response));
			setIsFavorite(false);
			toast.success('Remove favorite success');
		}
	};

	useEffect(() => {
		const getMedia = async () => {
			dispatch(setGlobalLoading(true));

			const { response, error } = await mediaApi.getDetail({
				mediaType,
				mediaId,
			});

			if (response) {
				setMedia(response);
				setIsFavorite(response.isFavorite);
				setGenres(response.genres.splice(0, 2));
			}

			if (error) {
				toast.error(error.message);
			}
			dispatch(setGlobalLoading(false));
		};

		getMedia();
	}, [mediaId, mediaType, dispatch]);

	return media ? (
		<>
			<ImageHeader
				imgPath={tmdbConfigs.backdropPath(
					media.backdrop_path || media.poster_path
				)}
			/>
			<Box
				sx={{
					color: 'primary.contrastText',
					...uiConfigs.style.mainContent,
				}}
			>
				{/* MEDIA CONTENT */}
				<Box
					sx={{
						mt: {
							xs: '-10rem',
							md: '-15rem',
							lg: '-20rem',
						},
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: {
								md: 'row',
								xs: 'column',
							},
						}}
					>
						{/* POSTER */}
						<Box
							sx={{
								width: {
									xs: '70%',
									sm: '50%',
									md: '40%',
								},
								margin: {
									xs: '0 auto 2rem',
									md: '0 2rem 0 0',
								},
							}}
						>
							<Box
								sx={{
									paddingTop: '140%',
									...uiConfigs.style.backgroundImage(
										tmdbConfigs.posterPath(
											media.poster_path || media.backdrop_path
										)
									),
								}}
							></Box>
						</Box>
						{/* POSTER */}

						{/* MEDIA INFO */}
						<Box
							sx={{
								width: {
									xs: '100%',
									md: '100%',
								},
								color: 'text.primary',
							}}
						>
							<Stack spacing={5}>
								{/* TITLE */}
								<Typography
									variant="h4"
									fontSize={{
										xs: '2rem',
										md: '2rem',
										lg: '4rem',
									}}
									fontWeight="700"
									sx={{ ...uiConfigs.style.typoLines(2, 'left') }}
								>
									{`${media.title || media.name} ${
										mediaType === tmdbConfigs.mediaType.movie
											? media.release_date.split('-')[0]
											: media.first_air_date.split('-')[0]
									}`}
								</Typography>
								{/* TITLE */}

								{/* RATE AND GENRES */}
								<Stack direction="row" spacing={1}>
									<CircularRate value={media.vote_average} />
									{genres.map((genre, index) => (
										<Chip
											label={genre.name}
											variant="filled"
											color="primary"
											key={index}
										/>
									))}
									<Divider orientation="vertical" />
								</Stack>
								{/* RATE AND GENRES */}

								{/* OVERVIEW */}
								<Typography
									variant="body1"
									sx={{
										...uiConfigs.style.typoLines(3),
									}}
								>
									{media.overview}
								</Typography>

								{/* BUTTON */}
								<Stack direction="row" spacing={1}>
									<LoadingButton
										variant="text"
										sx={{
											width: 'max-content',
											'& .Mui-starIcon': {
												mr: '0',
											},
										}}
										size="large"
										startIcon={
											isFavorite ? (
												<FavoriteOutlinedIcon />
											) : (
												<FavoriteBorderOutlinedIcon />
											)
										}
										loading={onRequest}
										loadingPosition="start"
										onClick={onFavoriteClick}
									/>
									<Button
										variant="contained"
										sx={{
											width: 'max-content',
										}}
										size="large"
										startIcon={<PlayArrowIcon />}
										onClick={() => videoRef.current.scrollIntoView()}
									>
										watch now
									</Button>
								</Stack>
								{/* BUTTON */}

								{/* CAST */}
								<Container header="Cast">
									<CastSlide casts={media.credits.cast} />
								</Container>
								{/* CAST */}

								{/* OVERVIEW */}
							</Stack>
						</Box>
						{/* MEDIA INFO */}
					</Box>
				</Box>
				{/* MEDIA CONTENT */}

				{/* MEDIA VIDEOS */}
				<div
					ref={videoRef}
					style={{
						paddingTop: '2rem',
					}}
				>
					<Container header="Videos">
						<MediaVideoSlide videos={media?.videos?.results.slice(0, 5)} />
					</Container>
				</div>
				{/* MEDIA VIDEOS */}

				{/* MEDIA BACKDROP */}
				{media.images.backdrops.length > 0 && (
					<Container header="backdrops">
						<BackdropSlide backdrops={media.images.backdrops} />
					</Container>
				)}
				{/* MEDIA BACKDROP */}

				{/* REVIEWS */}
				{/* REVIEWS */}

				{/* MEDIA POSTERS */}
				{media.images.posters.length > 0 && (
					<Container header="poster">
						<PosterSlice posters={media.images.posters} />
					</Container>
				)}
				{/* MEDIA POSTERS */}

				{/* RECOMMENDATION */}
				<Container header="you may also like">
					{media.recommend?.length > 0 ? (
						<RecommendSlide medias={media.recommend} mediaType={mediaType} />
					) : (
						<MediaSlide
							mediaType={mediaType}
							mediaCategory={tmdbConfigs.mediaCategory.topRated}
						/>
					)}
				</Container>
				{/* RECOMMENDATION */}
			</Box>
		</>
	) : null;
};

export default MediaDetail;
