import React from 'react';

import { LoadingButton } from '@mui/lab';
import {
	Box,
	Button,
	Divider,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import Container from './Container';
import reviewApi from '../../api/modules/review.api';
import TextAvatar from './TextAvatar';

const ReviewItem = ({ review, onRemoved }) => {
	console.log({ review });
	const { user } = useSelector((state) => state.user);

	const [onRequest, setOnRequest] = useState(false);

	const onRemove = async () => {
		if (onRequest) return;

		setOnRequest(true);

		const { response, error } = await reviewApi.remove({
			reviewId: review.id,
		});

		if (error) toast.error(error.message);
		if (response) onRemoved(review.id);
	};

	return (
		<Box
			sx={{
				padding: 2,
				borderRadius: '5px',
				position: 'relative',
				opacity: onRequest ? 0.6 : 1,
				'&:hover': {
					bgcolor: 'background.paper',
				},
			}}
		>
			<Stack direction="row" spacing={2}>
				<TextAvatar text={review.user.displayName} />
				<Stack>
					<Stack spacing={1}>
						<Typography variant="h6" fontWeight={700}>
							{review.user.displayName}
						</Typography>
						<Typography>
							{dayjs(review.createdAt).format('DD-MM-YYYY HH:mm:ss')}
						</Typography>
					</Stack>

					<Typography variant="body1" textAlign="justify">
						{review.content}
					</Typography>
					{user && user.id === review.user.id && (
						<LoadingButton
							variant="contained"
							startIcon={<DeleteIcon />}
							loadingPosition="start"
							loading={onRequest}
							onClick={onRemove}
							sx={{
								position: { xs: 'relative', md: 'absolute' },
								right: { xs: 0, md: '10px' },
								marginTop: { xs: 2, md: 0 },
								width: 'max-content',
							}}
						>
							remove
						</LoadingButton>
					)}
				</Stack>
			</Stack>
		</Box>
	);
};

const MediaReview = ({ reviews, media, mediaType }) => {
	const { user } = useSelector((state) => state.user);
	const [listReviews, setListReviews] = useState([]);
	const [filteredReviews, setFilteredReviews] = useState([]);
	const [page, setPage] = useState(1);
	const [onRequest, setOnRequest] = useState(false);
	const [content, setContent] = useState('');
	const [reviewCount, setReviewCount] = useState(0);

	const skip = 4;

	const onAddReview = async () => {
		if (onRequest) return;

		setOnRequest(true);

		const body = {
			content,
			mediaId: media.id,
			mediaType,
			mediaTitle: media.title || media.name,
			mediaPoster: media.poster_path,
		};

		const { response, error } = await reviewApi.add(body);

		setOnRequest(false);

		if (error) toast.error(error.message);
		if (response) {
			toast.success('Post review success');

			setFilteredReviews([...filteredReviews, response]);
			setReviewCount((review) => review + 1);
			setContent('');
		}
	};

	const onLoadMore = () => {
		setFilteredReviews([
			...filteredReviews,
			...[...listReviews]?.splice(page * skip, skip),
		]);
	};

	const onRemoved = (id) => {
		if (listReviews.findIndex((e) => e.id === id) !== -1) {
			const newListReviews = [...listReviews].filter((item) => item.id !== id);
			setListReviews(newListReviews);
			setFilteredReviews([...newListReviews]?.splice(0, page * skip));
		} else {
			setFilteredReviews([...filteredReviews].filter((item) => item.id !== id));
		}

		setReviewCount((count) => count - 1);

		toast.success('Remove review success');
	};

	useEffect(() => {
		setListReviews([...reviews]);
		setFilteredReviews([...reviews])?.splice(0, skip);
		setReviewCount(reviews.length);
	}, [reviews]);

	return (
		<>
			<Container header={`Reviews (${reviewCount})`}>
				<Stack spacing={4} mb={2}>
					{filteredReviews.map((item) => (
						<Box key={item.id}>
							<ReviewItem review={item} onRemoved={onRemoved} />

							<Divider
								sx={{
									display: {
										xs: 'block',
										md: 'none',
									},
								}}
							/>
						</Box>
					))}

					{filteredReviews.length < listReviews.length && (
						<Button onClick={onLoadMore}>load more</Button>
					)}
				</Stack>

				{user && (
					<>
						<Divider />
						<Stack direction="row" spacing={2}>
							<TextAvatar text={user.displayName} />

							<Stack spacing={2} flexGrow={1}>
								<Typography variant="h6" fontWeight={700}>
									{user.displayName}
								</Typography>

								<TextField
									value={content}
									onChange={(e) => setContent(e.target.value)}
									multiline
									rows={4}
									placeholder="Write your review"
									variant="outlined"
								/>
								<LoadingButton
									variant="contained"
									size="large"
									sx={{ width: 'max-content' }}
									startIcon={<SendOutlinedIcon />}
									loadingPosition="start"
									loading={onRequest}
									onClick={onAddReview}
								></LoadingButton>
							</Stack>
						</Stack>
					</>
				)}
			</Container>
		</>
	);
};

export default MediaReview;
