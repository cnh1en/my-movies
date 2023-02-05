import { Paper, Stack, Button, Box } from '@mui/material';
import React from 'react';
import Container from './Container';
import AppLogo from './AppLogo';
import menuConfigs from '../../configs/menu.configs';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<Container>
			<Paper square sx={{ backgroundImage: 'unset', padding: '2rem' }}>
				<Stack
					alignItems="center"
					justifyContent="space-between"
					direction={{ xs: 'column', md: 'row ' }}
					sx={{ height: 'max-content' }}
					flexGrow={1}
				>
					<AppLogo />
					<Box>
						{menuConfigs.main.map((item, index) => (
							<Button
								key={index}
								sx={{ color: 'inherit' }}
								component={Link}
								to={item.path}
							>
								{item.display}
							</Button>
						))}
					</Box>
				</Stack>
			</Paper>
		</Container>
	);
};

export default Footer;
