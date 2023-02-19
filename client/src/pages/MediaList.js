import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import MediaGrid from '../components/common/MediaGrid';
import { setGlobalLoading } from '../redux/features/globalLoadingSlice';
import { setAppState } from '../redux/features/appStateSlice';
import usePrevious from '../hooks/usePrevious';
import { useDispatch } from 'react-redux';
import mediaApi from '../api/modules/media.api';
import { toast } from 'react-toastify';
import HeroSlice from '../components/common/HeroSlide';
import { Box, Button, Stack, Typography } from '@mui/material';
import uiConfigs from '../configs/ui.config';
import tmdbConfigs from '../api/configs/tmdb.config';
import { LoadingButton } from '@mui/lab';

const MediaList = () => {
	const { mediaType } = useParams();

	const [medias, setMedias] = useState([]);
	const [mediaLoading, setMediaLoading] = useState(false);
	const [currCategory, setCurrCategory] = useState(0);
	const [currPage, setCurrPage] = useState(1);

	const prevMediaType = usePrevious(mediaType);
	console.log('[LOG] ~ MediaList ~ prevMediaType', prevMediaType);

	const dispatch = useDispatch();

	const mediaCategories = useMemo(() => ['popular', 'top_rated'], []);

	const category = ['popular', 'top rated'];

	useEffect(() => {
		dispatch(setAppState(mediaType));
		window.scrollTo(0, 0);
	}, [mediaType, dispatch]);

	useEffect(() => {
		const getMedias = async () => {
			if (currPage === 1) dispatch(setGlobalLoading(true));
			setMediaLoading(true);

			const { response, error } = await mediaApi.getList({
				mediaType,
				mediaCategory: mediaCategories[currCategory],
				page: currPage,
			});

			if (error) toast.error(error.message);
			if (response) {
				if (currPage !== 1) {
					setMedias((m) => [...m, ...response.results]);
				} else {
					setMedias([...response.results]);
				}
			}

			setMediaLoading(false);
			dispatch(setGlobalLoading(false));
		};
		if (mediaType !== prevMediaType) {
			setCurrPage(1);
			setCurrCategory(0);
		}

		getMedias();
	}, [
		currCategory,
		currPage,
		dispatch,
		mediaCategories,
		mediaType,
		prevMediaType,
	]);

	const onCategoryChange = (categoryIndex) => {
		if (currCategory === categoryIndex) return;
		setMedias([]);
		setCurrPage(1);
		setCurrCategory(categoryIndex);
	};

	const onLoadMore = () => setCurrPage(currPage + 1);

	return (
		<>
			<HeroSlice
				mediaType={mediaType}
				mediaCategory={mediaCategories[currCategory]}
			/>

			<Box sx={{ ...uiConfigs.style.mainContent }}>
				<Stack
					spacing={2}
					direction={{
						xs: 'column',
						md: 'row',
					}}
					alignItems="center"
					justifyContent="space-between"
					my={4}
				>
					<Typography fontWeight={700} variant="h5">
						{mediaType === tmdbConfigs.mediaType.movie ? 'Movie' : 'TV Series'}
					</Typography>

					<Stack direction="row" spacing={1}>
						{category.map((category, i) => (
							<Button
								key={i}
								size="large"
								variant={currCategory === i ? 'contained' : 'text.primary'}
								sx={{
									color:
										currCategory === i
											? 'primary.contrastText'
											: 'text.primary',
								}}
								onClick={() => onCategoryChange(i)}
							>
								{category}
							</Button>
						))}
					</Stack>
				</Stack>

				<MediaGrid medias={medias} mediaType={mediaType} />

				<LoadingButton
					sx={{ mt: 8 }}
					fullWidth
					color="primary"
					loading={mediaLoading}
					onClick={onLoadMore}
				>
					load more
				</LoadingButton>
			</Box>
		</>
	);
};

export default MediaList;
