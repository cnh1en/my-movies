import React from 'react';
import HeroSlide from '../components/common/HeroSlide';
import tmdbConfigs from '../api/configs/tmdb.config';
import { Box } from '@mui/material';
import uiConfigs from '../configs/ui.config';
import Container from '../components/common/Container';
import MediaSlide from '../components/common/MediaSlide';

const HomePage = () => {
	return (
		<>
			<HeroSlide
				mediaType={tmdbConfigs.mediaType.movie}
				mediaCategory={tmdbConfigs.mediaCategory.popular}
			/>

			<Box mt="-4rem" sx={{ ...uiConfigs.style.mainContent }}>
				<Container header="popular series">
					<MediaSlide
						mediaType={tmdbConfigs.mediaType.tv}
						mediaCategory={tmdbConfigs.mediaCategory.popular}
					/>
				</Container>
				<Container header="top rated">
					<MediaSlide
						mediaType={tmdbConfigs.mediaType.tv}
						mediaCategory={tmdbConfigs.mediaCategory.topRated}
					/>
				</Container>
			</Box>
		</>
	);
};

export default HomePage;
